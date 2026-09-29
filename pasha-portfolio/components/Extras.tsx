'use client'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command, Palette, Search } from 'lucide-react'
import { useLang } from './LangProvider'
import { pages } from '../lib/data'

// [nama, bg, accent, accent2, glow1, glow2, efek]
const THEMES: Record<string, [string, string, string, string, string, string]> = {
  Sky: ['#07080a', '#7dd3fc', '#a78bfa', 'rgba(125,211,252,.12)', 'rgba(167,139,250,.08)', ''],
  Aurora: ['#040a10', '#5eead4', '#a78bfa', 'rgba(94,234,212,.24)', 'rgba(167,139,250,.22)', 'drift'],
  'Black Blue': ['#02040c', '#3b82f6', '#22d3ee', 'rgba(59,130,246,.28)', 'rgba(34,211,238,.14)', ''],
  Rainbow: ['#08080c', '#ff5ea8', '#ffd84d', 'rgba(255,94,168,.22)', 'rgba(94,200,255,.22)', 'rainbow'],
  Sunset: ['#0d0709', '#fb923c', '#f43f5e', 'rgba(251,146,60,.22)', 'rgba(244,63,94,.18)', 'drift'],
  Matrix: ['#020a04', '#4ade80', '#a3e635', 'rgba(74,222,128,.2)', 'rgba(163,230,53,.1)', ''],
  Sakura: ['#0e0810', '#f9a8d4', '#c4b5fd', 'rgba(249,168,212,.2)', 'rgba(196,181,253,.16)', 'drift']
}
// [teks, kw, str, num, com, tag, attr, fn]
const CODES: Record<string, string[]> = {
  Neon: ['#dfe4ec', '#ff79c6', '#f1fa8c', '#bd93f9', '#6272a4', '#50fa7b', '#ffb86c', '#8be9fd'],
  Ocean: ['#d6e4ff', '#7aa2f7', '#9ece6a', '#ff9e64', '#565f89', '#2ac3de', '#bb9af7', '#7dcfff'],
  Sunset: ['#ffe9d6', '#ff7b72', '#ffd27f', '#ffa657', '#8b6f5e', '#f97583', '#ffab70', '#fbbf24'],
  Matrix: ['#b8ffca', '#4ade80', '#a3e635', '#22d3ee', '#3f7a52', '#4ade80', '#86efac', '#bef264'],
  Pastel: ['#f5e9ff', '#f9a8d4', '#a7f3d0', '#fde68a', '#8d7fa3', '#c4b5fd', '#93c5fd', '#fbcfe8']
}
const KEYS = ['txt', 'kw', 'str', 'num', 'com', 'tag', 'attr', 'fn']
const S = (k: string) => { try { return localStorage.getItem(k) } catch { return null } }
const W = (k: string, v: string) => { try { localStorage.setItem(k, v) } catch {} }

export default function Extras() {
  const { t } = useLang()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pal, setPal] = useState(false)
  const [q, setQ] = useState('')
  const [theme, setTheme] = useState('Aurora')
  const [code, setCode] = useState('Neon')
  const [txt, setTxt] = useState('')

  useEffect(() => {
    const a = S('pt-theme'), b = S('pt-code'), c = S('pt-txt')
    if (a && THEMES[a]) setTheme(a)
    if (b && CODES[b]) setCode(b)
    if (c) setTxt(c)
  }, [])

  useEffect(() => {
    const [bg, ac, ac2, g1, g2, fx] = THEMES[theme]
    const r = document.documentElement
    r.style.setProperty('--bg', bg); r.style.setProperty('--accent', ac); r.style.setProperty('--accent2', ac2)
    r.style.setProperty('--glow1', g1); r.style.setProperty('--glow2', g2)
    r.dataset.fx = fx
    W('pt-theme', theme)
  }, [theme])

  useEffect(() => {
    const r = document.documentElement
    CODES[code].forEach((v, i) => r.style.setProperty(`--c-${KEYS[i]}`, v))
    if (txt) r.style.setProperty('--c-txt', txt)
    W('pt-code', code); W('pt-txt', txt)
  }, [code, txt])

  // spotlight kursor
  useEffect(() => {
    const m = (e: PointerEvent) => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px')
      document.documentElement.style.setProperty('--my', e.clientY + 'px')
    }
    window.addEventListener('pointermove', m, { passive: true })
    return () => window.removeEventListener('pointermove', m)
  }, [])

  // Ctrl/Cmd+K = command palette
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPal(p => !p); setQ('') }
      if (e.key === 'Escape') { setPal(false); setOpen(false) }
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const list = useMemo(() => pages.filter(p => !p.soon && (t.nav[p.key] + ' ' + t.navDesc[p.key]).toLowerCase().includes(q.toLowerCase())), [q, t])
  const go = (h: string) => { setPal(false); router.push(h) }

  return (
    <>
      <div className="fab">
        <button onClick={() => { setPal(true); setQ('') }} aria-label="Command palette"><Command size={18} /></button>
        <button onClick={() => setOpen(o => !o)} aria-label="Theme" aria-expanded={open}><Palette size={18} /></button>
      </div>

      {open && (
        <div className="tpanel" role="dialog" aria-label="Theme">
          <b>Website</b>
          <div className="sw">
            {Object.entries(THEMES).map(([n, v]) => (
              <button key={n} title={n} className={n === theme ? 'on' : ''} style={{ background: `linear-gradient(135deg,${v[1]},${v[2]})` }} onClick={() => setTheme(n)} aria-label={n} />
            ))}
          </div>
          <b>Code Lab</b>
          <div className="chips">
            {Object.keys(CODES).map(n => (
              <button key={n} className={n === code ? 'on' : ''} onClick={() => { setCode(n); setTxt('') }}>{n}</button>
            ))}
          </div>
          <label className="tcol">Warna teks kode <input type="color" value={txt || CODES[code][0]} onChange={e => setTxt(e.target.value)} /></label>
        </div>
      )}

      {pal && (
        <div className="pal" onClick={() => setPal(false)}>
          <div className="pal-box" onClick={e => e.stopPropagation()} role="dialog" aria-label="Command palette">
            <div className="pal-in"><Search size={16} />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Cari halaman…  (Ctrl+K)" onKeyDown={e => { if (e.key === 'Enter' && list[0]) go(list[0].href) }} />
            </div>
            {list.map(p => <button key={p.key} onClick={() => go(p.href)}><b>{t.nav[p.key]}</b><span>{t.navDesc[p.key]}</span></button>)}
          </div>
        </div>
      )}
    </>
  )
}
