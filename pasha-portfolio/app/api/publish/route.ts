import { unzipSync } from 'fflate'
import { BUCKET, MIME, clean, clientIp, encPath, extOf, isId, json, newId, newSecret, rateLimit, safeEqual, sameOrigin, sb, sbReady, sha256 } from '../../../lib/server'

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_UPLOAD = 2 * 1024 * 1024 // 2 MB (file yang diupload)
const MAX_UNZIPPED = 6 * 1024 * 1024
const MAX_FILES = 60

type FileMap = Record<string, Uint8Array>
class Bad extends Error {
  constructor(public code: string, public status = 400) {
    super(code)
  }
}

// rapikan path di zip; tolak path berbahaya dan tipe file yang tidak diizinkan
function cleanPath(p: string) {
  const s = p.replace(/\\/g, '/').replace(/^\/+/, '')
  if (!s || s.split('/').some(x => x === '..' || x === '' || x === '.')) return null
  return s
}

function readZip(bytes: Uint8Array): FileMap {
  let total = 0
  let count = 0
  let raw: Record<string, Uint8Array>
  try {
    raw = unzipSync(bytes, {
      filter: f => {
        if (f.name.endsWith('/')) return false
        count++
        total += f.originalSize
        if (count > MAX_FILES + 50 || total > MAX_UNZIPPED || f.originalSize > MAX_UPLOAD) throw new Bad('zip_too_big')
        return true
      }
    })
  } catch (e) {
    throw e instanceof Bad ? e : new Bad('zip_invalid')
  }
  let entries = Object.entries(raw).filter(([n]) => !n.startsWith('__MACOSX/') && !n.endsWith('.DS_Store'))
  // kalau semua file ada di dalam 1 folder, naikkan ke root
  const tops = new Set(entries.map(([n]) => n.split('/')[0]))
  if (tops.size === 1 && entries.every(([n]) => n.includes('/'))) entries = entries.map(([n, d]) => [n.split('/').slice(1).join('/'), d])
  const out: FileMap = {}
  for (const [name, data] of entries) {
    const p = cleanPath(name)
    if (!p || !MIME[extOf(p)]) throw new Bad('file_type:' + name.slice(0, 60))
    out[p] = data
  }
  if (Object.keys(out).length > MAX_FILES) throw new Bad('zip_too_many')
  if (!out['index.html']) throw new Bad('no_index')
  return out
}

async function readBody(req: Request) {
  const len = Number(req.headers.get('content-length') || 0)
  if (len > MAX_UPLOAD + 200_000) throw new Bad('too_big', 413)
  const type = req.headers.get('content-type') || ''
  let title = ''
  let id: unknown
  let secret: unknown
  let files: FileMap

  if (type.includes('multipart/form-data')) {
    const f = await req.formData()
    title = clean(f.get('title'), 80)
    id = f.get('id') || undefined
    secret = f.get('secret') || undefined
    const file = f.get('file')
    if (!(file instanceof File)) throw new Bad('no_file')
    if (file.size > MAX_UPLOAD) throw new Bad('too_big', 413)
    const bytes = new Uint8Array(await file.arrayBuffer())
    const name = file.name.toLowerCase()
    if (name.endsWith('.zip')) files = readZip(bytes)
    else if (name.endsWith('.html') || name.endsWith('.htm')) files = { 'index.html': bytes }
    else throw new Bad('file_type')
  } else {
    const b = await req.json().catch(() => null)
    if (!b || typeof b.html !== 'string') throw new Bad('bad')
    title = clean(b.title, 80)
    id = b.id
    secret = b.secret
    const bytes = new TextEncoder().encode(b.html)
    if (bytes.length > MAX_UPLOAD) throw new Bad('too_big', 413)
    files = { 'index.html': bytes }
  }
  if (!Object.values(files).some(d => d.length > 0)) throw new Bad('no_file')
  return { title: title || 'Tanpa judul', id, secret, files }
}

// hapus file di Storage berdasarkan daftar path yang disimpan di tabel
async function removeFiles(id: string, paths: string[]) {
  const all = paths.map(p => `${id}/${p}`)
  if (!all.length) return
  await sb(`/storage/v1/object/${BUCKET}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefixes: all })
  })
}

async function uploadAll(id: string, files: FileMap) {
  for (const [p, data] of Object.entries(files)) {
    const r = await sb(`/storage/v1/object/${BUCKET}/${id}/${encPath(p)}`, {
      method: 'POST',
      headers: { 'Content-Type': MIME[extOf(p)] || 'application/octet-stream', 'x-upsert': 'true' },
      body: data as unknown as BodyInit
    })
    if (!r.ok) throw new Bad('storage_failed', 502)
  }
}

async function getRow(id: string) {
  const r = await sb(`/rest/v1/publications?id=eq.${id}&select=id,secret_hash,paths`)
  if (!r.ok) return null
  const rows = await r.json()
  return rows[0] as { id: string; secret_hash: string; paths: string[] } | null
}

export async function POST(req: Request) {
  if (!sbReady()) return json({ error: 'not_configured' }, 503)
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403)
  const ip = clientIp(req)
  const ipHash = sha256(ip)

  try {
    if (!rateLimit('pub:' + ip, 6, 60 * 60_000)) throw new Bad('rate', 429)
    // batas frekuensi kedua lewat database (tetap jalan di serverless)
    const since = new Date(Date.now() - 60 * 60_000).toISOString()
    const recent = await sb(`/rest/v1/publications?ip_hash=eq.${ipHash}&created_at=gte.${encodeURIComponent(since)}&select=id&limit=20`)
    if (recent.ok && (await recent.json()).length >= 10) throw new Bad('rate', 429)

    const { title, id: wantId, secret, files } = await readBody(req)
    const paths = Object.keys(files)
    const size = Object.values(files).reduce((n, d) => n + d.length, 0)

    // ----- update situs yang sudah ada -----
    if (wantId !== undefined) {
      if (!isId(wantId) || typeof secret !== 'string') throw new Bad('bad')
      const row = await getRow(wantId)
      if (!row || !safeEqual(row.secret_hash, sha256(secret))) throw new Bad('auth', 403)
      await uploadAll(wantId, files)
      await removeFiles(wantId, (row.paths || []).filter(p => !paths.includes(p)))
      await sb(`/rest/v1/publications?id=eq.${wantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, size, paths, updated_at: new Date().toISOString() })
      })
      return json({ ok: true, id: wantId })
    }

    // ----- situs baru -----
    const secretPlain = newSecret()
    for (let i = 0; i < 5; i++) {
      const id = newId()
      const ins = await sb('/rest/v1/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ id, title, size, paths, secret_hash: sha256(secretPlain), ip_hash: ipHash })
      })
      if (ins.status === 409) continue // id kebetulan sudah dipakai, coba lagi
      if (!ins.ok) throw new Bad('db_failed', 502)
      try {
        await uploadAll(id, files)
      } catch (e) {
        await removeFiles(id, paths)
        await sb(`/rest/v1/publications?id=eq.${id}`, { method: 'DELETE' })
        throw e
      }
      return json({ ok: true, id, secret: secretPlain })
    }
    throw new Bad('db_failed', 502)
  } catch (e) {
    if (e instanceof Bad) return json({ error: e.code }, e.status)
    return json({ error: 'failed' }, 500)
  }
}

export async function DELETE(req: Request) {
  if (!sbReady()) return json({ error: 'not_configured' }, 503)
  if (!sameOrigin(req)) return json({ error: 'forbidden' }, 403)
  if (!rateLimit('pubdel:' + clientIp(req), 20, 60 * 60_000)) return json({ error: 'rate' }, 429)
  const b = await req.json().catch(() => null)
  if (!b || !isId(b.id) || typeof b.secret !== 'string') return json({ error: 'bad' }, 400)
  const row = await getRow(b.id)
  if (!row || !safeEqual(row.secret_hash, sha256(b.secret))) return json({ error: 'auth' }, 403)
  await removeFiles(b.id, row.paths || [])
  await sb(`/rest/v1/publications?id=eq.${b.id}`, { method: 'DELETE' })
  return json({ ok: true })
}
