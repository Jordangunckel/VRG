import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'
import { useScrollReveal } from './hooks/useScrollReveal.js'
import { useSunMode } from './hooks/useSunMode.js'
import EmployeeHub from './employee/EmployeeHub.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import TrustBar from './components/TrustBar.jsx'
import Stats from './components/Stats.jsx'
import Services from './components/Services.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import About from './components/About.jsx'
import Testimonials from './components/Testimonials.jsx'
import CtaBanner from './components/CtaBanner.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import BookCallModal from './components/BookCallModal.jsx'
import SetPasswordModal from './components/SetPasswordModal.jsx'
import LoginPage from './components/LoginPage.jsx'
import SOPBuilder from './sop/SOPBuilder.jsx'
import PromoPopup from './components/PromoPopup.jsx'
import LeadMagnet from './leadmagnet/LeadMagnet.jsx'
import FlightPath from './flightpath/FlightPath.jsx'

export default function App() {
  const [modalOpen, setModalOpen]   = useState(false)
  const [activePage, setActivePage] = useState('home')
  const [user, setUser]             = useState(null)
  const [isEmployee, setIsEmployee] = useState(false)
  const [needsPassword, setNeedsPassword] = useState(false)

  // Re-observe [data-reveal] elements whenever the home page is shown
  useScrollReveal(activePage)

  // Manual dark mode override (persisted to localStorage)
  const [manualDark, setManualDark] = useState(() => {
    const stored = localStorage.getItem('darkMode')
    return stored === null ? null : stored === 'true'
  })

  // Auto dark mode — switches at local sunrise / sunset
  const autoDark = useSunMode()
  const isDark = manualDark !== null ? manualDark : autoDark

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleDark = () => {
    const next = !isDark
    setManualDark(next)
    localStorage.setItem('darkMode', String(next))
  }

  // Route helper (role-aware)
  const routeUser = async (loggedInUser) => {
    const { data } = await supabase.from('vrg_roles').select('user_id').eq('user_id', loggedInUser.id).maybeSingle()
    const emp = !!data
    setIsEmployee(emp)
    setActivePage(emp ? 'employee' : 'sop')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Restore session on mount + listen for auth changes
  useEffect(() => {
    // Restore existing session silently (don't re-route if already on a page)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setUser(session.user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session) { setIsEmployee(false); return }

      // Route automatically on fresh sign-in (including invite link clicks)
      if (event === 'SIGNED_IN') {
        // If coming from an invite link, the user has no password yet
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

  // Check VRG employee role whenever user changes
  useEffect(() => {
    if (!user) { setIsEmployee(false); return }
    supabase.from('vrg_roles').select('user_id').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setIsEmployee(!!data))
  }, [user])

  const goToPage = (page) => {
    if (page === 'login' && user) {
      setActivePage(isEmployee ? 'employee' : 'sop')
    } else {
      setActivePage(page)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setIsEmployee(false)
    setActivePage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // After login, route employee vs client
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser)
    // Role check will fire via useEffect; pre-check here for speed
    supabase.from('vrg_roles').select('user_id').eq('user_id', loggedInUser.id).maybeSingle()
      .then(({ data }) => {
        const emp = !!data
        setIsEmployee(emp)
        setActivePage(emp ? 'employee' : 'sop')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
  }

  return (
    <>
      {/* Hide public navbar when employee hub is active */}
      {activePage !== 'employee' && (
        <Navbar
          activePage={activePage}
          onPageChange={goToPage}
          isDark={isDark}
          onToggleDark={toggleDark}
          onCrmHealth={() => goToPage('crm-health')}
          onFlightPath={() => goToPage('flight-path')}
        />
      )}

      {activePage === 'login' ? (
        <LoginPage
          onSuccess={handleLoginSuccess}
          onBack={() => goToPage('home')}
        />
      ) : activePage === 'employee' ? (
        <EmployeeHub
          user={user}
          onLogout={handleLogout}
        />
      ) : activePage === 'sop' ? (
        <SOPBuilder
          user={user}
          onBack={() => goToPage('home')}
          onLogout={handleLogout}
        />
      ) : activePage === 'crm-health' ? (
        <LeadMagnet onBack={() => goToPage('home')} />
      ) : activePage === 'flight-path' ? (
        <FlightPath
          onBookCall={() => { goToPage('home'); setTimeout(() => setModalOpen(true), 100) }}
          onCrmHealth={() => goToPage('crm-health')}
        />
      ) : (
        <>
          <Hero onBookCall={() => setModalOpen(true)} onCrmHealth={() => goToPage('crm-health')} onFlightPath={() => goToPage('flight-path')} />
          <TrustBar />
          <Stats />
          <Services />
          <HowItWorks />
          <About />
          <Testimonials />
          <CtaBanner onBookCall={() => setModalOpen(true)} />
          <Contact />
          <Footer onEmployeeLogin={() => setActivePage('employee')} />
        </>
      )}

      {activePage === 'home' && (
        <PromoPopup onBookCall={() => setModalOpen(true)} />
      )}

      <BookCallModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <SetPasswordModal open={needsPassword} onDone={() => setNeedsPassword(false)} />
    </>
  )
}
