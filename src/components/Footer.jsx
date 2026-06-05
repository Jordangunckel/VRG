export default function Footer({ onEmployeeLogin }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src="/logo.png" alt="RoofSmartr" />
            <p>The roofing industry's dedicated back-office partner. We build the systems that grow with your business.</p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              {[['home','Home'],['about','About'],['services','Services'],['contact','Contact']].map(([id,label]) => (
                <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {['Lead Follow-Up','Storm Outreach','Presale Coordination','Production','Post-Sale','Reviews & Referrals'].map(s => (
                <li key={s}><a href="#services" onClick={e => { e.preventDefault(); scrollTo('services') }}>{s}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@valleyridgegroup.com">hello@valleyridgegroup.com</a></li>
              <li><a href="tel:8005550190">(800) 555-0190</a></li>
              <li><span>Mon–Fri, 8am–6pm CST</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} RoofSmartr. All rights reserved.</span>
          <span>RoofSmartr</span>
          <button className="footer-employee-login" onClick={onEmployeeLogin}>
            Employee Login
          </button>
        </div>
      </div>
    </footer>
  )
}
