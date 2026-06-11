import Link from 'next/link'
import { GAME_LIST } from '@/lib/games'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="font-display font-bold uppercase tracking-wider text-zinc-100 text-sm mb-2">
              capthe<span className="text-amber-400">flag</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Community hub for classic Battlefield — keeping BF1942 and BF Vietnam alive with live servers and stats.
            </p>
          </div>

          {GAME_LIST.map((game) => (
            <div key={game.id}>
              <div className={`text-xs stencil ${game.theme.text} mb-3`}>{game.shortName}</div>
              <ul className="space-y-2">
                <li>
                  <Link href={game.slug} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    Overview & join
                  </Link>
                </li>
                <li>
                  <a href={game.site} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    Stats & leaderboards ↗
                  </a>
                </li>
                <li>
                  <Link href="/servers" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    Live servers
                  </Link>
                </li>
              </ul>
            </div>
          ))}

          <div>
            <div className="text-xs stencil text-zinc-400 mb-3">Community</div>
            <ul className="space-y-2">
              <li><Link href="/news" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">News</Link></li>
              <li><Link href="/rules" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Rules</Link></li>
              <li><Link href="/about" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">About</Link></li>
              {process.env.NEXT_PUBLIC_DISCORD_URL && (
                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_DISCORD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors"
                  >
                    Discord ↗
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-zinc-600">© {year} captheflag.com — Classic Battlefield Community</p>
          <Link href="/login" className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  )
}
