import { useState, useEffect } from 'react'
import SunCalc from 'suncalc'

// Default location: geographic centre of the US (Kansas)
const DEFAULT_LAT = 39.5
const DEFAULT_LNG = -98.35

function isDarkNow(lat, lng) {
  const now   = new Date()
  const times = SunCalc.getTimes(now, lat, lng)
  return now < times.sunrise || now > times.sunset
}

function msUntilNext(lat, lng) {
  const now   = new Date()
  const times = SunCalc.getTimes(now, lat, lng)

  if (now < times.sunrise) return times.sunrise - now
  if (now < times.sunset)  return times.sunset  - now

  // After sunset — next event is tomorrow's sunrise
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowTimes = SunCalc.getTimes(tomorrow, lat, lng)
  return tomorrowTimes.sunrise - now
}

export function useSunMode() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    let timer

    const start = (lat, lng) => {
      const update = () => {
        setDark(isDarkNow(lat, lng))
        // Schedule the next flip at exactly the next sunrise/sunset
        const delay = Math.max(msUntilNext(lat, lng), 1000)
        timer = setTimeout(update, delay)
      }
      update()
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => start(pos.coords.latitude, pos.coords.longitude),
        ()  => start(DEFAULT_LAT, DEFAULT_LNG),
        { timeout: 5000 }
      )
    } else {
      start(DEFAULT_LAT, DEFAULT_LNG)
    }

    return () => clearTimeout(timer)
  }, [])

  return dark
}
