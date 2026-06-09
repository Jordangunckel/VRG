import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Renders a static funnel page (under /funnel/) inside the marketing shell so the
// site-wide Navbar (rendered by App) sits on top. Forwards the URL query string
// into the iframe (deep-link params) and bridges the iframe's "book-call" message
// to the React BookCallModal.
export default function FunnelFrame({ src, onBookCall }) {
  const { search } = useLocation()

  useEffect(() => {
    const handler = (e) => { if (e.data === 'book-call') onBookCall?.() }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onBookCall])

  return (
    <div style={{ marginTop: 66, height: 'calc(100vh - 66px)' }}>
      <iframe
        src={src + search}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="RoofSmartr"
      />
    </div>
  )
}
