'use client'

// shared.tsx — hooks, layout primitives, and demo chrome shared across the v2
// landing page. Ported from the LifeSync design system (landing/shared.jsx).

import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'

// ─── DESIGN TOKENS ────────────────────────────────────────────
// The landing page uses its own dark palette, independent of the MUI theme.
export const T = {
  primary: '#C97C4A',
  primaryLight: '#DBA07A',
  primaryDark: '#A8612E',
  page: '#F8F4EF',
  paper: '#FFFFFF',
  paper2: '#FCFAF7',
  fg1: 'rgba(47,43,61,.92)',
  fg2: 'rgba(47,43,61,.66)',
  fg3: 'rgba(47,43,61,.46)',
  divider: 'rgba(47,43,61,.09)',
  border: 'rgba(47,43,61,.14)',
  dBg: '#25293C',
  dBg2: '#2B2740',
  dPaper: '#2F3349',
  dPaper2: '#373B50',
  dFg1: 'rgba(231,227,252,.92)',
  dFg2: 'rgba(231,227,252,.6)',
  dFg3: 'rgba(231,227,252,.4)',
  dLine: 'rgba(231,227,252,.09)',
  serif: "'Lora', Georgia, serif",
  shadowSm: '0 2px 10px rgba(47,43,61,.07)',
  shadowMd: '0 6px 26px rgba(47,43,61,.10)',
  shadowLg: '0 24px 70px rgba(47,43,61,.18)',
  maxw: 1180
}

// ─── HOOKS ────────────────────────────────────────────────────
type InViewOpts = { threshold?: number; once?: boolean; rootMargin?: string }

// Fires `inView` true when element enters viewport. once:true = latch on.
export function useInView(opts: InViewOpts = {}): [React.RefObject<any>, boolean] {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current

    if (!el) return
    const once = opts.once !== false

    const check = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      const visible = r.top < vh * 0.92 && r.bottom > vh * 0.06

      if (visible) {
        setInView(true)

        if (once) {
          done.current = true
          cleanup()
        }
      } else if (!once) {
        setInView(false)
      }
    }

    const onScroll = () => {
      if (!done.current) check()
    }

    let io: IntersectionObserver | undefined

    try {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setInView(true)

            if (once) {
              done.current = true
              cleanup()
            }
          } else if (!once) {
            setInView(false)
          }
        },
        { threshold: opts.threshold ?? 0.2, rootMargin: opts.rootMargin || '0px 0px -8% 0px' }
      )
      io.observe(el)
    } catch {
      /* no IO */
    }

    function cleanup() {
      if (io) io.disconnect()
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }

    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    check()
    const t1 = setTimeout(check, 120)
    const t2 = setTimeout(check, 500)

    return () => {
      cleanup()
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [ref, inView]
}

// A play "token" that increments the first time the element is seen, and again
// whenever replay() is called.
export function useAutoplay(opts: InViewOpts = {}) {
  const [ref, inView] = useInView({ threshold: opts.threshold ?? 0.4, once: true })
  const [token, setToken] = useState(0)
  const seen = useRef(false)

  useEffect(() => {
    if (inView && !seen.current) {
      seen.current = true
      setToken(t => t + 1)
    }
  }, [inView])

  const replay = useCallback(() => setToken(t => t + 1), [])

  return { ref, token, replay, started: token > 0 }
}

// Count a number up from 0 → target when `run` flips true (and on token change).
export function useCountUp(target: number, run: boolean, { duration = 1400, decimals = 0 } = {}) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!run) return
    let raf: number
    let start: number | undefined

    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min((t - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)

      setVal(target * e)
      if (p < 1) raf = requestAnimationFrame(tick)
      else setVal(target)
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [run, target, duration])

  return decimals ? Number(val.toFixed(decimals)) : Math.round(val)
}

export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)
export const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x))
export const money = (n: number) => '$' + Math.round(n).toLocaleString()

// ─── REVEAL WRAPPER ───────────────────────────────────────────
export function Reveal({
  children,
  delay = 0,
  className = '',
  style
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const [ref, inView] = useInView({ threshold: 0.18 })

  return (
    <div ref={ref} className={`ls-reveal ${inView ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  )
}

// ─── DEMO FRAME ───────────────────────────────────────────────
// The dark "device" panel that every interactive demo lives inside.
export function DemoFrame({
  accent,
  label,
  icon,
  onReplay,
  interacted,
  playing,
  children,
  minHeight = 430
}: {
  accent: string
  label: string
  icon: string
  onReplay: () => void
  interacted: boolean
  playing: boolean
  children: ReactNode
  minHeight?: number
}) {
  return (
    <div
      style={{
        background: 'linear-gradient(168deg, #2B2740 0%, #2F3349 100%)',
        borderRadius: 20,
        boxShadow: `${T.shadowLg}, 0 0 0 1px rgba(255,255,255,.05)`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* chrome */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', borderBottom: `1px solid ${T.dLine}` }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.85 }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginInlineStart: 8 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: `${accent}26`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className={icon} style={{ fontSize: 13, color: accent }} />
          </div>
          <span style={{ fontSize: '.78rem', fontWeight: 700, color: T.dFg1 }}>{label}</span>
        </div>
        <span
          style={{
            marginInlineStart: 'auto',
            fontSize: '.62rem',
            fontWeight: 700,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: T.dFg3
          }}
        >
          LifeSync
        </span>
      </div>
      {/* body */}
      <div style={{ flex: 1, padding: 20, minHeight, position: 'relative' }}>{children}</div>
      {/* control bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderTop: `1px solid ${T.dLine}` }}>
        <button
          onClick={onReplay}
          title='Replay this demo'
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: T.dFg2,
            fontSize: '.74rem',
            fontWeight: 600,
            padding: '6px 11px',
            borderRadius: 8,
            background: 'rgba(255,255,255,.05)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <i className='tabler-refresh' style={{ fontSize: 14 }} /> Replay
        </button>
        <div
          style={{
            marginInlineStart: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            fontSize: '.72rem',
            fontWeight: 600,
            color: interacted ? accent : T.dFg3
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: interacted ? accent : playing ? '#28C840' : 'rgba(231,227,252,.3)',
              animation: playing && !interacted ? 'lsPulseRing 1.6s infinite' : 'none'
            }}
          />
          {interacted ? 'Your turn — try it' : playing ? 'Playing…' : 'Hover to interact'}
        </div>
      </div>
    </div>
  )
}

// ─── SCENE LAYOUT ─────────────────────────────────────────────
// Standard feature section: copy column + demo column, alternating sides.
export type Bullet = { icon?: string; text: string }

export function Scene({
  id,
  accent,
  icon,
  eyebrow,
  title,
  desc,
  bullets = [],
  flip,
  children,
  footnote
}: {
  id: string
  accent: string
  icon: string
  eyebrow: string
  title: ReactNode
  desc: string
  bullets?: Bullet[]
  flip?: boolean
  children: ReactNode
  footnote?: string
}) {
  return (
    <section id={id} className='ls-scene' style={{ padding: '92px 0', position: 'relative' }}>
      <div
        className='container ls-scene-grid'
        style={{
          maxWidth: T.maxw,
          margin: '0 auto',
          padding: '0 32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1.08fr',
          gap: 64,
          alignItems: 'center',
          direction: flip ? 'rtl' : 'ltr'
        }}
      >
        <div style={{ direction: 'ltr' }}>
          <Reveal>
            <div className='ls-eyebrow' style={{ background: `${accent}1a`, color: accent }}>
              <i className={icon} style={{ fontSize: 14 }} /> {eyebrow}
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className='ls-h-section' style={{ margin: '18px 0 16px' }}>
              {title}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className='ls-lead' style={{ maxWidth: 460 }}>
              {desc}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <ul style={{ listStyle: 'none', margin: '26px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 13 }}>
              {bullets.map((b, i) => (
                <li
                  key={i}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 11, fontSize: '.95rem', color: T.fg2, lineHeight: 1.45 }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      background: `${accent}1c`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: 1
                    }}
                  >
                    <i className={b.icon || 'tabler-check'} style={{ fontSize: 13, color: accent }} />
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: b.text }} />
                </li>
              ))}
            </ul>
          </Reveal>
          {footnote && (
            <Reveal delay={0.32}>
              <div
                style={{
                  marginTop: 26,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  fontSize: '.82rem',
                  color: T.fg3,
                  fontStyle: 'italic'
                }}
              >
                <i className='tabler-arrows-exchange' style={{ fontSize: 15, color: accent }} /> {footnote}
              </div>
            </Reveal>
          )}
        </div>
        <Reveal delay={0.12} style={{ direction: 'ltr' }}>
          {children}
        </Reveal>
      </div>
    </section>
  )
}

// section header (centered) for non-scene sections
export function SectionHead({
  accent = T.primary,
  icon,
  eyebrow,
  title,
  sub,
  light
}: {
  accent?: string
  icon?: string
  eyebrow: string
  title: ReactNode
  sub?: ReactNode
  light?: boolean
}) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
      <Reveal>
        <div
          className='ls-eyebrow'
          style={{ background: light ? 'rgba(255,255,255,.1)' : `${accent}1a`, color: light ? T.primaryLight : accent }}
        >
          {icon && <i className={icon} style={{ fontSize: 14 }} />} {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className='ls-h-section' style={{ margin: '18px 0 14px', color: light ? '#F7F3EE' : T.fg1 }}>
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className='ls-lead' style={{ margin: '0 auto', color: light ? 'rgba(247,243,238,.62)' : T.fg2 }}>
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  )
}
