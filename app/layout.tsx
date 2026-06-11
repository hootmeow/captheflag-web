import type { Metadata } from 'next'
import { Geist, Geist_Mono, Oswald } from 'next/font/google'
import './globals.css'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
const oswald = Oswald({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-oswald' })

export const metadata: Metadata = {
  title: {
    default: 'captheflag.com — Classic Battlefield Community',
    template: '%s · captheflag.com',
  },
  description: 'Classic FPS server community — Battlefield 1942 & Battlefield Vietnam. Live servers, news, and community.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://captheflag.com'),
  openGraph: {
    siteName: 'captheflag.com',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable} ${oswald.variable} font-sans bg-zinc-950 text-zinc-100 antialiased`}>
        <TopNav />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
