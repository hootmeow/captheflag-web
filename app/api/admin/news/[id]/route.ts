import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, { params }: Params) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { title, slug, content, game, published } = await req.json()

  try {
    const post = await db.post.update({
      where: { id: parseInt(id) },
      data: { title, slug, content, game: game ?? null, published },
    })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 })
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await db.post.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ ok: true })
}
