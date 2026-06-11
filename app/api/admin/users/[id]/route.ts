import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

interface Params {
  params: Promise<{ id: string }>
}

export async function PUT(req: Request, { params }: Params) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { password } = await req.json()

  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  await db.adminUser.update({
    where: { id: parseInt(id) },
    data: { passwordHash: await hash(password, 12) },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: Request, { params }: Params) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const targetId = parseInt(id)

  const count = await db.adminUser.count()
  if (count <= 1) {
    return NextResponse.json({ error: 'Cannot delete the last admin user' }, { status: 400 })
  }

  await db.adminUser.delete({ where: { id: targetId } })
  return NextResponse.json({ ok: true })
}
