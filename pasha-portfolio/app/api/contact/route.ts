import { clean, clientIp, json, rateLimit, sameOrigin, sb, sbReady, sha256 } from '../../../lib/server'

export const runtime = 'nodejs'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403)
  const ip = clientIp(req)
  if (!rateLimit('contact:' + ip, 3, 10 * 60_000)) return json({ error: 'rate' }, 429)

  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return json({ error: 'bad' }, 400)
  }

  // anti-spam 1: honeypot (kolom tersembunyi, manusia tidak mengisi). Pura-pura sukses biar bot tidak belajar.
  if (b.website) return json({ ok: true })
  // anti-spam 2: form yang dikirim < 2,5 detik setelah dibuka hampir pasti bot
  const took = Date.now() - Number(b.t || 0)
  if (!(took > 2500 && took < 86_400_000)) return json({ error: 'fast' }, 400)

  const name = clean(b.name, 80)
  const email = clean(b.email, 254)
  const message = clean(b.message, 3000)
  if (!name || !message || message.length < 5 || !EMAIL.test(email)) return json({ error: 'invalid' }, 400)
  // anti-spam 3: pesan yang isinya banyak link
  if ((message.match(/https?:\/\//gi) || []).length > 3) return json({ error: 'invalid' }, 400)

  const jobs: Promise<boolean>[] = []

  if (sbReady()) {
    jobs.push(
      sb('/rest/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ name, email, message, ip_hash: sha256(ip) })
      }).then(r => r.ok, () => false)
    )
  }

  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO) {
    jobs.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>',
          to: [process.env.CONTACT_TO],
          reply_to: email,
          subject: `Pesan baru dari ${name.replace(/[\r\n]/g, ' ')}`,
          html: `<p><b>${esc(name)}</b> (${esc(email)})</p><p style="white-space:pre-wrap">${esc(message)}</p>`
        })
      }).then(r => r.ok, () => false)
    )
  }

  if (!jobs.length) return json({ error: 'not_configured' }, 503)
  const results = await Promise.all(jobs)
  // sukses kalau minimal satu jalur (Supabase atau email) berhasil
  return results.some(Boolean) ? json({ ok: true }) : json({ error: 'send_failed' }, 502)
}
