import { BUCKET, MIME, encPath, extOf, isId, sb, sbReady } from '../../../../lib/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const page = (msg: string, status: number) =>
  new Response(`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${msg}</title><body style="font-family:system-ui;background:#07080a;color:#f3f5f8;display:grid;place-items:center;min-height:100vh;margin:0"><p>${msg}</p>`, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' }
  })

export async function GET(req: Request, { params }: { params: { id: string; path?: string[] } }) {
  if (!sbReady()) return page('Belum dikonfigurasi', 503)
  const { id } = params
  if (!isId(id)) return page('Tidak ditemukan', 404)

  const segs = (params.path || []).map(s => decodeURIComponent(s))
  if (segs.some(s => !s || s === '.' || s === '..' || s.includes('/') || s.includes('\\'))) return page('Tidak ditemukan', 404)
  const path = segs.length ? segs.join('/') : 'index.html'
  const mime = MIME[extOf(path)]
  if (!mime) return page('Tidak ditemukan', 404)

  const rowRes = await sb(`/rest/v1/publications?id=eq.${id}&select=hidden`)
  const row = rowRes.ok ? (await rowRes.json())[0] : null
  if (!row) return page('Tidak ditemukan', 404)
  if (row.hidden) return page('Halaman ini disembunyikan karena dilaporkan', 410)

  const file = await sb(`/storage/v1/object/${BUCKET}/${id}/${encPath(path)}`)
  if (!file.ok) return page('Tidak ditemukan', 404)

  const headers: Record<string, string> = {
    'Content-Type': mime,
    // sandbox tanpa allow-same-origin: halaman jalan di "origin kosong", tidak bisa menyentuh cookie/localStorage situs utama
    'Content-Security-Policy': 'sandbox allow-scripts allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow',
    'Cache-Control': 'public, max-age=30'
  }

  if (!mime.startsWith('text/html')) return new Response(file.body, { headers })

  // situs di subdomain terpisah di-rewrite oleh middleware (header x-sites-sub)
  const prefix = req.headers.get('x-sites-sub') === '1' ? '' : '/s'
  const home = `${prefix}/${id}/`
  let html = await file.text()
  const base = `<base href="${home}">`
  html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, m => m + base) : base + html
  const bar =
    '<div style="position:fixed;left:0;right:0;bottom:0;z-index:2147483647;display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;padding:6px 10px;background:rgba(7,8,10,.9);color:#c9cfda;font:12px system-ui,sans-serif">' +
    'Halaman buatan pengguna, jangan masukkan password atau data penting. ' +
    `<a style="color:#7dd3fc" target="_blank" href="${process.env.NEXT_PUBLIC_MAIN_URL || ''}/publish?report=${id}">Laporkan</a></div>`
  html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, bar + '</body>') : html + bar
  return new Response(html, { headers })
}
