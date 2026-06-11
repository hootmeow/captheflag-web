import Link from 'next/link'
import { GameConfig } from '@/lib/games'
import { getGameSnapshot } from '@/lib/stats'
import LiveServersList from './LiveServersList'
import WeeklyLeaders from './WeeklyLeaders'
import { fmt } from './StatTile'

export interface JoinStep {
  step: string
  title: string
  body: string
}
export interface DetailRow {
  label: string
  value: string
}
export interface ResourceLink {
  title: string
  desc: string
  href: string
}

interface GameLandingProps {
  game: GameConfig
  intro: string
  joinSteps: JoinStep[]
  details: DetailRow[]
  resources: ResourceLink[]
}

/**
 * Portal landing strip for a single game. Deliberately NOT a full site — it
 * shows live status + a stats teaser pulled from the game's engine, the join
 * basics, then funnels into the game's own subdomain for the deep dive.
 */
export default async function GameLanding({ game, intro, joinSteps, details, resources }: GameLandingProps) {
  const t = game.theme
  const snapshot = await getGameSnapshot(game, 5)
  const onlineServers = snapshot.servers.filter((s) => s.online)
  const livePlayers = onlineServers.reduce((a, s) => a + s.players, 0)
  const m = snapshot.metrics

  return (
    <div>
      {/* Themed hero */}
      <section className={`relative overflow-hidden border-b ${t.border}`}>
        <div className={`absolute inset-0 ${t.grid}`} />
        <div className={`absolute inset-0 bg-gradient-to-b ${t.heroWash}`} />
        <div className="absolute inset-0 scanlines opacity-50" />
        <div className="relative max-w-5xl mx-auto px-4 py-14">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-4">
            <Link href="/" className="hover:text-zinc-300 transition-colors">captheflag</Link>
            <span className="text-zinc-700">/</span>
            <span className={t.text}>{game.shortName}</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="ctf-rise">
              <div className={`inline-flex items-center gap-1.5 text-[11px] stencil px-2.5 py-1 rounded border ${t.chip}`}>
                {game.era}
              </div>
              <h1 className="mt-3 text-4xl sm:text-5xl font-display font-bold uppercase tracking-tight text-zinc-100">
                {game.name}
              </h1>
              <p className="mt-3 text-zinc-400 text-lg max-w-xl leading-relaxed">{intro}</p>
            </div>
            <div className="ctf-rise" style={{ animationDelay: '90ms' }}>
              <div className="flex items-center gap-1.5 justify-end">
                <span className={`w-2 h-2 rounded-full ${livePlayers > 0 ? t.dot + ' animate-pulse' : 'bg-zinc-700'}`} />
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">in-game now</span>
              </div>
              <div className={`text-5xl font-display font-bold tabular-nums text-right ${t.text}`}>{livePlayers}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={game.site} className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-colors ${t.btn}`}>
              Full stats & leaderboards →
            </a>
            <a href="#join" className={`px-5 py-2.5 rounded-md border border-zinc-700 text-zinc-300 text-sm transition-colors ${t.ghostHover}`}>
              How to join
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        {/* Live + stats teaser */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <SectionRule game={game} title="Live servers" />
            <LiveServersList game={game} servers={snapshot.servers} limit={6} emptyLabel="No servers reporting right now." />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <SectionRule game={game} title="Top players · this week" />
              <a href={`${game.site}/leaderboard`} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors shrink-0">
                Full board ↗
              </a>
            </div>
            <WeeklyLeaders game={game} leaders={snapshot.leaders} />
          </div>
        </section>

        {/* Network totals */}
        {m && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-lg overflow-hidden border border-zinc-800 bg-zinc-800">
            <Totals label="Rounds tracked" value={fmt(m.totalRounds)} accent={t.text} />
            <Totals label="Players seen" value={fmt(m.totalPlayers)} accent={t.text} />
            <Totals label="Active (24h)" value={fmt(m.activePlayers24h)} accent={t.text} />
            <Totals label="Top map (7d)" value={m.topMap ?? '—'} accent="text-zinc-200" truncate />
          </section>
        )}

        {/* How to join */}
        <section id="join" className="space-y-4 scroll-mt-20">
          <SectionRule game={game} title="How to join" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {joinSteps.map(({ step, title, body }) => (
              <div key={step} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 space-y-2">
                <div className={`font-display font-bold ${t.text}`}>{step}</div>
                <div className="font-semibold text-zinc-200">{title}</div>
                <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Server details */}
        <section className="space-y-4">
          <SectionRule game={game} title="Server details" />
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800">
            {details.map(({ label, value }) => (
              <div key={label} className="flex items-start gap-4 px-5 py-3">
                <span className="w-28 shrink-0 text-xs text-zinc-500 uppercase tracking-wide font-medium pt-0.5">{label}</span>
                <span className="text-sm text-zinc-300">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        {resources.length > 0 && (
          <section className="space-y-4">
            <SectionRule game={game} title="Resources" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resources.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 transition-all group ${t.borderHover}`}
                >
                  <div>
                    <div className="text-sm font-medium text-zinc-200 group-hover:text-white">{r.title}</div>
                    <div className="text-xs text-zinc-500">{r.desc}</div>
                  </div>
                  <span className={`text-zinc-600 ${t.textHover} transition-colors text-xs`}>↗</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Funnel to subdomain */}
        <section className={`rounded-xl border ${t.border} ${t.panel} p-6 flex flex-wrap items-center justify-between gap-4`}>
          <div>
            <div className="font-display font-bold uppercase tracking-wide text-zinc-100 text-lg">
              The full {game.shortName} experience
            </div>
            <p className="text-sm text-zinc-500 mt-1">
              Player profiles, detailed leaderboards, round history, maps and more live on the dedicated site.
            </p>
          </div>
          <a href={game.site} className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-colors shrink-0 ${t.btn}`}>
            Go to {new URL(game.site).host} →
          </a>
        </section>
      </div>
    </div>
  )
}

function SectionRule({ game, title }: { game: GameConfig; title: string }) {
  const t = game.theme
  return (
    <div className="flex items-center gap-3">
      <span className={`w-1 h-4 rounded-full ${t.bar}`} />
      <h2 className="text-sm stencil text-zinc-200">{title}</h2>
    </div>
  )
}

function Totals({ label, value, accent, truncate }: { label: string; value: string; accent: string; truncate?: boolean }) {
  return (
    <div className="bg-zinc-950/60 px-4 py-3 text-center">
      <div className={`text-xl font-display font-bold ${accent} ${truncate ? 'truncate' : 'tabular-nums'}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-mono mt-0.5">{label}</div>
    </div>
  )
}
