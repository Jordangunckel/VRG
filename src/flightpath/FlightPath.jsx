import { useEffect } from 'react'

export default function FlightPath({ onBookCall, onCrmHealth }) {
  // Listen for postMessage events from the iframe
  useEffect(() => {
    const handler = (e) => {
      if (e.data === 'book-call') onBookCall?.()
      if (e.data === 'crm-health') onCrmHealth?.()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onBookCall, onCrmHealth])

  return (
    <div style={{ marginTop: 66, height: 'calc(100vh - 66px)' }}>
      <iframe
        src="/flight-path/index.html"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="RoofSmartr Flight Path"
      />
    </div>
  )
}
