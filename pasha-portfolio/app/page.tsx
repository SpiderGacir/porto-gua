'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useLang } from '../components/LangProvider'
import SocialLinks from '../components/SocialLinks'
import { reveal } from '../components/motion'
import { pageIcons } from '../components/icons'
import { pages } from '../lib/data'

export default function Home() {
  const { t } = useLang()
  const cards = pages.filter(p => p.key !== 'home')

  return (
    <>
      <section className="hero container">
        <motion.div initial="hidden" animate="show" variants={reveal}>
          <div className="eyebrow"><span className="dot" />{t.hero.eyebrow}</div>
          <p className="mini">{t.hero.based}</p>
          <h1>
            {t.hero.hi} <span className="soft">Pasha.</span>
            <strong>{t.hero.title}</strong>
          </h1>
          <p className="lead">{t.hero.lead}</p>
          <div className="actions">
            <Link href="/projects" className="btn btn-primary">{t.hero.work} <ArrowUpRight size={17} /></Link>
            <Link href="/contact" className="btn btn-ghost">{t.hero.connect}</Link>
          </div>
          <SocialLinks className="socials" />
        </motion.div>

        <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <div className="orbit o1" />
          <div className="orbit o2" />
          <div className="photo">
            <Image src="/pasha.jpg" alt={t.hero.photoAlt} width={800} height={1010} priority sizes="(max-width: 900px) 80vw, 400px" />
            <div className="photo-cap">
              <b>Rafi Pasha</b>
              <span>{t.hero.role}</span>
            </div>
          </div>
          <div className="floatTag">{t.hero.tag1}<br />{t.hero.tag2}</div>
        </motion.div>
      </section>

      <div className="container">
        <div className="strip">
          {t.strip.map(x => <span key={x}>{x}</span>)}
        </div>
      </div>

      <section className="section container">
        <span className="kicker">{t.explore.kicker}</span>
        <h2 className="h2">{t.explore.title}</h2>
        <div className="cards">
          {cards.map(p => {
            const Icon = pageIcons[p.key]
            const body = (
              <>
                <span className="card-ico"><Icon size={20} /></span>
                {p.soon ? <span className="badge go">{t.ui.soon}</span> : <ArrowUpRight className="go" size={18} />}
                <h3>{t.nav[p.key]}</h3>
                <p>{t.navDesc[p.key]}</p>
              </>
            )
            return p.soon ? (
              <div key={p.key} className="card off" aria-disabled="true">{body}</div>
            ) : (
              <Link key={p.key} href={p.href} className="card">{body}</Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
