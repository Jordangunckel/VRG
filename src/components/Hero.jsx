export default function Hero({ onBookCall }) {
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
              Good roofing companies stall when the back office can't keep up. RoofSmartr runs your leads, scheduling, supplements, permits, and post-sale work, so your team can focus on selling and building.
            </p>
            <div className="hero-actions hero-animate hero-animate-3">
              <button className="btn btn-primary btn-lg" onClick={onBookCall}>
                Book a Free Call ↗
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => scrollTo('services')}>
                Explore Services
              </button>
            </div>
            <a href="/crm" className="hero-lead-magnet hero-flight-path hero-animate hero-animate-4">
              <span className="hero-lm-icon">✈️</span>
              <span>Get your <strong>Free CRM Flight Check</strong> in 2 minutes</span>
              <span className="hero-lm-arrow">→</span>
            </a>
            <div className="hero-proof hero-animate hero-animate-4">
              {[
                { num: '$13.5M', label: 'Sold in roofing sales' },
                { num: '6 yrs', label: 'In roofing' },
                { num: 'JobNimbus + AccuLynx', label: 'CRMs we specialize in' },
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
              <strong>Built by an operator, not an agency.</strong>
              No hiring, no training, no overhead.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
