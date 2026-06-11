'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserFormProps {
  userId?: number
  username?: string
}

export default function UserForm({ userId, username }: UserFormProps) {
  const router = useRouter()
  const [usernameVal, setUsernameVal] = useState(username ?? '')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== passwordConfirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setSaving(true)

    const method = userId ? 'PUT' : 'POST'
    const url = userId ? `/api/admin/users/${userId}` : '/api/admin/users'
    const body = userId ? { password } : { username: usernameVal, password }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      if (userId) {
        setSuccess('Password updated successfully.')
        setPassword('')
        setPasswordConfirm('')
      } else {
        router.push('/admin/users')
        router.refresh()
      }
    } else {
      const data = await res.json()
      setError(data.error ?? 'Failed to save')
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!userId || !window.confirm(`Delete user "${username}"? They will lose admin access immediately.`)) return
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/users')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error ?? 'Delete failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!userId && (
        <div className="space-y-1">
          <label className="text-xs text-zinc-500 uppercase tracking-wide">Username</label>
          <input
            type="text"
            value={usernameVal}
            onChange={(e) => setUsernameVal(e.target.value)}
            required
            autoComplete="off"
            className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 text-sm font-mono"
          />
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs text-zinc-500 uppercase tracking-wide">
          {userId ? 'New Password' : 'Password'}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
          className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-zinc-500 uppercase tracking-wide">Confirm Password</label>
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
          autoComplete="new-password"
          className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-100 focus:outline-none focus:border-amber-500 text-sm"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-950/40 border border-red-900/50 px-3 py-2">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-950/40 border border-green-900/50 px-3 py-2">
          <p className="text-sm text-green-400">{success}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : userId ? 'Update Password' : 'Create User'}
        </button>
        {userId && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 rounded-md border border-red-900/60 text-red-400 hover:bg-red-950/30 text-sm transition-colors ml-auto"
          >
            Delete User
          </button>
        )}
      </div>
    </form>
  )
}
