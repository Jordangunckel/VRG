import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import './employee.css'

// ─── Section meta ──────────────────────────────────────────────
const SECTION_META = {
  company:      { label: 'Company Info',          icon: '🏢' },
  storm:        { label: 'Storm Ready Outreach',  icon: '⛈️' },
  leads:        { label: 'Leads',                 icon: '📋' },
  presale:      { label: 'Presale',               icon: '🔍' },
  production:   { label: 'Production',            icon: '🔨' },
  'post-sale':  { label: 'Post Sale',             icon: '💰' },
  satisfaction: { label: 'Customer Satisfaction', icon: '⭐' },
}

// ─── Helpers ───────────────────────────────────────────────────
function timeAgo(ts) {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (s < 60)   return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

function fmtDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── SOP summary read-only view ────────────────────────────────
function SOPSummary({ data }) {
  if (!data) return <p className="emp-empty">No SOP data yet.</p>

  const rows = [
    { label: 'CRM',              val: data.crmUsed === 'other' ? data.crmUsedOther : data.crmUsed },
    { label: 'Avg Jobs/Month',   val: data.avgJobsMonthly },
    { label: 'Service Area',     val: data.serviceArea },
    { label: 'Business Hours',   val: data.businessHours },
    { label: 'Main Contact',     val: data.mainContact },
    { label: 'Communication',    val: data.preferredCommunication },
  ].filter(r => r.val)

  const sections = [
    {
      id: 'storm', items: [
        { label: 'Storm Ready',    val: data.stormReady ? 'Yes' : 'No' },
        { label: 'Target Areas',   val: data.stormReadyAreas?.length ? `${data.stormReadyAreas.length} area(s)` : null },
        { label: 'Lead Assignment',val: data.stormLeadAssignment },
      ]
    },
    {
      id: 'leads', items: [
        { label: 'Lead Follow-Up', val: data.leadFollowUp },
        { label: 'Frequency',      val: data.leadFollowUpFrequency === 'custom' ? data.leadFollowUpFrequencyCustom : data.leadFollowUpFrequency },
        { label: 'Lost Leads',     val: data.lostLeadFollowUp },
        { label: 'Lost Frequency', val: data.lostLeadFrequency === 'custom' ? data.lostLeadFrequencyCustom : data.lostLeadFrequency },
      ]
    },
    {
      id: 'presale', items: [
        { label: 'Adjuster Coord.',  val: data.adjusterCoordination },
        { label: 'Time Window',      val: data.adjusterTimeWindow },
        { label: 'Scope Follow-Up',  val: data.scopeFollowUp },
        { label: 'Supplement F/U',   val: data.supplementFollowUp },
        { label: 'Measurements',     val: data.measurements },
        { label: 'Provider',         val: data.measurementsProvider === 'other' ? data.measurementsProviderOther : data.measurementsProvider },
        { label: 'Estimates',        val: data.estimates },
      ]
    },
    {
      id: 'production', items: [
        { label: 'Material Orders',  val: data.materialOrders },
        { label: 'Action',           val: data.materialAction },
        { label: 'Supplier',         val: data.materialSupplier === 'other' ? data.materialSupplierOther : data.materialSupplier },
        { label: 'Permits',          val: data.permits },
      ]
    },
    {
      id: 'post-sale', items: [
        { label: 'Financial Sheet',  val: data.financialWorksheet },
        { label: 'COC / Invoices',   val: data.cocInvoices },
        { label: 'COC Recipient',    val: data.cocRecipient },
        { label: 'Final Payment',    val: data.finalPayment },
        { label: 'Warranties',       val: data.warranties },
        { label: 'Warranty Type',    val: data.warrantyType },
      ]
    },
    {
      id: 'satisfaction', items: [
        { label: 'Reviews',          val: data.reviewsReferrals },
        { label: 'Timing',           val: data.reviewsTiming },
        { label: 'Methods',          val: Array.isArray(data.reviewsMethods) ? data.reviewsMethods.join(', ') : data.reviewsMethods },
        { label: 'Thank-You Gifts',  val: data.thankYouGifts },
        { label: 'Gift Type',        val: data.thankYouGiftType === 'custom' ? data.thankYouGiftCustom : data.thankYouGiftType },
      ]
    },
  ]

  return (
    <div className="emp-sop-summary">
      {/* Company info */}
      {rows.length > 0 && (
        <div className="emp-sop-section">
          <div className="emp-sop-section-head">
            <span>🏢</span> Company Info
          </div>
          <div className="emp-sop-rows">
            {rows.map(r => (
              <div key={r.label} className="emp-sop-row">
                <span className="emp-sop-key">{r.label}</span>
                <span className="emp-sop-val">{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.map(sec => {
        const meta = SECTION_META[sec.id]
        const filtered = sec.items.filter(i => i.val)
        if (!filtered.length) return null
        return (
          <div key={sec.id} className="emp-sop-section">
            <div className="emp-sop-section-head">
              <span>{meta.icon}</span> {meta.label}
            </div>
            <div className="emp-sop-rows">
              {filtered.map(r => (
                <div key={r.label} className="emp-sop-row">
                  <span className="emp-sop-key">{r.label}</span>
                  <span className="emp-sop-val">{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Notes panel ───────────────────────────────────────────────
function NotesPanel({ clientUserId, currentUserId }) {
  const [notes, setNotes] = useState([])
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.from('vrg_notes').select('*')
      .eq('client_user_id', clientUserId)
      .order('created_at', { ascending: false })
      .then(({ data }) => setNotes(data || []))
  }, [clientUserId])

  const submit = async () => {
    if (!text.trim()) return
    setSaving(true)
    const { data, error } = await supabase.from('vrg_notes')
      .insert({ client_user_id: clientUserId, note_text: text.trim(), created_by: currentUserId })
      .select().single()
    if (!error) { setNotes(p => [data, ...p]); setText('') }
    setSaving(false)
  }

  return (
    <div className="emp-notes-panel">
      <h4 className="emp-notes-title">Internal Notes</h4>
      <div className="emp-notes-compose">
        <textarea
          className="emp-notes-textarea"
          placeholder="Add an internal note visible only to VRG staff…"
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
        />
        <button
          className="emp-btn-primary"
          onClick={submit}
          disabled={saving || !text.trim()}
        >
          {saving ? 'Saving…' : 'Add Note'}
        </button>
      </div>
      <div className="emp-notes-list">
        {notes.length === 0 && <p className="emp-empty">No notes yet.</p>}
        {notes.map(n => (
          <div key={n.id} className="emp-note-item">
            <p className="emp-note-text">{n.note_text}</p>
            <span className="emp-note-meta">{fmtDate(n.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Change history panel ──────────────────────────────────────
function ChangeHistory({ clientUserId }) {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    supabase.from('sop_change_log').select('*')
      .eq('client_user_id', clientUserId)
      .order('changed_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setLogs(data || []))
  }, [clientUserId])

  if (!logs.length) return <p className="emp-empty">No changes recorded yet.</p>

  return (
    <div className="emp-history-list">
      {logs.map(l => (
        <div key={l.id} className="emp-history-item">
          <div className="emp-history-summary">{l.change_summary}</div>
          <div className="emp-history-meta">{fmtDate(l.changed_at)}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Client detail view ────────────────────────────────────────
function ClientDetail({ client, user, onBack }) {
  const [tab, setTab] = useState('sop')

  return (
    <div className="emp-detail">
      <div className="emp-detail-header">
        <button className="emp-back-btn" onClick={onBack}>← All Clients</button>
        <div className="emp-detail-title">
          <span className="emp-detail-company">{client.company_name || 'Unnamed Company'}</span>
          <span className="emp-detail-updated">Last updated {fmtDate(client.updated_at)}</span>
        </div>
      </div>

      <div className="emp-tabs">
        {[['sop', 'SOP Config'], ['notes', 'Notes'], ['history', 'Change History']].map(([id, label]) => (
          <button
            key={id}
            className={`emp-tab${tab === id ? ' emp-tab--active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="emp-tab-body">
        {tab === 'sop'     && <SOPSummary data={client.sop_data} />}
        {tab === 'notes'   && <NotesPanel clientUserId={client.user_id} currentUserId={user?.id} />}
        {tab === 'history' && <ChangeHistory clientUserId={client.user_id} />}
      </div>
    </div>
  )
}

// ─── Tasks view ────────────────────────────────────────────────
function TasksView({ tasks, setTasks, user, onClientClick }) {
  const pending = tasks.filter(t => t.status === 'pending')
  const done    = tasks.filter(t => t.status === 'done')

  const markDone = async (task) => {
    await supabase.from('vrg_tasks').update({
      status: 'done',
      completed_at: new Date().toISOString(),
      completed_by: user?.id,
    }).eq('id', task.id)
    setTasks(p => p.map(t => t.id === task.id ? { ...t, status: 'done', completed_at: new Date().toISOString() } : t))
  }

  const reopen = async (task) => {
    await supabase.from('vrg_tasks').update({ status: 'pending', completed_at: null, completed_by: null }).eq('id', task.id)
    setTasks(p => p.map(t => t.id === task.id ? { ...t, status: 'pending', completed_at: null } : t))
  }

  return (
    <div className="emp-tasks-view">
      {pending.length === 0 && done.length === 0 && (
        <div className="emp-empty-state">
          <div className="emp-empty-icon">✅</div>
          <h3>All caught up!</h3>
          <p>New tasks will appear here when clients update their SOP.</p>
        </div>
      )}

      {pending.length > 0 && (
        <div className="emp-task-group">
          <div className="emp-task-group-label">Pending — {pending.length}</div>
          {pending.map(t => (
            <div key={t.id} className="emp-task-card emp-task-card--pending">
              <div className="emp-task-card-main">
                <div className="emp-task-company">{t.company_name || 'Unknown Company'}</div>
                <div className="emp-task-summary">{t.change_summary}</div>
                {t.sections_changed?.length > 0 && (
                  <div className="emp-task-tags">
                    {t.sections_changed.map(s => (
                      <span key={s} className="emp-task-tag">
                        {SECTION_META[s]?.icon} {SECTION_META[s]?.label || s}
                      </span>
                    ))}
                  </div>
                )}
                <div className="emp-task-meta">{timeAgo(t.created_at)}</div>
              </div>
              <div className="emp-task-card-actions">
                <button className="emp-btn-ghost" onClick={() => onClientClick(t.client_user_id)}>
                  View SOP
                </button>
                <button className="emp-btn-primary emp-btn-sm" onClick={() => markDone(t)}>
                  Mark Done ✓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <div className="emp-task-group">
          <div className="emp-task-group-label emp-task-group-label--done">Completed — {done.length}</div>
          {done.map(t => (
            <div key={t.id} className="emp-task-card emp-task-card--done">
              <div className="emp-task-card-main">
                <div className="emp-task-company">{t.company_name || 'Unknown Company'}</div>
                <div className="emp-task-summary">{t.change_summary}</div>
                <div className="emp-task-meta">Done {fmtDate(t.completed_at)}</div>
              </div>
              <button className="emp-btn-ghost emp-btn-sm" onClick={() => reopen(t)}>
                Reopen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Clients list view ─────────────────────────────────────────
function ClientsView({ clients, onSelect }) {
  const [search, setSearch] = useState('')
  const filtered = clients.filter(c =>
    (c.company_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="emp-clients-view">
      <div className="emp-search-wrap">
        <input
          className="emp-search"
          placeholder="Search companies…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {filtered.length === 0 && <p className="emp-empty">No clients found.</p>}
      <div className="emp-clients-grid">
        {filtered.map(c => (
          <button key={c.user_id} className="emp-client-card" onClick={() => onSelect(c)}>
            <div className="emp-client-name">{c.company_name || 'Unnamed Company'}</div>
            <div className="emp-client-meta">
              <span>{c.sop_data?.crmUsed || '—'}</span>
              <span>Updated {fmtDate(c.updated_at)}</span>
            </div>
            <div className="emp-client-arrow">›</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Leads view (Free CRM Report submissions) ─────────────────
const STATUS_COLORS = {
  'Autopilot Engaged': '#2E9BD6',
  'Cruising':          '#00AEBB',
  'Hitting Turbulence':'#f0a830',
  'Losing Altitude':   '#e8772e',
  'Engine Failure':    '#e2574c',
}
function crmLabel(crm) {
  if (crm === 'acculynx')  return 'AccuLynx'
  if (crm === 'jobnimbus') return 'JobNimbus'
  if (crm === 'other')     return 'Other CRM'
  return crm || '—'
}
function LeadsView({ leads }) {
  const [search, setSearch] = useState('')
  const q = search.toLowerCase()
  const filtered = leads.filter(l =>
    (l.company || '').toLowerCase().includes(q) ||
    (l.email || '').toLowerCase().includes(q)
  )

  return (
    <div className="emp-clients-view">
      <div className="emp-search-wrap">
        <input
          className="emp-search"
          placeholder="Search by company or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {leads.length === 0 && (
        <div className="emp-empty-state">
          <div className="emp-empty-icon">✈️</div>
          <h3>No reports yet</h3>
          <p>Leads from the Free CRM Report will appear here the moment someone finishes the quiz.</p>
        </div>
      )}

      {leads.length > 0 && filtered.length === 0 && (
        <p className="emp-empty">No leads match your search.</p>
      )}

      {filtered.map(l => {
        const color = STATUS_COLORS[l.status] || '#5b6b7c'
        return (
          <div key={l.id} className="emp-task-card emp-task-card--pending" style={{ borderLeft: `5px solid ${color}` }}>
            <div className="emp-task-card-main">
              <div className="emp-task-company">{l.company || 'Unnamed Company'}</div>
              <div className="emp-task-summary">
                <a href={`mailto:${l.email}`} style={{ color: '#00AEBB', textDecoration: 'none', fontWeight: 600 }}>
                  {l.email || '—'}
                </a>
              </div>
              <div className="emp-task-tags">
                <span className="emp-task-tag">{crmLabel(l.crm)}</span>
                <span className="emp-task-tag" style={{ background: color, color: '#fff', borderColor: color }}>
                  {l.status || '—'}{typeof l.score === 'number' ? ` · ${l.score}/100` : ''}
                </span>
                {typeof l.estimated_monthly_leak === 'number' && l.estimated_monthly_leak > 0 && (
                  <span className="emp-task-tag" style={{ background: 'rgba(226,87,76,0.12)', color: '#e2574c', borderColor: 'rgba(226,87,76,0.3)' }}>
                    ~${l.estimated_monthly_leak.toLocaleString()}/mo leak
                  </span>
                )}
              </div>
              <div className="emp-task-meta">{timeAgo(l.created_at)} · {fmtDate(l.created_at)}</div>
            </div>
            <div className="emp-task-card-actions">
              <a className="emp-btn-primary emp-btn-sm" href={`mailto:${l.email}`} style={{ textDecoration: 'none' }}>
                Email Lead →
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main EmployeeHub ──────────────────────────────────────────
export default function EmployeeHub({ user, onLogout }) {
  const [view, setView]               = useState('tasks')   // 'tasks' | 'clients' | 'leads' | 'detail'
  const [tasks, setTasks]             = useState([])
  const [clients, setClients]         = useState([])
  const [leads, setLeads]             = useState([])
  const [selectedClient, setSelected] = useState(null)
  const [loading, setLoading]         = useState(true)

  // Load tasks + clients + leads on mount
  useEffect(() => {
    const load = async () => {
      const [{ data: tasksData }, { data: sopData }, { data: leadsData }] = await Promise.all([
        supabase.from('vrg_tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('sop_data').select('user_id, data, updated_at').order('updated_at', { ascending: false }),
        supabase.from('flight_readiness_leads').select('*').order('created_at', { ascending: false }),
      ])
      setTasks(tasksData || [])
      setClients((sopData || []).map(row => ({
        user_id:      row.user_id,
        company_name: row.data?.companyName || 'Unnamed Company',
        sop_data:     row.data,
        updated_at:   row.updated_at,
      })))
      setLeads(leadsData || [])
      setLoading(false)
    }
    load()
  }, [])

  // Jump to a client's detail from a task "View SOP" click
  const goToClient = (userId) => {
    const c = clients.find(cl => cl.user_id === userId)
    if (c) { setSelected(c); setView('detail') }
  }

  const pendingCount = tasks.filter(t => t.status === 'pending').length

  if (loading) {
    return (
      <div className="emp-root">
        <div className="emp-loading">
          <div className="emp-spinner" />
          <p>Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="emp-root">
      {/* Top bar */}
      <div className="emp-topbar">
        <div className="emp-topbar-inner">
          <div className="emp-topbar-left">
            <div>
              <div className="emp-topbar-title">Employee Hub</div>
              <div className="emp-topbar-sub">RoofSmartr</div>
            </div>
          </div>
          <div className="emp-topbar-right">
            {user && <span className="emp-topbar-user">{user.email}</span>}
            <button className="emp-btn-ghost" onClick={onLogout}>Sign Out</button>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="emp-nav">
        <div className="emp-nav-inner">
          <button
            className={`emp-nav-btn${view === 'tasks' || (view === 'detail' && selectedClient) ? '' : ''} ${view === 'tasks' ? 'emp-nav-btn--active' : ''}`}
            onClick={() => setView('tasks')}
          >
            Tasks
            {pendingCount > 0 && <span className="emp-nav-badge">{pendingCount}</span>}
          </button>
          <button
            className={`emp-nav-btn${view === 'clients' || view === 'detail' ? ' emp-nav-btn--active' : ''}`}
            onClick={() => setView('clients')}
          >
            Clients
            <span className="emp-nav-count">{clients.length}</span>
          </button>
          <button
            className={`emp-nav-btn${view === 'leads' ? ' emp-nav-btn--active' : ''}`}
            onClick={() => setView('leads')}
          >
            Leads
            <span className="emp-nav-count">{leads.length}</span>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="emp-body">
        {view === 'tasks' && (
          <TasksView tasks={tasks} setTasks={setTasks} user={user} onClientClick={goToClient} />
        )}
        {view === 'clients' && (
          <ClientsView
            clients={clients}
            onSelect={c => { setSelected(c); setView('detail') }}
          />
        )}
        {view === 'leads' && (
          <LeadsView leads={leads} />
        )}
        {view === 'detail' && selectedClient && (
          <ClientDetail
            client={selectedClient}
            user={user}
            onBack={() => setView('clients')}
          />
        )}
      </div>
    </div>
  )
}
