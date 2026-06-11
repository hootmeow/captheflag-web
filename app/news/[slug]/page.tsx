import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await db.post.findUnique({ where: { slug } })
  if (!post) return {}
  return {
    title: post.title,
    description: post.content.replace(/[#*`\[\]]/g, '').trim().slice(0, 160),
  }
}

const GAME_LABELS: Record<string, string> = { bf1942: 'BF1942', bfv: 'BFV' }
const GAME_HREF: Record<string, string> = { bf1942: '/games/bf1942', bfv: '/games/bfv' }

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params
  const post = await db.post.findUnique({ where: { slug, published: true } })

  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="space-y-8">
        {/* Back + meta */}
        <div className="space-y-4">
          <Link href="/news" className="text-sm text-zinc-500 hover:text-amber-400 transition-colors inline-flex items-center gap-1">
            ← Back to News
          </Link>

          <div>
            {post.game && (
              <Link
                href={GAME_HREF[post.game] ?? '/news'}
                className="inline-block text-xs px-2 py-0.5 rounded border bg-amber-950 text-amber-400 border-amber-900/50 mb-3"
              >
                {GAME_LABELS[post.game] ?? post.game}
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 leading-tight">{post.title}</h1>
            <time className="block mt-2 text-sm text-zinc-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>

        {/* Content */}
        <div className="border-t border-zinc-800 pt-8">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Footer nav */}
        <div className="border-t border-zinc-800 pt-6">
          <Link href="/news" className="text-sm text-zinc-500 hover:text-amber-400 transition-colors">
            ← All News
          </Link>
        </div>
      </div>
    </div>
  )
}
