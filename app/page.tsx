import Link from 'next/link'
import { db } from '@/lib/db'
import NewsCard from '@/components/NewsCard'
import GameTheaterCard from '@/components/GameTheaterCard'
import { GAME_LIST } from '@/lib/games'
import { getGameSnapshot } from '@/lib/stats'
import { fmt } from '@/components/StatTile'

function getExcerpt(content: string) {
  return content.replace(/[#*`\[\]]/g, '').trim().slice(0, 160) || null
}

export default async function HomePage() {
  const [snapshots, latestPosts] = await Promise.all([
    Promise.all(GAME_LIST.map((g) => getGameSnapshot(g, 1))),
    db.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 4 }),
  ])

  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_URL
  const livePlayers = snapshots.reduce(
    (sum, s) => sum + s.servers.filter((sv) => sv.online).reduce((a, sv) => a + sv.players, 0),
    0,
  )
  const liveServers = snapshots.reduce((sum, s) => sum + s.servers.filter((sv) => sv.online).length, 0)
  const totalRounds = snapshots.reduce((sum, s) => sum + (s.metrics?.totalRounds ?? 0), 0)

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 tactical-grid" />
        <div className="absolute inset-0 scanlines opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-transparent to-zinc-950" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-2xl space-y-5 ctf-rise">
            <div className="inline-flex items-center gap-2 text-[11px] stencil text-zinc-400 bg-zinc-900/70 border border-zinc-800 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Classic Battlefield · Community Hub
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-bold uppercase tracking-tight text-zinc-100 leading-[0.95]">
              Keep the classics
              <br />
              <span className="text-amber-400">in the fight.</span>
            </h1>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-lg">
              The home base for Battlefield 1942 and Battlefield Vietnam — live servers, real-time stats, and the
              community keeping both games alive. Pick your theater below.
            </p>
          </div>

          {/* Combined live telemetry */}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 ctf-rise" style={{ animationDelay: '90ms' }}>
            <HeroStat value={fmt(livePlayers)} label="players in-game now" pulse={livePlayers > 0} />
            <HeroStat value={fmt(liveServers)} label="servers online" />
            <HeroStat value={totalRounds ? fmt(totalRounds) : '—'} label="rounds tracked" />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14 w-full">
        {/* Game theaters */}
        <section className="space-y-4">
          <SectionHeading title="Choose your theater" sub="Each game has its own servers, stats engine, and full site." />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {GAME_LIST.map((game, i) => (
              <GameTheaterCard key={game.id} game={game} snapshot={snapshots[i]} index={i} />
            ))}
          </div>
        </section>

        {/* Latest News */}
        <section className="space-y-4">
          <div className="flex items-end justify-between">
            <SectionHeading title="Briefing" sub="Latest from across the community." />
            <Link href="/news" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors shrink-0">
              All news →
            </Link>
          </div>
          {latestPosts.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
              <p className="text-zinc-600 text-sm">No news posted yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {latestPosts.map((post) => (
                <NewsCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  createdAt={post.createdAt}
                  game={post.game}
                  excerpt={getExcerpt(post.content)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Discord CTA */}
        {discordUrl && (
          <section>
            <div className="relative overflow-hidden rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-8 text-center space-y-4">
              <div className="absolute inset-0 tactical-grid opacity-40" />
              <div className="relative space-y-4">
                <h2 className="text-2xl font-display font-bold uppercase tracking-wide text-zinc-100">Join the squad</h2>
                <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
                  Get pinged when servers fill up, organize game nights, and hang out with the community keeping these
                  games alive.
                </p>
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
                >
                  Join us on Discord
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function HeroStat({ value, label, pulse }: { value: string; label: string; pulse?: boolean }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={`w-2 h-2 rounded-full self-center ${pulse ? 'bg-amber-400 animate-pulse' : 'bg-zinc-700'}`} />
      <span className="text-2xl font-display font-bold tabular-nums text-zinc-100">{value}</span>
      <span className="text-xs uppercase tracking-wider text-zinc-600 font-mono">{label}</span>
    </div>
  )
}

function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div>
      <h2 className="text-xl font-display font-bold uppercase tracking-wide text-zinc-100">{title}</h2>
      {sub && <p className="text-sm text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  )
}
