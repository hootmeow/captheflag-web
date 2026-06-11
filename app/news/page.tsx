import type { Metadata } from 'next'
import { db } from '@/lib/db'
import NewsCard from '@/components/NewsCard'

export const metadata: Metadata = {
  title: 'News',
  description: 'Community news and updates from captheflag.com.',
}

function getExcerpt(content: string) {
  return content.replace(/[#*`\[\]]/g, '').trim().slice(0, 160) || null
}

export default async function NewsPage() {
  const posts = await db.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  const bf1942Posts = posts.filter((p) => p.game === 'bf1942')
  const bfvPosts = posts.filter((p) => p.game === 'bfv')
  const sitePosts = posts.filter((p) => !p.game)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">News</h1>
        <p className="text-zinc-500 text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} published</p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-12 text-center">
          <p className="text-zinc-600">No posts published yet — check back soon.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {sitePosts.length > 0 && (
            <section className="space-y-3">
              {bf1942Posts.length > 0 || bfvPosts.length > 0 ? (
                <h2 className="text-xs text-zinc-500 uppercase tracking-wide font-semibold">Community</h2>
              ) : null}
              <div className="space-y-3">
                {sitePosts.map((post) => (
                  <NewsCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    createdAt={post.createdAt}
                    game={post.game}
                    excerpt={getExcerpt(post.content)}
                  />
                ))}
              </div>
            </section>
          )}

          {bf1942Posts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs text-zinc-500 uppercase tracking-wide font-semibold">Battlefield 1942</h2>
              <div className="space-y-3">
                {bf1942Posts.map((post) => (
                  <NewsCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    createdAt={post.createdAt}
                    game={post.game}
                    excerpt={getExcerpt(post.content)}
                  />
                ))}
              </div>
            </section>
          )}

          {bfvPosts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs text-zinc-500 uppercase tracking-wide font-semibold">Battlefield Vietnam</h2>
              <div className="space-y-3">
                {bfvPosts.map((post) => (
                  <NewsCard
                    key={post.id}
                    slug={post.slug}
                    title={post.title}
                    createdAt={post.createdAt}
                    game={post.game}
                    excerpt={getExcerpt(post.content)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
