import { useState, useEffect } from 'react'

export default function BookCallModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', jobs: '', crm: '', time: '' })
  const [submitted, setSubmitted] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Book a Free Discovery Call</h2>
            <p>30 minutes · No obligation · We'll learn your operation and show you how we can help</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div className="form-success">
              <div className="form-success-icon">🎉</div>
              <h3>You're on the calendar!</h3>
              <p>A Valley Ridge team member will confirm your call time within one business day. We're looking forward to learning about your operation.</p>
              <button className="btn btn-forest" style={{ marginTop: 24 }} onClick={onClose}>Close</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-row">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input required type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
                </div>
                <div className="form-field">
                  <label>Company Name</label>
                  <input type="text" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Your company" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Phone Number *</label>
                  <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000" />
                </div>
                <div className="form-field">
                  <label>Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Jobs Per Month</label>
                  <select value={form.jobs} onChange={e => set('jobs', e.target.value)}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A9A8E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:36 }}>
                    <option value="">Select…</option>
                    <option>1–10</option><option>11–25</option>
                    <option>26–50</option><option>50+</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>CRM You Use</label>
                  <select value={form.crm} onChange={e => set('crm', e.target.value)}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A9A8E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:36 }}>
                    <option value="">Select…</option>
                    <option>JobNimbus</option><option>AccuLynx</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Preferred Call Time</label>
                <select value={form.time} onChange={e => set('time', e.target.value)}
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A9A8E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center', paddingRight:36 }}>
                  <option value="">Select a window…</option>
                  <option>Morning (8am–12pm CST)</option>
                  <option>Afternoon (12pm–4pm CST)</option>
                  <option>Late Afternoon (4pm–6pm CST)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-forest btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                Request My Free Call →
              </button>
              <p style={{ fontSize: 12, color: 'var(--gray-400)', textAlign: 'center', marginTop: 12 }}>
                We'll confirm your time within one business day. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
