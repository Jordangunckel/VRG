import { useState, useEffect, useRef } from 'react'

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = performance.now()
        const tick = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
          setCount(Math.round(target * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return [count, ref]
}

function StatItem({ num, suffix, label }) {
  const [count, ref] = useCountUp(parseInt(num, 10))
  return (
    <div className="stat-item" ref={ref} data-reveal>
      <div className="stat-number">
        {count}<span>{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <div className="stats-grid">
          <StatItem num="500" suffix="+"  label="Jobs Managed Monthly" />
          <StatItem num="48"  suffix="hr" label="Average Turnaround" />
          <StatItem num="97"  suffix="%"  label="Client Retention Rate" />
          <StatItem num="3"   suffix="min" label="Avg Lead Response Time" />
        </div>
      </div>
    </section>
  )
}
