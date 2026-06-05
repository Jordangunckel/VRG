export default function Hero({ onBookCall, onCrmHealth, onFlightPath }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero" id="home">
      {/* Animated background orbs */}
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />
      <div className="hero-mountain" />

      <div className="container">
        <div className="hero-inner">
          <div>
            <h1 className="hero-animate hero-animate-1">
              Your Roofing Business.<br />
              <em>On Autopilot.</em>
            </h1>
            <p className="hero-sub hero-animate hero-animate-2">
              RoofSmartr builds the systems that scale your roofing operation—handling leads, scheduling, supplements, permits, and post-sale so your team can focus on closing jobs and growing revenue.
            </p>
            <div className="hero-actions hero-animate hero-animate-3">
              <button className="btn btn-primary btn-lg" onClick={onBookCall}>
                Book a Free Call ↗
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => scrollTo('services')}>
                Explore Services
              </button>
            </div>
            <div className="hero-lead-magnet hero-animate hero-animate-4" onClick={onCrmHealth}>
              <span className="hero-lm-icon">⚡</span>
              <span>Get your free <strong>CRM Health Report</strong> — takes 3 minutes</span>
              <span className="hero-lm-arrow">→</span>
            </div>
            <div className="hero-lead-magnet hero-flight-path hero-animate hero-animate-4" onClick={onFlightPath}>
              <span className="hero-lm-icon">✈️</span>
              <span>Explore the <strong>CRM Flight Path</strong> — every stage mapped</span>
              <span className="hero-lm-arrow">→</span>
            </div>
            <div className="hero-proof hero-animate hero-animate-4">
              {[
                { num: '500+', label: 'Jobs Managed' },
                { num: '48hr', label: 'Avg Turnaround' },
                { num: '97%', label: 'Client Retention' },
                { num: '5', label: 'CRMs Supported' },
              ].map((s, i, arr) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="hero-proof-item">
                    <strong>{s.num}</strong>
                    <span>{s.label}</span>
                  </div>
                  {i < arr.length - 1 && <div className="hero-proof-divider" />}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-card hero-animate hero-animate-2">
            <div className="hero-card-title">What We Handle For You</div>
            <ul className="hero-service-list">
              {[
                'Lead follow-up & lost lead reactivation',
                'Storm ready cold call outreach',
                'Adjuster appointment coordination',
                'Scope of loss & supplement follow-up',
                'Material orders & permit pulling',
                'Final payment collection',
                'Warranties, reviews & referrals',
              ].map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="hero-card-cta">
              <strong>No hiring. No training. No overhead.</strong>
              Just results—starting within days.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
