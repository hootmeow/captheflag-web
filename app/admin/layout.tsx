import Link from 'next/link'

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/news', label: 'News' },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/users', label: 'Users' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-zinc-800 bg-zinc-900/30 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <Link href="/" className="text-xs text-zinc-600 hover:text-amber-400 transition-colors">
            ← captheflag.com
          </Link>
          <div className="mt-2 font-semibold text-zinc-200 text-sm">Admin Panel</div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800">
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full text-left px-3 py-2 rounded-md text-sm text-zinc-500 hover:text-red-400 hover:bg-zinc-800/60 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 overflow-auto bg-zinc-950">
        {children}
      </div>
    </div>
  )
}
