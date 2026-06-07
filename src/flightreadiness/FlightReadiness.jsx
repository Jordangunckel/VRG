import { useEffect } from 'react'

export default function FlightReadiness({ onBookCall }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.data === 'book-call') onBookCall?.()
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onBookCall])

  return (
    <div style={{ marginTop: 66, height: 'calc(100vh - 66px)' }}>
      <iframe
        src="/flight-readiness/index.html"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        title="RoofSmartr Flight Readiness Score"
      />
    </div>
  )
}
