import { db } from '@/lib/db'
import Link from 'next/link'

export const metadata = {
  title: 'Pages · captheflag.com Admin',
}

export default async function AdminPagesListPage() {
  const pages = await db.page.findMany({ orderBy: { slug: 'asc' } })

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-xl font-bold text-zinc-100">Pages</h1>

      <div className="space-y-2">
        {pages.map((page) => (
          <div
            key={page.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3"
          >
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-zinc-200">{page.title}</div>
              <div className="text-xs text-zinc-600 font-mono">/{page.slug}</div>
            </div>
            <Link
              href={`/admin/pages/${page.id}`}
              className="text-xs text-zinc-500 hover:text-amber-400 transition-colors"
            >
              Edit →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
