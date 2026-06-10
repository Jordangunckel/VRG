import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase.js'
import { useScrollReveal } from './hooks/useScrollReveal.js'
import EmployeeHub from './employee/EmployeeHub.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TrustBar from './components/TrustBar.jsx'
import Services from './components/Services.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import About from './components/About.jsx'
import FoundingClients from './components/FoundingClients.jsx'
import CtaBanner from './components/CtaBanner.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import BookCallModal from './components/BookCallModal.jsx'
import SetPasswordModal from './components/SetPasswordModal.jsx'
import LoginPage from './components/LoginPage.jsx'
import ControlTower from './controltower/ControlTower.jsx'
import './controltower/control-tower.css'
import PromoPopup from './components/PromoPopup.jsx'
import FunnelFrame from './funnel/FunnelFrame.jsx'

// ─── Home page (all sections) ───────────────────────────────────────────────
function HomePage({ onBookCall }) {
  useScrollReveal('home')
  return (
    <>
      <Hero onBookCall={onBookCall} />
      <TrustBar />
      <Services />
      <HowItWorks />
      <About />
      <FoundingClients onBookCall={onBookCall} />
      <CtaBanner onBookCall={onBookCall} />
      <Contact />
      <Footer />
    </>
  )
}

export default function App() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const [modalOpen, setModalOpen]   = useState(false)
  const [user, setUser]             = useState(null)
  const [isEmployee, setIsEmployee] = useState(false)
  const [needsPassword, setNeedsPassword] = useState(false)

  const isHome = location.pathname === '/'

  // Light/dark mode — manual only, persisted to localStorage.
  // Defaults to light; no automatic location-based switching.
  const [isDark, setIsDark] = useState(() => localStorage.getItem('darkMode') === 'true')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleDark = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem('darkMode', String(next))
  }

  // Route helper (role-aware)
  const routeUser = async (loggedInUser) => {
    const { data } = await supabase.from('vrg_roles').select('user_id').eq('user_id', loggedInUser.id).maybeSingle()
    const emp = !!data
    setIsEmployee(emp)
    navigate(emp ? '/employee' : '/dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Restore session on mount + listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session) { setIsEmployee(false); return }

      if (event === 'SIGNED_IN') {
        const isInvite = window.location.hash.includes('type=invite')
        if (isInvite) setNeedsPassword(true)
        routeUser(session.user)
      }
      if (event === 'PASSWORD_RECOVERY') {
        setNeedsPassword(true)
      }
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Check employee role whenever user changes
  useEffect(() => {
    if (!user) { setIsEmployee(false); return }
    supabase.from('vrg_roles').select('user_id').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setIsEmployee(!!data))
  }, [user])

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser)
    supabase.from('vrg_roles').select('user_id').eq('user_id', loggedInUser.id).maybeSingle()
      .then(({ data }) => {
        const emp = !!data
        setIsEmployee(emp)
        navigate(emp ? '/employee' : '/dashboard')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsEmployee(false)
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openBooking = () => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => setModalOpen(true), 100)
    } else {
      setModalOpen(true)
    }
  }

  // Full-screen app routes (own chrome) — hide the marketing navbar
  const isAppPage = location.pathname === '/employee' || location.pathname === '/dashboard'

  // Funnel pages show a slimmed navbar (logo only — no login / dark toggle)
  const isFunnelPage = location.pathname.startsWith('/crm') || location.pathname.startsWith('/flight-path')

  return (
    <>
      {!isAppPage && (
        <Navbar
          onPageChange={(path) => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          isDark={isDark}
          onToggleDark={toggleDark}
          minimal={isFunnelPage}
          onBookCall={() => setModalOpen(true)}
        />
      )}

      <Routes>
        <Route path="/" element={
          <HomePage onBookCall={openBooking} />
        } />

        {/* CRM Flight Check funnel + Flight Path bonus — static pages framed under the site navbar */}
        <Route path="/crm"      element={<FunnelFrame src="/funnel/landing.html"     onBookCall={() => setModalOpen(true)} />} />
        <Route path="/crm/quiz" element={<FunnelFrame src="/funnel/quiz.html"        onBookCall={() => setModalOpen(true)} />} />
        <Route path="/flight-path"           element={<FunnelFrame src="/funnel/flight-path.html" onBookCall={() => setModalOpen(true)} />} />
        <Route path="/flight-path/map"       element={<FunnelFrame src="/funnel/map.html"         onBookCall={() => setModalOpen(true)} />} />

        <Route path="/login" element={
          <LoginPage
            onSuccess={handleLoginSuccess}
            onBack={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          />
        } />

        <Route path="/dashboard" element={
          <div className="ct-scope">
            <ControlTower user={user} onLogout={handleLogout} />
          </div>
        } />

        <Route path="/employee" element={
          <EmployeeHub user={user} onLogout={handleLogout} />
        } />

        {/* Catch-all → home */}
        <Route path="*" element={
          <HomePage onBookCall={openBooking} />
        } />
      </Routes>

      {isHome && <PromoPopup onBookCall={openBooking} />}

      <BookCallModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <SetPasswordModal open={needsPassword} onDone={() => setNeedsPassword(false)} />
    </>
  )
}
