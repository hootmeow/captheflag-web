import type { Metadata } from 'next'
import { db } from '@/lib/db'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'About captheflag.com — a classic Battlefield community.',
}

export default async function AboutPage() {
  const page = await db.page.findUnique({ where: { slug: 'about' } })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          {page?.title ?? 'About captheflag.com'}
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Community-run classic Battlefield servers</p>
      </div>

      <div className="border-t border-zinc-800 pt-6">
        {page ? (
          <MarkdownRenderer content={page.content} />
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <p className="text-zinc-600">About page content coming soon.</p>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-800 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/games/bf1942"
          className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 transition-colors group"
        >
          <div className="text-sm font-medium text-zinc-200 group-hover:text-white">Play Battlefield 1942</div>
          <div className="text-xs text-zinc-500 mt-1">Setup guide and server info →</div>
        </Link>
        {process.env.NEXT_PUBLIC_DISCORD_URL && (
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-indigo-900/30 bg-indigo-950/20 p-4 hover:bg-indigo-950/30 transition-colors group"
          >
            <div className="text-sm font-medium text-indigo-300 group-hover:text-indigo-200">Join the Community</div>
            <div className="text-xs text-indigo-500 mt-1">Discord server →</div>
          </a>
        )}
      </div>
    </div>
  )
}
