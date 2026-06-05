import { useState, useRef, useEffect } from 'react'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const SHAPE_OPTS = {
  fillColor: '#223382', fillOpacity: 0.25,
  strokeColor: '#223382', strokeWeight: 2,
}

const TYPE_LABEL = { polygon: 'Polygon', rectangle: 'Rectangle', circle: 'Circle' }

// ─── Load Google Maps script once ───────────────────────────
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

// ─── Rebuild a saved area as a Google Maps overlay ──────────
function buildOverlay(area, map) {
  const opts = { ...SHAPE_OPTS, map }
  if (area.type === 'polygon' && area.path) {
    return new window.google.maps.Polygon({ paths: area.path, ...opts })
  }
  if (area.type === 'rectangle' && area.bounds) {
    return new window.google.maps.Rectangle({
      bounds: new window.google.maps.LatLngBounds(
        { lat: area.bounds.sw.lat, lng: area.bounds.sw.lng },
        { lat: area.bounds.ne.lat, lng: area.bounds.ne.lng }
      ),
      ...opts,
    })
  }
  if (area.type === 'circle' && area.center) {
    return new window.google.maps.Circle({
      center: area.center,
      radius: area.radius,
      ...opts,
    })
  }
  return null
}

// ─── Serialize a freshly-drawn overlay to plain data ────────
function extractAreaData(e) {
  if (e.type === 'polygon') {
    return {
      type: 'polygon',
      path: e.overlay.getPath().getArray().map(ll => ({ lat: ll.lat(), lng: ll.lng() })),
    }
  }
  if (e.type === 'rectangle') {
    const b = e.overlay.getBounds()
    return {
      type: 'rectangle',
      bounds: {
        ne: { lat: b.getNorthEast().lat(), lng: b.getNorthEast().lng() },
        sw: { lat: b.getSouthWest().lat(), lng: b.getSouthWest().lng() },
      },
    }
  }
  if (e.type === 'circle') {
    const c = e.overlay.getCenter()
    return {
      type: 'circle',
      center: { lat: c.lat(), lng: c.lng() },
      radius: e.overlay.getRadius(),
    }
  }
  return null
}

// ─── Fit map to all saved areas ──────────────────────────────
function fitToAreas(map, areas) {
  if (!areas?.length) return
  const bounds = new window.google.maps.LatLngBounds()
  let added = false
  areas.forEach(a => {
    if (a.type === 'polygon')   { a.path?.forEach(p => { bounds.extend(p); added = true }) }
    if (a.type === 'rectangle') { bounds.extend(a.bounds?.ne); bounds.extend(a.bounds?.sw); added = true }
    if (a.type === 'circle')    { bounds.extend(a.center); added = true }
  })
  if (added) {
    map.fitBounds(bounds)
    // Don't zoom in too close for single small area
    window.google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
      if (map.getZoom() > 12) map.setZoom(12)
    })
  }
}

// ─── Component ───────────────────────────────────────────────
export default function StormMapPicker({ value, onChange, hasError }) {
  // Normalize value: accept null, single object (legacy), or array
  const initAreas = Array.isArray(value)
    ? value
    : (value && typeof value === 'object' ? [value] : [])

  const mapRef       = useRef(null)
  const googleMapRef = useRef(null)
  const dmRef        = useRef(null)
  // shapesRef: [{ overlay: GoogleMapsOverlay, data: areaData }]
  const shapesRef    = useRef([])
  const onChangeRef  = useRef(onChange)

  const [isLoaded,  setIsLoaded]  = useState(false)
  const [loadError, setLoadError] = useState(false)
  // `chips` mirrors shapesRef for React rendering
  const [chips, setChips] = useState(initAreas)

  // Keep onChange ref fresh without re-triggering effects
  useEffect(() => { onChangeRef.current = onChange })

  // Load script
  useEffect(() => {
    if (!API_KEY) return
    loadGoogleMaps(API_KEY).then(() => setIsLoaded(true)).catch(() => setLoadError(true))
  }, [])

  // Init map once API is ready
  useEffect(() => {
    if (!isLoaded || !mapRef.current || googleMapRef.current) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 39.5, lng: -98.35 },
      zoom: 4,
      mapTypeControl: false,
      streetViewControl: false,
    })
    googleMapRef.current = map

    // Restore previously saved areas onto the map
    initAreas.forEach(areaData => {
      const overlay = buildOverlay(areaData, map)
      if (overlay) shapesRef.current.push({ overlay, data: areaData })
    })
    if (initAreas.length > 0) fitToAreas(map, initAreas)

    // Drawing manager
    const dm = new window.google.maps.drawing.DrawingManager({
      drawingMode: initAreas.length === 0
        ? window.google.maps.drawing.OverlayType.POLYGON
        : null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          window.google.maps.drawing.OverlayType.POLYGON,
          window.google.maps.drawing.OverlayType.RECTANGLE,
          window.google.maps.drawing.OverlayType.CIRCLE,
        ],
      },
      polygonOptions:   { ...SHAPE_OPTS },
      rectangleOptions: { ...SHAPE_OPTS },
      circleOptions:    { ...SHAPE_OPTS },
    })
    dm.setMap(map)
    dmRef.current = dm

    window.google.maps.event.addListener(dm, 'overlaycomplete', e => {
      dm.setDrawingMode(null)
      const data = extractAreaData(e)
      if (!data) return
      shapesRef.current.push({ overlay: e.overlay, data })
      const newAreas = shapesRef.current.map(s => s.data)
      setChips([...newAreas])
      onChangeRef.current(newAreas)
    })
  }, [isLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  const removeArea = idx => {
    if (shapesRef.current[idx]) shapesRef.current[idx].overlay.setMap(null)
    shapesRef.current.splice(idx, 1)
    const newAreas = shapesRef.current.map(s => s.data)
    setChips([...newAreas])
    onChangeRef.current(newAreas)
  }

  const renameArea = (idx, name) => {
    shapesRef.current = shapesRef.current.map((s, i) =>
      i === idx ? { ...s, data: { ...s.data, name } } : s
    )
    const newAreas = shapesRef.current.map(s => s.data)
    setChips([...newAreas])
    onChangeRef.current(newAreas)
  }

  const clearAll = () => {
    shapesRef.current.forEach(s => s.overlay.setMap(null))
    shapesRef.current = []
    if (dmRef.current) {
      dmRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON)
    }
    setChips([])
    onChangeRef.current([])
  }

  // ── No API key ──────────────────────────────────────────────
  if (!API_KEY) {
    return (
      <div className="map-placeholder">
        <div style={{ fontSize: 28, marginBottom: 10 }}>🗺️</div>
        <h4>Map Coming Soon</h4>
        <p style={{ marginTop: 6, color: 'var(--gray-400)', fontSize: 13 }}>
          The interactive outreach area map will be available shortly.<br />
          Your other SOP preferences can still be saved below.
        </p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="notice danger">
        Failed to load Google Maps. Check your API key and browser console.
      </div>
    )
  }

  return (
    <div className="map-wrapper" style={{ borderColor: hasError ? 'var(--red)' : undefined }}>
      {!isLoaded && (
        <div style={{ padding: 24, textAlign: 'center', color: 'var(--gray-500)', fontSize: 14 }}>
          Loading map…
        </div>
      )}
      <div
        ref={mapRef}
        style={{ width: '100%', height: 380, display: isLoaded ? 'block' : 'none' }}
      />

      {/* ── Area chips + controls ── */}
      <div className="map-area-info">
        {chips.length > 0 ? (
          <div className="map-areas-col">
            <div className="map-areas-header">
              <span className="map-areas-count">
                {chips.length} outreach area{chips.length !== 1 ? 's' : ''} selected
              </span>
              <button type="button" className="btn-clear" onClick={clearAll}>
                Clear All
              </button>
            </div>
            <div className="map-area-chips">
              {chips.map((area, i) => (
                <div key={i} className="map-area-chip">
                  <span className="map-chip-pin">📍</span>
                  <input
                    className="map-chip-name"
                    value={area.name || ''}
                    onChange={e => renameArea(i, e.target.value)}
                    placeholder={`Area ${i + 1}`}
                    title="Click to name this area"
                  />
                  <span className="map-chip-type">
                    {TYPE_LABEL[area.type] || area.type}
                  </span>
                  <button
                    type="button"
                    className="map-chip-remove"
                    onClick={() => removeArea(i)}
                    disabled={!isLoaded}
                    title={`Remove Area ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <span className="map-required-badge">
            {hasError
              ? '⚠ Required — draw at least one outreach area above'
              : 'Draw shapes on the map to define outreach areas. Multiple areas supported.'}
          </span>
        )}
      </div>
    </div>
  )
}
