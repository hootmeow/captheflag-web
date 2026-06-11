import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function POST(req: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { username, password } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'username and password are required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  try {
    const newUser = await db.adminUser.create({
      data: { username, passwordHash: await hash(password, 12) },
    })
    return NextResponse.json({ id: newUser.id, username: newUser.username })
  } catch {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
  }
}
