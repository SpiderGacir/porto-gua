'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useLang } from './LangProvider'
import LangSwitch from './LangSwitch'
import SocialLinks from './SocialLinks'
import Extras from './Extras'
import Portal from './Portal'
import { pages } from '../lib/data'

const mainKeys = ['about', 'projects', 'skills', 'experience', 'lab', 'contact']

export default function Shell({ children }: { children: React.ReactNode }) {
  const { t } = useLang()
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const [egg, setEgg] = useState(0)

  // tutup menu setiap pindah halaman
  useEffect(() => {
    setOpen(false)
  }, [path])

  // progress bar scroll (dijaga biar gak bagi nol)
  useEffect(() => {
    const f = () => {
      const max = document.body.scrollHeight - window.innerHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      document.documentElement.style.setProperty('--scroll', `${pct}%`)
    }
    f()
    window.addEventListener('scroll', f, { passive: true })
    window.addEventListener('resize', f)
    return () => {
      window.removeEventListener('scroll', f)
      window.removeEventListener('resize', f)
    }
  }, [path])

  // menu terbuka: kunci scroll, Esc buat nutup
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // easter egg: 4 klik logo, pesan tampil 3 detik
  useEffect(() => {
    if (egg >= 4) {
      const timer = setTimeout(() => setEgg(0), 3000)
      return () => clearTimeout(timer)
    }
  }, [egg])

  const main = pages.filter(p => mainKeys.includes(p.key))

  return (
    <>
      <Portal />
      <div className="progress" />
      <Extras />

      <header className="hdr">
        <div className="hdr-in container">
          <Link href="/" className="logo" onClick={() => setEgg(e => e + 1)}>PASHA</Link>
          <nav className="dnav" aria-label="Main">
            {main.map(p => (
              <Link key={p.key} href={p.href} className={path === p.href ? 'on' : ''}>{t.nav[p.key]}</Link>
            ))}
          </nav>
          <div className="hdr-r">
            <LangSwitch />
            <button className="menuBtn" onClick={() => setOpen(true)} aria-label={t.ui.menu} aria-expanded={open}>
              <span>{t.ui.menu}</span>
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.ui.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="menu-top container">
              <Link href="/" className="logo" onClick={() => setOpen(false)}>PASHA</Link>
              <button className="menuBtn" onClick={() => setOpen(false)} aria-label={t.ui.close}>
                <span>{t.ui.close}</span>
                <X size={18} />
              </button>
            </div>
            <div className="menu-body container">
              <ul className="mlist">
                {pages.map(p =>
                  p.soon ? (
                    <li key={p.key}>
                      <div className="mrow off" aria-disabled="true">
                        <span className="mtitle">{t.nav[p.key]}</span>
                        <span className="badge">{t.ui.soon}</span>
                        <span className="mdesc">{t.navDesc[p.key]}</span>
                      </div>
                    </li>
                  ) : (
                    <li key={p.key}>
                      <Link href={p.href} className={'mrow' + (path === p.href ? ' on' : '')} onClick={() => setOpen(false)}>
                        <span className="mtitle">{t.nav[p.key]}</span>
                        <ArrowUpRight className="arr" size={20} />
                        <span className="mdesc">{t.navDesc[p.key]}</span>
                      </Link>
                    </li>
                  )
                )}
              </ul>
              <aside className="mside">
                <div>
                  <span className="kicker">{t.ui.language}</span>
                  <div className="mside-row"><LangSwitch /></div>
                </div>
                <div>
                  <span className="kicker">{t.ui.follow}</span>
                  <SocialLinks className="msocial" />
                </div>
              </aside>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {egg >= 4 && <div className="egg" role="status">{t.egg}</div>}

      <main>{children}</main>

      <footer className="ftr">
        <div className="ftr-in container">
          <div>
            <b className="logo">PASHA</b>
            <p>{t.footer.tagline}</p>
          </div>
          <div className="footLinks">
            {['about', 'projects', 'contact'].map(k => {
              const p = pages.find(x => x.key === k)!
              return <Link key={k} href={p.href}>{t.nav[p.key]}</Link>
            })}
          </div>
          <small>© 2026 Rafi Pasha. {t.footer.made}<br />{t.footer.by}</small>
        </div>
      </footer>
    </>
  )
}
