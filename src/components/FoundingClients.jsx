const POINTS = [
  {
    title: 'Founder pricing',
    desc: "You partner with us at founder rates while we're getting started. We'll walk through the terms on the call.",
  },
  {
    title: "You set the bar",
    desc: "You're one of the first five. Your results become the case studies we build the company on.",
  },
  {
    title: 'Work with the founder',
    desc: "You deal with Jordan directly, not a rep. He ran a roofing company to $5M and now runs your back office.",
  },
]

export default function FoundingClients({ onBookCall }) {
  return (
    <section className="testimonials founding" id="founding">
      <div className="container">
        <div className="section-header centered">
          <span className="section-label">Founding Clients</span>
          <h2 className="section-title">We're taking on our first 5 clients</h2>
          <p className="section-sub">
            RoofSmartr is new, and that's the opportunity. The first roofing companies we
            partner with get founder pricing and become the first results we publish.
          </p>
          <div className="divider centered" />
        </div>

        <div className="founding-grid">
          {POINTS.map(p => (
            <div key={p.title} className="founding-card">
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>

        <div className="founding-cta">
          <button className="btn btn-primary btn-lg" onClick={onBookCall}>
            Apply to be a founding client ↗
          </button>
        </div>
      </div>
    </section>
  )
}
