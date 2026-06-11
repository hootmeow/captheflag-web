import Link from 'next/link'

interface NewsCardProps {
  slug: string
  title: string
  createdAt: Date
  game?: string | null
  excerpt?: string | null
}

const GAME_LABELS: Record<string, string> = {
  bf1942: 'BF1942',
  bfv: 'BFV',
}

const GAME_COLORS: Record<string, string> = {
  bf1942: 'bg-amber-950 text-amber-400 border-amber-900/50',
  bfv: 'bg-emerald-950 text-emerald-400 border-emerald-900/50',
}

export default function NewsCard({ slug, title, createdAt, game, excerpt }: NewsCardProps) {
  return (
    <Link
      href={`/news/${slug}`}
      className="group block rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-medium text-zinc-200 leading-snug group-hover:text-white transition-colors">
          {title}
        </span>
        {game && (
          <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded border ${GAME_COLORS[game] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
            {GAME_LABELS[game] ?? game}
          </span>
        )}
      </div>
      {excerpt && (
        <p className="mt-2 text-sm text-zinc-500 line-clamp-2">{excerpt}</p>
      )}
      <time className="mt-2 block text-xs text-zinc-600">
        {new Date(createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </time>
    </Link>
  )
}
