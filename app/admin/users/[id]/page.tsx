import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import UserForm from '../UserForm'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Edit User · Admin' }

export default async function EditUserPage({ params }: Props) {
  const { id } = await params
  const user = await db.adminUser.findUnique({ where: { id: parseInt(id) } })
  if (!user) notFound()

  return (
    <div className="p-8 space-y-6 max-w-lg">
      <h1 className="text-xl font-bold text-zinc-100">
        Change Password — <span className="font-mono text-amber-400">{user.username}</span>
      </h1>
      <UserForm userId={user.id} username={user.username} />
    </div>
  )
}
