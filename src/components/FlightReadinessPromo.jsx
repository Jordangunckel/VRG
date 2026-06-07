export default function FlightReadinessPromo({ onFlightReadiness }) {
  return (
    <section className="frs-promo">
      <div className="container">
        <div className="frs-inner">

          {/* Left — copy */}
          <div className="frs-copy">
            <span className="section-label">It's Free</span>
            <h2 className="frs-heading">Free Flight<br />Readiness Report</h2>
            <p className="frs-sub">
              10 questions. 2 minutes. Find out exactly where your pipeline is
              leaking revenue — and get a personalized list of free automations
              you can set up today.
            </p>
            <ul className="frs-bullets">
              <li><span className="frs-check">✓</span> Your overall Flight Readiness Score</li>
              <li><span className="frs-check">✓</span> Stage-by-stage breakdown (Leads · Presale · Production · Post-Sale)</li>
              <li><span className="frs-check">✓</span> Estimated revenue leaking every month</li>
              <li><span className="frs-check">✓</span> Free automations matched to your gaps</li>
            </ul>
            <button className="btn btn-primary btn-lg frs-cta" onClick={onFlightReadiness}>
              Get My Free Report →
            </button>
          </div>

          {/* Right — airplane art */}
          <div className="frs-art" aria-hidden="true">
            <div className="frs-art-bg" />
            {/* Altitude meter */}
            <div className="frs-meter">
              <div className="frs-meter-label">Altitude</div>
              <div className="frs-meter-track">
                <div className="frs-meter-fill" />
                <div className="frs-meter-arrow" />
              </div>
              <div className="frs-meter-bands">
                <span style={{ color: '#2E9BD6' }}>Autopilot</span>
                <span style={{ color: '#00AEBB' }}>Cruising</span>
                <span style={{ color: '#f0a830' }}>Turbulence</span>
                <span style={{ color: '#e8772e' }}>Losing Alt.</span>
                <span style={{ color: '#e2574c' }}>Engine Fail</span>
              </div>
            </div>
            {/* Plane SVG */}
            <svg className="frs-plane" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Fuselage */}
              <ellipse cx="110" cy="110" rx="14" ry="68" fill="#0B1929" stroke="#00AEBB" strokeWidth="2.5"/>
              {/* Main wings */}
              <path d="M110 95 L20 135 L46 135 L110 108 L174 135 L200 135 L110 95Z" fill="#142840" stroke="#00AEBB" strokeWidth="2"/>
              {/* Tail wings */}
              <path d="M110 162 L72 178 L88 178 L110 168 L132 178 L148 178 L110 162Z" fill="#142840" stroke="#00AEBB" strokeWidth="1.5"/>
              {/* Nose */}
              <ellipse cx="110" cy="50" rx="8" ry="12" fill="#00AEBB"/>
              {/* Engine pods */}
              <ellipse cx="72" cy="118" rx="7" ry="16" fill="#0d2035" stroke="#A8D242" strokeWidth="1.5"/>
              <ellipse cx="148" cy="118" rx="7" ry="16" fill="#0d2035" stroke="#A8D242" strokeWidth="1.5"/>
              {/* Engine glow */}
              <ellipse cx="72" cy="132" rx="4" ry="3" fill="#A8D242" opacity="0.6"/>
              <ellipse cx="148" cy="132" rx="4" ry="3" fill="#A8D242" opacity="0.6"/>
              {/* Cockpit window */}
              <ellipse cx="110" cy="64" rx="5" ry="7" fill="#00AEBB" opacity="0.7"/>
              {/* Wing windows */}
              <circle cx="96" cy="110" r="3" fill="#00AEBB" opacity="0.5"/>
              <circle cx="110" cy="110" r="3" fill="#00AEBB" opacity="0.5"/>
              <circle cx="124" cy="110" r="3" fill="#00AEBB" opacity="0.5"/>
              {/* Speed lines */}
              <line x1="20" y1="148" x2="60" y2="148" stroke="#A8D242" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
              <line x1="14" y1="155" x2="46" y2="155" stroke="#A8D242" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>
              <line x1="160" y1="148" x2="200" y2="148" stroke="#A8D242" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
              <line x1="174" y1="155" x2="206" y2="155" stroke="#A8D242" strokeWidth="1" strokeLinecap="round" opacity="0.25"/>
            </svg>
            {/* Score badge */}
            <div className="frs-score-badge">
              <div className="frs-score-num">?</div>
              <div className="frs-score-lbl">Your Score</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
