import { GameConfig } from '@/lib/games'
import { LiveServer } from '@/lib/stats'

interface LiveServersListProps {
  game: GameConfig
  servers: LiveServer[]
  /** Cap the number shown; omit for all */
  limit?: number
  emptyLabel?: string
}

export default function LiveServersList({ game, servers, limit, emptyLabel }: LiveServersListProps) {
  const t = game.theme
  const shown = limit ? servers.slice(0, limit) : servers

  if (shown.length === 0) {
    return (
      <div className="rounded-md border border-zinc-800 bg-zinc-950/40 px-4 py-6 text-center">
        <p className="text-sm text-zinc-600">{emptyLabel ?? 'No servers reporting right now.'}</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-zinc-800 rounded-md border border-zinc-800 bg-zinc-950/40 overflow-hidden">
      {shown.map((s) => {
        const fill = s.maxPlayers > 0 ? Math.min(100, (s.players / s.maxPlayers) * 100) : 0
        return (
          <div key={s.id} className="flex items-center gap-3 px-4 py-2.5">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.online ? t.dot : 'bg-zinc-700'}`} />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-zinc-200 truncate">{s.name}</div>
              <div className="text-xs text-zinc-600 truncate">{s.map}</div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-sm tabular-nums">
                <span className={t.text}>{s.players}</span>
                <span className="text-zinc-600">/{s.maxPlayers || '—'}</span>
              </div>
              <div className="mt-1 h-1 w-16 rounded-full bg-zinc-800 overflow-hidden">
                <div className={`h-1 rounded-full ${t.bar}`} style={{ width: `${fill}%` }} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
