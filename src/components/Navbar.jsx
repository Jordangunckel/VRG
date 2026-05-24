import { useState, useEffect } from 'react'

export default function Navbar({ onBookCall, activePage = 'home', onPageChange }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    if (activePage === 'sop') {
      onPageChange?.('home')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <a className="navbar-logo" href="#" onClick={handleLogoClick}>
            <img src="/logo.png" alt="Valley Ridge Group" />
            <strong className="navbar-logo-name">Valley Ridge Group</strong>
          </a>

          {activePage === 'sop' ? (
            /* SOP page: show a single Back link */
            <ul className="navbar-links">
              <li>
                <a
                  href="#"
                  onClick={e => { e.preventDefault(); onPageChange?.('home'); setMenuOpen(false) }}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  ← Back to Home
                </a>
              </li>
            </ul>
          ) : (
            /* Home page: full nav links + SOP link */
            <ul className="navbar-links">
              {[['home','Home'],['services','Services'],['about','About'],['contact','Contact']].map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a>
                </li>
              ))}
              <li>
                <a
                  href="#sop"
                  className="navbar-sop-link"
                  onClick={e => { e.preventDefault(); onPageChange?.('sop'); setMenuOpen(false) }}
                >
                  Client SOP
                </a>
              </li>
            </ul>
          )}

          {activePage !== 'sop' && (
            <button
              className="btn btn-primary"
              onClick={onBookCall}
              style={{ fontSize: 14, padding: '10px 20px' }}
            >
              Book a Free Call
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
