export default function PageHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="ph">
      <span className="kicker">{kicker}</span>
      <h1>{title}</h1>
    </div>
  )
}
