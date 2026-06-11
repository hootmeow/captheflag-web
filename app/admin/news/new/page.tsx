import PostForm from '../PostForm'

export const metadata = {
  title: 'New Post · captheflag.com Admin',
}

export default function NewPostPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-xl font-bold text-zinc-100">New Post</h1>
      <PostForm />
    </div>
  )
}
