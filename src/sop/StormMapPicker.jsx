import { useState, useRef, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function loadGoogleMaps(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing`
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

export default function StormMapPicker({ value, onChange, hasError }) {
  const mapRef = useRef(null)
  const googleMapRef = useRef(null)
  const drawingManagerRef = useRef(null)
  const shapeRef = useRef(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [areaSet, setAreaSet] = useState(!!value)

  useEffect(() => {
    if (!API_KEY) return
    loadGoogleMaps(API_KEY)
      .then(() => setIsLoaded(true))
      .catch(() => setLoadError(true))
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || googleMapRef.current) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 39.5, lng: -98.35 },
      zoom: 4,
      mapTypeControl: false,
      streetViewControl: false,
    })
    googleMapRef.current = map

    const dm = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          window.google.maps.drawing.OverlayType.POLYGON,
          window.google.maps.drawing.OverlayType.RECTANGLE,
          window.google.maps.drawing.OverlayType.CIRCLE,
        ],
      },
      polygonOptions:   { fillColor: '#223382', fillOpacity: 0.25, strokeColor: '#223382', strokeWeight: 2 },
      rectangleOptions: { fillColor: '#223382', fillOpacity: 0.25, strokeColor: '#223382', strokeWeight: 2 },
      circleOptions:    { fillColor: '#223382', fillOpacity: 0.25, strokeColor: '#223382', strokeWeight: 2 },
    })
    dm.setMap(map)
    drawingManagerRef.current = dm

    const handleOverlayComplete = (e) => {
      if (shapeRef.current) shapeRef.current.setMap(null)
      shapeRef.current = e.overlay
      dm.setDrawingMode(null)

      let areaData = { type: e.type }
      if (e.type === 'polygon') {
        areaData.path = e.overlay.getPath().getArray().map(ll => ({ lat: ll.lat(), lng: ll.lng() }))
      } else if (e.type === 'rectangle') {
        const b = e.overlay.getBounds()
        areaData.bounds = {
          ne: { lat: b.getNorthEast().lat(), lng: b.getNorthEast().lng() },
          sw: { lat: b.getSouthWest().lat(), lng: b.getSouthWest().lng() },
        }
      } else if (e.type === 'circle') {
        const c = e.overlay.getCenter()
        areaData.center = { lat: c.lat(), lng: c.lng() }
        areaData.radius = e.overlay.getRadius()
      }

      setAreaSet(true)
      onChange(areaData)
    }

    window.google.maps.event.addListener(dm, 'overlaycomplete', handleOverlayComplete)
  }, [isLoaded, onChange])

  const clearArea = () => {
    if (shapeRef.current) { shapeRef.current.setMap(null); shapeRef.current = null }
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON)
    }
    setAreaSet(false)
    onChange(null)
  }

  if (!API_KEY) {
    return (
      <div className="map-placeholder" style={{ borderColor: hasError ? 'var(--red)' : undefined }}>
        <h4>Google Maps API Key Required</h4>
        <p>
          To enable the outreach area map, add your key to a <code>.env</code> file:
        </p>
        <p style={{ marginTop: 8 }}>
          <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code>
        </p>
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-400)' }}>
          Restart the dev server after adding the key.
        </p>
      </div>
    )
  }

  if (loadError) {
    return <div className="notice danger">Failed to load Google Maps. Check your API key and browser console.</div>
  }

  return (
    <div className="map-wrapper" style={{ borderColor: hasError ? 'var(--red)' : undefined }}>
      {!isLoaded && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--gray-500)', fontSize: 14 }}>
          Loading map…
        </div>
      )}
      <div ref={mapRef} style={{ width: '100%', height: 380, display: isLoaded ? 'block' : 'none' }} />
      <div className="map-area-info">
        {areaSet ? (
          <>
            <span className="map-area-set">✓ Outreach area selected</span>
            <button type="button" className="btn-clear" onClick={clearArea}>Clear area</button>
          </>
        ) : (
          <span className="map-required-badge">
            {hasError ? '⚠ Required — draw your outreach area on the map above' : 'Draw a shape on the map to define your outreach area'}
          </span>
        )}
      </div>
    </div>
  )
}
