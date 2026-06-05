import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import './sop.css'
import CompanyInfo from './CompanyInfo.jsx'
import LeadsSection from './LeadsSection.jsx'
import StormReadySection from './StormReadySection.jsx'
import PresaleSection from './PresaleSection.jsx'
import ProductionSection from './ProductionSection.jsx'
import PostSaleSection from './PostSaleSection.jsx'
import ReviewsSection from './ReviewsSection.jsx'

// ─── Dashboard section cards ───────────────────────────────────
// Left col: storm, leads, presale  |  Right col: production, post-sale, satisfaction
// Array order = correct mobile reading order (top→bottom, single column).
// Desktop CSS uses `order` to re-interleave into two columns:
//   Left col:  storm, leads, presale
//   Right col: production, post-sale, satisfaction
const SECTIONS = [
  { id: 'storm',        label: 'Storm Ready Outreach',  icon: '⛈️', desc: 'Proactive outreach in storm-affected areas'   },
  { id: 'leads',        label: 'Leads',                 icon: '📋', desc: 'Lead follow-up and lost lead management'       },
  { id: 'presale',      label: 'Presale',               icon: '🔍', desc: 'Adjuster coordination, scope & estimates'     },
  { id: 'production',   label: 'Production',            icon: '🔨', desc: 'Material orders, permits & scheduling'        },
  { id: 'post-sale',    label: 'Post Sale',             icon: '💰', desc: 'Invoices, financials & warranties'            },
  { id: 'satisfaction', label: 'Customer Satisfaction', icon: '⭐', desc: 'Reviews, referrals & thank-you gifts'         },
]

// ─── Initial form state ────────────────────────────────────────
const INITIAL = {
  companyName: '', companyLogo: '', mainContact: '', preferredCommunication: '', avgJobsMonthly: '',
  crmUsed: '', crmUsedOther: '', primaryCustomerBase: '', primaryProjectType: '',
  serviceArea: '', businessHours: '', emergencyContact: '',
  leadFollowUp: '', leadFollowUpIdentification: '', leadFollowUpCRMTrigger: '',
  leadFollowUpFrequency: '', leadFollowUpFrequencyCustom: '', leadFollowUpManualAgree: false,
  lostLeadFollowUp: '', lostLeadFrequency: '', lostLeadFrequencyCustom: '',
  stormReady: false, stormReadyArea: null, stormReadyAreas: [], stormLeadAssignment: '',
  stormLeadAssignmentMethod: '', stormLeadAssignmentMethodCustom: '', stormManualAssignee: '',
  adjusterCoordination: '', adjusterIdentification: '', adjusterCRMTrigger: '',
  adjusterManualAgree: false, adjusterTimeWindow: '', adjusterAssignment: '', adjusterAssignmentCustom: '',
  scopeFollowUp: '', scopeIdentification: '', scopeCRMTrigger: '',
  scopeManualAgree: false, scopeFrequency: '', scopeFrequencyCustom: '',
  supplementFollowUp: '', supplementIdentification: '', supplementCRMTrigger: '',
  supplementManualAgree: false, supplementFrequency: '', supplementFrequencyCustom: '',
  measurements: '', measurementsIdentification: '', measurementsCRMTrigger: '',
  measurementsManualAgree: false, measurementsProvider: '', measurementsProviderOther: '',
  estimates: '', estimatesIdentification: '', estimatesCRMTrigger: '',
  estimatesManualAgree: false, estimatesDelivery: '',
  materialOrders: '', materialIdentification: '', materialCRMTrigger: '',
  materialManualAgree: false, materialAction: '', materialSupplier: '', materialSupplierOther: '',
  permits: '', permitsIdentification: '', permitsManualAgree: false,
  financialWorksheet: '', financialIdentification: '', financialCRMTrigger: '', financialManualAgree: false,
  cocInvoices: '', cocRecipient: '',
  finalPayment: '', finalPaymentFollowUpWith: '', finalPaymentFrequency: '', finalPaymentFrequencyCustom: '',
  warranties: '', warrantyType: '',
  reviewsReferrals: '', reviewsTiming: '', reviewsMethods: [], reviewsFrequency: '', reviewsFrequencyCustom: '',
  thankYouGifts: '', thankYouIdentification: '', thankYouIdentificationCustom: '',
  thankYouGiftType: '', thankYouGiftCustom: '',
  _sectionsDone: [],
}

// ─── Per-section completion check ─────────────────────────────
// Returns true when every required top-level field in a section
// has been answered (non-empty). Storm requires _sectionsDone too
// (handled at call site) since false === "No" is a valid answer.
function isSectionComplete(id, d) {
  switch (id) {
    case 'leads':
      return d.leadFollowUp !== '' && d.lostLeadFollowUp !== ''
    case 'storm':
      if (!d.stormReady) return true   // "No" is a valid, complete answer
      return (d.stormReadyAreas?.length ?? 0) > 0 && d.stormLeadAssignment !== ''
    case 'presale':
      return (
        d.adjusterCoordination !== '' &&
        d.scopeFollowUp        !== '' &&
        d.supplementFollowUp   !== '' &&
        d.measurements         !== '' &&
        d.estimates            !== ''
      )
    case 'production':
      return d.materialOrders !== '' && d.permits !== ''
    case 'post-sale':
      return (
        d.financialWorksheet !== '' &&
        d.cocInvoices        !== '' &&
        d.finalPayment       !== '' &&
        d.warranties         !== ''
      )
    case 'satisfaction':
      return d.reviewsReferrals !== '' && d.thankYouGifts !== ''
    default:
      return false
  }
}

// ─── Detect already-configured sections (for existing users) ──
function detectConfigured(d) {
  const done = []
  if (d.leadFollowUp !== '')          done.push('leads')
  if (d.adjusterCoordination !== '')  done.push('presale')
  if (d.materialOrders !== '')        done.push('production')
  if (d.financialWorksheet !== '')    done.push('post-sale')
  if (d.reviewsReferrals !== '')      done.push('satisfaction')
  return done
}

// ─── Section labels ────────────────────────────────────────────
const SECTION_LABELS = {
  company:      'Company Info',
  storm:        'Storm Ready Outreach',
  leads:        'Leads',
  presale:      'Presale',
  production:   'Production',
  'post-sale':  'Post Sale',
  satisfaction: 'Customer Satisfaction',
}

// ─── Supabase helpers ──────────────────────────────────────────
async function saveToDb(user, formData, changedSection = null) {
  if (!user) return

  const { data: existing } = await supabase
    .from('sop_data').select('data').eq('user_id', user.id).maybeSingle()

  if (existing) {
    await supabase.from('sop_data')
      .update({ data: formData, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
  } else {
    await supabase.from('sop_data').insert({ user_id: user.id, data: formData })
  }

  // Create a task for every section save (skip company info saves)
  if (!changedSection || changedSection === 'company') return

  const companyName = formData.companyName || 'Unknown Company'
  const sectionLabel = SECTION_LABELS[changedSection] || changedSection

  await supabase.from('vrg_tasks').insert({
    client_user_id:   user.id,
    company_name:     companyName,
    change_summary:   `${companyName} updated their ${sectionLabel} settings — review and update CRM`,
    sections_changed: [changedSection],
    status:           'pending',
  })
}

// ─── Settings dropdown ─────────────────────────────────────────
function SettingsMenu({ onEditCompany, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="sop-settings-wrap" ref={ref}>
      <button className="sop-settings-btn" onClick={() => setOpen(o => !o)}>
        ⚙️ Settings
      </button>
      {open && (
        <div className="sop-settings-dropdown">
          <button
            className="sop-settings-item"
            onClick={() => { setOpen(false); onEditCompany() }}
          >
            ✏️ Edit Company Info
          </button>
          <div className="sop-settings-divider" />
          <button
            className="sop-settings-item sop-settings-item--danger"
            onClick={onLogout}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Shared top-bar ────────────────────────────────────────────
function TopBar({ backLabel, onBack, companyName, companyLogo, onEditCompany, onLogout }) {
  return (
    <div className="sop-page-header">
      <div className="sop-page-header-inner">
        <div className="sop-header-top-row">
          <button className="sop-back-btn" onClick={onBack}>← {backLabel}</button>
          <div className="sop-header-right-row">
            {(companyName || companyLogo) && (
              <div className="sop-company-display">
                {companyName && <span className="sop-company-chip">{companyName}</span>}
                {companyLogo && (
                  <img
                    src={companyLogo}
                    alt="Company logo"
                    className="sop-header-logo-img"
                  />
                )}
              </div>
            )}
            <SettingsMenu onEditCompany={onEditCompany} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────
export default function SOPBuilder({ user, onBack, onLogout }) {
  const [formData, setFormData]       = useState(INITIAL)
  // 'loading' | 'welcome' | 'company' | 'dashboard' | 'section' | 'company-edit'
  const [view, setView]               = useState('loading')
  const [activeSection, setActiveSection] = useState(null)
  const [saving, setSaving]           = useState(false)
  const [errors, setErrors]           = useState({})

  // ── Load saved data ────────────────────────────────────────
  useEffect(() => {
    if (!user) { setView('welcome'); return }
    supabase.from('sop_data').select('data').eq('user_id', user.id).maybeSingle()
      .then(({ data, error }) => {
        if (!error && data?.data) {
          const loaded = { ...INITIAL, ...data.data }
          // Back-fill configured sections for users from the old wizard
          if (!loaded._sectionsDone?.length) {
            loaded._sectionsDone = detectConfigured(loaded)
          }
          // Migrate single stormReadyArea → stormReadyAreas array
          if (loaded.stormReadyArea && !loaded.stormReadyAreas?.length) {
            loaded.stormReadyAreas = [loaded.stormReadyArea]
          }
          setFormData(loaded)
          setView('dashboard')
        } else {
          setView('welcome')
        }
      })
  }, [user])

  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const save = async (data = formData, section = null) => {
    setSaving(true)
    await saveToDb(user, data, section)
    setSaving(false)
  }

  const companyName = formData.companyName?.trim()

  // ── Loading ──────────────────────────────────────────────────
  if (view === 'loading') {
    return (
      <div className="sop-root">
        <div className="sop-loading-screen">
          <div className="sop-spinner" />
          <p>Loading your SOP data…</p>
        </div>
      </div>
    )
  }

  // ── Welcome (first-time users) ───────────────────────────────
  if (view === 'welcome') {
    return (
      <div className="sop-root">
        <div className="sop-welcome-page">
          <div className="sop-welcome-card">
            <img src="/icon.png" alt="RoofSmartr" className="sop-welcome-logo" />
            <h1 className="sop-welcome-title">Welcome to the<br />SOP Builder</h1>
            <p className="sop-welcome-desc">
              Let's configure exactly how RoofSmartr handles each step of your roofing
              operation. This takes about <strong>10–15 minutes</strong> and saves
              automatically as you go.
            </p>
            <div className="sop-welcome-steps">
              {[{ icon: '🏢', label: 'Company Info' }, ...SECTIONS].map((s, i) => (
                <div key={i} className="sop-welcome-step-item">
                  <span className="sop-welcome-step-icon">{s.icon}</span>
                  <span className="sop-welcome-step-label">{s.label}</span>
                </div>
              ))}
            </div>
            <button className="sop-btn-primary" onClick={() => setView('company')}>
              Get Started →
            </button>
            {user && (
              <button className="sop-welcome-logout" onClick={onLogout}>
                Sign out ({user.email})
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Company info (first setup OR editing from settings) ──────
  if (view === 'company' || view === 'company-edit') {
    const isEdit = view === 'company-edit'
    return (
      <div className="sop-root">
        {isEdit ? (
          <TopBar
            backLabel="Dashboard"
            onBack={() => setView('dashboard')}
            companyName={companyName}
            companyLogo={formData.companyLogo}
            onEditCompany={() => {}}
            onLogout={onLogout}
          />
        ) : (
          <div className="sop-page-header">
            <div className="sop-page-header-inner">
              <div className="sop-header-top-row">
                <button className="sop-back-btn" onClick={onBack}>← Home</button>
              </div>
            </div>
          </div>
        )}

        <div className="sop-section-hero">
          <div className="sop-section-hero-inner">
            <div className="sop-section-hero-icon">🏢</div>
            <div>
              <h2 className="sop-section-hero-title">Company Information</h2>
              <p className="sop-section-hero-desc">Tell us about your business</p>
            </div>
          </div>
        </div>

        <main className="sop-form-container">
          <CompanyInfo data={formData} setField={setField} />
          <div className="sop-nav-bar">
            {isEdit ? (
              <button className="sop-btn-back" onClick={() => setView('dashboard')}>
                ← Dashboard
              </button>
            ) : (
              <div />
            )}
            <div className="sop-nav-right">
              {saving && <span className="sop-saving-label">Saving…</span>}
              <button
                className="sop-btn-primary"
                onClick={async () => { await save(formData, 'company'); setView('dashboard') }}
                disabled={saving}
              >
                {saving ? 'Saving…' : isEdit ? 'Save Changes ✓' : 'Continue to Dashboard →'}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Dashboard ────────────────────────────────────────────────
  if (view === 'dashboard') {
    const sectionsDone = formData._sectionsDone || []

    const completedCount = SECTIONS.filter(section =>
      section.id === 'storm'
        ? sectionsDone.includes('storm') && isSectionComplete('storm', formData)
        : isSectionComplete(section.id, formData)
    ).length
    const totalCount = SECTIONS.length
    const pct = Math.round((completedCount / totalCount) * 100)
    const allDone = completedCount === totalCount

    return (
      <div className="sop-root">
        <TopBar
          backLabel="Home"
          onBack={onBack}
          companyName={companyName}
          companyLogo={formData.companyLogo}
          onEditCompany={() => setView('company-edit')}
          onLogout={onLogout}
        />

        <div className="sop-dash-hero">
          <div className="sop-dash-hero-inner">
            <h2 className="sop-dash-welcome">
              {companyName ? `👋 Welcome back, ${companyName}!` : '👋 Welcome back!'}
            </h2>
            <p className="sop-dash-welcome-sub">
              Select a service category below to configure your SOP preferences.
            </p>

            {/* Progress bar */}
            <div className="sop-progress-wrap">
              <div className="sop-progress-header">
                <span className="sop-progress-label">
                  {allDone ? '🎉 SOP fully configured!' : `${completedCount} of ${totalCount} sections complete`}
                </span>
                <span className="sop-progress-pct">{pct}%</span>
              </div>
              <div className="sop-progress-track">
                <div
                  className={`sop-progress-fill${allDone ? ' sop-progress-fill--done' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sop-dashboard">
          {SECTIONS.map(section => {
            // Storm requires an explicit save visit + completion (false is valid)
            // All other sections: just check every required field is answered
            const isDone = section.id === 'storm'
              ? sectionsDone.includes('storm') && isSectionComplete('storm', formData)
              : isSectionComplete(section.id, formData)
            return (
              <button
                key={section.id}
                className={`sop-dash-card${isDone ? ' sop-dash-card--done' : ''}`}
                data-section={section.id}
                onClick={() => {
                  setActiveSection(section.id)
                  setView('section')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              >
                <div className="sop-dash-card-icon">{section.icon}</div>
                <div className="sop-dash-card-content">
                  <div className="sop-dash-card-title">{section.label}</div>
                  <div className="sop-dash-card-desc">{section.desc}</div>
                </div>
                {isDone && <span className="sop-dash-card-badge">✓</span>}
                <div className="sop-dash-card-arrow">›</div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Section editing ──────────────────────────────────────────
  if (view === 'section' && activeSection) {
    const meta = SECTIONS.find(s => s.id === activeSection)

    const handleSaveSection = async () => {
      const updated = {
        ...formData,
        _sectionsDone: [...new Set([...(formData._sectionsDone || []), activeSection])],
      }
      setFormData(updated)
      setSaving(true)
      await saveToDb(user, updated, activeSection)
      setSaving(false)
      setView('dashboard')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
      <div className="sop-root">
        <TopBar
          backLabel="Dashboard"
          onBack={() => setView('dashboard')}
          companyName={companyName}
          companyLogo={formData.companyLogo}
          onEditCompany={() => setView('company-edit')}
          onLogout={onLogout}
        />

        <div className="sop-section-hero">
          <div className="sop-section-hero-inner">
            <div className="sop-section-hero-icon">{meta.icon}</div>
            <div>
              <h2 className="sop-section-hero-title">{meta.label}</h2>
              <p className="sop-section-hero-desc">{meta.desc}</p>
            </div>
          </div>
        </div>

        <main className="sop-form-container">
          {activeSection === 'leads'        && <LeadsSection      data={formData} setField={setField} errors={errors} />}
          {activeSection === 'storm'        && <StormReadySection data={formData} setField={setField} errors={errors} />}
          {activeSection === 'presale'      && <PresaleSection    data={formData} setField={setField} errors={errors} />}
          {activeSection === 'production'   && <ProductionSection data={formData} setField={setField} errors={errors} />}
          {activeSection === 'post-sale'    && <PostSaleSection   data={formData} setField={setField} errors={errors} />}
          {activeSection === 'satisfaction' && <ReviewsSection    data={formData} setField={setField} errors={errors} />}

          {Object.keys(errors).length > 0 && (
            <div className="validation-errors">
              <strong>Please fix the following:</strong>
              <ul>{Object.values(errors).map((msg, i) => <li key={i}>{msg}</li>)}</ul>
            </div>
          )}

          <div className="sop-nav-bar">
            <button className="sop-btn-back" onClick={() => setView('dashboard')}>
              ← Dashboard
            </button>
            <div className="sop-nav-right">
              {saving && <span className="sop-saving-label">Saving…</span>}
              <button
                className="sop-btn-primary"
                onClick={handleSaveSection}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Save & Return ✓'}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return null
}
