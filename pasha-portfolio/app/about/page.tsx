'use client'
import PageHeader from '../../components/PageHeader'
import { useLang } from '../../components/LangProvider'

export default function AboutPage() {
  const { t } = useLang()
  const a = t.about
  return (
    <div className="page container">
      <PageHeader kicker={a.kicker} title={a.title} />
      <p className="bigCopy">{a.copy}</p>
      <div className="chips">
        {a.chips.map(x => <span key={x}>{x}</span>)}
      </div>
      <div className="journey">
        {a.journey.map(j => (
          <div key={j.y}><b>{j.y}</b><p>{j.text}</p></div>
        ))}
      </div>

      <div className="block">
        <span className="kicker">{a.exploreKicker}</span>
        <h2 className="h2">{a.exploreTitle}</h2>
      </div>
      <div className="marquee-wrap">
        <div className="marquee">
          <div className="mq">{a.exploring.map(x => <span key={x}>{x}</span>)}</div>
          <div className="mq" aria-hidden="true">{a.exploring.map(x => <span key={x}>{x}</span>)}</div>
        </div>
      </div>

      <div className="beyond">
        <div>
          <span className="kicker">{a.beyondKicker}</span>
          <h2 className="h2">{a.beyondTitle}</h2>
        </div>
        <div>
          <p className="beyond-copy">{a.beyondCopy}</p>
          <div className="tags">
            {a.tags.map(x => <span key={x}>{x}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
