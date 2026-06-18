import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import Onboarding from './components/Onboarding.jsx'
import Dashboard from './components/Dashboard.jsx'
import Settings from './components/Settings.jsx'
import ServicePage from './components/ServicePage.jsx'
import { SERVICES, companyProfileComplete } from './sopConfig.js'

const KEY = 'roofsmartr-control-tower-v1'
const INITIAL_INTAKE = {
  companyName: '', mainContact: '', callbackPhone: '', mainEmail: '',
  customerBase: '', avgJobsMonthly: '', serviceArea: '', businessHours: '',
  quietHours: '', reviewLink: '', escalationContact: '',
  team: [], teamRules: '', clientStatuses: [], statusMap: {},
  crm: '', voice: '', textingEnabled: '',
}

function loadLocal() {
  try { const v = JSON.parse(localStorage.getItem(KEY)); if (v) return v } catch {}
  return null
}

export default function ControlTower({ user, onLogout }) {
  const saved = loadLocal()
  const [intake, setIntake] = useState(saved?.intake || INITIAL_INTAKE)
  const [services, setServices] = useState(saved?.services || {})
  const [companyDone, setCompanyDone] = useState(saved?.companyDone || false)
  const [view, setView] = useState({ name: 'dashboard' })
  const [errors, setErrors] = useState({})

  const loadedRef = useRef(false)   // true once the server load (or no-user) has settled
  const saveTimer = useRef(null)

  // Load this user's saved config from Supabase on mount (overrides local cache)
  useEffect(() => {
    if (!user) { loadedRef.current = true; return }
    let cancelled = false
    supabase.from('control_tower').select('data').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        const d = data?.data
        if (d) {
          if (d.intake) setIntake({ ...INITIAL_INTAKE, ...d.intake })
          if (d.services) setServices(d.services)
          if (typeof d.companyDone === 'boolean') setCompanyDone(d.companyDone)
        }
        loadedRef.current = true
      })
    return () => { cancelled = true }
  }, [user])

  // Persist: localStorage immediately (cache) + debounced Supabase upsert (per account)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ intake, services, companyDone })) } catch {}
    if (!user || !loadedRef.current) return
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      supabase.from('control_tower').upsert(
        { user_id: user.id, data: { intake, services, companyDone }, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
    }, 800)
    return () => clearTimeout(saveTimer.current)
  }, [intake, services, companyDone, user])

  // Browser tab title while inside the Control Tower; restore on exit
  useEffect(() => {
    const prev = document.title
    document.title = 'RoofSmartr — Control Tower'
    return () => { document.title = prev }
  }, [])

  const setIntakeField = (name, value) => {
    setIntake(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }
  const updateService = (id, patch) =>
    setServices(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  const updateTouch = (id, aid, field, val) =>
    setServices(prev => ({ ...prev, [id]: { ...prev[id], touches: { ...prev[id]?.touches, [aid]: { ...prev[id]?.touches?.[aid], [field]: val } } } }))
  const updateTask = (id, aid, patch) =>
    setServices(prev => ({ ...prev, [id]: { ...prev[id], tasks: { ...prev[id]?.tasks, [aid]: { ...prev[id]?.tasks?.[aid], ...patch } } } }))
  const updateStatus = (id, statusName, patch) =>
    setServices(prev => ({ ...prev, [id]: { ...prev[id], statuses: { ...prev[id]?.statuses, [statusName]: { ...prev[id]?.statuses?.[statusName], ...patch } } } }))

  const completeOnboarding = () => {
    // Every field across all three sections is required.
    if (!companyProfileComplete(intake)) return
    setErrors({})
    setCompanyDone(true)
    setView({ name: 'dashboard' })
  }

  if (!companyDone) {
    return (
      <main className="app-onboarding">
        <Onboarding data={intake} setField={setIntakeField} errors={errors} onComplete={completeOnboarding} />
      </main>
    )
  }

  const openService = (id) => { setView({ name: 'service', serviceId: id }); window.scrollTo(0, 0) }
  const service = view.name === 'service' ? SERVICES.find(s => s.id === view.serviceId) : null

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" type="button" onClick={() => setView({ name: 'dashboard' })}>
            <img className="ct-logo-img" src="/brand/roofsmartr-logo.png" alt="RoofSmartr" />
            <span className="brand-sub">Control Tower</span>
          </button>
          <nav className="topnav">
            <button className={view.name === 'dashboard' || view.name === 'service' ? 'active' : ''} onClick={() => setView({ name: 'dashboard' })}>Dashboard</button>
            <button className={view.name === 'settings' ? 'active' : ''} onClick={() => setView({ name: 'settings' })}>Settings</button>
            {onLogout && <button className="ct-signout" onClick={onLogout}>Sign Out</button>}
          </nav>
        </div>
      </header>

      <main className="app-main">
        {view.name === 'dashboard' && <Dashboard intake={intake} services={services} onOpenService={openService} />}
        {view.name === 'settings' && <Settings data={intake} setField={setIntakeField} errors={errors} onDone={() => setView({ name: 'dashboard' })} />}
        {view.name === 'service' && service && (
          <ServicePage service={service} state={services[service.id]} intake={intake}
            onUpdate={updateService} onUpdateTouch={updateTouch} onUpdateTask={updateTask} onUpdateStatus={updateStatus}
            onOpenService={openService} onBack={() => setView({ name: 'dashboard' })} />
        )}
      </main>
    </div>
  )
}
