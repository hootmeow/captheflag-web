'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface Post {
  id: number
  slug: string
  title: string
  content: string
  game: string | null
  published: boolean
}

interface PostFormProps {
  post?: Post
}

function autoSlug(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function PostForm({ post }: PostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title ?? '')
  const [slug, setSlug] = useState(post?.slug ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [game, setGame] = useState(post?.game ?? '')
  const [published, setPublished] = useState(post?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const method = post ? 'PUT' : 'POST'
    const url = post ? `/api/admin/news/${post.id}` : '/api/admin/news'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, content, game: game || null, published }),
    })

    if (res.ok) {
      router.push('/admin/news')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!post || !confirm('Delete this post? This cannot be undone.')) return
    await fetch(`/api/admin/news/${post.id}`, { method: 'DELETE' })
    router.push('/admin/news')
    router.refresh()
  }

  async function handleTogglePublish() {
    if (!post) return
    const res = await fetch(`/api/admin/news/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, slug, content, game: game || null, published: !published }),
    })
    if (res.ok) {
      setPublished(!published)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-wide">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (!post) setSlug(autoSlug(e.target.value))
            }}
            required
            className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-sm transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-wide">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-sm font-mono transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1 max-w-xs">
        <label className="text-xs text-zinc-500 uppercase tracking-wide">Game</label>
        <select
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 text-sm"
        >
          <option value="">Site-wide</option>
          <option value="bf1942">Battlefield 1942</option>
          <option value="bfv">Battlefield Vietnam</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-500 uppercase tracking-wide">Content (Markdown)</label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-xs text-zinc-500 hover:text-amber-400 transition-colors px-2 py-0.5 rounded border border-zinc-700 hover:border-zinc-600"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {preview ? (
          <div className="min-h-64 rounded-md bg-zinc-900 border border-zinc-700 p-4 text-sm">
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-zinc-600 italic">Nothing to preview.</p>
            )}
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={16}
            className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 text-sm font-mono resize-y transition-colors"
          />
        )}
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="accent-amber-500 w-4 h-4"
        />
        <span className="text-sm text-zinc-300">Published</span>
        {post && (
          <span className={`text-xs px-2 py-0.5 rounded-full border ml-1 ${
            published
              ? 'bg-green-950 text-green-400 border-green-900/60'
              : 'bg-zinc-800 text-zinc-500 border-zinc-700'
          }`}>
            {published ? 'Live' : 'Draft'}
          </span>
        )}
      </label>

      {error && (
        <div className="rounded-md bg-red-950/40 border border-red-900/50 px-3 py-2">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : post ? 'Save Changes' : 'Create Post'}
        </button>
        {post && (
          <>
            <button
              type="button"
              onClick={handleTogglePublish}
              className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-600 text-zinc-300 text-sm transition-colors"
            >
              {published ? 'Unpublish' : 'Publish'}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-md border border-red-900/60 text-red-400 hover:bg-red-950/30 text-sm transition-colors ml-auto"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </form>
  )
}
