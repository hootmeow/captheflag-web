import { GameConfig } from '@/lib/games'
import { LeaderPlayer } from '@/lib/stats'

interface WeeklyLeadersProps {
  game: GameConfig
  leaders: LeaderPlayer[]
}

export default function WeeklyLeaders({ game, leaders }: WeeklyLeadersProps) {
  const t = game.theme

  if (leaders.length === 0) {
    return (
      <div className="rounded-md border border-zinc-800 bg-zinc-950/40 px-4 py-6 text-center">
        <p className="text-sm text-zinc-600">Not enough rounds played this week yet.</p>
      </div>
    )
  }

  return (
    <ol className="divide-y divide-zinc-800 rounded-md border border-zinc-800 bg-zinc-950/40 overflow-hidden">
      {leaders.map((p) => (
        <li key={p.playerId} className="flex items-center gap-3 px-4 py-2.5">
          <span className={`w-5 text-right font-display font-bold tabular-nums ${p.rank <= 3 ? t.text : 'text-zinc-600'}`}>
            {p.rank}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm text-zinc-200 truncate">{p.name}</div>
            <div className="text-[11px] text-zinc-600 truncate">
              {p.rankLabel} · {p.rounds} rounds · {p.kdr.toFixed(2)} K/D
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className={`text-sm font-semibold tabular-nums ${t.text}`}>{p.rp}</div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-600 font-mono">RP</div>
          </div>
        </li>
      ))}
    </ol>
  )
}
