import type { Metadata } from 'next'
import UserForm from '../UserForm'

export const metadata: Metadata = { title: 'New User · Admin' }

export default function NewUserPage() {
  return (
    <div className="p-8 space-y-6 max-w-lg">
      <h1 className="text-xl font-bold text-zinc-100">Add Admin User</h1>
      <UserForm />
    </div>
  )
}
