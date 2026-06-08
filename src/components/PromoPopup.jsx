import { useState, useEffect } from 'react'

const SESSION_KEY = 'vrg_promo_dismissed'

export default function PromoPopup({ onBookCall }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(SESSION_KEY)) return

    const t = setTimeout(() => setVisible(true), 6000)
    return () => clearTimeout(t)
  }, [])

  const dismiss = () => {
    setVisible(false)
    sessionStorage.setItem(SESSION_KEY, '1')
  }

  const handleBookCall = () => {
    dismiss()
    onBookCall()
  }

  return (
    <div className={`promo-popup${visible ? ' promo-popup--visible' : ''}`} role="dialog" aria-label="Book a free call">
      <button className="promo-popup-close" onClick={dismiss} aria-label="Dismiss">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="1" y1="1" x2="11" y2="11"/>
          <line x1="11" y1="1" x2="1" y2="11"/>
        </svg>
      </button>

      <div className="promo-popup-eyebrow">Free Consultation</div>
      <p className="promo-popup-heading">See how we'd run your back office</p>
      <p className="promo-popup-sub">30 minutes. No pressure. We'll walk through your current workflow and show you exactly where we can help.</p>

      <button className="promo-popup-cta" onClick={handleBookCall}>
        Book a Free Call
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/>
          <polyline points="12 5 19 12 12 19"/>
        </svg>
      </button>
    </div>
  )
}
