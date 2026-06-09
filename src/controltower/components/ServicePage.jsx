import { YesNo } from './shared.jsx'
import {
  SERVICES, statusesForStage, serviceDefaults, ALL_CHANNELS, MANUAL_NOTICE,
  renderAutomation, timingLabel, getCopy, makeStatusMapper,
} from '../sopConfig.js'

// ── Shared pieces ───────────────────────────────────────────────────────────
function ChannelsPicker({ defs, selected, textingOn, onToggle }) {
  const channels = defs.channels.map(id => ALL_CHANNELS.find(c => c.id === id))
  return (
    <div>
      <span className="question-label">Select all the ways you want these jobs contacted</span>
      <div className="checkbox-group">
        {channels.map(c => {
          const disabled = c.id === 'text' && !textingOn
          const on = selected.includes(c.id)
          return (
            <label key={c.id} className={`checkbox-option ${disabled ? 'is-disabled' : ''}`}>
              <input type="checkbox" disabled={disabled} checked={on} onChange={() => !disabled && onToggle(c.id)} />
              <span className="check-box" />
              <span className="radio-label">{c.label}{disabled && <span className="gated"> — needs texting enabled in your CRM</span>}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

function FrequencyPicker({ frequency, customMax, recommendedText, defs, selected, onSetFreq, onSetMax }) {
  return (
    <div>
      <span className="question-label">How often should we reach out?</span>
      <div className="radio-group">
        <label className="radio-option">
          <input type="radio" checked={frequency === 'recommended'} onChange={() => onSetFreq('recommended')} />
          <span className="radio-dot" />
          <span className="radio-label">Recommended<span className="rec">(Recommended)</span><br /><span className="freq-rec">{recommendedText}</span></span>
        </label>
        <label className="radio-option">
          <input type="radio" checked={frequency === 'custom'} onChange={() => onSetFreq('custom')} />
          <span className="radio-dot" />
          <span className="radio-label">Custom — set a maximum per channel</span>
        </label>
      </div>
      {frequency === 'custom' && (
        <div className="sub-section">
          <span className="sub-label">Most touches per channel</span>
          <div className="max-grid">
            {(selected.length ? selected : defs.channels).map(id => (
              <div className="field" key={id}>
                <label>{ALL_CHANNELS.find(c => c.id === id)?.label}</label>
                <input type="number" min="0" max={defs.max[id]} value={customMax?.[id] ?? ''} placeholder={`up to ${defs.max[id]}`} onChange={e => onSetMax(id, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function GroupTasks({ group, serviceId, sTasks, intake, onUpdateTask }) {
  const people = (intake.team || []).filter(p => p && p.name)
  const roles = [...new Set((intake.team || []).map(p => p && p.role).filter(Boolean))]
  const mapStatus = makeStatusMapper(intake.statusMap)
  const isOwnerTask = a => a.kind === 'call' || a.kind === 'task' || (a.kind === 'exit' && a.exitType === 'manual')
  const tasks = group.automations.filter(isOwnerTask)
  const autoExits = group.automations.filter(a => a.kind === 'exit' && a.exitType === 'auto')
  return (
    <>
      {tasks.map(a => {
        const t = sTasks?.[a.id] || {}
        const owner = a.clientOnly ? 'team' : (t.owner || 'roofsmartr')
        const r = renderAutomation(a, group.status, intake.crm, mapStatus)
        const label = a.task || (a.kind === 'exit' ? `Route the file → ${mapStatus(a.exitTo)}` : 'Call the lead')
        return (
          <div className="task-row" key={a.id}>
            <div className="task-main">
              <span className="task-label">{label}</span>
              <span className="crm-line"><span className="crm-kw">{r.format === 'whenthen' ? 'WHEN' : 'Trigger:'}</span> {r.trigger}</span>
            </div>
            <div className="task-owner">
              {a.clientOnly ? (
                <span className="client-only-note">Your team only</span>
              ) : (
                <label className="owner-switch">
                  <span className={owner === 'roofsmartr' ? 'ow-on' : 'ow-off'}>{owner === 'roofsmartr' ? 'RoofSmartr' : 'Your team'}</span>
                  <span className="toggle-switch">
                    <input type="checkbox" checked={owner === 'roofsmartr'} onChange={e => onUpdateTask(serviceId, a.id, { owner: e.target.checked ? 'roofsmartr' : 'team' })} />
                    <span className="toggle-slider" />
                  </span>
                </label>
              )}
              {owner === 'team' && (
                <select className="assignee" value={t.assignee || ''} onChange={e => onUpdateTask(serviceId, a.id, { assignee: e.target.value })}>
                  <option value="">{(roles.length || people.length) ? 'Assign to…' : 'Add team in Settings'}</option>
                  {roles.length > 0 && <optgroup label="By role">{roles.map(rr => <option key={'r-' + rr} value={rr}>{rr}</option>)}</optgroup>}
                  {people.length > 0 && <optgroup label="By person">{people.map(p => <option key={'p-' + p.name} value={p.name}>{p.name}{p.role ? ` (${p.role})` : ''}</option>)}</optgroup>}
                </select>
              )}
            </div>
          </div>
        )
      })}
      {autoExits.map(a => {
        const r = renderAutomation(a, group.status, intake.crm, mapStatus)
        return <div className="task-info" key={a.id}><span className="chip chip-exit">Auto</span> {r.action}</div>
      })}
    </>
  )
}

function GroupMessages({ group, serviceId, intake, selected, sTouches, onUpdateTouch }) {
  const mapStatus = makeStatusMapper(intake.statusMap)
  const msgs = group.automations.filter(a => a.kind === 'message' && selected.includes(a.channel))
  if (!msgs.length) return <p className="freq-rec" style={{ padding: '4px 2px' }}>No messages for the channels you picked.</p>
  return (
    <>
      {msgs.map(a => {
        const def = getCopy(intake.voice, a.messageKey)
        const t = sTouches?.[a.id] || {}
        const r = renderAutomation(a, group.status, intake.crm, mapStatus)
        return (
          <div className="auto-card" key={a.id}>
            <div className="auto-card-top">
              <span className="chip chip-time">{timingLabel(a.timing)}</span>
              <span className={`chip chip-${a.channel}`}>{a.channel === 'text' ? 'Text' : 'Email'}</span>
            </div>
            <span className="crm-line"><span className="crm-kw">{r.format === 'whenthen' ? 'WHEN' : 'Trigger:'}</span> {r.trigger} <span className="crm-kw">{r.format === 'whenthen' ? 'THEN' : 'Action:'}</span> {r.action}</span>
            <div className="copy-edit">
              {a.channel === 'email' && (
                <div className="field"><label>Subject</label>
                  <input type="text" value={t.subject ?? def.subject ?? ''} onChange={e => onUpdateTouch(serviceId, a.id, 'subject', e.target.value)} />
                </div>
              )}
              <div className="field"><label>Message</label>
                <textarea rows={a.channel === 'email' ? 7 : 3} value={t.body ?? def.body ?? ''} onChange={e => onUpdateTouch(serviceId, a.id, 'body', e.target.value)} />
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function ServicePage(props) {
  const { service } = props
  const idx = SERVICES.findIndex(s => s.id === service.id)
  const nextService = SERVICES[idx + 1]
  return (
    <div className="service-page">
      <button className="back-link" type="button" onClick={props.onBack}>← All services</button>
      <div className="sp-head">
        <span className="service-num">{String(service.number).padStart(2, '0')}</span>
        <div>
          <h1>{service.name}</h1>
          <span className={`stage-badge stage-${service.stage.toLowerCase().replace(/\s+/g, '-')}`}>{service.stage}</span>
        </div>
      </div>
      <p className="service-summary">{service.summary}</p>
      {service.perStatus ? <PerStatusBody {...props} /> : <SingleBody {...props} />}

      <div className="sp-nav">
        {nextService ? (
          <button className="btn-save" type="button" onClick={() => props.onOpenService(nextService.id)}>
            Go to next service →
          </button>
        ) : (
          <button className="btn-save" type="button" onClick={props.onBack}>
            Finish configuration ✓
          </button>
        )}
      </div>
    </div>
  )
}

// One trigger status, one cadence — the model for 9 of the 10 services.
function SingleBody({ service, state, intake, onUpdate, onUpdateTouch, onUpdateTask }) {
  const s = state || {}
  const defs = serviceDefaults(service.id)
  const textingOn = intake.textingEnabled === 'yes'
  const selected = s.channels || []
  const mapStatus = makeStatusMapper(intake.statusMap)
  const toggleChannel = id => onUpdate(service.id, { channels: selected.includes(id) ? selected.filter(c => c !== id) : [...selected, id] })

  return (
    <>
      <div className="sp-card">
        <span className="question-label">Do you want RoofSmartr to handle {service.name} for you?</span>
        <YesNo name={`enabled-${service.id}`} value={s.enabled} onChange={v => onUpdate(service.id, { enabled: v })} />
      </div>

      {s.enabled === 'yes' && (
        <>
          <div className="sp-card">
            <span className="question-label">How should RoofSmartr identify jobs that need {service.name}?</span>
            <div className="radio-group">
              <label className="radio-option">
                <input type="radio" name={`id-${service.id}`} checked={s.identify === 'auto'} onChange={() => onUpdate(service.id, { identify: 'auto' })} />
                <span className="radio-dot" />
                <span className="radio-label">Automatically assign a task when a file reaches a status<span className="rec">(Recommended)</span></span>
              </label>
              {s.identify === 'auto' && (
                <div className="sub-section">
                  <div className="field">
                    <label>Which status triggers it?</label>
                    <select value={s.status || ''} onChange={e => onUpdate(service.id, { status: e.target.value })}>
                      <option value="">Select a status…</option>
                      {statusesForStage(service.stage).map(st => <option key={st} value={st}>{mapStatus(st)}</option>)}
                    </select>
                  </div>
                </div>
              )}
              <label className="radio-option">
                <input type="radio" name={`id-${service.id}`} checked={s.identify === 'manual'} onChange={() => onUpdate(service.id, { identify: 'manual' })} />
                <span className="radio-dot" />
                <span className="radio-label">A team member manually creates the task</span>
              </label>
              {s.identify === 'manual' && (
                <div className="sub-section">
                  <div className="notice warning">{MANUAL_NOTICE}</div>
                  <label className="agree-row"><input type="checkbox" checked={!!s.agreed} onChange={e => onUpdate(service.id, { agreed: e.target.checked })} />I Agree</label>
                </div>
              )}
            </div>
          </div>

          <div className="sp-card"><ChannelsPicker defs={defs} selected={selected} textingOn={textingOn} onToggle={toggleChannel} /></div>

          <div className="sp-card">
            <FrequencyPicker frequency={s.frequency} customMax={s.customMax} recommendedText={defs.recommended} defs={defs} selected={selected}
              onSetFreq={f => onUpdate(service.id, { frequency: f })} onSetMax={(id, val) => onUpdate(service.id, { customMax: { ...s.customMax, [id]: val } })} />
          </div>

          <div className="sp-card backoffice-card">
            <div className="bo-head">
              <span className="question-label" style={{ margin: 0 }}>Back-office tasks — who handles each?</span>
              <span className="freq-rec">On = RoofSmartr does it for you. Off = the task still fires automatically, assigned to your team member.</span>
            </div>
            {service.groups.map(g => (
              <div className="group-block" key={g.status}>
                <div className="group-head"><h4>{mapStatus(g.status)}</h4></div>
                <div className="group-autos"><GroupTasks group={g} serviceId={service.id} sTasks={s.tasks} intake={intake} onUpdateTask={onUpdateTask} /></div>
              </div>
            ))}
          </div>

          <div className="sp-card">
            <span className="question-label">Your messages <span className="freq-rec">— edit any to make it yours (custom copywriting)</span></span>
            {service.groups.map(g => (
              <div className="group-block" key={g.status}>
                <div className="group-head"><h4>{mapStatus(g.status)}</h4><span className="group-goal">{g.goal}</span></div>
                <div className="group-autos"><GroupMessages group={g} serviceId={service.id} intake={intake} selected={selected} sTouches={s.touches} onUpdateTouch={onUpdateTouch} /></div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  )
}

// Each status runs its own sequence — the Lead Nurture model.
function PerStatusBody({ service, state, intake, onUpdateStatus, onUpdateTask, onUpdateTouch }) {
  const s = state || {}
  const defs = serviceDefaults(service.id)
  const textingOn = intake.textingEnabled === 'yes'
  const statuses = s.statuses || {}
  const mapStatus = makeStatusMapper(intake.statusMap)

  return (
    <>
      {service.groups.map(group => {
        const st = statuses[group.status] || {}
        const selected = st.channels || []
        const toggleChannel = id => onUpdateStatus(service.id, group.status, { channels: selected.includes(id) ? selected.filter(c => c !== id) : [...selected, id] })
        return (
          <div className="sp-card status-card" key={group.status}>
            <div className="status-card-head">
              <h3>{mapStatus(group.status)}</h3>
              <span className="group-goal">{group.goal}</span>
            </div>
            <span className="question-label">Do you want RoofSmartr to run the {mapStatus(group.status)} sequence?</span>
            <YesNo name={`en-${service.id}-${group.status}`} value={st.enabled} onChange={v => onUpdateStatus(service.id, group.status, { enabled: v })} />

            {st.enabled === 'yes' && (
              <>
                <ChannelsPicker defs={defs} selected={selected} textingOn={textingOn} onToggle={toggleChannel} />
                <FrequencyPicker frequency={st.frequency} customMax={st.customMax} recommendedText={group.recommended || defs.recommended} defs={defs} selected={selected}
                  onSetFreq={f => onUpdateStatus(service.id, group.status, { frequency: f })} onSetMax={(id, val) => onUpdateStatus(service.id, group.status, { customMax: { ...st.customMax, [id]: val } })} />

                <div className="sub-block">
                  <span className="sub-label">Back-office tasks — who handles each?</span>
                  <div className="group-autos flush"><GroupTasks group={group} serviceId={service.id} sTasks={s.tasks} intake={intake} onUpdateTask={onUpdateTask} /></div>
                </div>

                <div className="sub-block">
                  <span className="sub-label">Messages <span className="freq-rec">— edit any to make it yours</span></span>
                  <div className="group-autos flush"><GroupMessages group={group} serviceId={service.id} intake={intake} selected={selected} sTouches={s.touches} onUpdateTouch={onUpdateTouch} /></div>
                </div>
              </>
            )}
          </div>
        )
      })}
    </>
  )
}
