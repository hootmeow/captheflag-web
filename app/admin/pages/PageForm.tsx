'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Page {
  id: number
  slug: string
  title: string
  content: string
}

export default function PageForm({ page }: { page: Page }) {
  const router = useRouter()
  const [title, setTitle] = useState(page.title)
  const [content, setContent] = useState(page.content)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch(`/api/admin/pages/${page.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })

    if (res.ok) {
      router.push('/admin/pages')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="space-y-1">
        <label className="text-xs text-zinc-500 uppercase tracking-wide">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 text-sm"
        />
      </div>

      <div className="text-xs text-zinc-600 font-mono">slug: /{page.slug} (fixed)</div>

      <div className="space-y-1">
        <label className="text-xs text-zinc-500 uppercase tracking-wide">Content (Markdown)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={14}
          className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 text-sm font-mono resize-y"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}
