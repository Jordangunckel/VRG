import { SERVICES, STAGES, CRMS, BRAND_VOICES, isServiceComplete } from '../sopConfig.js'

// Rough time-to-set-up estimate per service.
function estMinutes(service) {
  if (service.perStatus) return service.groups.length // ~5 for Lead Nurture (one per status)
  return (service.groups?.length || 1) >= 2 ? 3 : 2
}

function statusPill(svcState, service) {
  if (service.perStatus) {
    const sts = (svcState && svcState.statuses) || {}
    const any = Object.values(sts).some(st => st && st.enabled !== undefined)
    if (!any) return <span className="pill pill-todo">Not set up</span>
    if (isServiceComplete(svcState, service)) return <span className="pill pill-done">Configured</span>
    return <span className="pill pill-progress">In progress</span>
  }
  if (!svcState || svcState.enabled === undefined) return <span className="pill pill-todo">Not set up</span>
  if (svcState.enabled === 'no') return <span className="pill pill-off">Turned off</span>
  if (isServiceComplete(svcState, service)) return <span className="pill pill-done">Configured</span>
  return <span className="pill pill-progress">In progress</span>
}

const stageClass = stage => 'sa-' + stage.toLowerCase().replace(/\s+/g, '-')

export default function Dashboard({ intake, services, onOpenService }) {
  const completed = SERVICES.filter(s => isServiceComplete(services[s.id], s)).length
  const pct = Math.round((completed / SERVICES.length) * 100)
  const remaining = SERVICES.filter(s => !isServiceComplete(services[s.id], s)).reduce((sum, s) => sum + estMinutes(s), 0)
  const crmName = CRMS.find(c => c.id === intake.crm)?.name
  const voiceName = BRAND_VOICES.find(v => v.id === intake.voice)?.name

  return (
    <div className="dashboard">
      <div className="dash-hero">
        <span className="dash-eyebrow">Control Tower setup</span>
        <h1>Your services</h1>
        <p>Set up each service the way your team runs. Showing automations for <strong>{crmName}</strong>, copy in <strong>{voiceName}</strong>.</p>
      </div>

      <div className="progress-card">
        <div className="progress-top">
          <strong>Setup progress</strong>
          <span>{completed} of {SERVICES.length} configured</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: pct + '%' }} /></div>
        <div className="progress-foot">
          <span className="progress-pct">{pct}% complete</span>
          <span className="progress-time">{remaining > 0 ? `About ${remaining} min to finish` : 'All services configured'}</span>
        </div>
      </div>

      {STAGES.map(stage => {
        const inStage = SERVICES.filter(s => s.stage === stage)
        if (!inStage.length) return null
        return (
          <div className="dash-stage" key={stage}>
            <h2 className="stage-title"><span className={`stage-dot ${stageClass(stage)}`} />{stage}</h2>
            <div className="card-grid">
              {inStage.map(svc => (
                <button className={`svc-card ${stageClass(svc.stage)}`} key={svc.id} type="button" onClick={() => onOpenService(svc.id)}>
                  <div className="svc-card-top">
                    <span className="service-num">{String(svc.number).padStart(2, '0')}</span>
                    <div className="svc-card-meta">
                      <span className="time-chip">~{estMinutes(svc)} min</span>
                      {statusPill(services[svc.id], svc)}
                    </div>
                  </div>
                  <h3>{svc.name}</h3>
                  <p>{svc.summary}</p>
                  <span className="svc-card-cta">Configure →</span>
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
