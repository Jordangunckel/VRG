export default function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          {[
            { num: '500', suffix: '+', label: 'Jobs Managed Monthly' },
            { num: '48', suffix: 'hr', label: 'Average Turnaround' },
            { num: '97', suffix: '%', label: 'Client Retention Rate' },
            { num: '3', suffix: 'min', label: 'Avg Lead Response Time' },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-number">
                {s.num}<span>{s.suffix}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
