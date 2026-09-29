import { NextResponse, type NextRequest } from 'next/server'

// Opsional: kalau SITES_HOST diisi (mis. s.domain.com), semua request ke host itu
// di-rewrite ke /s/... supaya situs buatan pengguna hidup di origin terpisah dari portfolio.
export function middleware(req: NextRequest) {
  const sitesHost = process.env.SITES_HOST
  const host = (req.headers.get('host') || '').split(':')[0]
  if (!sitesHost || host !== sitesHost) return NextResponse.next()
  const url = req.nextUrl.clone()
  if (url.pathname === '/') return new NextResponse('Not found', { status: 404 })
  if (url.pathname.startsWith('/publish') || url.pathname.startsWith('/api')) return new NextResponse('Not found', { status: 404 })
  url.pathname = '/s' + url.pathname
  const headers = new Headers(req.headers)
  headers.set('x-sites-sub', '1')
  return NextResponse.rewrite(url, { request: { headers } })
}

export const config = { matcher: ['/((?!_next/|favicon.ico).*)'] }
