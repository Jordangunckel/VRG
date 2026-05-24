export default function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="container">
        <div className="trust-bar-inner">
          <span className="trust-label">Works with</span>
          {['JobNimbus', 'AccuLynx', 'EagleView', 'Roofr', 'ABC Supply', 'SRS Distribution', 'Beacon'].map(name => (
            <span key={name} className="trust-crm">{name}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
