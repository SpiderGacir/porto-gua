'use client'
import PageHeader from '../../components/PageHeader'
import { useLang } from '../../components/LangProvider'

export default function ExperiencePage() {
  const { t } = useLang()
  return (
    <div className="page container">
      <PageHeader kicker={t.experience.kicker} title={t.experience.title} />
      <div className="timeline">
        {t.experience.items.map(x => (
          <div key={x.title}>
            <b>{x.y}</b>
            <h3>{x.title}</h3>
            <p>{x.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
