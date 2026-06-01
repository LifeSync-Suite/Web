'use client'

// Modules.tsx — the eight scroll-driven module demos (Goals, Habits, Focus, Mood,
// Projects, Wealth, Analytics) + the Decision Compass finale.
// Ported from landing/{goals,habits,focus,mood,projects,wealth,analytics,decision}.jsx.

import { useEffect, useMemo, useRef, useState } from 'react'

import { DemoFrame, Reveal, Scene, SectionHead, easeOut, clamp, money, useAutoplay, useCountUp, T } from './shared'

// ════════════════════════ GOALS ════════════════════════
const G_TARGET = 5000
const G_EXPECTED = 3250

function paceFor(actual: number) {
  const r = actual / G_EXPECTED

  if (r >= 1.1) return { label: 'Ahead of pace', tone: '#28C76F', icon: 'tabler-trending-up', note: 'You’re ahead. Nice work.' }
  if (r >= 0.97) return { label: 'On track', tone: '#00BAD1', icon: 'tabler-checks', note: 'Right on plan.' }
  if (r >= 0.75) return { label: 'Slightly behind', tone: '#FF9F43', icon: 'tabler-trending-down', note: 'A bit behind — let’s adjust.' }

  return { label: 'Falling behind', tone: '#FF4C51', icon: 'tabler-alert-triangle', note: 'Well behind pace — time to refocus.' }
}

export function GoalsSection() {
  const { ref, token, replay, started } = useAutoplay()
  const [actual, setActual] = useState(0)
  const [interacted, setInteracted] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!started) return
    setPlaying(true)
    setInteracted(false)
    let raf: number
    let start: number | undefined
    const dur = 1500

    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min((t - start) / dur, 1)

      setActual(Math.round(easeOut(p) * 2900))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setPlaying(false)
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, token])

  const pct = (actual / G_TARGET) * 100
  const expPct = (G_EXPECTED / G_TARGET) * 100
  const pace = paceFor(actual)
  const touch = (v: number) => {
    setActual(v)
    setInteracted(true)
    setPlaying(false)
  }

  return (
    <Scene
      id='goals'
      accent='#FF9F43'
      icon='tabler-target'
      eyebrow='Goal Tracking'
      title={
        <>
          Always know if you’re{' '}
          <span className='ls-serif-em' style={{ color: '#FF9F43' }}>
            on pace
          </span>
        </>
      }
      desc="Our Dual-Progress System shows actual progress against where you should be by now — not just how much you've done. Course-correct before it's too late."
      bullets={[
        { icon: 'tabler-arrows-diff', text: '<b>Actual vs. expected</b> pace marker on every goal' },
        { icon: 'tabler-link', text: 'Linked habits &amp; tasks feed progress automatically' },
        { icon: 'tabler-adjustments', text: 'Annual, quarterly or custom timeframes' }
      ]}
      footnote='Your daily reading habit logs 30 pages straight into this goal.'
    >
      <div ref={ref}>
        <DemoFrame
          accent='#FF9F43'
          label='Goals · Dual progress'
          icon='tabler-target'
          onReplay={() => {
            setActual(0)
            replay()
          }}
          interacted={interacted}
          playing={playing}
          minHeight={440}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 22 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(255,159,67,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-book' style={{ fontSize: 21, color: '#FF9F43' }} />
              </div>
              <div>
                <div style={{ fontSize: '.95rem', fontWeight: 700, color: T.dFg1 }}>Read 5,000 pages this year</div>
                <div style={{ fontSize: '.72rem', color: T.dFg3 }}>Day 141 of 365 · 30 pages/day plan</div>
              </div>
              <div style={{ marginInlineStart: 'auto', textAlign: 'end' }}>
                <div className='ls-tnum' style={{ fontSize: '1.7rem', fontWeight: 800, color: '#FF9F43', lineHeight: 1 }}>
                  {Math.round(pct)}%
                </div>
              </div>
            </div>

            <div style={{ position: 'relative', height: 16, background: T.dBg, borderRadius: 9999, marginBottom: 8 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg,#FFB066,#FF9F43)', borderRadius: 9999, transition: playing ? 'none' : 'width .35s ease' }} />
              <div style={{ position: 'absolute', top: -6, left: `${expPct}%`, transform: 'translateX(-50%)', width: 3, height: 28, background: T.dFg2, borderRadius: 2 }} />
              <div style={{ position: 'absolute', top: -26, left: `${expPct}%`, transform: 'translateX(-50%)', fontSize: '.62rem', fontWeight: 700, color: T.dFg2, whiteSpace: 'nowrap' }}>
                expected
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.74rem', color: T.dFg3, marginBottom: 18 }}>
              <span className='ls-tnum' style={{ color: T.dFg1, fontWeight: 600 }}>
                {actual.toLocaleString()} / {G_TARGET.toLocaleString()} pages
              </span>
              <span>should be {G_EXPECTED.toLocaleString()} by now</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', borderRadius: 12, background: `${pace.tone}1a`, border: `1px solid ${pace.tone}40`, marginBottom: 'auto' }}>
              <i className={pace.icon} style={{ fontSize: 20, color: pace.tone }} />
              <div>
                <div style={{ fontSize: '.84rem', fontWeight: 700, color: pace.tone }}>{pace.label}</div>
                <div style={{ fontSize: '.72rem', color: T.dFg2 }}>{pace.note}</div>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: T.dFg3, marginBottom: 9 }}>Log your progress</div>
              <input type='range' min='0' max='5000' step='10' value={actual} onChange={e => touch(+e.target.value)} style={{ width: '100%', accentColor: '#FF9F43', cursor: 'pointer' }} />
              <button
                onClick={() => touch(Math.min(5000, actual + 30))}
                style={{
                  marginTop: 12,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  padding: '10px',
                  borderRadius: 10,
                  background: 'rgba(40,199,111,.16)',
                  color: '#28C76F',
                  fontSize: '.8rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <i className='tabler-flame' style={{ fontSize: 15 }} /> +30 pages · today’s reading habit
              </button>
            </div>
          </div>
        </DemoFrame>
      </div>
    </Scene>
  )
}

// ════════════════════════ HABITS ════════════════════════
const H_DAYS = 35
const H_BASE = Array.from({ length: H_DAYS }, (_, i) => {
  if (i >= 16 && i <= 33) return true

  return [2, 3, 5, 8, 9, 11, 13].includes(i)
})

function trailingStreak(cells: boolean[]) {
  let s = 0

  for (let i = cells.length - 1; i >= 0; i--) {
    if (cells[i]) s++
    else break
  }

  return s
}

export function HabitsSection() {
  const { ref, token, replay, started } = useAutoplay()
  const [show, setShow] = useState(false)
  const [todayDone, setTodayDone] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const streakBase = useCountUp(18, show, { duration: 1300 })

  useEffect(() => {
    if (!started) return
    setShow(false)
    setTodayDone(false)
    setInteracted(false)
    const t = setTimeout(() => setShow(true), 60)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, token])

  const cells = H_BASE.map((v, i) => (i === H_DAYS - 1 ? todayDone : v))
  const streak = todayDone ? trailingStreak(cells) : streakBase
  const mark = () => {
    setTodayDone(d => !d)
    setInteracted(true)
  }

  const sub: [string, number, string, string][] = [
    ['Meditation', 12, '#00BAD1', 'tabler-yin-yang'],
    ['5km Run', 8, '#7367F0', 'tabler-run']
  ]

  return (
    <Scene
      id='habits'
      accent='#28C76F'
      icon='tabler-flame'
      eyebrow='Habit Builder'
      flip
      title={
        <>
          Build streaks that{' '}
          <span className='ls-serif-em' style={{ color: '#28C76F' }}>
            actually stick
          </span>
        </>
      }
      desc='Daily streaks, heatmap calendars and gentle, psychology-backed nudges turn good intentions into routines that compound — and feed your goals automatically.'
      bullets={[
        { icon: 'tabler-calendar-heart', text: 'Heatmap calendar &amp; consecutive-day streaks' },
        { icon: 'tabler-award', text: 'Milestone badges and tasteful gamification' },
        { icon: 'tabler-bell-ringing', text: 'Habit stacking + smart reminders' }
      ]}
      footnote='Completing this habit logs 30 pages toward your reading goal.'
    >
      <div ref={ref}>
        <DemoFrame
          accent='#28C76F'
          label='Habits · Daily reading'
          icon='tabler-flame'
          onReplay={() => replay()}
          interacted={interacted}
          playing={show && streakBase < 18 && !todayDone}
          minHeight={440}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(201,124,74,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='tabler-book-2' style={{ fontSize: 21, color: '#C97C4A' }} />
              </div>
              <div>
                <div style={{ fontSize: '.95rem', fontWeight: 700, color: T.dFg1 }}>Daily reading (30 min)</div>
                <div style={{ fontSize: '.72rem', color: T.dFg3 }}>Last 5 weeks</div>
              </div>
              <div
                key={streak}
                style={{
                  marginInlineStart: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,159,67,.16)',
                  color: '#FF9F43',
                  padding: '6px 12px',
                  borderRadius: 9999,
                  fontWeight: 800,
                  fontSize: '.92rem',
                  animation: 'lsBadgePop .4s'
                }}
              >
                <i className='tabler-flame' style={{ fontSize: 17 }} /> {streak}-day streak
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 7, marginBottom: 18 }}>
              {cells.map((v, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1',
                    borderRadius: 6,
                    background: v ? `rgba(40,199,111,${0.4 + (i / H_DAYS) * 0.6})` : 'rgba(255,255,255,.06)',
                    border: i === H_DAYS - 1 ? `1.5px solid ${todayDone ? '#28C76F' : 'rgba(255,159,67,.7)'}` : '1px solid transparent',
                    transform: show ? 'scale(1)' : 'scale(.2)',
                    opacity: show ? 1 : 0,
                    transition: `transform .4s cubic-bezier(.34,1.56,.64,1) ${i * 16}ms, opacity .3s ${i * 16}ms, background .3s`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {i === H_DAYS - 1 && todayDone && <i className='tabler-check' style={{ fontSize: 12, color: '#fff' }} />}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 'auto' }}>
              {sub.map(([n, d, c, ic]) => (
                <div key={n} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, background: T.dPaper2, borderRadius: 10, padding: '9px 11px' }}>
                  <i className={ic} style={{ fontSize: 17, color: c }} />
                  <div>
                    <div style={{ fontSize: '.76rem', fontWeight: 600, color: T.dFg1 }}>{n}</div>
                    <div style={{ fontSize: '.66rem', color: '#FF9F43', fontWeight: 700 }}>🔥 {d}d</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={mark}
              style={{
                marginTop: 18,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px',
                borderRadius: 11,
                fontSize: '.84rem',
                fontWeight: 700,
                background: todayDone ? 'rgba(40,199,111,.16)' : '#28C76F',
                color: todayDone ? '#28C76F' : '#fff',
                boxShadow: todayDone ? 'none' : '0 4px 16px rgba(40,199,111,.4)',
                animation: !todayDone && show ? 'lsPulseRing 2s infinite' : 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <i className={todayDone ? 'tabler-circle-check-filled' : 'tabler-plus'} style={{ fontSize: 16 }} />
              {todayDone ? 'Done today · +30 pages logged to your goal' : 'Mark today done'}
            </button>
          </div>
        </DemoFrame>
      </div>
    </Scene>
  )
}

// ════════════════════════ FOCUS ════════════════════════
const F_TEMPLATES = [
  { id: 'deep', label: 'Deep Work', focus: 50, color: '#C97C4A', icon: 'tabler-brain' },
  { id: 'study', label: 'Study', focus: 25, color: '#7367F0', icon: 'tabler-book' },
  { id: 'light', label: 'Light', focus: 15, color: '#28C76F', icon: 'tabler-leaf' }
]
const F_SOUNDS: [string, string, string][] = [
  ['rain', 'Rain', 'tabler-cloud-rain'],
  ['forest', 'Forest', 'tabler-trees'],
  ['cafe', 'Café', 'tabler-coffee'],
  ['white', 'White', 'tabler-wave-sine'],
  ['none', 'Silence', 'tabler-volume-off']
]
const F_PLAY_MS = 11000

export function FocusSection() {
  const { ref, token, replay, started } = useAutoplay()
  const [tplId, setTplId] = useState('deep')
  const [p, setP] = useState(0)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [sound, setSound] = useState('rain')
  const [interacted, setInteracted] = useState(false)
  const [done, setDone] = useState(false)
  const tpl = F_TEMPLATES.find(t => t.id === tplId)!

  useEffect(() => {
    if (!started) return
    setTplId('deep')
    setP(0)
    setSessions(0)
    setDone(false)
    setInteracted(false)
    const t = setTimeout(() => setRunning(true), 400)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, token])

  useEffect(() => {
    if (!running) return
    let raf: number
    let last: number | undefined

    const loop = (t: number) => {
      if (last != null) setP(prev => Math.min(prev + (t - last!) / F_PLAY_MS, 1))
      last = t
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(raf)
  }, [running])

  useEffect(() => {
    if (p >= 1 && running) {
      setRunning(false)
      setSessions(s => s + 1)
      setDone(true)
    }
  }, [p, running])

  const total = tpl.focus * 60
  const remain = Math.round(total * (1 - p))
  const mm = String(Math.floor(remain / 60)).padStart(2, '0')
  const ss = String(remain % 60).padStart(2, '0')
  const R = 78
  const C = 2 * Math.PI * R
  const selTpl = (t: (typeof F_TEMPLATES)[number]) => {
    setTplId(t.id)
    setP(0)
    setRunning(false)
    setDone(false)
    setInteracted(true)
  }
  const toggle = () => {
    if (p >= 1) {
      setP(0)
      setDone(false)
    }

    setRunning(r => !r)
    setInteracted(true)
  }

  return (
    <Scene
      id='focus'
      accent='#C97C4A'
      icon='tabler-clock-play'
      eyebrow='Focus Timer'
      title={
        <>
          Deep work,{' '}
          <span className='ls-serif-em' style={{ color: '#C97C4A' }}>
            beautifully timed
          </span>
        </>
      }
      desc='A Pomodoro suite with custom templates and ambient soundscapes. Every session auto-logs its minutes to the task you were working on.'
      bullets={[
        { icon: 'tabler-template', text: 'Deep Work, Study &amp; Light presets — or your own' },
        { icon: 'tabler-music', text: 'Rain, forest, café &amp; white-noise soundscapes' },
        { icon: 'tabler-clock-check', text: 'Sessions auto-log to the linked task' }
      ]}
      footnote='25 minutes here posts straight to today’s task and focus total.'
    >
      <div ref={ref}>
        <DemoFrame
          accent='#C97C4A'
          label='Focus · Pomodoro'
          icon='tabler-clock-play'
          onReplay={() => {
            setRunning(false)
            replay()
          }}
          interacted={interacted}
          playing={running}
          minHeight={440}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', gap: 6, background: T.dBg, borderRadius: 10, padding: 4, marginBottom: 18 }}>
              {F_TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => selTpl(t)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 13px',
                    borderRadius: 7,
                    fontSize: '.76rem',
                    fontWeight: 700,
                    background: tplId === t.id ? t.color : 'transparent',
                    color: tplId === t.id ? '#fff' : T.dFg3,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <i className={t.icon} style={{ fontSize: 14 }} /> {t.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: 184, height: 184, marginBottom: 6 }}>
              <svg width='184' height='184' style={{ transform: 'rotate(-90deg)' }}>
                <circle cx='92' cy='92' r={R} fill='none' stroke={T.dBg} strokeWidth='11' />
                <circle cx='92' cy='92' r={R} fill='none' stroke={tpl.color} strokeWidth='11' strokeLinecap='round' strokeDasharray={C} strokeDashoffset={C * (1 - p)} style={{ transition: running ? 'none' : 'stroke-dashoffset .3s' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className='ls-tnum' style={{ fontSize: '2.4rem', fontWeight: 800, color: T.dFg1, lineHeight: 1 }}>
                  {mm}:{ss}
                </div>
                <div style={{ fontSize: '.68rem', color: T.dFg3, marginTop: 4 }}>{done ? 'Session complete ✓' : `Session ${sessions + 1}`}</div>
              </div>
            </div>

            <div style={{ fontSize: '.72rem', color: T.dFg2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className='tabler-link' style={{ fontSize: 13, color: tpl.color }} /> Logging to <b style={{ color: T.dFg1 }}>Design system tokens</b>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
              <button
                onClick={toggle}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 26px',
                  borderRadius: 11,
                  background: tpl.color,
                  color: '#fff',
                  fontSize: '.86rem',
                  fontWeight: 700,
                  boxShadow: `0 4px 16px ${tpl.color}66`,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <i className={running ? 'tabler-player-pause-filled' : 'tabler-player-play-filled'} style={{ fontSize: 15 }} /> {running ? 'Pause' : p > 0 && p < 1 ? 'Resume' : 'Start'}
              </button>
              <button
                onClick={() => {
                  setP(0)
                  setRunning(false)
                  setDone(false)
                  setInteracted(true)
                }}
                style={{ display: 'flex', alignItems: 'center', padding: '11px 16px', borderRadius: 11, background: 'rgba(255,255,255,.06)', color: T.dFg2, border: 'none', cursor: 'pointer' }}
              >
                <i className='tabler-rotate-2' style={{ fontSize: 16 }} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: 7, marginTop: 'auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              {F_SOUNDS.map(([id, l, ic]) => (
                <button
                  key={id}
                  onClick={() => {
                    setSound(id)
                    setInteracted(true)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 11px',
                    borderRadius: 9999,
                    fontSize: '.72rem',
                    fontWeight: 600,
                    background: sound === id ? 'rgba(201,124,74,.18)' : 'rgba(255,255,255,.05)',
                    color: sound === id ? '#DBA07A' : T.dFg3,
                    border: `1px solid ${sound === id ? 'rgba(201,124,74,.4)' : 'transparent'}`,
                    cursor: 'pointer'
                  }}
                >
                  <i className={ic} style={{ fontSize: 13 }} /> {l}
                </button>
              ))}
            </div>
          </div>
        </DemoFrame>
      </div>
    </Scene>
  )
}

// ════════════════════════ MOOD ════════════════════════
const EMOTIONS = [
  { n: 'Excited', v: 0.55, e: 0.82, c: '#FF9F43' },
  { n: 'Energized', v: 0.3, e: 0.95, c: '#28C76F' },
  { n: 'Happy', v: 0.82, e: 0.4, c: '#FFC24B' },
  { n: 'Focused', v: 0.28, e: 0.5, c: '#00BAD1' },
  { n: 'Content', v: 0.7, e: -0.05, c: '#28C76F' },
  { n: 'Calm', v: 0.55, e: -0.55, c: '#00BAD1' },
  { n: 'Relaxed', v: 0.45, e: -0.85, c: '#6B8F71' },
  { n: 'Tired', v: -0.2, e: -0.78, c: '#808390' },
  { n: 'Bored', v: -0.5, e: -0.4, c: '#808390' },
  { n: 'Sad', v: -0.8, e: -0.3, c: '#7367F0' },
  { n: 'Anxious', v: -0.55, e: 0.55, c: '#FF4C51' },
  { n: 'Stressed', v: -0.45, e: 0.85, c: '#FF4C51' },
  { n: 'Angry', v: -0.85, e: 0.65, c: '#FF4C51' },
  { n: 'Neutral', v: 0, e: 0, c: '#C9A96E' }
]

function nearest(v: number, e: number) {
  let best = EMOTIONS[0]
  let bd = Infinity

  for (const m of EMOTIONS) {
    const d = (m.v - v) ** 2 + (m.e - e) ** 2

    if (d < bd) {
      bd = d
      best = m
    }
  }

  return best
}

export function MoodSection() {
  const { ref, token, replay, started } = useAutoplay()
  const plane = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ v: 0, e: 0 })
  const [interacted, setInteracted] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!started) return
    setPlaying(true)
    setInteracted(false)
    let raf: number
    let start: number | undefined
    const from = { v: -0.15, e: -0.25 }
    const to = { v: 0.28, e: 0.5 }

    const tick = (t: number) => {
      if (!start) start = t
      const p = easeOut(Math.min((t - start) / 1500, 1))

      setPos({ v: from.v + (to.v - from.v) * p, e: from.e + (to.e - from.e) * p })
      if (p < 1) raf = requestAnimationFrame(tick)
      else setPlaying(false)
    }

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, token])

  const place = (cx: number, cy: number) => {
    const r = plane.current!.getBoundingClientRect()

    setPos({ v: clamp(((cx - r.left) / r.width) * 2 - 1, -1, 1), e: clamp(1 - ((cy - r.top) / r.height) * 2, -1, 1) })
  }

  const onPointer = (ev: React.PointerEvent) => {
    if (ev.type === 'pointermove' && ev.buttons !== 1) return
    setInteracted(true)
    setPlaying(false)
    place(ev.clientX, ev.clientY)
  }

  const em = nearest(pos.v, pos.e)
  const px = ((pos.v + 1) / 2) * 100
  const py = ((1 - pos.e) / 2) * 100

  return (
    <Scene
      id='mood'
      accent='#00BAD1'
      icon='tabler-mood-smile'
      eyebrow='Mood & Journal'
      flip
      title={
        <>
          Name how you feel,{' '}
          <span className='ls-serif-em' style={{ color: '#00BAD1' }}>
            find the why
          </span>
        </>
      }
      desc='Log mood on an energy × pleasantness plane, add an encrypted journal entry, and LifeSync surfaces the patterns — like which habits lift your energy and which drain it.'
      bullets={[
        { icon: 'tabler-grid-dots', text: 'Two-axis emotion plane — far richer than 1–5' },
        { icon: 'tabler-lock', text: 'End-to-end encrypted journaling' },
        { icon: 'tabler-chart-dots', text: 'Correlates mood with habits, focus &amp; sleep' }
      ]}
      footnote="Today's mood becomes a signal in your Decision Compass."
    >
      <div ref={ref}>
        <DemoFrame
          accent='#00BAD1'
          label='Mood · Check-in'
          icon='tabler-mood-smile'
          onReplay={() => {
            setPos({ v: 0, e: 0 })
            replay()
          }}
          interacted={interacted}
          playing={playing}
          minHeight={440}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 16, height: '100%' }}>
            <div>
              <div
                ref={plane}
                onPointerDown={onPointer}
                onPointerMove={onPointer}
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 14,
                  cursor: 'crosshair',
                  touchAction: 'none',
                  overflow: 'hidden',
                  background:
                    'radial-gradient(circle at 78% 22%, rgba(255,159,67,.32), transparent 55%), radial-gradient(circle at 80% 80%, rgba(40,199,111,.3), transparent 55%), radial-gradient(circle at 20% 80%, rgba(115,103,240,.28), transparent 55%), radial-gradient(circle at 22% 22%, rgba(255,76,81,.3), transparent 55%), ' +
                    T.dBg
                }}
              >
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,.12)' }} />
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,.12)' }} />
                {['Energy +', 'Pleasant +', 'Energy −', 'Pleasant −'].map((l, i) => (
                  <span
                    key={l}
                    style={{
                      position: 'absolute',
                      fontSize: '.58rem',
                      fontWeight: 700,
                      color: T.dFg3,
                      textTransform: 'uppercase',
                      letterSpacing: '.05em',
                      ...(i === 0
                        ? { top: 6, left: '50%', transform: 'translateX(-50%)' }
                        : i === 1
                          ? { right: 6, top: '50%', transform: 'translateY(-50%)' }
                          : i === 2
                            ? { bottom: 6, left: '50%', transform: 'translateX(-50%)' }
                            : { left: 6, top: '50%', transform: 'translateY(-50%)' })
                    }}
                  >
                    {l}
                  </span>
                ))}
                <div style={{ position: 'absolute', left: `${px}%`, top: `${py}%`, transform: 'translate(-50%,-50%)', transition: playing ? 'none' : 'all .15s' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: em.c, border: '3px solid #fff', boxShadow: `0 0 0 6px ${em.c}40, 0 6px 16px ${em.c}88` }} />
                </div>
              </div>
              <div style={{ marginTop: 12, textAlign: 'center' }}>
                <div style={{ fontSize: '.66rem', color: T.dFg3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>You’re feeling</div>
                <div key={em.n} style={{ fontSize: '1.5rem', fontWeight: 800, color: em.c, animation: 'lsBadgePop .35s' }}>
                  {em.n}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: T.dPaper2, borderRadius: 12, padding: '12px 13px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: T.dFg3, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <i className='tabler-lock' style={{ fontSize: 12 }} /> Encrypted journal
                </div>
                <div style={{ fontSize: '.78rem', color: T.dFg2, lineHeight: 1.5, fontStyle: 'italic', flex: 1 }}>
                  &ldquo;Morning run cleared my head — went into the design sprint feeling {em.n.toLowerCase()} and ready.&rdquo;
                </div>
              </div>
              <div style={{ background: T.dPaper2, borderRadius: 12, padding: '12px 13px' }}>
                <div style={{ fontSize: '.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: T.dFg3, marginBottom: 9 }}>Factors today</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(
                    [
                      ['tabler-run', 'Exercise'],
                      ['tabler-moon', 'Slept 7h'],
                      ['tabler-coffee', 'Caffeine'],
                      ['tabler-users', 'Social']
                    ] as [string, string][]
                  ).map(([ic, l]) => (
                    <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 9px', borderRadius: 9999, background: 'rgba(0,186,209,.14)', color: '#22C7DB', fontSize: '.68rem', fontWeight: 600 }}>
                      <i className={ic} style={{ fontSize: 12 }} /> {l}
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 11, background: 'rgba(40,199,111,.12)', border: '1px solid rgba(40,199,111,.28)' }}>
                <i className='tabler-bulb' style={{ fontSize: 16, color: '#28C76F' }} />
                <span style={{ fontSize: '.7rem', color: T.dFg2, lineHeight: 1.35 }}>
                  Insight: energy is <b style={{ color: '#28C76F' }}>+38%</b> on days you run before noon.
                </span>
              </div>
            </div>
          </div>
        </DemoFrame>
      </div>
    </Scene>
  )
}

// ════════════════════════ PROJECTS ════════════════════════
const PJ_RATE = 75
const PJ_TASKS = [
  { id: 1, title: 'Chapter 3 outline', hours: 1.5, done: true },
  { id: 2, title: 'Chapter 3 first draft', hours: 4.0, done: true },
  { id: 3, title: 'Chapter 3 revision pass', hours: 2.0, done: true },
  { id: 4, title: 'Landing page copy', hours: 1.0, done: false },
  { id: 5, title: 'Chapter 4 outline', hours: 2.5, done: false }
]

export function ProjectsSection() {
  const { ref, token, replay, started } = useAutoplay()
  const [tasks, setTasks] = useState(PJ_TASKS)
  const [interacted, setInteracted] = useState(false)
  const [flash, setFlash] = useState<{ id: number; amt: number } | null>(null)
  const [playing, setPlaying] = useState(false)

  const reset = () => setTasks(PJ_TASKS.map(t => ({ ...t })))

  function toggle(id: number, auto?: boolean) {
    if (!auto) {
      setInteracted(true)
      setPlaying(false)
    }

    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t
        const nowDone = !t.done

        if (nowDone) {
          setFlash({ id, amt: t.hours * PJ_RATE })
          setTimeout(() => setFlash(f => (f && f.id === id ? null : f)), 1400)
        }

        return { ...t, done: nowDone }
      })
    )
  }

  useEffect(() => {
    if (!started) return
    reset()
    setInteracted(false)
    setPlaying(true)
    const t1 = setTimeout(() => toggle(4, true), 900)
    const t2 = setTimeout(() => setPlaying(false), 2200)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, token])

  const earned = tasks.filter(t => t.done).reduce((s, t) => s + t.hours * PJ_RATE, 0)
  const hours = tasks.filter(t => t.done).reduce((s, t) => s + t.hours, 0)
  const received = 1200
  const outstanding = earned - received

  return (
    <Scene
      id='projects'
      accent='#C9A96E'
      icon='tabler-briefcase'
      eyebrow='Projects & Billing'
      title={
        <>
          Your work,{' '}
          <span className='ls-serif-em' style={{ color: '#C9A96E' }}>
            finally paid attention to
          </span>
        </>
      }
      desc="Set a rate per project — hourly, fixed-fee, or monthly retainer. Completed tasks auto-accrue earnings, track what's outstanding, and post straight to your Wealth ledger."
      bullets={[
        { icon: 'tabler-clock-dollar', text: 'Hourly, project-based &amp; monthly retainer billing' },
        { icon: 'tabler-checklist', text: 'Completing a task instantly accrues its earnings' },
        { icon: 'tabler-arrow-right-bar', text: 'Earnings sync straight to Wealth &amp; Analytics' }
      ]}
      footnote='Tick a task — watch the money flow into your accounts.'
    >
      <div ref={ref}>
        <DemoFrame
          accent='#C9A96E'
          label='Projects · "Quiet Systems" book'
          icon='tabler-briefcase'
          onReplay={() => {
            reset()
            replay()
          }}
          interacted={interacted}
          playing={playing}
          minHeight={440}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {(
                [
                  ['Earned', money(earned), '#C9A96E', `${hours}h @ $${PJ_RATE}/hr`],
                  ['Received', money(received), '#28C76F', 'Apr payout'],
                  ['Outstanding', money(outstanding), '#FF9F43', 'unpaid']
                ] as [string, string, string, string][]
              ).map(([l, v, c, sub]) => (
                <div key={l} style={{ flex: 1, background: T.dPaper2, borderRadius: 11, padding: '11px 12px' }}>
                  <div style={{ fontSize: '.62rem', color: T.dFg3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</div>
                  <div className='ls-tnum' style={{ fontSize: '1.25rem', fontWeight: 800, color: c, marginTop: 3 }}>
                    {v}
                  </div>
                  <div style={{ fontSize: '.6rem', color: T.dFg3, marginTop: 1 }}>{sub}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: T.dFg3, marginBottom: 9 }}>Tasks · tick to bill</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 'auto' }}>
              {tasks.map(t => {
                const amt = t.hours * PJ_RATE

                return (
                  <button
                    key={t.id}
                    onClick={() => toggle(t.id)}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 11,
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: t.done ? 'rgba(201,169,110,.12)' : T.dPaper2,
                      border: `1px solid ${t.done ? 'rgba(201,169,110,.32)' : 'transparent'}`,
                      textAlign: 'left',
                      transition: 'all .2s',
                      cursor: 'pointer'
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: t.done ? '#C9A96E' : 'transparent',
                        border: `2px solid ${t.done ? '#C9A96E' : T.dFg3}`,
                        transition: 'all .2s'
                      }}
                    >
                      {t.done && <i className='tabler-check' style={{ fontSize: 13, color: '#fff' }} />}
                    </span>
                    <span style={{ flex: 1, fontSize: '.82rem', fontWeight: 600, color: t.done ? T.dFg2 : T.dFg1, textDecoration: t.done ? 'line-through' : 'none', textDecorationColor: 'rgba(231,227,252,.35)' }}>{t.title}</span>
                    <span style={{ fontSize: '.72rem', fontWeight: 700, color: t.done ? '#C9A96E' : T.dFg3 }}>{money(amt)}</span>
                    {flash && flash.id === t.id && (
                      <span style={{ position: 'absolute', right: 10, top: -14, background: '#28C76F', color: '#fff', fontSize: '.68rem', fontWeight: 800, padding: '3px 9px', borderRadius: 9999, boxShadow: '0 4px 12px rgba(40,199,111,.5)', animation: 'lsBadgePop .4s', whiteSpace: 'nowrap' }}>
                        +{money(flash.amt)} → Wealth
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', borderRadius: 11, background: 'rgba(40,199,111,.1)', border: '1px solid rgba(40,199,111,.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className='tabler-briefcase' style={{ fontSize: 15, color: '#C9A96E' }} />
                <i className='tabler-arrow-right' style={{ fontSize: 13, color: T.dFg3 }} />
                <i className='tabler-report-money' style={{ fontSize: 15, color: '#C9A96E' }} />
                <i className='tabler-arrow-right' style={{ fontSize: 13, color: T.dFg3 }} />
                <i className='tabler-chart-line' style={{ fontSize: 15, color: '#C9A96E' }} />
              </div>
              <span style={{ fontSize: '.74rem', color: T.dFg2 }}>
                Earnings live-sync to <b style={{ color: T.dFg1 }}>Wealth</b> & <b style={{ color: T.dFg1 }}>Analytics</b>
              </span>
            </div>
          </div>
        </DemoFrame>
      </div>
    </Scene>
  )
}

// ════════════════════════ WEALTH ════════════════════════
const W_BUDGETS = [
  { cat: 'Groceries', budgeted: 500, spent: 312, color: '#28C76F', icon: 'tabler-shopping-cart' },
  { cat: 'Dining', budgeted: 300, spent: 268, color: '#FF9F43', icon: 'tabler-tools-kitchen-2' },
  { cat: 'Transport', budgeted: 200, spent: 96, color: '#7367F0', icon: 'tabler-car' },
  { cat: 'Shopping', budgeted: 200, spent: 187, color: '#C9A96E', icon: 'tabler-tag' }
]
const W_GOALS = [
  { name: 'Emergency Fund', target: 10000, saved: 8200, color: '#28C76F', icon: 'tabler-shield-check' },
  { name: 'Vacation — Japan', target: 3500, saved: 1340, color: '#C97C4A', icon: 'tabler-plane' }
]

export function WealthSection() {
  const { ref, token, replay, started } = useAutoplay()
  const [run, setRun] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const [tab, setTab] = useState('budgets')
  const score = useCountUp(82, run, { duration: 1500 })
  const net = useCountUp(34837, run, { duration: 1600 })

  useEffect(() => {
    if (!started) return
    setRun(false)
    setInteracted(false)
    setTab('budgets')
    const t = setTimeout(() => setRun(true), 60)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, token])

  const R = 52
  const C = 2 * Math.PI * R
  const scoreColor = score >= 75 ? '#28C76F' : score >= 50 ? '#FF9F43' : '#FF4C51'

  return (
    <Scene
      id='wealth'
      accent='#C9A96E'
      icon='tabler-report-money'
      eyebrow='Wealth'
      flip
      title={
        <>
          A money OS that{' '}
          <span className='ls-serif-em' style={{ color: '#B89456' }}>
            knows your life
          </span>
        </>
      }
      desc="Accounts, budgets, bills, savings goals and a 90-day cash-flow forecast — plus a Money-Health score that tells you, at a glance, whether you're trending in the right direction."
      bullets={[
        { icon: 'tabler-heart-rate-monitor', text: 'Money-Health score from budgets, savings &amp; runway' },
        { icon: 'tabler-wallet', text: 'Multi-account net worth &amp; envelope budgets' },
        { icon: 'tabler-calendar-dollar', text: 'Upcoming-bills timeline &amp; 90-day forecast' }
      ]}
      footnote='Freelance payouts from Projects land here automatically.'
    >
      <div ref={ref}>
        <DemoFrame accent='#C9A96E' label='Wealth · Overview' icon='tabler-report-money' onReplay={() => replay()} interacted={interacted} playing={run && score < 82} minHeight={440}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <div style={{ background: T.dPaper2, borderRadius: 13, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                <div style={{ position: 'relative', width: 120, height: 120 }}>
                  <svg width='120' height='120' style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx='60' cy='60' r={R} fill='none' stroke={T.dBg} strokeWidth='9' />
                    <circle cx='60' cy='60' r={R} fill='none' stroke={scoreColor} strokeWidth='9' strokeLinecap='round' strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} style={{ transition: 'stroke-dashoffset .1s' }} />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className='ls-tnum' style={{ fontSize: '1.9rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
                      {score}
                    </div>
                    <div style={{ fontSize: '.56rem', color: T.dFg3, fontWeight: 600 }}>/ 100</div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '.66rem', color: T.dFg3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Money health</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: scoreColor, margin: '2px 0 6px' }}>Healthy</div>
                  <div style={{ fontSize: '.7rem', color: T.dFg2, lineHeight: 1.4, maxWidth: 130 }}>5.2 months runway · saving 41% of income</div>
                </div>
              </div>
              <div style={{ background: T.dPaper2, borderRadius: 13, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 130 }}>
                <div style={{ fontSize: '.66rem', color: T.dFg3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Net worth</div>
                <div className='ls-tnum' style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C9A96E', margin: '3px 0' }}>
                  {money(net)}
                </div>
                <div style={{ fontSize: '.68rem', color: '#28C76F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <i className='tabler-trending-up' style={{ fontSize: 13 }} /> +$2,210 this mo
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {(
                [
                  ['budgets', 'Budgets', 'tabler-chart-donut'],
                  ['goals', 'Savings goals', 'tabler-target-arrow']
                ] as [string, string, string][]
              ).map(([id, l, ic]) => (
                <button
                  key={id}
                  onClick={() => {
                    setTab(id)
                    setInteracted(true)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '7px 13px',
                    borderRadius: 9,
                    fontSize: '.75rem',
                    fontWeight: 700,
                    background: tab === id ? 'rgba(201,169,110,.18)' : T.dPaper2,
                    color: tab === id ? '#C9A96E' : T.dFg3,
                    border: `1px solid ${tab === id ? 'rgba(201,169,110,.4)' : 'transparent'}`,
                    cursor: 'pointer'
                  }}
                >
                  <i className={ic} style={{ fontSize: 14 }} /> {l}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 'auto' }}>
              {tab === 'budgets' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                  {W_BUDGETS.map(b => {
                    const pct = Math.min(b.spent / b.budgeted, 1)
                    const over = b.spent / b.budgeted > 0.9

                    return (
                      <div key={b.cat}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                          <i className={b.icon} style={{ fontSize: 14, color: b.color }} />
                          <span style={{ fontSize: '.76rem', fontWeight: 600, color: T.dFg1 }}>{b.cat}</span>
                          <span className='ls-tnum' style={{ marginInlineStart: 'auto', fontSize: '.72rem', color: over ? '#FF9F43' : T.dFg2 }}>
                            {money(b.spent)} / {money(b.budgeted)}
                          </span>
                        </div>
                        <div style={{ height: 7, background: T.dBg, borderRadius: 9999 }}>
                          <div style={{ width: run ? `${pct * 100}%` : 0, height: '100%', background: over ? '#FF9F43' : b.color, borderRadius: 9999, transition: 'width .9s cubic-bezier(.22,1,.36,1) .1s' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {W_GOALS.map(g => {
                    const pct = g.saved / g.target

                    return (
                      <div key={g.name} style={{ background: T.dPaper2, borderRadius: 11, padding: '12px 13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: `${g.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className={g.icon} style={{ fontSize: 15, color: g.color }} />
                          </div>
                          <span style={{ fontSize: '.8rem', fontWeight: 700, color: T.dFg1 }}>{g.name}</span>
                          <span className='ls-tnum' style={{ marginInlineStart: 'auto', fontSize: '.74rem', fontWeight: 700, color: g.color }}>
                            {Math.round(pct * 100)}%
                          </span>
                        </div>
                        <div style={{ height: 8, background: T.dBg, borderRadius: 9999 }}>
                          <div style={{ width: run ? `${pct * 100}%` : 0, height: '100%', background: g.color, borderRadius: 9999, transition: 'width 1s cubic-bezier(.22,1,.36,1) .1s' }} />
                        </div>
                        <div style={{ fontSize: '.66rem', color: T.dFg3, marginTop: 5 }}>
                          {money(g.saved)} of {money(g.target)} saved
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </DemoFrame>
      </div>
    </Scene>
  )
}

// ════════════════════════ ANALYTICS ════════════════════════
const A_DATA: Record<string, { bars: number[][]; labels: string[] }> = {
  Week: {
    bars: [
      [820, 540],
      [640, 610],
      [1180, 470],
      [560, 720],
      [1320, 510],
      [430, 380],
      [690, 290]
    ],
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  },
  Month: {
    bars: [
      [4200, 2940],
      [4850, 3420],
      [4200, 2780],
      [5050, 2840]
    ],
    labels: ['W1', 'W2', 'W3', 'W4']
  },
  Year: {
    bars: [
      [12400, 9100],
      [13800, 9600],
      [15200, 10400],
      [16800, 11200]
    ],
    labels: ['Q1', 'Q2', 'Q3', 'Q4']
  }
}

export function AnalyticsSection() {
  const { ref, token, replay, started } = useAutoplay()
  const [run, setRun] = useState(false)
  const [range, setRange] = useState('Month')
  const [interacted, setInteracted] = useState(false)
  const d = A_DATA[range]
  const income = d.bars.reduce((s, b) => s + b[0], 0)
  const expense = d.bars.reduce((s, b) => s + b[1], 0)
  const profit = income - expense
  const margin = Math.round((profit / income) * 100)
  const incomeC = useCountUp(income, run, { duration: 1300 })
  const profitC = useCountUp(profit, run, { duration: 1300 })
  const max = Math.max(...d.bars.flat())

  useEffect(() => {
    if (!started) return
    setRun(false)
    setInteracted(false)
    setRange('Month')
    const t = setTimeout(() => setRun(true), 60)

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, token])

  const pick = (r: string) => {
    setRange(r)
    setInteracted(true)
    setRun(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setRun(true)))
  }

  return (
    <Scene
      id='analytics'
      accent='#C9A96E'
      icon='tabler-chart-line'
      eyebrow='Analytics'
      title={
        <>
          See where your money{' '}
          <span className='ls-serif-em' style={{ color: '#B89456' }}>
            actually goes
          </span>
        </>
      }
      desc='Income vs. expenses vs. net profit, across day, week, month or year. Because earnings flow in from Projects automatically, your numbers are always live — no spreadsheets.'
      bullets={[
        { icon: 'tabler-chart-bar', text: 'Income · expenses · net-profit, side by side' },
        { icon: 'tabler-calendar-time', text: 'Day / week / month / year ranges' },
        { icon: 'tabler-percentage', text: 'Profit-margin &amp; trend at a glance' }
      ]}
      footnote='Every completed billable task updates these charts instantly.'
    >
      <div ref={ref}>
        <DemoFrame accent='#C9A96E' label='Analytics · Cash flow' icon='tabler-chart-line' onReplay={() => replay()} interacted={interacted} playing={run && incomeC < income} minHeight={440}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 4, background: T.dBg, borderRadius: 9, padding: 4 }}>
                {Object.keys(A_DATA).map(r => (
                  <button key={r} onClick={() => pick(r)} style={{ padding: '6px 14px', borderRadius: 6, fontSize: '.74rem', fontWeight: 700, background: range === r ? '#C9A96E' : 'transparent', color: range === r ? '#2B2740' : T.dFg3, border: 'none', cursor: 'pointer' }}>
                    {r}
                  </button>
                ))}
              </div>
              <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 14 }}>
                {(
                  [
                    ['Income', '#28C76F'],
                    ['Expenses', '#FF4C51']
                  ] as [string, string][]
                ).map(([l, c]) => (
                  <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.68rem', color: T.dFg2, fontWeight: 600 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: c }} /> {l}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {(
                [
                  ['Income', money(incomeC), '#28C76F'],
                  ['Net profit', money(profitC), '#C9A96E'],
                  ['Margin', `${margin}%`, '#7367F0']
                ] as [string, string, string][]
              ).map(([l, v, c]) => (
                <div key={l} style={{ flex: 1, background: T.dPaper2, borderRadius: 11, padding: '10px 12px' }}>
                  <div style={{ fontSize: '.62rem', color: T.dFg3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>{l}</div>
                  <div className='ls-tnum' style={{ fontSize: '1.2rem', fontWeight: 800, color: c, marginTop: 2 }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 10, padding: '8px 4px 0', minHeight: 150 }}>
              {d.bars.map(([inc, exp], i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', width: '100%', height: '100%', justifyContent: 'center' }}>
                    <div style={{ width: '38%', maxWidth: 22, height: run ? `${(inc / max) * 100}%` : 0, background: 'linear-gradient(180deg,#3DDC84,#28C76F)', borderRadius: '4px 4px 0 0', transition: `height .8s cubic-bezier(.22,1,.36,1) ${i * 70}ms` }} />
                    <div style={{ width: '38%', maxWidth: 22, height: run ? `${(exp / max) * 100}%` : 0, background: 'linear-gradient(180deg,#FF6B70,#FF4C51)', borderRadius: '4px 4px 0 0', transition: `height .8s cubic-bezier(.22,1,.36,1) ${i * 70 + 40}ms` }} />
                  </div>
                  <span style={{ fontSize: '.66rem', color: T.dFg3, fontWeight: 600 }}>{d.labels[i]}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', borderRadius: 11, background: 'rgba(201,169,110,.1)', border: '1px solid rgba(201,169,110,.25)' }}>
              <i className='tabler-bolt' style={{ fontSize: 16, color: '#C9A96E' }} />
              <span style={{ fontSize: '.74rem', color: T.dFg2 }}>
                Live-fed by <b style={{ color: T.dFg1 }}>Projects</b> — that $75 task you ticked is already in here.
              </span>
            </div>
          </div>
        </DemoFrame>
      </div>
    </Scene>
  )
}

// ════════════════════════ DECISION COMPASS (finale) ════════════════════════
const DC_CRITERIA = [
  { id: 'c1', name: 'Growth', icon: 'tabler-trending-up', color: '#7367F0', w: 10 },
  { id: 'c2', name: 'Financial Security', icon: 'tabler-coin', color: '#28C76F', w: 9 },
  { id: 'c3', name: 'Autonomy', icon: 'tabler-key', color: '#C97C4A', w: 8 },
  { id: 'c4', name: 'Career Trajectory', icon: 'tabler-stairs-up', color: '#C9A96E', w: 7 },
  { id: 'c5', name: 'Health', icon: 'tabler-heartbeat', color: '#FF4C51', w: 6 },
  { id: 'c6', name: 'Family', icon: 'tabler-users', color: '#00BAD1', w: 5 },
  { id: 'c7', name: 'Stability', icon: 'tabler-anchor', color: '#6B8F71', w: 4 },
  { id: 'c8', name: 'Adventure', icon: 'tabler-mountain', color: '#FF9F43', w: 3 }
]
const DC_OPTIONS = [
  { id: 'o1', label: 'Accept the MASc offer', desc: 'Move to Montreal, start September', sq: false, s: { c1: 5, c2: -3, c3: 2, c4: 4, c5: -1, c6: 1, c7: -2, c8: 3 } as Record<string, number> },
  { id: 'o2', label: 'Stay at current job', desc: 'Continue as Senior Engineer', sq: true, s: { c1: -2, c2: 2, c3: 0, c4: -1, c5: 1, c6: 0, c7: 4, c8: -2 } as Record<string, number> },
  { id: 'o3', label: 'Apply elsewhere next cycle', desc: 'Stronger applications for Fall 2027', sq: false, s: { c1: 1, c2: 0, c3: 0, c4: 0, c5: -1, c6: 0, c7: -3, c8: 0 } as Record<string, number> }
]

function scoreOption(opt: (typeof DC_OPTIONS)[number], weights: Record<string, number>) {
  const total = DC_CRITERIA.reduce((s, c) => s + weights[c.id], 0) || 1
  let raw = 0

  for (const c of DC_CRITERIA) raw += (weights[c.id] / total) * opt.s[c.id]

  return ((raw + 5) / 10) * 100
}

export function DecisionSection() {
  const { ref, token, started } = useAutoplay({ threshold: 0.3 })
  const initW = useMemo(() => Object.fromEntries(DC_CRITERIA.map(c => [c.id, c.w])), [])
  const [weights, setWeights] = useState<Record<string, number>>(initW)
  const [reveal, setReveal] = useState(0)
  const [interacted, setInteracted] = useState(false)

  useEffect(() => {
    if (!started) return
    setReveal(0)
    let raf: number
    let start: number | undefined

    const tick = (t: number) => {
      if (!start) start = t
      const p = Math.min((t - start) / 1100, 1)

      setReveal(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }

    const to = setTimeout(() => {
      raf = requestAnimationFrame(tick)
    }, 350)

    return () => {
      clearTimeout(to)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, token])

  const scored = DC_OPTIONS.map(o => ({ ...o, score: scoreOption(o, weights) })).sort((a, b) => b.score - a.score)
  const best = scored[0]
  const setW = (id: string, v: number) => {
    setWeights(w => ({ ...w, [id]: v }))
    setInteracted(true)
  }
  const reset = () => {
    setWeights(initW)
    setInteracted(false)
  }

  const confidence = Math.round(58 + (best.score - scored[1].score) * 1.4)

  return (
    <section id='decisions' style={{ background: 'linear-gradient(180deg,#2B2740 0%,#25293C 100%)', padding: '100px 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'rgba(107,143,113,.13)', filter: 'blur(90px)', top: '5%', right: '-6%' }} />
      <div style={{ maxWidth: T.maxw, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
        <SectionHead
          light
          accent='#8BAE90'
          icon='tabler-compass'
          eyebrow='Decision Compass · the newest module'
          title={
            <>
              For the choices that{' '}
              <span className='ls-serif-em' style={{ color: '#A7C4AB' }}>
                actually matter
              </span>
            </>
          }
          sub='Rank what you value, score each option against it, and get a clear recommendation — grounded in your money, your goals, and what you truly care about. This is where every other module pays off.'
        />

        <div ref={ref} className='ls-scene-grid' style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: 22, alignItems: 'stretch', marginTop: 52, maxWidth: 1040, marginInline: 'auto' }}>
          {/* LEFT — values */}
          <Reveal>
            <div style={{ background: 'linear-gradient(168deg,#2F3349,#373B50)', borderRadius: 20, padding: 22, height: '100%', boxShadow: T.shadowLg, border: '1px solid rgba(255,255,255,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <i className='tabler-adjustments-heart' style={{ fontSize: 18, color: '#8BAE90' }} />
                <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: T.dFg1 }}>What matters to you</h3>
              </div>
              <p style={{ fontSize: '.72rem', color: T.dFg3, marginBottom: 18 }}>Drag to re-weight — the recommendation updates live.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {DC_CRITERIA.map(c => (
                  <div key={c.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <i className={c.icon} style={{ fontSize: 14, color: c.color }} />
                      <span style={{ fontSize: '.78rem', fontWeight: 600, color: T.dFg1 }}>{c.name}</span>
                      <span className='ls-tnum' style={{ marginInlineStart: 'auto', fontSize: '.7rem', fontWeight: 700, color: c.color }}>
                        {weights[c.id]}
                      </span>
                    </div>
                    <input type='range' min='0' max='10' step='1' value={weights[c.id]} onChange={e => setW(c.id, +e.target.value)} style={{ width: '100%', accentColor: c.color, cursor: 'pointer', height: 4 }} />
                  </div>
                ))}
              </div>
              <button onClick={reset} style={{ marginTop: 18, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '9px', borderRadius: 9, background: 'rgba(255,255,255,.06)', color: T.dFg2, fontSize: '.76rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                <i className='tabler-refresh' style={{ fontSize: 14 }} /> Reset weights
              </button>
            </div>
          </Reveal>

          {/* RIGHT — decision + options */}
          <Reveal delay={0.12}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
              <div style={{ background: 'linear-gradient(168deg,#2F3349,#373B50)', borderRadius: 20, padding: '20px 22px', boxShadow: T.shadowLg, border: '1px solid rgba(255,255,255,.05)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div>
                    <div style={{ display: 'flex', gap: 7, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.64rem', fontWeight: 700, color: '#FF6B70', background: 'rgba(255,76,81,.14)', padding: '3px 9px', borderRadius: 9999 }}>
                        <i className='tabler-flag' style={{ fontSize: 11 }} /> High stakes
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.64rem', fontWeight: 700, color: '#FF9F43', background: 'rgba(255,159,67,.14)', padding: '3px 9px', borderRadius: 9999 }}>
                        <i className='tabler-lock' style={{ fontSize: 11 }} /> Hard to reverse
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.64rem', fontWeight: 700, color: '#7367F0', background: 'rgba(115,103,240,.14)', padding: '3px 9px', borderRadius: 9999 }}>
                        <i className='tabler-calendar' style={{ fontSize: 11 }} /> 5-year horizon
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: T.dFg1, letterSpacing: '-.01em' }}>Accept the Concordia MASc offer?</h3>
                    <p style={{ fontSize: '.76rem', color: T.dFg3, marginTop: 3 }}>Two-year funded research master&apos;s · decision deadline May 28</p>
                  </div>
                </div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 13, padding: '13px 15px', borderRadius: 13, background: 'rgba(107,143,113,.16)', border: '1px solid rgba(107,143,113,.4)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#6B8F71', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className='tabler-compass' style={{ fontSize: 22, color: '#fff' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.68rem', color: T.dFg3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Compass recommends</div>
                    <div key={best.id} style={{ fontSize: '1rem', fontWeight: 800, color: '#A7C4AB', animation: 'lsBadgePop .35s' }}>
                      {best.label}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div className='ls-tnum' style={{ fontSize: '1.7rem', fontWeight: 800, color: '#A7C4AB', lineHeight: 1 }}>
                      {Math.round(best.score)}
                    </div>
                    <div style={{ fontSize: '.58rem', color: T.dFg3 }}>/ 100 · {Math.max(20, Math.min(96, confidence))}% conf.</div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'linear-gradient(168deg,#2F3349,#373B50)', borderRadius: 20, padding: 20, flex: 1, boxShadow: T.shadowLg, border: '1px solid rgba(255,255,255,.05)' }}>
                <div style={{ fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: T.dFg3, marginBottom: 13 }}>Options, ranked by your values</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {scored.map((o, rank) => {
                    const pct = o.score * reveal
                    const isBest = rank === 0

                    return (
                      <div key={o.id} style={{ opacity: rank === 0 ? 1 : 0.92 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
                          <span style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.66rem', fontWeight: 800, background: isBest ? '#6B8F71' : 'rgba(255,255,255,.08)', color: isBest ? '#fff' : T.dFg2 }}>{rank + 1}</span>
                          <span style={{ fontSize: '.84rem', fontWeight: 700, color: T.dFg1 }}>{o.label}</span>
                          {o.sq && <span style={{ fontSize: '.6rem', fontWeight: 700, color: T.dFg3, background: 'rgba(255,255,255,.07)', padding: '2px 7px', borderRadius: 9999 }}>status quo</span>}
                          <span className='ls-tnum' style={{ marginInlineStart: 'auto', fontSize: '1rem', fontWeight: 800, color: isBest ? '#A7C4AB' : T.dFg2 }}>
                            {Math.round(pct)}
                          </span>
                        </div>
                        <div style={{ height: 9, background: T.dBg, borderRadius: 9999, marginLeft: 29, position: 'relative', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: isBest ? 'linear-gradient(90deg,#6B8F71,#A7C4AB)' : 'rgba(231,227,252,.28)', borderRadius: 9999, transition: interacted ? 'width .35s ease' : 'none' }} />
                          <div style={{ position: 'absolute', top: -2, left: '50%', width: 2, height: 13, background: 'rgba(255,255,255,.25)' }} />
                        </div>
                        <div style={{ fontSize: '.68rem', color: T.dFg3, marginLeft: 29, marginTop: 4 }}>{o.desc}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', borderRadius: 11, background: 'rgba(107,143,113,.1)', border: '1px solid rgba(107,143,113,.22)' }}>
                  <i className='tabler-plug-connected' style={{ fontSize: 16, color: '#8BAE90' }} />
                  <span style={{ fontSize: '.72rem', color: T.dFg2 }}>
                    Pulls in your <b style={{ color: T.dFg1 }}>Wealth</b> runway and active <b style={{ color: T.dFg1 }}>Goals</b> as scoring criteria — automatically.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
        <div style={{ textAlign: 'center', marginTop: 22, fontSize: '.76rem', color: 'rgba(231,227,252,.45)' }}>
          <i className='tabler-hand-finger' style={{ fontSize: 14 }} /> Drag the value sliders — the ranking recomputes in real time.
        </div>
      </div>
    </section>
  )
}
