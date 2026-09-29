import { clean, clientIp, isId, json, rateLimit, sameOrigin, sb, sbReady, sha256 } from '../../../lib/server'

export const runtime = 'nodejs'
const AUTO_HIDE_AT = 3 // jumlah pelapor berbeda sebelum halaman otomatis disembunyikan

export async function POST(req: Request) {
  if (!sbReady()) return json({ error: 'not_configured' }, 503)
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403)
  const ip = clientIp(req)
  if (!rateLimit('report:' + ip, 5, 10 * 60_000)) return json({ error: 'rate' }, 429)
  const b = await req.json().catch(() => null)
  if (!b || !isId(b.id)) return json({ error: 'bad' }, 400)

  const exists = await sb(`/rest/v1/publications?id=eq.${b.id}&select=id`)
  if (!exists.ok || !(await exists.json()).length) return json({ error: 'not_found' }, 404)

  // unique (publication_id, ip_hash): satu orang tidak bisa melapor berkali-kali
  await sb('/rest/v1/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ publication_id: b.id, reason: clean(b.reason, 300), ip_hash: sha256(ip) })
  })
  const cnt = await sb(`/rest/v1/reports?publication_id=eq.${b.id}&select=id`)
  if (cnt.ok && (await cnt.json()).length >= AUTO_HIDE_AT) {
    await sb(`/rest/v1/publications?id=eq.${b.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: true })
    })
  }
  return json({ ok: true })
}
