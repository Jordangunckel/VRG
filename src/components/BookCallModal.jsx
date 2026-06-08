import { useState, useEffect } from 'react'

const MONTHS = ['January','February','March','April','May','June',
                 'July','August','September','October','November','December']
const DAY_HDRS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function buildTimeSlots() {
  const slots = []
  for (let h = 8; h < 18; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h % 12 || 12
      const ampm = h < 12 ? 'AM' : 'PM'
      slots.push(`${hour}:${String(m).padStart(2, '0')} ${ampm}`)
    }
  }
  return slots
}
const TIME_SLOTS = buildTimeSlots()

function MiniCalendar({ selected, onSelect }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [vm, setVm] = useState(today.getMonth())
  const [vy, setVy] = useState(today.getFullYear())

  const firstDay = new Date(vy, vm, 1).getDay()
  const totalDays = new Date(vy, vm + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  const isPast = d => new Date(vy, vm, d) < today
  const isSel  = d => selected?.day === d && selected?.month === vm && selected?.year === vy
  const canPrev = vy > today.getFullYear() || (vy === today.getFullYear() && vm > today.getMonth())

  const prev = () => vm === 0 ? (setVm(11), setVy(y => y - 1)) : setVm(m => m - 1)
  const next = () => vm === 11 ? (setVm(0),  setVy(y => y + 1)) : setVm(m => m + 1)

  return (
    <div className="cal-wrap">
      <div className="cal-header">
        <button type="button" className="cal-nav" onClick={prev} disabled={!canPrev}>‹</button>
        <span className="cal-month-label">{MONTHS[vm]} {vy}</span>
        <button type="button" className="cal-nav" onClick={next}>›</button>
      </div>
      <div className="cal-grid">
        {DAY_HDRS.map(d => <div key={d} className="cal-day-hdr">{d}</div>)}
        {cells.map((d, i) => (
          <button
            key={i}
            type="button"
            disabled={!d || isPast(d)}
            className={`cal-cell${!d ? ' cal-empty' : ''}${d && isPast(d) ? ' cal-past' : ''}${d && isSel(d) ? ' cal-sel' : ''}`}
            onClick={() => d && !isPast(d) && onSelect({ day: d, month: vm, year: vy })}
          >
            {d || ''}
          </button>
        ))}
      </div>
    </div>
  )
}

const SVG_ARROW = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A9A8E' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`
const selectStyle = { backgroundImage: SVG_ARROW, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36 }

export default function BookCallModal({ open, onClose }) {
  const [form, setForm] = useState({ name: '', company: '', phone: '', email: '', jobs: '', crm: '' })
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const formatDate = d => d
    ? new Date(d.year, d.month, d.day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : ''

  const submit = e => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
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
              <h3>You're on the calendar.</h3>
              <p>
                Confirmed for <strong>{formatDate(selectedDate)} at {selectedTime} CST</strong>.
                A RoofSmartr team member will reach out to confirm shortly.
              </p>
              <button className="btn btn-forest" style={{ marginTop: 24 }} onClick={onClose}>Close</button>
            </div>
          ) : (
            <form onSubmit={submit}>

              {/* Contact info */}
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
                  <select value={form.jobs} onChange={e => set('jobs', e.target.value)} style={selectStyle}>
                    <option value="">Select…</option>
                    <option>1–10</option><option>11–25</option>
                    <option>26–50</option><option>50+</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>CRM You Use</label>
                  <select value={form.crm} onChange={e => set('crm', e.target.value)} style={selectStyle}>
                    <option value="">Select…</option>
                    <option>JobNimbus</option><option>AccuLynx</option><option>Other</option>
                  </select>
                </div>
              </div>

              {/* Date picker */}
              <div className="booking-section">
                <div className="booking-section-label">Select a Date</div>
                <MiniCalendar
                  selected={selectedDate}
                  onSelect={d => { setSelectedDate(d); setSelectedTime(null) }}
                />
              </div>

              {/* Time picker — shown after date selected */}
              {selectedDate && (
                <div className="booking-section">
                  <div className="booking-section-label">
                    Select a Time
                    <span className="booking-tz">CST · {formatDate(selectedDate)}</span>
                  </div>
                  <div className="time-slots">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        className={`time-slot${selectedTime === slot ? ' sel' : ''}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-forest btn-lg"
                style={{ width: '100%', justifyContent: 'center', marginTop: 16, opacity: (!selectedDate || !selectedTime) ? 0.5 : 1 }}
                disabled={!selectedDate || !selectedTime}
              >
                {selectedDate && selectedTime
                  ? `Book for ${formatDate(selectedDate)} at ${selectedTime} →`
                  : 'Select a date & time to continue'}
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
