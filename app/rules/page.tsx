import type { Metadata } from 'next'
import { db } from '@/lib/db'
import MarkdownRenderer from '@/components/MarkdownRenderer'

export const metadata: Metadata = {
  title: 'Server Rules',
  description: 'Rules for captheflag.com Battlefield servers.',
}

export default async function RulesPage() {
  const page = await db.page.findUnique({ where: { slug: 'rules' } })

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          {page?.title ?? 'Server Rules'}
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Rules that apply to all captheflag.com servers</p>
      </div>

      <div className="border-t border-zinc-800 pt-6">
        {page ? (
          <MarkdownRenderer content={page.content} />
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
            <p className="text-zinc-600">Rules have not been published yet.</p>
          </div>
        )}
      </div>

      {process.env.NEXT_PUBLIC_DISCORD_URL && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-zinc-300">Questions about the rules?</div>
            <div className="text-xs text-zinc-500 mt-0.5">Ask in our Discord — admins are active there.</div>
          </div>
          <a
            href={process.env.NEXT_PUBLIC_DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3 py-1.5 rounded-md bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 hover:bg-indigo-600/30 text-xs font-medium transition-colors"
          >
            Ask on Discord →
          </a>
        </div>
      )}
    </div>
  )
}
