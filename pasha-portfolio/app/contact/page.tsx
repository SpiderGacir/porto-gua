'use client'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Github, Instagram, Linkedin, Mail } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import { useLang } from '../../components/LangProvider'
import { socials } from '../../lib/data'
import { errText, xt } from '../../lib/i18n-extra'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactPage() {
  const { t, lang } = useLang()
  const c = t.contact
  const x = xt[lang].contact
  const [status, setStatus] = useState<Status>('idle')
  const [msg, setMsg] = useState('')
  const opened = useRef(0)

  // waktu form dibuka: dipakai server untuk menolak kiriman yang terlalu cepat (bot)
  useEffect(() => {
    opened.current = Date.now()
  }, [])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const f = new FormData(form)
    setStatus('sending')
    setMsg('')
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          email: f.get('email'),
          message: f.get('message'),
          website: f.get('website'), // honeypot
          t: opened.current
        })
      })
      const d = await r.json().catch(() => ({}))
      if (r.ok) {
        setStatus('sent')
        setMsg(x.ok)
        form.reset()
      } else {
        setStatus('error')
        setMsg({ fast: x.fast, rate: x.rate, invalid: x.invalid }[d.error as 'fast' | 'rate' | 'invalid'] || x.fail)
      }
    } catch {
      setStatus('error')
      setMsg(x.fail)
    }
  }

  return (
    <div className="page container">
      <PageHeader kicker={c.kicker} title={c.title} />
      <div className="contactGrid">
        <div>
          <p className="bigCopy">{c.copy}</p>
          <div className="contactLinks">
            <a href={socials.email}><Mail size={18} /> Email</a>
            <a href={socials.github} target="_blank" rel="noopener noreferrer"><Github size={18} /> GitHub</a>
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={18} /> Instagram</a>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={18} /> LinkedIn</a>
          </div>
        </div>
        <form onSubmit={submit}>
          <input name="name" required maxLength={80} placeholder={c.name} aria-label={c.name} autoComplete="name" />
          <input name="email" required type="email" maxLength={254} placeholder={c.mail} aria-label={c.mail} autoComplete="email" />
          <textarea name="message" required minLength={5} maxLength={3000} placeholder={c.message} aria-label={c.message} rows={6} />
          {/* honeypot: disembunyikan dari manusia, bot biasanya mengisinya */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
            <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? x.sending : status === 'sent' ? x.sent : c.send} <ArrowUpRight size={17} />
          </button>
          {msg && <small className={'note ' + (status === 'error' ? 'note-err' : 'note-ok')} role="status">{msg}</small>}
        </form>
      </div>
    </div>
  )
}
