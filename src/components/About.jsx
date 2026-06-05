const VALUES = [
  { title: 'Roofing-Focused', desc: 'We work exclusively with roofing companies—so we speak your language.' },
  { title: 'CRM-Native', desc: 'We live inside your CRM. No extra tools, no new logins for your team.' },
  { title: 'Transparent Reporting', desc: 'Weekly dashboards showing every task completed on your behalf.' },
  { title: 'No Contracts', desc: 'Month-to-month pricing. We earn your business every single month.' },
]

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img-wrap">
            <div className="about-img-bg">
              <img src="/logo.png" alt="RoofSmartr" className="about-img-logo" />
            </div>
            <div className="about-img-badge">
              <strong style={{ fontSize: 16 }}>Systems</strong>
              <span>That Scale</span>
            </div>
          </div>

          <div>
            <span className="section-label">About Us</span>
            <h2 className="section-title">
              Built by people who<br /><span>know roofing</span>
            </h2>
            <div className="divider" />
            <p className="section-sub" style={{ maxWidth: '100%' }}>
              RoofSmartr was founded by roofing industry veterans who got tired of watching great companies stall out—not because of sales, but because their back-office couldn't keep up.
            </p>
            <p className="about-body-p">
              We built a team of trained specialists—not generalist VAs—who understand adjuster negotiations, CRM workflows, insurance claims, and permit processes. Every person on our team has been trained specifically for the roofing industry, so your SOP runs exactly the way you need it to.
            </p>
            <div className="about-values">
              {VALUES.map(v => (
                <div key={v.title} className="about-value">
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
