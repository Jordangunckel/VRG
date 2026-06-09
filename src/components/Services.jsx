const STAGES = [
  {
    name: 'Pre-Sale',
    services: [
      {
        icon: '📞',
        title: 'Lead Nurture System',
        desc: 'We keep every lead contacted and moving through the right stage. Hot leads get 7 touches in 7 days, warm get 5, cold get 1 a week, and anyone who responds gets re-engaged. Email, text, and phone.',
      },
      {
        icon: '🤝',
        title: 'Adjuster Appointments',
        desc: 'We coordinate between the homeowner, the adjuster, and your team. We schedule it, assign it, narrow the time window, and prep notes. We watch the weather and handle reschedules.',
      },
      {
        icon: '📋',
        title: 'Scope & Supplement Follow-Up',
        desc: 'Files stall after the adjuster visit when nobody chases the paperwork. We follow up with everyone until the documents come in, then upload and tag them in your CRM. We follow up. We do not write supplements.',
      },
      {
        icon: '📐',
        title: 'Measurements, Estimates & Profit Analysis',
        desc: 'When a job hits the right stage, we order measurements, prep the estimate draft for your review, and flag any job below your margin target before it goes out.',
      },
    ],
  },
  {
    name: 'Production',
    services: [
      {
        icon: '📦',
        title: 'Material Orders',
        desc: 'We take the approved estimate and build the material and labor order for your team to review and submit.',
      },
      {
        icon: '🏛️',
        title: 'Pull Permits',
        desc: 'Every jurisdiction, every form, every inspection, handled. No install-day surprises from a missed permit.',
      },
    ],
  },
  {
    name: 'Post-Sale',
    services: [
      {
        icon: '🧾',
        title: 'C.O.C. & Invoices',
        desc: 'Certificate of Completion and invoice go out the moment the crew rolls off.',
      },
      {
        icon: '💰',
        title: 'Final Payment Follow-Up',
        desc: 'We chase carrier and homeowner payments, politely and persistently, until the money lands.',
      },
      {
        icon: '🛡️',
        title: 'Warranties & Final Invoice',
        desc: 'Manufacturer warranty registered. Workmanship warranty issued. Closeout packet sent.',
      },
      {
        icon: '⭐',
        title: 'Reviews & Referrals',
        desc: 'We ask for the review while the install is fresh, and the referral while the neighbors are still noticing.',
      },
    ],
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

        {STAGES.map(stage => (
          <div key={stage.name} className="services-stage-group">
            <div className="services-stage-header" data-reveal>
              <span className="services-stage-label">{stage.name}</span>
              <span className="services-stage-line" />
            </div>
            <div className="services-grid">
              {stage.services.map((s, i) => (
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
        ))}

        <p className="services-boundary" data-reveal>
          <strong>What we don't do:</strong> we don't write supplements, we don't handle bookkeeping or tax, and we don't own your production calendar or crew scheduling.
        </p>
      </div>
    </section>
  )
}
