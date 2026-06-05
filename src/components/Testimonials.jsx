const TESTIMONIALS = [
  {
    quote: "RoofSmartr took over our lead follow-up and adjuster coordination within a week of signing. Our close rate jumped 22% in the first month—just from not letting leads go cold.",
    name: 'Marcus T.',
    company: 'Peak Roofing Solutions, TX',
    initials: 'MT',
  },
  {
    quote: "I used to spend 3 hours a day chasing supplements and insurance adjusters. Now I spend that time in front of homeowners. RoofSmartr pays for itself ten times over.",
    name: 'Dana R.',
    company: 'Summit Storm Restoration, CO',
    initials: 'DR',
  },
  {
    quote: "Their storm outreach campaign generated 14 sold jobs in the first 60 days. The process was seamless—they handled everything from cold call to appointment set.",
    name: 'Chris W.',
    company: 'Ridgeline Roofing, OK',
    initials: 'CW',
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-header centered">
          <span className="section-label">Client Results</span>
          <h2 className="section-title">Roofing companies love working with us</h2>
          <p className="section-sub">Real results from real roofing companies across the country.</p>
          <div className="divider centered" />
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => <span key={i}>⭐</span>)}
              </div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-company">{t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
