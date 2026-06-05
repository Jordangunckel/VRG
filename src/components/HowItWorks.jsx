const STEPS = [
  {
    num: '01',
    title: 'Book a Discovery Call',
    desc: 'We learn your CRM, workflows, team structure, and goals—then map out exactly which services will have the biggest impact.',
  },
  {
    num: '02',
    title: 'Configure Your SOP',
    desc: 'Using our custom SOP Builder, you tell us exactly how to handle every service: triggers, frequencies, assignments, and preferences.',
  },
  {
    num: '03',
    title: 'We Go Live—Fast',
    desc: 'Our team is trained and active within days. No long onboarding. No software to install. We plug directly into your existing CRM.',
  },
  {
    num: '04',
    title: 'Scale Without Hiring',
    desc: 'As your volume grows, we grow with you. Add services, adjust workflows, and get weekly reporting—all included.',
  },
]

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="container">
        <div className="how-grid">
          <div>
            <span className="section-label" data-reveal>How It Works</span>
            <h2 className="section-title" data-reveal data-delay="1">
              From signed to <span style={{ color: 'var(--taupe)' }}>live in days</span>,<br />not months
            </h2>
            <div className="divider" style={{ marginBottom: 40 }} data-reveal data-delay="1" />
            <div className="how-steps">
              {STEPS.map((s, i) => (
                <div key={s.num} className="how-step" data-reveal data-delay={i + 2}>
                  <div className="how-step-num">{s.num}</div>
                  <div className="how-step-body">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="how-visual" data-reveal data-delay="2">
            <div className="how-visual-title">What's included from day one</div>
            <ul className="how-checklist">
              {[
                'Dedicated account manager',
                'CRM integration & setup',
                'Custom SOP configuration',
                'Daily follow-up execution',
                'Weekly performance reports',
                'Unlimited workflow adjustments',
                'Storm outreach campaigns',
                'Permit pulling & supplier coordination',
              ].map(item => (
                <li key={item}>
                  <span className="how-check">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="how-cta">
              <div>
                <div className="how-cta-text">
                  <strong>Ready to get started?</strong>
                  No contracts. Cancel anytime.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
