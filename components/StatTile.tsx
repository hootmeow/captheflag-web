interface StatTileProps {
  label: string
  value: string | number
  /** Accent class for the value, e.g. "text-amber-400" */
  accent?: string
  sub?: string
}

export default function StatTile({ label, value, accent = 'text-zinc-100', sub }: StatTileProps) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-950/40 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-mono">{label}</div>
      <div className={`text-xl font-display font-semibold tabular-nums leading-tight mt-0.5 ${accent}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-zinc-600 mt-0.5 truncate">{sub}</div>}
    </div>
  )
}

export function fmt(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}
