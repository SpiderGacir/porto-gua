import type { Metadata, Viewport } from 'next'
import { Inter, Sora } from 'next/font/google'
import './globals.css'
import { LangProvider } from '../components/LangProvider'
import Shell from '../components/Shell'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })

export const metadata: Metadata = {
  title: 'Rafi Pasha — Student & Creative Tech Enthusiast',
  description: 'Personal portfolio of Rafi Pasha, a student and creative tech enthusiast exploring web development, AI, digital business, and technology.',
  openGraph: { title: 'Rafi Pasha — Student & Creative Tech Enthusiast', description: 'Building, learning, experimenting.', type: 'website' }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#07080a'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <LangProvider>
          <Shell>{children}</Shell>
        </LangProvider>
      </body>
    </html>
  )
}
