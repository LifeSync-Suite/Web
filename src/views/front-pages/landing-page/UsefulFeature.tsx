'use client'

// React Imports
import { useEffect, useRef } from 'react'

const FEATURES = [
  { icon: 'tabler-link', color: '#C97C4A', bg: 'rgba(201,124,74,.1)', title: 'Everything talks to everything', desc: 'A focus session logs to your task. A completed habit nudges your mood score. Your goal progress updates in real time. No manual syncing.' },
  { icon: 'tabler-lock', color: '#28C76F', bg: 'rgba(40,199,111,.1)', title: 'Your data is yours, always', desc: 'Journal entries are end-to-end encrypted. No ads, no data selling. LifeSync is a tool that works for you — not the other way around.' },
  { icon: 'tabler-brain', color: '#00BAD1', bg: 'rgba(0,186,209,.1)', title: 'Insights that actually help', desc: 'AI surfaces patterns you\'d never notice yourself — like how your mood drops on low-sleep days, or which habits predict your best focus sessions.' },
  { icon: 'tabler-chart-line', color: '#7367F0', bg: 'rgba(115,103,240,.1)', title: 'Dual-progress goal tracking', desc: 'See actual vs. expected pace for every goal, so you always know if you\'re on track — not just how much you\'ve done.' },
  { icon: 'tabler-flame', color: '#FF9F43', bg: 'rgba(255,159,67,.1)', title: 'Habits that actually stick', desc: 'Streak tracking, heatmaps, milestone badges, and psychology-backed reminders designed to make good habits feel natural.' },
  { icon: 'tabler-mood-smile', color: '#C97C4A', bg: 'rgba(201,124,74,.1)', title: 'A safe space for your inner life', desc: 'Log your mood on a 48-emotion axis, write private journal entries, and watch your emotional patterns emerge over time.' }
]

const UsefulFeature = () => {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('ls-revealed') })
    }, { threshold: 0.12 })
    refs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  return (
    <section style={{ padding: '96px 32px', background: '#F8F4EF' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,124,74,.08)', color: '#A8612E', borderRadius: 9999, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: 16 }}>
            <i className='tabler-sparkles' /> Why LifeSync
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'rgba(47,43,61,.92)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Everything connected,{' '}
            <em style={{ fontStyle: 'normal', fontFamily: 'Georgia, serif', color: '#C97C4A', fontWeight: 700 }}>nothing forgotten</em>
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(47,43,61,.58)', lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
            Most apps track one thing. LifeSync understands the whole picture — and helps you make sense of it.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 22 }}>
          {FEATURES.map(({ icon, color, bg, title, desc }, i) => (
            <div
              key={title}
              ref={el => { refs.current[i] = el }}
              className='ls-reveal'
              style={{
                background: '#fff', borderRadius: 16, padding: '28px 26px',
                boxShadow: '0 2px 16px rgba(47,43,61,.07)',
                transition: 'transform 240ms, box-shadow 240ms',
                position: 'relative', overflow: 'hidden',
                transitionDelay: `${i * 0.08}s`
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(47,43,61,.11)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(47,43,61,.07)' }}
            >
              <div style={{ width: 50, height: 50, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18, background: bg, transition: 'transform .25s cubic-bezier(.22,1,.36,1)' }}>
                <i className={icon} style={{ color }} />
              </div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'rgba(47,43,61,.92)', marginBottom: 9 }}>{title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(47,43,61,.58)', lineHeight: 1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ls-fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        .ls-reveal { opacity: 0; transform: translateY(28px); transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1); }
        .ls-reveal.ls-revealed { opacity: 1; transform: translateY(0); }
      `}</style>
    </section>
  )
}

export default UsefulFeature
