const VALUES = [
  { title: 'Roofing-Focused', desc: 'We only work with roofing companies. We speak your language.' },
  { title: 'CRM-Native', desc: 'We work inside your CRM. No extra tools, no new logins for your team.' },
  { title: 'Transparent Reporting', desc: 'You get clear weekly reporting on every task we handle for you.' },
  { title: 'No Contracts', desc: 'Month to month. We earn your business every month.' },
]

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img-wrap">
            <div className="about-img-bg">
              <span className="about-img-logo">RoofSmartr</span>
            </div>
            <div className="about-img-badge">
              <strong style={{ fontSize: 16 }}>$13.5M</strong>
              <span>In roofing sales</span>
            </div>
          </div>

          <div>
            <span className="section-label">About Us</span>
            <h2 className="section-title">
              Built by a roofing<br /><span>operator</span>
            </h2>
            <div className="divider" />
            <p className="section-sub" style={{ maxWidth: '100%' }}>
              RoofSmartr was built by Jordan Gunckel. He started in roofing sales, then ran his own roofing company and sold $13.5 million in roofing.
            </p>
            <p className="about-body-p">
              Jordan got tired of watching good roofing companies stall. Not on sales, but on back-office chaos: leads going cold, supplements sitting, permits slipping. He built RoofSmartr to fix that. You get an operator who has done the work, running the systems behind your business.
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
