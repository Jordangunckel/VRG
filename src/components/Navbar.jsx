import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar({ isDark, onToggleDark, minimal = false, onBookCall }) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const isSubPage = location.pathname !== '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const goHome = () => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const scrollTo = (id) => {
    setMenuOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">

          {/* Logo */}
          <div className="navbar-menu-wrap" ref={menuRef}>
            <button
              className={`navbar-logo-btn${menuOpen ? ' open' : ''}`}
              onClick={() => isSubPage ? goHome() : setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              <img className="navbar-logo-img" src="/brand/roofsmartr-logo.png" alt="RoofSmartr" />
              {!isSubPage && (
                <svg className={`navbar-chevron${menuOpen ? ' flipped' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            {menuOpen && !isSubPage && (
              <div className="navbar-dropdown">
                {[['home','Home'],['services','Services'],['about','About'],['contact','Contact']].map(([id, label]) => (
                  <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>
                    {label}
                  </a>
                ))}
                {/* Lead magnet */}
                <a href="/crm" className="navbar-dropdown-item-special" onClick={e => { e.preventDefault(); setMenuOpen(false); navigate('/crm'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                  ✈️ Free CRM Flight Check
                </a>
              </div>
            )}
          </div>

          {/* Right side — hidden on the slimmed funnel navbar */}
          {!minimal && (
          <div className="navbar-right">
            <button
              className="navbar-login-btn"
              onClick={() => { navigate('/login'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            >
              Login
            </button>

            <button
              className="navbar-dark-toggle"
              onClick={onToggleDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
          )}

          {/* Slimmed funnel navbar — single CTA on the right */}
          {minimal && (
          <div className="navbar-right">
            <button className="navbar-cta" onClick={() => onBookCall?.()}>
              Book a Free Call
            </button>
          </div>
          )}

        </div>
      </div>
    </nav>
  )
}
