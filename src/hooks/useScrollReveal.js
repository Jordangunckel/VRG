import { useEffect } from 'react'

/**
 * Observes all [data-reveal] elements and adds the 'is-visible' class
 * when they enter the viewport. Re-runs whenever `trigger` changes so
 * newly mounted elements (e.g. after page navigation) are picked up.
 */
export function useScrollReveal(trigger, threshold = 0.14) {
  useEffect(() => {
    // Small delay so the DOM has fully rendered before we query
    const raf = requestAnimationFrame(() => {
      const els = document.querySelectorAll('[data-reveal]')
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      }, { threshold })

      els.forEach(el => observer.observe(el))
    })
    return () => cancelAnimationFrame(raf)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])
}
