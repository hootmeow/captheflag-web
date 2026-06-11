import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import PostForm from '../PostForm'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Edit Post · captheflag.com Admin',
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const post = await db.post.findUnique({ where: { id: parseInt(id) } })
  if (!post) notFound()

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-xl font-bold text-zinc-100">Edit Post</h1>
      <PostForm post={post} />
    </div>
  )
}
