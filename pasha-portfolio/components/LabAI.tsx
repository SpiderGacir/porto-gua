'use client'
import { useState } from 'react'
import { Bug, FileText, Loader2, Sparkles, X } from 'lucide-react'
import { useLang } from './LangProvider'
import { errText, xt } from '../lib/i18n-extra'

export type Files = { html: string; css: string; js: string }
type Log = { level: string; text: string }
type Mode = 'explain' | 'fix' | 'generate'

export default function LabAI({ files, tab, logs, onApply }: {
  files: Files
  tab: keyof Files
  logs: Log[]
  onApply: (f: Files) => boolean // false kalau pengguna batal mengganti kode
}) {
  const { lang } = useLang()
  const a = xt[lang].ai
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState<Mode | null>(null)
  const [out, setOut] = useState<{ text: string; files?: Files | null } | null>(null)
  const [err, setErr] = useState('')

  async function call(mode: Mode) {
    if (busy) return
    setErr('')
    setOut(null)
    let body: Record<string, unknown> = { mode, lang }
    if (mode === 'explain') {
      if (!files[tab].trim()) return setErr(a.empty)
      body = { ...body, kind: tab, code: files[tab] }
    } else if (mode === 'fix') {
      const text = logs.map(l => `[${l.level}] ${l.text}`).join('\n').slice(-4000)
      body = { ...body, files, logs: text }
    } else {
      if (prompt.trim().length < 3) return
      body = { ...body, prompt }
    }
    setBusy(mode)
    try {
      const r = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) return setErr(errText(a.errors, d.error))
      if (mode === 'generate') {
        if (onApply(d.files)) setOut({ text: a.generated })
      } else {
        setOut({ text: d.text, files: d.files })
      }
    } catch {
      setErr(a.errors.default)
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className="lab-ai" aria-label={a.title}>
      <div className="lab-ai-head"><Sparkles size={16} /> {a.title}</div>
      <div className="lab-ai-row">
        <button className="btn btn-ghost btn-sm" onClick={() => call('explain')} disabled={!!busy} title={a.explainHint}>
          <FileText size={15} /> {a.explain}
        </button>
        <button className="btn btn-ghost btn-sm" onClick={() => call('fix')} disabled={!!busy} title={a.fixHint}>
          <Bug size={15} /> {a.fix}
        </button>
      </div>
      <div className="lab-ai-gen">
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') call('generate') }}
          maxLength={600}
          placeholder={a.genPlaceholder}
          aria-label={a.genLabel}
        />
        <button className="btn btn-primary btn-sm" onClick={() => call('generate')} disabled={!!busy || prompt.trim().length < 3}>
          {a.genBtn}
        </button>
      </div>
      <p className="lab-ai-note dim">{lang === 'en' ? 'AI sends your code to Google Gemini to answer.' : 'AI mengirim kodemu ke Google Gemini untuk menjawab.'}</p>
      {busy && <p className="lab-ai-note"><Loader2 size={14} className="spin" /> {a.working}</p>}
      {err && <p className="lab-ai-note err" role="alert">{err}</p>}
      {out && (
        <div className="lab-ai-out">
          <button className="lab-ai-x" onClick={() => setOut(null)} aria-label={a.close}><X size={15} /></button>
          <div className="lab-ai-text">{out.text}</div>
          {out.files && (
            <button className="btn btn-primary btn-sm" onClick={() => { if (onApply(out.files!)) setOut({ text: a.applied }) }}>
              {a.apply}
            </button>
          )}
        </div>
      )}
    </section>
  )
}
