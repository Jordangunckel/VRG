import { useState, useEffect, useRef } from 'react'

export default function Navbar({ activePage = 'home', onPageChange, isDark, onToggleDark, onCrmHealth, onFlightPath }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">

          {/* Logo — dropdown trigger on home, back-nav on SOP */}
          <div className="navbar-menu-wrap" ref={menuRef}>
            <button
              className={`navbar-logo-btn${menuOpen ? ' open' : ''}`}
              onClick={() => {
                if (activePage === 'sop' || activePage === 'login') { onPageChange?.('home') }
                else setMenuOpen(o => !o)
              }}
              aria-label="Menu"
            >
              <img src="/logo-transparent.png" alt="RoofSmartr" />
              <div className="navbar-logo-text">
                <span className="navbar-logo-main">Roof<span style={{ color: '#2DD4BF' }}>Smart</span><span style={{ color: '#2DD4BF' }}>r</span></span>
              </div>
              {activePage !== 'sop' && activePage !== 'login' && (
                <svg className={`navbar-chevron${menuOpen ? ' flipped' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>

            {menuOpen && activePage !== 'sop' && activePage !== 'login' && (
              <div className="navbar-dropdown">
                {[['home','Home'],['services','Services'],['about','About'],['contact','Contact']].map(([id, label]) => (
                  <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>
                    {label}
                  </a>
                ))}
                <a href="#flight-path" className="navbar-dropdown-item-special" onClick={e => { e.preventDefault(); setMenuOpen(false); onFlightPath?.() }}>
                  ✈️ CRM Flight Path
                </a>
                <a href="#crm-health" className="navbar-dropdown-cta" onClick={e => { e.preventDefault(); setMenuOpen(false); onCrmHealth?.() }}>
                  ⚡ Free CRM Health Report
                </a>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="navbar-right">
            {activePage !== 'sop' && activePage !== 'login' && (
              <button
                className="navbar-login-btn"
                onClick={() => onPageChange?.('login')}
              >
                Login
              </button>
            )}

            <button
              className="navbar-dark-toggle"
              onClick={onToggleDark}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                /* Sun icon */
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
                /* Moon icon */
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

          </div>

        </div>
      </div>
    </nav>
  )
}
