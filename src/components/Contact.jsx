import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    return e
  }

  const submit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setSubmitted(true)
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="section-label">Get In Touch</span>
            <h2>Let's talk about your roofing business</h2>
            <p>
              Fill out the form and a member of the RoofSmartr team will reach out within one business day to learn about your operation and walk you through our services.
            </p>
            <div className="contact-details">
              {[
                { icon: '📧', label: 'hello@roofsmartr.com' },
                { icon: '📞', label: '(800) 555-0190' },
                { icon: '📍', label: 'Serving roofing companies nationwide' },
                { icon: '🕐', label: 'Mon–Fri, 8am–6pm CST' },
              ].map(d => (
                <div key={d.label} className="contact-detail">
                  <div className="contact-detail-icon">{d.icon}</div>
                  {d.label}
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form">
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">✅</div>
                <h3>Message received.</h3>
                <p>A RoofSmartr team member will reach out within one business day. We look forward to learning about your operation.</p>
              </div>
            ) : (
              <>
                <h3>Send us a message</h3>
                <form onSubmit={submit}>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Full Name *</label>
                      <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="Your name" style={errors.name ? { borderColor: 'var(--red)' } : {}} />
                    </div>
                    <div className="form-field">
                      <label>Company Name</label>
                      <input type="text" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Your company" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label>Phone Number *</label>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                        placeholder="(555) 000-0000" style={errors.phone ? { borderColor: 'var(--red)' } : {}} />
                    </div>
                    <div className="form-field">
                      <label>Email Address *</label>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="you@company.com" style={errors.email ? { borderColor: 'var(--red)' } : {}} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Service You're Most Interested In</label>
                    <select value={form.service} onChange={e => set('service', e.target.value)}
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A9A8E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36 }}>
                      <option value="">Select a service…</option>
                      <optgroup label="Pre-Sale">
                        <option>Lead Nurture System</option>
                        <option>Adjuster Appointments</option>
                        <option>Scope &amp; Supplement Follow-Up</option>
                        <option>Measurements, Estimates &amp; Profit Analysis</option>
                      </optgroup>
                      <optgroup label="Production">
                        <option>Material Orders</option>
                        <option>Pull Permits</option>
                      </optgroup>
                      <optgroup label="Post-Sale">
                        <option>C.O.C. &amp; Invoices</option>
                        <option>Final Payment Follow-Up</option>
                        <option>Warranties &amp; Final Invoice</option>
                        <option>Reviews &amp; Referrals</option>
                      </optgroup>
                      <option>Full Back-Office Package</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Tell us about your operation</label>
                    <textarea value={form.message} onChange={e => set('message', e.target.value)}
                      placeholder="How many jobs per month? What CRM do you use? What's your biggest back-office challenge?" />
                  </div>
                  <button type="submit" className="btn btn-forest" style={{ width: '100%', justifyContent: 'center' }}>
                    Send Message →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
