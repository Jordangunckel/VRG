// ─── Reusable UI primitives shared across all sections ───

export function SectionHeader({ number, title }) {
  return (
    <div className="section-header">
      <div className="section-number">{number}</div>
      <h2>{title}</h2>
    </div>
  )
}

export function ServiceCard({ title, children }) {
  return (
    <div className="service-card">
      <div className="service-card-header">
        <span className="service-tag">Service</span>
        <h3>{title}</h3>
      </div>
      <div className="service-card-body">{children}</div>
    </div>
  )
}

export function YesNo({ name, value, onChange, question }) {
  return (
    <div>
      {question && <span className="question-label">{question}</span>}
      <div className="yesno-group">
        {['yes', 'no'].map(opt => (
          <label key={opt} className={`yesno-option ${opt}`}>
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            {opt === 'yes' ? 'Yes' : 'No'}
          </label>
        ))}
      </div>
    </div>
  )
}

// Conditional rendering wrapper — renders children only when condition is met
export function ShowIf({ when, children }) {
  if (!when) return null
  return <>{children}</>
}

// Auto vs Manual workflow selection — used in many services
export function AutoOrManual({ name, value, onChange, question }) {
  return (
    <div>
      <span className="question-label">{question || 'How should RoofSmartr identify files needing this service?'}</span>
      <div className="radio-group">
        <label className="radio-option">
          <input type="radio" name={name} value="automatic" checked={value === 'automatic'} onChange={() => onChange('automatic')} />
          <span className="radio-dot" />
          <span className="radio-label">
            Automatically when file reaches selected CRM status
            <span className="rec">(Recommended)</span>
          </span>
        </label>
        <label className="radio-option">
          <input type="radio" name={name} value="manual" checked={value === 'manual'} onChange={() => onChange('manual')} />
          <span className="radio-dot" />
          <span className="radio-label">Team member manually creates task</span>
        </label>
      </div>
    </div>
  )
}

// CRM status trigger text input — shown when automatic is selected
export function CRMTriggerInput({ value, onChange, label }) {
  return (
    <div className="field">
      <label>{label || 'CRM Status Trigger'}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. New Lead, Approved, Ready for Install…"
      />
    </div>
  )
}

// Manual workflow notice + required I Agree checkbox
export function ManualNotice({ agreed, onAgree, errorMsg, customText }) {
  const defaultText =
    'Our system only detects assigned tasks. Tags, internal notes, and comments will not trigger this workflow. By selecting manual task creation, you agree to follow RoofSmartr\'s task submission instructions.'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="notice warning">
        {customText || defaultText}
      </div>
      <label className={`agree-row ${errorMsg ? 'error-border' : ''}`}>
        <input type="checkbox" checked={agreed} onChange={e => onAgree(e.target.checked)} />
        I Agree
      </label>
      {errorMsg && <span style={{ fontSize: 12, color: 'var(--red)' }}>{errorMsg}</span>}
    </div>
  )
}

// Frequency radio group with optional custom text input
export function FrequencyField({ name, value, onChange, customValue, onCustomChange, options, question }) {
  return (
    <div>
      {question && <span className="question-label">{question}</span>}
      <div className="radio-group">
        {options.map(opt => (
          <label key={opt.value} className="radio-option">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span className="radio-dot" />
            <span className="radio-label">
              {opt.label}
              {opt.recommended && <span className="rec">(Recommended)</span>}
            </span>
          </label>
        ))}
      </div>
      {/* Conditional: show custom text input when "Custom" is selected */}
      {value === 'custom' && (
        <div className="field" style={{ marginTop: 10 }}>
          <label>Describe your custom logic</label>
          <input
            type="text"
            value={customValue}
            onChange={e => onCustomChange(e.target.value)}
            placeholder="Describe your custom frequency or logic…"
          />
        </div>
      )}
    </div>
  )
}

// Simple radio group from an array of options
export function RadioGroup({ name, value, onChange, options, question, horizontal }) {
  return (
    <div>
      {question && <span className="question-label">{question}</span>}
      <div className={`radio-group ${horizontal ? 'radio-group-h' : ''}`}>
        {options.map(opt => (
          <label key={opt.value} className="radio-option">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
            />
            <span className="radio-dot" />
            <span className="radio-label">
              {opt.label}
              {opt.recommended && <span className="rec">(Recommended)</span>}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

// Multi-select checkbox group
export function CheckboxGroup({ name, values, onChange, options, question }) {
  const toggle = (val) => {
    const next = values.includes(val)
      ? values.filter(v => v !== val)
      : [...values, val]
    onChange(next)
  }
  return (
    <div>
      {question && <span className="question-label">{question}</span>}
      <div className="checkbox-group">
        {options.map(opt => (
          <label key={opt.value} className="checkbox-option">
            <input
              type="checkbox"
              name={name}
              value={opt.value}
              checked={values.includes(opt.value)}
              onChange={() => toggle(opt.value)}
            />
            <span className="check-box" />
            <span className="radio-label">
              {opt.label}
              {opt.recommended && <span className="rec">(Recommended)</span>}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

export function InfoNote({ children, type = 'info' }) {
  return <div className={`notice ${type}`}>{children}</div>
}

export function SubSection({ children }) {
  return <div className="sub-section">{children}</div>
}
