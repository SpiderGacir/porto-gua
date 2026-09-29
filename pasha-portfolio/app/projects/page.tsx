'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import { useLang } from '../../components/LangProvider'
import { projects, type Project } from '../../lib/data'

const filters = ['All', 'Web', 'AI', 'Creative', 'Business'] as const

export default function ProjectsPage() {
  const { t, lang } = useLang()
  const p = t.projects
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [selected, setSelected] = useState<Project | null>(null)
  const visible = filter === 'All' ? projects : projects.filter(x => x.cat === filter)

  // modal terbuka: kunci scroll, Esc buat nutup
  useEffect(() => {
    if (!selected) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [selected])

  return (
    <div className="page container">
      <PageHeader kicker={p.kicker} title={p.title} />

      <div className="filters">
        {filters.map(x => (
          <button key={x} className={filter === x ? 'active' : ''} aria-pressed={filter === x} onClick={() => setFilter(x)}>
            {p.filters[x]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty">{p.empty}</p>
      ) : (
        <div className="projects">
          {visible.map(x => (
            <motion.article
              layout
              key={x.name}
              className="project"
              role="button"
              tabIndex={0}
              onClick={() => setSelected(x)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setSelected(x)
                }
              }}
            >
              <div className="projectTop">
                <span>{p.filters[x.cat]}</span>
                <span className="status">{p.status[x.status]}</span>
              </div>
              <h3>{x.name}<ArrowUpRight size={19} /></h3>
              <p>{x.desc[lang]}</p>
              <div className="tech">
                {x.tech.map(tc => <span key={tc}>{tc}</span>)}
              </div>
              <div className="view">{p.view} <ArrowUpRight size={15} /></div>
            </motion.article>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div
              className="modalBox"
              role="dialog"
              aria-modal="true"
              aria-label={selected.name}
              onClick={e => e.stopPropagation()}
              initial={{ y: 24, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
            >
              <button className="close" onClick={() => setSelected(null)} aria-label="Close"><X /></button>
              <span className="kicker">{p.filters[selected.cat]} / {p.status[selected.status]}</span>
              <h2>{selected.name}</h2>
              <p>{selected.desc[lang]}</p>
              <h4>{p.tech}</h4>
              <div className="tech">
                {selected.tech.map(tc => <span key={tc}>{tc}</span>)}
              </div>
              <div className="case">
                <b>{p.caseTitle}</b>
                <p>{p.caseText}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
