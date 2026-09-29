'use client'
import { useLang } from './LangProvider'

export default function LangSwitch() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang" role="group" aria-label="Language">
      {(['id', 'en'] as const).map(l => (
        <button key={l} className={lang === l ? 'on' : ''} aria-pressed={lang === l} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
