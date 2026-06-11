import Link from 'next/link'
import { GameConfig } from '@/lib/games'
import { GameSnapshot } from '@/lib/stats'
import { fmt } from './StatTile'

interface GameTheaterCardProps {
  game: GameConfig
  snapshot: GameSnapshot
  /** stagger index for page-load reveal */
  index?: number
}

/** Large "mission select" panel for one game on the portal home board. */
export default function GameTheaterCard({ game, snapshot, index = 0 }: GameTheaterCardProps) {
  const t = game.theme
  const onlineServers = snapshot.servers.filter((s) => s.online)
  const livePlayers = onlineServers.reduce((sum, s) => sum + s.players, 0)
  const topPlayer = snapshot.leaders[0]
  const totalRounds = snapshot.metrics?.totalRounds ?? 0

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border ${t.border} bg-zinc-900/40 ctf-rise`}
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      {/* Atmospheric wash + grid */}
      <div className={`absolute inset-0 ${t.grid} opacity-60`} />
      <div className={`absolute inset-0 bg-gradient-to-b ${t.heroWash}`} />
      <div className="absolute inset-0 scanlines opacity-50" />

      <div className="relative p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={`inline-flex items-center gap-1.5 text-[10px] stencil px-2 py-0.5 rounded border ${t.chip}`}>
              {game.era}
            </div>
            <h3 className="mt-2 text-2xl sm:text-3xl font-display font-bold uppercase tracking-wide text-zinc-100">
              {game.name}
            </h3>
            <p className="text-sm text-zinc-500 mt-0.5">{game.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center justify-end gap-1.5">
              <span className={`w-2 h-2 rounded-full ${livePlayers > 0 ? t.dot + ' animate-pulse' : 'bg-zinc-700'}`} />
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">
                {snapshot.reachable ? 'Live' : 'Offline'}
              </span>
            </div>
            <div className={`mt-1 text-3xl font-display font-bold tabular-nums ${t.text}`}>{livePlayers}</div>
            <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-mono">in-game now</div>
          </div>
        </div>

        {/* Telemetry strip */}
        <div className="grid grid-cols-3 gap-px rounded-md overflow-hidden border border-zinc-800 bg-zinc-800 text-center">
          <Tele label="Servers" value={`${onlineServers.length}`} />
          <Tele label="Rounds tracked" value={totalRounds ? fmt(totalRounds) : '—'} />
          <Tele
            label="Top this week"
            value={topPlayer ? topPlayer.name : '—'}
            accent={topPlayer ? t.text : 'text-zinc-500'}
            truncate
          />
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-2 pt-1">
          <a
            href={game.site}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${t.btn}`}
          >
            Enter {game.shortName} →
          </a>
          <Link
            href={game.slug}
            className={`px-4 py-2 rounded-md border border-zinc-700 text-zinc-300 text-sm transition-colors ${t.ghostHover}`}
          >
            How to join
          </Link>
        </div>
      </div>
    </div>
  )
}

function Tele({
  label,
  value,
  accent = 'text-zinc-200',
  truncate,
}: {
  label: string
  value: string
  accent?: string
  truncate?: boolean
}) {
  return (
    <div className="bg-zinc-950/60 px-2 py-2.5">
      <div className={`text-sm font-semibold ${accent} ${truncate ? 'truncate' : 'tabular-nums'}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-mono mt-0.5">{label}</div>
    </div>
  )
}
