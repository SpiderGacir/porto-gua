'use client'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { dict, type Dict, type Lang } from '../lib/i18n'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict }

const LangCtx = createContext<Ctx>({ lang: 'id', setLang: () => {}, t: dict.id })

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setL] = useState<Lang>('id')

  // baca pilihan bahasa yang tersimpan di browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang')
      if (saved === 'id' || saved === 'en') setL(saved)
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setL(l)
    try {
      localStorage.setItem('lang', l)
    } catch {}
  }, [])

  return <LangCtx.Provider value={{ lang, setLang, t: dict[lang] }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)
