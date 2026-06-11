import { db } from '@/lib/db'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Users · Admin' }

export default async function AdminUsersPage() {
  const users = await db.adminUser.findMany({ orderBy: { id: 'asc' } })

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Admin Users</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Manage who can access the admin panel</p>
        </div>
        <Link
          href="/admin/users/new"
          className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-colors"
        >
          + Add User
        </Link>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
          >
            <div className="space-y-0.5">
              <div className="text-sm font-medium text-zinc-200 font-mono">{user.username}</div>
              <div className="text-xs text-zinc-600">ID #{user.id}</div>
            </div>
            <Link
              href={`/admin/users/${user.id}`}
              className="text-xs text-zinc-500 hover:text-amber-400 transition-colors"
            >
              Change Password →
            </Link>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-4">
        <p className="text-xs text-zinc-600 leading-relaxed">
          All users listed here have full admin access. Only add trusted individuals.
          Passwords are hashed with bcrypt and never stored in plaintext.
        </p>
      </div>
    </div>
  )
}
