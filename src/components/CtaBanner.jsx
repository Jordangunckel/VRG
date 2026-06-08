export default function CtaBanner({ onBookCall }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section className="cta-banner">
      <div className="container">
        <div className="cta-banner-inner">
          <h2>Build the systems that <span>grow your business.</span></h2>
          <p>Book a free 30-minute discovery call and we'll show you exactly how RoofSmartr's systems can plug into your operation this week.</p>
          <div className="cta-banner-actions">
            <button className="btn btn-primary btn-lg" onClick={onBookCall}>Book a Free Call ↗</button>
            <button className="btn btn-outline btn-lg" onClick={() => scrollTo('contact')}>Send a Message</button>
          </div>
        </div>
      </div>
    </section>
  )
}
