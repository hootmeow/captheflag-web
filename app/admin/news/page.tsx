import { db } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage News · Admin' }

const GAME_LABELS: Record<string, string> = { bf1942: 'BF1942', bfv: 'BFV' }

export default async function AdminNewsListPage() {
  const posts = await db.post.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="p-8 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">News</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/admin/news/new"
          className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-colors"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <p className="text-zinc-600 text-sm">No posts yet.</p>
          <Link href="/admin/news/new" className="mt-3 inline-block text-sm text-amber-500 hover:text-amber-400">
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="space-y-1.5">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-0.5 min-w-0 mr-4">
                <div className="text-sm font-medium text-zinc-200 truncate">{post.title}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 font-mono">/news/{post.slug}</span>
                  {post.game && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-950 text-amber-500 border border-amber-900/40">
                      {GAME_LABELS[post.game] ?? post.game}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  post.published
                    ? 'bg-green-950 text-green-400 border-green-900/60'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                }`}>
                  {post.published ? 'Published' : 'Draft'}
                </span>
                <Link
                  href={`/admin/news/${post.id}`}
                  className="text-xs text-zinc-500 hover:text-amber-400 transition-colors"
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
