'use client'

// React Imports
import { useEffect, useRef } from 'react'

const STATS = [
  { target: 12000, suffix: '+', label: 'Early access members', short: true },
  { target: 2400000, suffix: '+', label: 'Habits tracked', short: true },
  { target: 89, suffix: '%', label: 'Streak success rate', short: false },
  { target: 48, suffix: '★', label: 'Average rating', decimal: true }
]

function formatStat(val: number, stat: (typeof STATS)[0]): string {
  if (stat.decimal) return (val / 10).toFixed(1) + stat.suffix
  if (stat.short && val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M' + stat.suffix
  if (stat.short && val >= 1_000) return Math.round(val / 1_000) + 'K' + stat.suffix
  return Math.round(val).toLocaleString() + stat.suffix
}

const ProductStat = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const animate = (el: HTMLDivElement, stat: (typeof STATS)[0]) => {
      const duration = 1800
      const start = performance.now()
      const update = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        el.textContent = formatStat(stat.target * ease, stat)
        if (progress < 1) requestAnimationFrame(update)
      }
      requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !(e.target as HTMLElement).dataset.counted) {
          (e.target as HTMLElement).dataset.counted = 'true'
          const i = refs.current.indexOf(e.target as HTMLDivElement)
          if (i >= 0) animate(e.target as HTMLDivElement, STATS[i])
        }
      })
    }, { threshold: 0.5 })

    refs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ background: '#2B2740', padding: '56px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(201,124,74,.08) 0%, transparent 70%)' }} />
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center', position: 'relative' }}>
        {STATS.map((stat, i) => (
          <div key={stat.label}>
            <div
              ref={el => { refs.current[i] = el }}
              style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F7F3EE', letterSpacing: '-0.03em', lineHeight: 1 }}
            >
              0
            </div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(247,243,238,.45)', marginTop: 7, fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductStat
