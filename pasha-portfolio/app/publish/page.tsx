'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageHeader from '../../components/PageHeader'
import { useLang } from '../../components/LangProvider'
import { CopyBox, readMine, saveMine, siteUrl, type Mine } from '../../components/LabPublish'
import { errText, xt } from '../../lib/i18n-extra'

function Inner() {
  const { lang } = useLang()
  const p = xt[lang].pub
  const params = useSearchParams()
  const reportId = params.get('report') || ''

  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [res, setRes] = useState<{ id: string; secret: string } | null>(null)
  const [mine, setMine] = useState<Mine[]>([])
  const [mid, setMid] = useState('')
  const [msec, setMsec] = useState('')
  const [mfile, setMfile] = useState<File | null>(null)
  const [why, setWhy] = useState('')
  const [reported, setReported] = useState(false)

  useEffect(() => setMine(readMine()), [])

  async function send(fd: FormData, method = 'POST') {
    const r = await fetch('/api/publish', { method, body: fd })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(errText(p.errors, d.error))
    return d
  }

  async function publish() {
    if (!file) return setErr(p.errors.no_file)
    setBusy(true); setErr(''); setInfo('')
    try {
      const fd = new FormData()
      fd.set('file', file)
      fd.set('title', title || file.name)
      const d = await send(fd)
      setRes({ id: d.id, secret: d.secret })
      const next = [{ id: d.id, secret: d.secret, title: title || file.name, at: Date.now() }, ...readMine()]
      saveMine(next); setMine(next)
    } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }

  async function update() {
    if (!mfile) return setErr(p.errors.no_file)
    setBusy(true); setErr(''); setInfo('')
    try {
      const fd = new FormData()
      fd.set('file', mfile); fd.set('id', mid.trim()); fd.set('secret', msec.trim()); fd.set('title', title || mfile.name)
      await send(fd)
      setInfo(p.updated)
    } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }

  async function remove() {
    if (!window.confirm(p.confirmDel)) return
    setBusy(true); setErr(''); setInfo('')
    try {
      const r = await fetch('/api/publish', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: mid.trim(), secret: msec.trim() }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(errText(p.errors, d.error))
      const next = readMine().filter(m => m.id !== mid.trim())
      saveMine(next); setMine(next); setInfo(p.deleted)
    } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }

  async function report() {
    setBusy(true); setErr('')
    try {
      const r = await fetch('/api/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: reportId, reason: why }) })
      if (!r.ok) throw new Error(errText(p.errors, (await r.json().catch(() => ({}))).error))
      setReported(true)
    } catch (e) { setErr((e as Error).message) } finally { setBusy(false) }
  }

  if (reportId) {
    return (
      <div className="page container">
        <PageHeader kicker={p.pageKicker} title={p.report} />
        <div className="pub-card">
          <p className="lab-ai-note">/{reportId}</p>
          {reported ? <p className="note note-ok">{p.reportDone}</p> : (
            <>
              <textarea rows={4} maxLength={300} value={why} onChange={e => setWhy(e.target.value)} placeholder={p.reportWhy} aria-label={p.reportWhy} />
              {err && <p className="lab-ai-note err" role="alert">{err}</p>}
              <button className="btn btn-primary" onClick={report} disabled={busy}>{p.reportSend}</button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="page container">
      <PageHeader kicker={p.pageKicker} title={p.pageTitle} />
      <p className="bigCopy">{p.pageLead}</p>
      <div className="pub-grid">
        <div className="pub-card">
          {!res ? (
            <>
              <input value={title} onChange={e => setTitle(e.target.value)} maxLength={80} placeholder={p.name} aria-label={p.name} />
              <input type="file" accept=".html,.htm,.zip" onChange={e => setFile(e.target.files?.[0] || null)} aria-label={p.file} />
              <button className="btn btn-primary" onClick={publish} disabled={busy || !file}>{busy ? p.publishing : p.publish}</button>
            </>
          ) : (
            <>
              <h3>{p.done}</h3>
              <CopyBox label={p.link} value={siteUrl(res.id)} />
              <CopyBox label={p.secret} value={res.secret} />
              <p className="lab-ai-note err">{p.secretWarn}</p>
              <button className="btn btn-ghost btn-sm" onClick={() => { setRes(null); setFile(null) }}>+</button>
            </>
          )}
        </div>

        <div className="pub-card">
          <h3>{p.manage}</h3>
          <input value={mid} onChange={e => setMid(e.target.value)} maxLength={6} placeholder={p.siteId} aria-label={p.siteId} autoCapitalize="off" />
          <input value={msec} onChange={e => setMsec(e.target.value)} maxLength={40} placeholder={p.secretIn} aria-label={p.secretIn} type="password" autoComplete="off" />
          <input type="file" accept=".html,.htm,.zip" onChange={e => setMfile(e.target.files?.[0] || null)} aria-label={p.file} />
          <div className="lab-ai-row">
            <button className="btn btn-primary btn-sm" onClick={update} disabled={busy || !mid || !msec || !mfile}>{p.update}</button>
            <button className="btn btn-ghost btn-sm" onClick={remove} disabled={busy || !mid || !msec}>{p.remove}</button>
          </div>
          {info && <p className="note note-ok" role="status">{info}</p>}
          {err && <p className="lab-ai-note err" role="alert">{err}</p>}
        </div>
      </div>

      {mine.length > 0 && (
        <div className="pub-card" style={{ marginTop: 20 }}>
          <h3>{p.mine}</h3>
          <ul className="pub-list">
            {mine.map(m => (
              <li key={m.id}>
                <span>{m.title}</span>
                <a href={siteUrl(m.id)} target="_blank" rel="noopener noreferrer">/{m.id}</a>
                <button className="btn btn-ghost btn-sm" onClick={() => { setMid(m.id); setMsec(m.secret) }}>{p.manage}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function PublishPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  )
}
