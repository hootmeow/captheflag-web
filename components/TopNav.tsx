'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { GAME_LIST, GameConfig } from '@/lib/games'

const COMMUNITY_LINKS = [
  { href: '/servers', label: 'Servers' },
  { href: '/news', label: 'News' },
  { href: '/rules', label: 'Rules' },
  { href: '/about', label: 'About' },
]

export default function TopNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeGame = GAME_LIST.find((g) => pathname.startsWith(g.slug)) ?? null

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <FlagIcon className="text-amber-400 group-hover:text-amber-300 transition-colors" />
          <span className="font-display font-bold uppercase tracking-wider text-zinc-100 text-sm">
            capthe<span className="text-amber-400">flag</span>
          </span>
        </Link>

        <div className="h-5 w-px bg-zinc-800 hidden md:block" />

        {/* Game pillars (desktop) */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          {GAME_LIST.map((game) => (
            <GamePillar key={game.id} game={game} active={activeGame?.id === game.id} />
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1 text-sm ml-1">
          {COMMUNITY_LINKS.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))
            return (
              <Link
                key={href}
                href={href}
                className={`px-2.5 py-1.5 rounded-md transition-colors ${
                  active ? 'text-zinc-100 bg-zinc-800/70' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {process.env.NEXT_PUBLIC_DISCORD_URL && (
            <a
              href={process.env.NEXT_PUBLIC_DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              <DiscordIcon />
              Discord
            </a>
          )}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden text-zinc-400 hover:text-zinc-100 p-1.5 -mr-1.5"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-4 py-4 space-y-4">
          {GAME_LIST.map((game) => (
            <div key={game.id} className="space-y-1.5">
              <div className={`text-xs stencil ${game.theme.text}`}>{game.name}</div>
              <div className="grid grid-cols-2 gap-1.5">
                <Link
                  href={game.slug}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-md text-sm text-zinc-300 bg-zinc-900 hover:bg-zinc-800"
                >
                  Overview
                </Link>
                <a
                  href={game.site}
                  className="px-3 py-2 rounded-md text-sm text-zinc-300 bg-zinc-900 hover:bg-zinc-800"
                >
                  Stats ↗
                </a>
              </div>
            </div>
          ))}
          <div className="border-t border-zinc-800 pt-3 grid grid-cols-2 gap-1.5">
            {COMMUNITY_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

function GamePillar({ game, active }: { game: GameConfig; active: boolean }) {
  const t = game.theme
  return (
    <div className="relative group">
      <Link
        href={game.slug}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
          active ? t.navActive : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/50'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
        <span className="font-medium">{game.shortName}</span>
        <ChevronIcon />
      </Link>

      {/* Hover/focus dropdown */}
      <div className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible transition-all duration-150">
        <div className={`rounded-lg border ${t.border} bg-zinc-950 shadow-xl shadow-black/50 overflow-hidden`}>
          <div className={`px-3 py-2 text-[10px] stencil ${t.text} border-b border-zinc-800 ${t.panel}`}>
            {game.era}
          </div>
          <DropItem href={game.slug} label="Overview & how to join" internal />
          <DropItem href="/servers" label="Live servers" internal />
          <DropItem href={game.site} label="Stats & leaderboards ↗" />
          <DropItem href={`${game.site}/players`} label="Player profiles ↗" />
        </div>
      </div>
    </div>
  )
}

function DropItem({ href, label, internal }: { href: string; label: string; internal?: boolean }) {
  const cls = 'block px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors'
  return internal ? (
    <Link href={href} className={cls}>
      {label}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {label}
    </a>
  )
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M3 1a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-1 0V9H1.5a.5.5 0 0 1 0-1H2.5V1.5A.5.5 0 0 1 3 1zm1 1v5.5h8.5L14 5 12.5 2.5H4z" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden className="text-zinc-600">
      <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.114 18.1.133 18.114a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  )
}
