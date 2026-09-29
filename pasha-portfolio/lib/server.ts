import { createHash, randomBytes, randomInt, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'

// ---------- rate limit (in-memory; cukup buat awal, lihat README soal serverless) ----------
const buckets = new Map<string, number[]>()
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now()
  const arr = (buckets.get(key) || []).filter(t => now - t < windowMs)
  if (arr.length >= max) {
    buckets.set(key, arr)
    return false
  }
  arr.push(now)
  buckets.set(key, arr)
  if (buckets.size > 5000) {
    buckets.forEach((v, k) => {
      if (!v.length || now - v[v.length - 1] > windowMs) buckets.delete(k)
    })
  }
  return true
}

export function clientIp(req: Request) {
  const h = req.headers
  return (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown').trim()
}

// tolak POST dari website lain (Origin harus sama dengan Host)
export function sameOrigin(req: Request) {
  const origin = req.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.get('host')
  } catch {
    return false
  }
}

export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } })

export const sha256 = (s: string) => createHash('sha256').update(s).digest('hex')
export const newSecret = () => randomBytes(16).toString('base64url')
const ALPHA = 'abcdefghjkmnpqrstuvwxyz23456789'
export const newId = () => Array.from({ length: 6 }, () => ALPHA[randomInt(ALPHA.length)]).join('')
export const isId = (s: unknown): s is string => typeof s === 'string' && /^[a-z0-9]{6}$/.test(s)

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

// ---------- Supabase lewat REST (tanpa library tambahan) ----------
const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, '')
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
export const sbReady = () => !!(SB_URL && SB_KEY)
export function sb(path: string, init: RequestInit = {}) {
  return fetch(`${SB_URL}${path}`, {
    ...init,
    // key lama (service_role, berbentuk JWT "eyJ...") dikirim juga sebagai Bearer.
    // key baru (sb_secret_...) cukup lewat header apikey; gateway Supabase yang mengurus sisanya.
    headers: { apikey: SB_KEY!, ...(SB_KEY!.startsWith('eyJ') ? { Authorization: `Bearer ${SB_KEY}` } : {}), ...(init.headers || {}) },
    cache: 'no-store'
  })
}
export const BUCKET = 'sites'
export const encPath = (p: string) => p.split('/').map(encodeURIComponent).join('/')

// ---------- tipe file yang boleh dipublish (statis saja) ----------
export const MIME: Record<string, string> = {
  html: 'text/html; charset=utf-8', htm: 'text/html; charset=utf-8',
  css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', mjs: 'text/javascript; charset=utf-8',
  json: 'application/json; charset=utf-8', txt: 'text/plain; charset=utf-8',
  svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  webp: 'image/webp', ico: 'image/x-icon', woff: 'font/woff', woff2: 'font/woff2',
  mp3: 'audio/mpeg', mp4: 'video/mp4'
}
export const extOf = (p: string) => (p.split('.').pop() || '').toLowerCase()
