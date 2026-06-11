import type { Metadata } from 'next'
import Link from 'next/link'
import LiveServersList from '@/components/LiveServersList'
import { GAME_LIST } from '@/lib/games'
import { getLiveServers } from '@/lib/stats'

export const metadata: Metadata = {
  title: 'Servers',
  description: 'Live server status for Battlefield 1942 and Battlefield Vietnam.',
}

export default async function ServersPage() {
  const serverLists = await Promise.all(GAME_LIST.map((g) => getLiveServers(g)))

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-bold uppercase tracking-wide text-zinc-100">Live servers</h1>
        <p className="text-zinc-500 text-sm">Status refreshes every 30 seconds · sourced from each game&apos;s stats engine.</p>
      </div>

      {GAME_LIST.map((game, i) => {
        const servers = serverLists[i] ?? []
        const online = servers.filter((s) => s.online)
        const players = online.reduce((a, s) => a + s.players, 0)
        const t = game.theme
        return (
          <section key={game.id} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className={`w-1 h-5 rounded-full ${t.bar}`} />
                <h2 className="text-lg font-display font-bold uppercase tracking-wide text-zinc-100">{game.name}</h2>
                <span className={`text-[11px] stencil px-2 py-0.5 rounded border ${t.chip}`}>
                  {online.length} up · {players} playing
                </span>
              </div>
              <a href={game.site} className={`text-xs ${t.text} hover:opacity-80 transition-opacity shrink-0`}>
                Stats site ↗
              </a>
            </div>
            <LiveServersList game={game} servers={servers} emptyLabel={`No ${game.shortName} servers reporting right now.`} />
            <Link href={game.slug} className="inline-block text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              How to join {game.shortName} →
            </Link>
          </section>
        )
      })}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 space-y-2">
        <h2 className="font-semibold text-zinc-200">Having trouble connecting?</h2>
        <p className="text-sm text-zinc-500">
          Check the <Link href="/rules" className="text-amber-400 hover:text-amber-300">server rules</Link> for connection
          requirements, or ask in the community Discord — someone will get you sorted.
        </p>
        {process.env.NEXT_PUBLIC_DISCORD_URL && (
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Join Discord for help →
          </a>
        )}
      </div>
    </div>
  )
}
