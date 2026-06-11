import { db } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard · Admin' }

export default async function AdminDashboard() {
  const [postCount, publishedCount, draftCount, pageCount, userCount, recentPosts] = await Promise.all([
    db.post.count(),
    db.post.count({ where: { published: true } }),
    db.post.count({ where: { published: false } }),
    db.page.count(),
    db.adminUser.count(),
    db.post.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  return (
    <div className="p-8 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 mt-0.5">captheflag.com content management</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-zinc-500 hover:text-amber-400 transition-colors"
        >
          View site ↗
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Published', value: publishedCount, color: 'text-amber-400' },
          { label: 'Drafts', value: draftCount, color: 'text-zinc-400' },
          { label: 'Pages', value: pageCount, color: 'text-zinc-400' },
          { label: 'Admin Users', value: userCount, color: 'text-zinc-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-1">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-zinc-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/news/new"
            className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-colors"
          >
            + New Post
          </Link>
          <Link
            href="/admin/news"
            className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-600 text-zinc-300 text-sm transition-colors"
          >
            Manage News
          </Link>
          <Link
            href="/admin/pages"
            className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-600 text-zinc-300 text-sm transition-colors"
          >
            Edit Pages
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-600 text-zinc-300 text-sm transition-colors"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">Recent Posts</h2>
          <div className="space-y-1.5">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3"
              >
                <div className="space-y-0.5 min-w-0 mr-4">
                  <div className="text-sm font-medium text-zinc-200 truncate">{post.title}</div>
                  <div className="text-xs text-zinc-600 font-mono">/news/{post.slug}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    post.published
                      ? 'bg-green-950 text-green-400 border-green-900/60'
                      : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <Link href={`/admin/news/${post.id}`} className="text-xs text-zinc-500 hover:text-amber-400 transition-colors">
                    Edit →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
