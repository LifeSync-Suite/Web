'use client'

// Sections.tsx — Nav, Hero, Stats, Testimonials, FAQ, CTA, Footer for the v2
// landing page. Ported from landing/sections.jsx.

import { useEffect, useState } from 'react'

import { Reveal, SectionHead, useCountUp, useInView, T } from './shared'

// ─── NAV ──────────────────────────────────────────────────────
export function Nav({ onToggleMotion, reduceMotion }: { onToggleMotion: () => void; reduceMotion: boolean }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 30)

    window.addEventListener('scroll', f)
    f()

    return () => window.removeEventListener('scroll', f)
  }, [])

  const links: [string, string][] = [
    ['How it connects', '#connected'],
    ['Modules', '#goals'],
    ['Money', '#projects'],
    ['Decisions', '#decisions'],
    ['FAQ', '#faq']
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all .3s',
        background: scrolled ? 'rgba(37,41,60,.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        boxShadow: scrolled ? '0 1px 0 rgba(255,255,255,.07)' : 'none'
      }}
    >
      <div style={{ maxWidth: T.maxw, margin: '0 auto', padding: '0 32px', height: 70, display: 'flex', alignItems: 'center', gap: 30 }}>
        <a href='#top' style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: T.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: 17,
              boxShadow: '0 4px 14px rgba(201,124,74,.45)'
            }}
          >
            L
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.06rem', color: '#F7F3EE' }}>
            Life<span style={{ color: T.primaryLight }}>Sync</span>
          </span>
        </a>
        <div className='ls-nav-links' style={{ display: 'flex', gap: 26, marginInlineStart: 14 }}>
          {links.map(([l, h]) => (
            <a
              key={l}
              href={h}
              style={{ fontSize: '.875rem', fontWeight: 500, color: 'rgba(247,243,238,.62)', transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.primaryLight)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(247,243,238,.62)')}
            >
              {l}
            </a>
          ))}
        </div>
        <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onToggleMotion}
            title={reduceMotion ? 'Enable motion' : 'Reduce motion'}
            style={{
              color: 'rgba(247,243,238,.6)',
              display: 'flex',
              alignItems: 'center',
              padding: 7,
              borderRadius: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <i className={reduceMotion ? 'tabler-player-play' : 'tabler-wave-sine'} style={{ fontSize: 17 }} />
          </button>
          <a
            href='/app'
            style={{
              background: T.primary,
              color: '#fff',
              borderRadius: 10,
              padding: '9px 20px',
              fontSize: '.875rem',
              fontWeight: 600,
              boxShadow: '0 3px 12px rgba(201,124,74,.4)',
              transition: 'all .2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = T.primaryDark
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = T.primary
              e.currentTarget.style.transform = 'none'
            }}
          >
            Get early access
          </a>
        </div>
      </div>
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────
function HeroMockup() {
  const net = useCountUp(34837, true, { duration: 1800 })
  const [mood, setMood] = useState(0)
  const moods = ['Focused', 'Calm', 'Energized', 'Content']

  useEffect(() => {
    const t = setInterval(() => setMood(m => (m + 1) % moods.length), 2600)

    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tile = (label: string, value: string, color: string) => (
    <div style={{ flex: 1, background: T.dPaper2, borderRadius: 11, padding: '12px 13px' }}>
      <div style={{ fontSize: '.96rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '.62rem', color: T.dFg3, marginTop: 2 }}>{label}</div>
    </div>
  )

  return (
    <div style={{ position: 'relative', maxWidth: 540, margin: '0 auto', animation: 'lsFloatY 7s ease-in-out infinite' }}>
      {/* floating badges */}
      <div
        style={{
          position: 'absolute',
          top: '14%',
          left: -54,
          zIndex: 3,
          background: '#fff',
          borderRadius: 12,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: '.72rem',
          fontWeight: 700,
          color: T.fg1,
          boxShadow: '0 12px 30px rgba(0,0,0,.3)',
          animation: 'lsBadgePop .6s 1.2s both, lsFloatY 5s ease-in-out 1.8s infinite',
          whiteSpace: 'nowrap'
        }}
      >
        <i className='tabler-circle-check-filled' style={{ color: '#28C76F', fontSize: 16 }} /> Task done → +$112 to Wealth
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: -48,
          zIndex: 3,
          background: '#fff',
          borderRadius: 12,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: '.72rem',
          fontWeight: 700,
          color: T.fg1,
          boxShadow: '0 12px 30px rgba(0,0,0,.3)',
          animation: 'lsBadgePop .6s 1.6s both, lsFloatY 6s ease-in-out 2.2s infinite',
          whiteSpace: 'nowrap'
        }}
      >
        <i className='tabler-flame' style={{ color: '#FF9F43', fontSize: 16 }} /> 19-day streak
      </div>
      <div
        style={{
          position: 'absolute',
          top: '48%',
          right: -36,
          zIndex: 3,
          background: '#6B8F71',
          borderRadius: 12,
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: '.72rem',
          fontWeight: 700,
          color: '#fff',
          boxShadow: '0 12px 30px rgba(0,0,0,.3)',
          animation: 'lsBadgePop .6s 2s both, lsFloatY 7s ease-in-out 2.6s infinite',
          whiteSpace: 'nowrap'
        }}
      >
        <i className='tabler-compass' style={{ fontSize: 16 }} /> Decision: 78/100
      </div>
      {/* window */}
      <div
        style={{
          background: 'linear-gradient(168deg,#2B2740,#2F3349)',
          borderRadius: 18,
          boxShadow: '0 30px 80px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.06)',
          overflow: 'hidden',
          display: 'flex'
        }}
      >
        <div style={{ width: 46, background: '#212434', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', gap: 13 }}>
          {['tabler-layout-dashboard', 'tabler-checklist', 'tabler-flame', 'tabler-report-money', 'tabler-compass', 'tabler-chart-line'].map(
            (ic, i) => (
              <div
                key={ic}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: i === 0 ? 'rgba(201,124,74,.22)' : 'transparent',
                  color: i === 0 ? T.primary : 'rgba(231,227,252,.4)'
                }}
              >
                <i className={ic} style={{ fontSize: 15 }} />
              </div>
            )
          )}
        </div>
        <div style={{ flex: 1, padding: 16 }}>
          <div style={{ fontSize: '.66rem', color: T.dFg2, marginBottom: 10 }}>Good morning, Jordan 👋</div>
          <div style={{ display: 'flex', gap: 9, marginBottom: 9 }}>
            {tile('Tasks today', '8/12', '#7367F0')}
            {tile('Net worth', '$' + net.toLocaleString(), '#C9A96E')}
            {tile('Mood', moods[mood], '#00BAD1')}
          </div>
          <div style={{ background: T.dPaper2, borderRadius: 11, padding: '12px 13px', marginBottom: 9 }}>
            <div style={{ fontSize: '.6rem', color: T.dFg3, marginBottom: 8, fontWeight: 600 }}>Goal · Read 5,000 pages — dual progress</div>
            <div style={{ position: 'relative', height: 7, background: T.dBg, borderRadius: 9999 }}>
              <div style={{ width: '58%', height: '100%', background: '#FF9F43', borderRadius: 9999 }} />
              <div style={{ position: 'absolute', top: -3, left: '65%', width: 2, height: 13, background: 'rgba(231,227,252,.4)' }} />
            </div>
            <div style={{ fontSize: '.58rem', color: T.dFg3, marginTop: 5 }}>Expected 65% · slightly behind</div>
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <div style={{ flex: 2, background: T.dPaper2, borderRadius: 11, padding: '12px 13px' }}>
              <div style={{ fontSize: '.6rem', color: T.dFg3, marginBottom: 8, fontWeight: 600 }}>This month · income vs spend</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 42 }}>
                {[
                  [26, 38],
                  [34, 30],
                  [30, 44],
                  [40, 36]
                ].map(([e, in_], i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'flex-end', height: '100%' }}>
                    <div style={{ flex: 1, height: `${in_}px`, background: '#28C76F', borderRadius: '2px 2px 0 0', opacity: 0.85 }} />
                    <div style={{ flex: 1, height: `${e}px`, background: '#FF4C51', borderRadius: '2px 2px 0 0', opacity: 0.7 }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, background: T.dPaper2, borderRadius: 11, padding: '12px 13px' }}>
              <div style={{ fontSize: '.6rem', color: T.dFg3, fontWeight: 600 }}>Focus today</div>
              <div style={{ fontSize: '.92rem', fontWeight: 800, color: T.primary, marginTop: 3 }}>3h 20m</div>
              <div style={{ display: 'flex', gap: 3, marginTop: 7 }}>
                {[1, 1, 1, 0].map((f, i) => (
                  <div key={i} style={{ width: 9, height: 9, borderRadius: 3, background: f ? T.primary : 'rgba(201,124,74,.25)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <header
      id='top'
      style={{
        position: 'relative',
        background: 'radial-gradient(ellipse 90% 60% at 50% -10%, #34304d 0%, #25293C 60%)',
        padding: '150px 0 110px',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'rgba(201,124,74,.16)',
          filter: 'blur(80px)',
          top: -60,
          left: '8%',
          animation: 'lsFloatY 12s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(107,143,113,.14)',
          filter: 'blur(80px)',
          bottom: -40,
          right: '10%',
          animation: 'lsFloatY 15s ease-in-out 1s infinite'
        }}
      />
      <div
        className='ls-hero-grid'
        style={{
          maxWidth: T.maxw,
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'center'
        }}
      >
        <div>
          <Reveal>
            <div
              className='ls-eyebrow'
              style={{ background: 'rgba(201,124,74,.18)', color: T.primaryLight, border: '1px solid rgba(201,124,74,.25)' }}
            >
              <i className='tabler-sparkles' style={{ fontSize: 14 }} /> Now in early access · 11 connected modules
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className='ls-h-display' style={{ color: '#F7F3EE', margin: '22px 0 20px' }}>
              One life,
              <br />
              <span className='ls-serif-em' style={{ color: T.primaryLight }}>
                beautifully in sync
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className='ls-lead' style={{ color: 'rgba(247,243,238,.66)', maxWidth: 480 }}>
              Tasks, habits, goals, mood, focus, money and the big decisions — all in one place, all aware of each other. Scroll down and
              watch every module come alive.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
              <a
                href='/app'
                style={{
                  background: T.primary,
                  color: '#fff',
                  borderRadius: 12,
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 6px 22px rgba(201,124,74,.45)',
                  transition: 'all .2s'
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
              >
                <i className='tabler-rocket' /> Get early access — free
              </a>
              <a
                href='#connected'
                style={{
                  background: 'transparent',
                  color: '#F7F3EE',
                  border: '1.5px solid rgba(247,243,238,.25)',
                  borderRadius: 12,
                  padding: '13px 24px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <i className='tabler-arrow-down' /> See how it connects
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <div style={{ display: 'flex', gap: 22, marginTop: 38, flexWrap: 'wrap' }}>
              {(
                [
                  ['tabler-lock', 'End-to-end encrypted'],
                  ['tabler-ad-off', 'No ads, ever'],
                  ['tabler-device-mobile', 'iOS & Android soon']
                ] as [string, string][]
              ).map(([ic, t]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '.8rem', color: 'rgba(247,243,238,.55)', fontWeight: 500 }}>
                  <i className={ic} style={{ fontSize: 15, color: T.primaryLight }} /> {t}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.25}>
          <HeroMockup />
        </Reveal>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 26,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          color: 'rgba(247,243,238,.4)',
          fontSize: '.7rem',
          fontWeight: 600,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          animation: 'lsFloatY 2.4s ease-in-out infinite'
        }}
      >
        Scroll <i className='tabler-chevron-down' style={{ fontSize: 18 }} />
      </div>
    </header>
  )
}

// ─── STATS BAND ───────────────────────────────────────────────
function Stat({
  target,
  suffix,
  decimals,
  label,
  short
}: {
  target: number
  suffix?: string
  decimals?: number
  label: string
  short?: boolean
}) {
  const [ref, inView] = useInView({ threshold: 0.5 })
  const v = useCountUp(target, inView, { duration: 1700, decimals })
  let display: string

  if (short && v >= 1000000) display = (v / 1000000).toFixed(1) + 'M'
  else if (short && v >= 1000) display = (v / 1000).toFixed(0) + 'K'
  else display = (decimals ? v : Math.round(v)).toLocaleString()

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div className='ls-tnum' style={{ fontSize: '2.5rem', fontWeight: 800, color: '#F7F3EE', letterSpacing: '-.03em', lineHeight: 1 }}>
        {display}
        <span style={{ color: T.primaryLight }}>{suffix}</span>
      </div>
      <div style={{ fontSize: '.85rem', color: 'rgba(247,243,238,.5)', marginTop: 8, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export function StatsBand() {
  return (
    <div style={{ background: '#2B2740', padding: '60px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(201,124,74,.08), transparent 70%)' }} />
      <div
        className='ls-grid-4'
        style={{
          maxWidth: T.maxw,
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 32
        }}
      >
        <Stat target={11} label='Connected modules' />
        <Stat target={12000} suffix='+' label='Early-access members' />
        <Stat target={2400000} short suffix='+' label='Habits tracked' />
        <Stat target={4.8} decimals={1} suffix='★' label='Average rating' />
      </div>
    </div>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────
const QUOTES = [
  {
    q: "It's the first tool that connects my money to my actual life. Finishing a client task and seeing it hit my net worth is wild.",
    n: 'Sara K.',
    r: 'Freelance designer',
    c: '#C9A96E',
    i: 'SK'
  },
  {
    q: "The Decision Compass talked me through accepting my master's offer. Seeing it scored against my own values was clarifying.",
    n: 'Marcus R.',
    r: 'Software engineer',
    c: '#6B8F71',
    i: 'MR'
  },
  {
    q: 'Mood + habit correlations showed me my energy crashes were tied to skipping my morning run. I had no idea.',
    n: 'Jess L.',
    r: 'Therapist & coach',
    c: '#00BAD1',
    i: 'JL'
  }
]

export function Testimonials() {
  return (
    <section style={{ padding: '92px 0' }}>
      <div style={{ maxWidth: T.maxw, margin: '0 auto', padding: '0 32px' }}>
        <SectionHead
          accent={T.primary}
          icon='tabler-heart'
          eyebrow='Early users'
          title={
            <>
              People are{' '}
              <span className='ls-serif-em' style={{ color: T.primary }}>
                already loving it
              </span>
            </>
          }
        />
        <div className='ls-grid-3' style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 52 }}>
          {QUOTES.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.1}>
              <div style={{ background: T.paper, borderRadius: 16, padding: '26px 24px', boxShadow: T.shadowSm, height: '100%' }}>
                <div style={{ color: '#FF9F43', fontSize: '.8rem', letterSpacing: 2, marginBottom: 14 }}>★★★★★</div>
                <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: '.96rem', color: T.fg1, lineHeight: 1.65, marginBottom: 18 }}>
                  &ldquo;{t.q}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: `${t.c}1f`,
                      color: t.c,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '.75rem',
                      fontWeight: 700
                    }}
                  >
                    {t.i}
                  </div>
                  <div>
                    <div style={{ fontSize: '.82rem', fontWeight: 700, color: T.fg1 }}>{t.n}</div>
                    <div style={{ fontSize: '.75rem', color: T.fg3 }}>{t.r}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────
const FAQS: [string, string][] = [
  [
    'Is LifeSync really free to start?',
    'Yes — early access is completely free, no credit card. We plan to keep a generous free tier forever, with optional premium features for power users later.'
  ],
  [
    'What does "everything connected" actually mean?',
    'A completed focus session logs to your task. A billable task adds earnings to your Wealth ledger. Those earnings flow into Analytics, and your finances and goals feed into the Decision Compass. One action ripples across the whole system — no manual syncing.'
  ],
  [
    'How is my private data protected?',
    "Journal entries and mood logs are end-to-end encrypted before they leave your device. We can't read them. No ads, no data selling, no third-party tracking — ever."
  ],
  [
    'Can LifeSync handle my freelance income?',
    "Yes. Set a rate per project (hourly, fixed-fee, or monthly retainer); completing tasks auto-accrues earnings, tracks what's outstanding, and posts it straight to your Wealth accounts and Analytics."
  ],
  [
    'Is there a mobile app?',
    'iOS and Android are in active development. The web app is fully responsive and works great on mobile browsers in the meantime.'
  ]
]

export function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id='faq' style={{ padding: '92px 0', background: T.paper }}>
      <div style={{ maxWidth: T.maxw, margin: '0 auto', padding: '0 32px' }}>
        <SectionHead
          accent={T.primary}
          icon='tabler-help'
          eyebrow='FAQ'
          title={
            <>
              Good questions,
              <br />
              <span className='ls-serif-em' style={{ color: T.primary }}>
                honest answers
              </span>
            </>
          }
        />
        <div style={{ maxWidth: 740, margin: '48px auto 0' }}>
          {FAQS.map(([q, a], i) => (
            <Reveal key={i} delay={i * 0.05}>
              <div style={{ borderBottom: `1px solid ${T.divider}` }}>
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '20px 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 16,
                    fontSize: '1.02rem',
                    fontWeight: 600,
                    color: T.fg1,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>{q}</span>
                  <i
                    className='tabler-plus'
                    style={{ fontSize: 18, color: T.primary, transition: 'transform .3s', transform: open === i ? 'rotate(45deg)' : 'none', flexShrink: 0 }}
                  />
                </button>
                <div style={{ maxHeight: open === i ? 240 : 0, overflow: 'hidden', transition: 'max-height .4s ease, padding .3s', paddingBottom: open === i ? 20 : 0 }}>
                  <p style={{ fontSize: '.94rem', color: T.fg2, lineHeight: 1.7 }}>{a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────
export function CTA() {
  return (
    <section style={{ position: 'relative', background: 'linear-gradient(135deg,#2B2740,#372E50)', padding: '96px 0', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'rgba(201,124,74,.18)',
          filter: 'blur(70px)',
          top: -70,
          left: '-4%',
          animation: 'lsFloatY 14s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'rgba(107,143,113,.15)',
          filter: 'blur(70px)',
          bottom: -60,
          right: '2%',
          animation: 'lsFloatY 18s ease-in-out 1s infinite'
        }}
      />
      <div style={{ maxWidth: T.maxw, margin: '0 auto', padding: '0 32px', position: 'relative', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Reveal>
            <h2 className='ls-h-section' style={{ color: '#F7F3EE' }}>
              Ready to build the life
              <br />
              <span className='ls-serif-em' style={{ color: T.primaryLight }}>
                you actually want?
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className='ls-lead' style={{ color: 'rgba(247,243,238,.62)', margin: '18px auto 32px' }}>
              Join thousands turning scattered habits, tasks, money and goals into a life that compounds in the right direction.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div
              style={{
                display: 'flex',
                gap: 10,
                maxWidth: 460,
                margin: '0 auto',
                background: 'rgba(255,255,255,.07)',
                border: '1px solid rgba(255,255,255,.12)',
                borderRadius: 13,
                padding: '7px 7px 7px 18px'
              }}
            >
              <input
                type='email'
                placeholder='your@email.com'
                style={{ flex: 1, background: 'none', border: 'none', color: 'rgba(247,243,238,.9)', fontSize: '.94rem' }}
              />
              <button
                style={{
                  background: T.primary,
                  color: '#fff',
                  borderRadius: 9,
                  padding: '11px 22px',
                  fontSize: '.9rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 10px rgba(201,124,74,.4)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Get early access
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div style={{ marginTop: 16, fontSize: '.8rem', color: 'rgba(247,243,238,.35)' }}>
              Free forever · No credit card · Unsubscribe anytime
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────
export function Footer() {
  const cols: [string, string[]][] = [
    ['Modules', ['Tasks & Projects', 'Goals', 'Habits', 'Mood & Journal', 'Focus', 'Wealth', 'Analytics', 'Decision Compass']],
    ['Company', ['About', 'Blog', 'Careers', 'Press']],
    ['Legal', ['Privacy Policy', 'Terms', 'Security', 'Cookies']]
  ]

  return (
    <footer style={{ background: '#1E1B2E', padding: '60px 0 32px', color: 'rgba(247,243,238,.5)' }}>
      <div style={{ maxWidth: T.maxw, margin: '0 auto', padding: '0 32px' }}>
        <div className='ls-grid-4' style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: T.primary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800
                }}
              >
                L
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.02rem', color: 'rgba(247,243,238,.9)' }}>
                Life<span style={{ color: T.primaryLight }}>Sync</span>
              </span>
            </div>
            <p style={{ fontSize: '.86rem', color: 'rgba(247,243,238,.4)', lineHeight: 1.6, marginTop: 12, maxWidth: 240 }}>
              Your personal OS for habits, goals, mood, tasks, money and the decisions that shape your life — all beautifully connected.
            </p>
          </div>
          {cols.map(([h, items]) => (
            <div key={h}>
              <h4 style={{ fontSize: '.78rem', fontWeight: 700, color: 'rgba(247,243,238,.7)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 14 }}>
                {h}
              </h4>
              {items.map(it => (
                <a
                  key={it}
                  href='#'
                  style={{ display: 'block', fontSize: '.86rem', color: 'rgba(247,243,238,.4)', marginBottom: 9, transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.primaryLight)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(247,243,238,.4)')}
                >
                  {it}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,.07)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: '.8rem'
          }}
        >
          <span>© 2026 LifeSync. All rights reserved.</span>
          <span style={{ color: 'rgba(247,243,238,.25)' }}>Made with care for people who care about their lives.</span>
        </div>
      </div>
    </footer>
  )
}
