import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="font-mono text-6xl font-bold text-zinc-800">404</div>
        <h1 className="text-xl font-bold text-zinc-200">Page not found</h1>
        <p className="text-zinc-500 text-sm leading-relaxed">
          That page doesn't exist or may have been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-sm transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/news"
            className="px-4 py-2 rounded-md border border-zinc-700 hover:border-zinc-600 text-zinc-300 text-sm transition-colors"
          >
            Latest News
          </Link>
        </div>
      </div>
    </div>
  )
}
