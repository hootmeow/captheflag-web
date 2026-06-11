import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import PageForm from '../PageForm'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Edit Page · captheflag.com Admin',
}

export default async function EditPagePage({ params }: Props) {
  const { id } = await params
  const page = await db.page.findUnique({ where: { id: parseInt(id) } })
  if (!page) notFound()

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-xl font-bold text-zinc-100">Edit Page: {page.title}</h1>
      <PageForm page={page} />
    </div>
  )
}
