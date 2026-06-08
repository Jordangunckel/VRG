const SERVICES = [
  {
    icon: '📞',
    title: 'Lead Follow-Up',
    desc: 'Never let a lead go cold. We follow up on your behalf through every stage, triggered by your CRM or by manual task, until they convert or opt out.',
  },
  {
    icon: '📋',
    title: 'Presale Coordination',
    desc: 'From adjuster scheduling to scope-of-loss follow-up, supplement tracking, measurements, and estimates. We keep every file moving toward approval.',
  },
  {
    icon: '🏗️',
    title: 'Production Management',
    desc: 'We build material orders, coordinate with suppliers, and pull permits so your crews have what they need on site, on time, without your office lifting a finger.',
  },
  {
    icon: '💰',
    title: 'Post-Sale & Collections',
    desc: 'Financial worksheets, COCs, invoices, final payment follow-up, and warranty delivery. We close the loop on every job so cash flows on schedule.',
  },
  {
    icon: '⭐',
    title: 'Reviews & Referrals',
    desc: 'After every completed job, we request Google reviews and referrals by email, text, or phone, building your reputation on autopilot.',
  },
]

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="container">
        <div className="section-header centered" data-reveal>
          <span className="section-label">What We Do</span>
          <h2 className="section-title">
            Every service your office<br /><span>needs to run itself</span>
          </h2>
          <p className="section-sub">
            From the first lead call to the final payment, RoofSmartr handles the back-office tasks that slow your team down, so you can grow without adding headcount.
          </p>
          <div className="divider centered" />
        </div>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="service-card"
              data-reveal
              data-delay={i}
            >
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="service-card-link">
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
