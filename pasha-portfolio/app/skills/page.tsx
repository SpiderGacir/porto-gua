'use client'
import PageHeader from '../../components/PageHeader'
import { useLang } from '../../components/LangProvider'
import { skillGroups } from '../../lib/data'

export default function SkillsPage() {
  const { t } = useLang()
  return (
    <div className="page container">
      <PageHeader kicker={t.skills.kicker} title={t.skills.title} />
      <div className="skillGrid">
        {skillGroups.map(g => (
          <div className="skill" key={g.key}>
            <h3>{t.skills.groups[g.key]}</h3>
            <div>
              {g.items.map(x => <span key={x}>{x}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
