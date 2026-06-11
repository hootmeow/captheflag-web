'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
  className?: string
}

const components: Components = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-amber-400 mt-6 mb-3">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-zinc-100 mt-6 mb-3 border-b border-zinc-800 pb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-zinc-200 mt-5 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-zinc-400 leading-relaxed my-3">{children}</p>,
  a: ({ href, children }) => <a href={href} className="text-amber-400 hover:text-amber-300 underline underline-offset-2">{children}</a>,
  strong: ({ children }) => <strong className="text-zinc-100 font-semibold">{children}</strong>,
  em: ({ children }) => <em className="text-zinc-300 italic">{children}</em>,
  ul: ({ children }) => <ul className="my-3 ml-5 space-y-1 list-disc marker:text-amber-600">{children}</ul>,
  ol: ({ children }) => <ol className="my-3 ml-5 space-y-1 list-decimal marker:text-amber-600">{children}</ol>,
  li: ({ children }) => <li className="text-zinc-400">{children}</li>,
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-')
    if (isBlock) {
      return (
        <pre className="my-4 rounded-lg bg-zinc-900 border border-zinc-800 p-4 overflow-x-auto">
          <code className="text-zinc-300 text-sm font-mono">{children}</code>
        </pre>
      )
    }
    return <code className="font-mono text-amber-400 bg-zinc-800 px-1.5 py-0.5 rounded text-sm">{children}</code>
  },
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-amber-600 pl-4 text-zinc-400 italic">{children}</blockquote>
  ),
  hr: () => <hr className="my-6 border-zinc-800" />,
  table: ({ children }) => <div className="overflow-x-auto my-4"><table className="w-full text-sm">{children}</table></div>,
  th: ({ children }) => <th className="text-left text-zinc-300 font-semibold border-b border-zinc-700 pb-2 pr-4">{children}</th>,
  td: ({ children }) => <td className="text-zinc-400 border-b border-zinc-800 py-2 pr-4">{children}</td>,
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
