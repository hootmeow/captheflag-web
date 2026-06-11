import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, slug, content, game, published } = await req.json()
  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'title, slug, and content are required' }, { status: 400 })
  }

  try {
    const post = await db.post.create({
      data: { title, slug, content, game: game ?? null, published: published ?? false },
    })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
  }
}
