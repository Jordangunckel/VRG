import { useState } from 'react'
import { CRMS, BRAND_VOICES, rolesForCrm, STAGES, STATUSES, profileSectionComplete } from '../sopConfig.js'

const SECTIONS = [
  { id: 'company', n: 1, label: 'Your company', sub: 'Company details, hours, and your message voice.' },
  { id: 'crm',     n: 2, label: 'Your CRM',     sub: 'Your CRM, texting, and pipeline statuses.' },
  { id: 'team',    n: 3, label: 'Your team',    sub: 'Who we can assign tasks to, and your rules.' },
]

// The company profile, split into three sections. Used by Onboarding + Settings.
// Shows a card overview with a progress bar so it's clear all three are required.
export default function CompanyForm({ data, setField, errors }) {
  const [open, setOpen] = useState(null)   // null = overview, else a section id
  const crmName = CRMS.find(c => c.id === data.crm)?.name
  const clientStatuses = data.clientStatuses || []
  const gaps = []
  STAGES.forEach(stage => STATUSES[stage].forEach(canon => { if (data.statusMap?.[canon] === '__ADD__') gaps.push(canon) }))

  const goTo = (id) => { setOpen(id); window.scrollTo(0, 0) }

  // ── Overview: progress bar + three cards ──
  if (open === null) {
    const doneCount = SECTIONS.filter(s => profileSectionComplete(s.id, data)).length
    const pct = Math.round((doneCount / SECTIONS.length) * 100)
    return (
      <div className="company-form">
        <div className="progress-card">
          <div className="progress-top">
            <strong>Profile setup</strong>
            <span>{doneCount} of {SECTIONS.length} complete</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
          <div className="progress-foot">
            <span className="progress-pct">{pct}% complete</span>
            <span className="progress-time">{doneCount === SECTIONS.length ? 'All sections complete' : 'All three sections are required'}</span>
          </div>
        </div>

        <div className="card-grid">
          {SECTIONS.map(s => {
            const done = profileSectionComplete(s.id, data)
            return (
              <button className="svc-card" key={s.id} type="button" onClick={() => goTo(s.id)}>
                <div className="svc-card-top">
                  <span className="service-num">{s.n}</span>
                  <div className="svc-card-meta">
                    {done
                      ? <span className="pill pill-done">Complete</span>
                      : <span className="pill pill-todo">Not set up</span>}
                  </div>
                </div>
                <h3>{s.label}</h3>
                <p>{s.sub}</p>
                <span className="svc-card-cta">{done ? 'Edit' : 'Fill out'} →</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Section detail ──
  const idx = SECTIONS.findIndex(s => s.id === open)
  const nextSection = SECTIONS[idx + 1]

  return (
    <div className="company-form">
      <button className="back-link" type="button" onClick={() => goTo(null)}>← All sections</button>

      {/* ── Your company — the details + the voice ── */}
      {open === 'company' && (
        <div className="cf-section">
          <div className="info-grid">
            <div className="field">
              <label>Company name <span className="required">*</span></label>
              <input type="text" value={data.companyName} onChange={e => setField('companyName', e.target.value)} placeholder="Exactly how customers should see it" />
              <span className="field-hint">The name that signs every message we send.</span>
            </div>
            <div className="field">
              <label>Main point of contact <span className="required">*</span></label>
              <input type="text" value={data.mainContact} onChange={e => setField('mainContact', e.target.value)} placeholder="Who we check in with" />
            </div>
            <div className="field">
              <label>Callback phone <span className="required">*</span></label>
              <input type="text" value={data.callbackPhone} onChange={e => setField('callbackPhone', e.target.value)} placeholder="The number homeowners call back" />
            </div>
            <div className="field">
              <label>Main office email <span className="required">*</span></label>
              <input type="text" value={data.mainEmail} onChange={e => setField('mainEmail', e.target.value)} placeholder="name@company.com" />
            </div>
            <div className="field">
              <label>Primary customer base <span className="required">*</span></label>
              <select value={data.customerBase} onChange={e => setField('customerBase', e.target.value)}>
                <option value="">Select…</option>
                <option>Insurance</option>
                <option>Retail</option>
                <option>Both</option>
              </select>
            </div>
            <div className="field">
              <label>Average jobs per month <span className="required">*</span></label>
              <input type="number" min="0" value={data.avgJobsMonthly} onChange={e => setField('avgJobsMonthly', e.target.value)} placeholder="e.g. 25" />
            </div>
            <div className="field span-2">
              <label>Service area <span className="required">*</span></label>
              <input type="text" value={data.serviceArea} onChange={e => setField('serviceArea', e.target.value)} placeholder="e.g. Greater Indianapolis, IN" />
            </div>
            <div className="field">
              <label>Business hours <span className="required">*</span></label>
              <input type="text" value={data.businessHours} onChange={e => setField('businessHours', e.target.value)} placeholder="e.g. Mon–Fri 8am–6pm" />
            </div>
            <div className="field">
              <label>Text &amp; call hours <span className="required">*</span></label>
              <input type="text" value={data.quietHours} onChange={e => setField('quietHours', e.target.value)} placeholder="Default 8am–9pm local (TCPA)" />
            </div>
            <div className="field span-2">
              <label>Google review link <span className="required">*</span></label>
              <input type="text" value={data.reviewLink} onChange={e => setField('reviewLink', e.target.value)} placeholder="The exact link we send happy customers" />
            </div>
            <div className="field span-2">
              <label>Primary escalation contact <span className="required">*</span></label>
              <input type="text" value={data.escalationContact} onChange={e => setField('escalationContact', e.target.value)} placeholder="Name, cell, email — who we go to when something’s outside the runbook" />
            </div>
          </div>

          <div>
            <span className="question-label">Pick your message voice <span className="required">*</span></span>
            <div className="driver-grid voices">
              {BRAND_VOICES.map(v => (
                <label key={v.id} className={`driver-card ${data.voice === v.id ? 'selected' : ''}`}>
                  <input type="radio" name="voice" value={v.id} checked={data.voice === v.id} onChange={() => setField('voice', v.id)} />
                  <span className="driver-card-name">{v.name}</span>
                  <span className="driver-card-sub">{v.blurb}</span>
                </label>
              ))}
            </div>
            {errors?.voice && <span className="inline-error">{errors.voice}</span>}
          </div>
        </div>
      )}

      {/* ── Your CRM — which one, texting, statuses ── */}
      {open === 'crm' && (
        <div className="cf-section">
          <div>
            <span className="question-label">Which CRM does your team run? <span className="required">*</span></span>
            <div className="driver-grid">
              {CRMS.map(c => (
                <label key={c.id} className={`driver-card ${data.crm === c.id ? 'selected' : ''}`}>
                  <input type="radio" name="crm" value={c.id} checked={data.crm === c.id} onChange={() => setField('crm', c.id)} />
                  <span className="driver-card-name">{c.name}</span>
                  <span className="driver-card-sub">{c.engine}</span>
                </label>
              ))}
            </div>
            {errors?.crm && <span className="inline-error">{errors.crm}</span>}
          </div>

          {data.crm && (
            <div className="texting-row">
              <div className="texting-copy">
                <strong>Is automated texting turned on in {crmName}? <span className="required">*</span></strong>
                <span>{data.crm === 'jobnimbus' ? 'JobNimbus needs the Engage add-on to send texts.' : 'AccuLynx charges extra for text messaging.'} If it is off, we will use email instead and you can enable Text later.</span>
              </div>
              <div className="yesno-group">
                {['yes', 'no'].map(opt => (
                  <label key={opt} className={`yesno-option ${opt}`}>
                    <input type="radio" name="textingEnabled" value={opt} checked={data.textingEnabled === opt} onChange={() => setField('textingEnabled', opt)} />
                    {opt === 'yes' ? 'Yes' : 'No'}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="pipeline-block">
            <span className="question-label">Your pipeline statuses <span className="required">*</span> <span className="freq-rec">— so our automations run on your labels, not ours</span></span>

            <div className="pipeline-step">
              <div className="pipeline-step-head"><span className="step-num">1</span> List every status in your CRM pipeline</div>
              {clientStatuses.map((st, i) => (
                <div className="team-row" key={i}>
                  <input type="text" value={st} placeholder="Status name (e.g. New Lead)" onChange={e => setField('clientStatuses', clientStatuses.map((v, idx) => idx === i ? e.target.value : v))} />
                  <button type="button" className="team-remove" onClick={() => setField('clientStatuses', clientStatuses.filter((_, idx) => idx !== i))}>Remove</button>
                </div>
              ))}
              <button type="button" className="team-add" onClick={() => setField('clientStatuses', [...clientStatuses, ''])}>+ Add status</button>
            </div>

            <div className="pipeline-step">
              <div className="pipeline-step-head"><span className="step-num">2</span> Match each of our steps to one of yours</div>
              <span className="freq-rec">Pick the status in your pipeline that matches each step. Can’t find a match? Choose “We’ll add this at install.”</span>
              {STAGES.map(stage => (
                <div className="pipeline-stage" key={stage}>
                  <div className="pipeline-stage-name">{stage}</div>
                  {STATUSES[stage].map(canon => (
                    <div className="pipeline-row" key={canon}>
                      <span className="pipeline-canon">{canon}</span>
                      <span className="pipeline-arrow">→</span>
                      <select value={data.statusMap?.[canon] || ''} onChange={e => setField('statusMap', { ...data.statusMap, [canon]: e.target.value })}>
                        <option value="">Select your status…</option>
                        {clientStatuses.filter(Boolean).map(csName => <option key={csName} value={csName}>{csName}</option>)}
                        <option value="__ADD__">➕ We’ll add this at install</option>
                      </select>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {gaps.length > 0 && (
              <div className="notice warning">We’ll create {gaps.length} status{gaps.length > 1 ? 'es' : ''} in your CRM at install: <strong>{gaps.join(', ')}</strong>.</div>
            )}
          </div>
        </div>
      )}

      {/* ── Your team — members + roles + rules ── */}
      {open === 'team' && (
        <div className="cf-section">
          <div className="team-block">
            <span className="question-label">Team members <span className="required">*</span> <span className="freq-rec">— the people we can hand a task to, and their {crmName || 'CRM'} user role</span></span>
            <div className="notice info">Add <strong>every person who has access to your CRM</strong>, and double-check each one’s role is correct. We can only assign tasks to people on this list.</div>
            {!data.crm && <div className="notice info">Pick your CRM on the Your CRM section to load its user roles.</div>}
            {(data.team || []).map((m, i) => (
              <div className="team-row" key={i}>
                <input type="text" value={m.name || ''} placeholder="Team member name" onChange={e => setField('team', (data.team || []).map((t, idx) => idx === i ? { ...t, name: e.target.value } : t))} />
                <select value={m.role || ''} disabled={!data.crm} onChange={e => setField('team', (data.team || []).map((t, idx) => idx === i ? { ...t, role: e.target.value } : t))}>
                  <option value="">User role…</option>
                  {rolesForCrm(data.crm).map(r => <option key={r}>{r}</option>)}
                </select>
                <button type="button" className="team-remove" onClick={() => setField('team', (data.team || []).filter((_, idx) => idx !== i))}>Remove</button>
              </div>
            ))}
            <button type="button" className="team-add" onClick={() => setField('team', [...(data.team || []), { name: '', role: '' }])}>+ Add team member</button>
          </div>

          <div className="field">
            <label>Team rules <span className="required">*</span> <span className="freq-rec">— how assignments should work (e.g. “supplements always go to the Office Admin; escalations to the owner”)</span></label>
            <textarea rows={3} value={data.teamRules || ''} onChange={e => setField('teamRules', e.target.value)} placeholder="Any standing rules for who handles what…" />
          </div>
        </div>
      )}

      <div className="cf-section-nav">
        <span className="cf-section-status">
          {profileSectionComplete(open, data)
            ? 'This section is complete.'
            : 'Fill out every field in this section.'}
        </span>
        {nextSection ? (
          <button className="btn-save" type="button" onClick={() => goTo(nextSection.id)}>Next: {nextSection.label} →</button>
        ) : (
          <button className="btn-save" type="button" onClick={() => goTo(null)}>Back to all sections →</button>
        )}
      </div>
    </div>
  )
}
