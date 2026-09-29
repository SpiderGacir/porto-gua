'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Globe, X } from 'lucide-react'
import { useLang } from './LangProvider'
import { errText, xt } from '../lib/i18n-extra'

export const PUB_STORE = 'pasha-pub-v1'
export type Mine = { id: string; secret: string; title: string; at: number }

export function readMine(): Mine[] {
  try {
    const v = JSON.parse(localStorage.getItem(PUB_STORE) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}
export function saveMine(list: Mine[]) {
  try {
    localStorage.setItem(PUB_STORE, JSON.stringify(list.slice(0, 50)))
  } catch {}
}
export const siteUrl = (id: string) => {
  const base = process.env.NEXT_PUBLIC_SITES_URL
  return base ? `${base.replace(/\/$/, '')}/${id}` : `${window.location.origin}/s/${id}`
}

export function CopyBox({ label, value }: { label: string; value: string }) {
  const { lang } = useLang()
  const p = xt[lang].pub
  const [ok, setOk] = useState(false)
  return (
    <div className="copybox">
      <span className="kicker">{label}</span>
      <div>
        <code>{value}</code>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => { navigator.clipboard?.writeText(value).then(() => { setOk(true); setTimeout(() => setOk(false), 1500) }, () => {}) }}
        >
          {ok ? p.copied : p.copy}
        </button>
      </div>
    </div>
  )
}

export default function LabPublish({ getHtml }: { getHtml: () => string }) {
  const { lang } = useLang()
  const p = xt[lang].pub
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [res, setRes] = useState<{ id: string; secret: string } | null>(null)

  const close = () => { setOpen(false); setRes(null); setErr('') }

  async function go() {
    setBusy(true)
    setErr('')
    try {
      const r = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title || 'Code Lab', html: getHtml() })
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) return setErr(errText(p.errors, d.error))
      setRes({ id: d.id, secret: d.secret })
      saveMine([{ id: d.id, secret: d.secret, title: title || 'Code Lab', at: Date.now() }, ...readMine()])
    } catch {
      setErr(p.errors.default)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => setOpen(true)}><Globe size={15} /> {p.btn}</button>
      {open && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={p.title} onClick={e => { if (e.target === e.currentTarget) close() }}>
          <div className="modal-box">
            <button className="lab-ai-x" onClick={close} aria-label="Close"><X size={16} /></button>
            <h3>{res ? p.done : p.title}</h3>
            {!res ? (
              <>
                <p className="lab-ai-note">{p.labNote}</p>
                <input value={title} onChange={e => setTitle(e.target.value)} maxLength={80} placeholder={p.name} aria-label={p.name} />
                {err && <p className="lab-ai-note err" role="alert">{err}</p>}
                <button className="btn btn-primary" onClick={go} disabled={busy}>{busy ? p.publishing : p.publish}</button>
              </>
            ) : (
              <>
                <CopyBox label={p.link} value={siteUrl(res.id)} />
                <CopyBox label={p.secret} value={res.secret} />
                <p className="lab-ai-note err">{p.secretWarn}</p>
                <div className="lab-ai-row">
                  <a className="btn btn-primary btn-sm" href={siteUrl(res.id)} target="_blank" rel="noopener noreferrer">{p.open}</a>
                  <Link className="btn btn-ghost btn-sm" href="/publish">{p.manage}</Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
