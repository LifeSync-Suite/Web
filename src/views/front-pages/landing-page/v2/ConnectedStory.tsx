'use client'

// ConnectedStory.tsx — "Everything connected" animated data-flow centerpiece.
// Ported from landing/connected.jsx.

import { useEffect, useRef, useState } from 'react'

import { easeOut, useAutoplay, T } from './shared'

type NodeDef = { label: string; icon: string; color: string; x: number; y: number; hub?: boolean }

const C_NODES: Record<string, NodeDef> = {
  tasks: { label: 'Tasks', icon: 'tabler-checklist', color: '#7367F0', x: 150, y: 118 },
  focus: { label: 'Focus', icon: 'tabler-clock-play', color: '#C97C4A', x: 95, y: 300 },
  habits: { label: 'Habits', icon: 'tabler-flame', color: '#28C76F', x: 170, y: 445 },
  goals: { label: 'Goals', icon: 'tabler-target', color: '#FF9F43', x: 420, y: 292 },
  mood: { label: 'Mood', icon: 'tabler-mood-smile', color: '#00BAD1', x: 432, y: 472 },
  wealth: { label: 'Wealth', icon: 'tabler-report-money', color: '#C9A96E', x: 662, y: 108 },
  analytics: { label: 'Analytics', icon: 'tabler-chart-line', color: '#C9A96E', x: 858, y: 250 },
  decisions: { label: 'Decision Compass', icon: 'tabler-compass', color: '#6B8F71', x: 718, y: 432, hub: true }
}

type EdgeDef = { from: string; to: string; label: string; k: number; caption: string }

const C_EDGES: EdgeDef[] = [
  { from: 'focus', to: 'tasks', label: '3h 20m logged', k: 36, caption: 'A focus session auto-logs 3h 20m of deep work to today’s task.' },
  { from: 'tasks', to: 'wealth', label: '+$112 earned', k: -70, caption: 'That task was billable — $112 posts straight to your Wealth ledger.' },
  { from: 'wealth', to: 'analytics', label: 'income ↑', k: 30, caption: 'Analytics updates instantly — this month’s income just ticked up.' },
  { from: 'habits', to: 'goals', label: '+30 pages', k: -40, caption: 'Your daily reading habit feeds a goal — 30 pages closer to 5,000.' },
  { from: 'mood', to: 'decisions', label: 'mood: focused', k: 30, caption: 'Today’s mood is part of the picture too.' },
  { from: 'goals', to: 'decisions', label: 'on pace', k: 60, caption: 'Your goals report whether you’re on pace.' },
  {
    from: 'wealth',
    to: 'decisions',
    label: 'net worth',
    k: -40,
    caption: 'When a big decision comes, the Compass already knows your money, goals & values — and scores it 78/100.'
  }
]

const STEP_MS = 1500
const TAIL_MS = 2200

function edgePath(e: EdgeDef) {
  const a = C_NODES[e.from]
  const b = C_NODES[e.to]
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len

  return { d: `M ${a.x} ${a.y} Q ${mx + nx * e.k} ${my + ny * e.k} ${b.x} ${b.y}`, color: C_NODES[e.to].color }
}

type Packet = { x: number; y: number; label: string; color: string; show: boolean }

export function ConnectedStory() {
  const { ref, token, replay, started } = useAutoplay({ threshold: 0.35 })
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const [frame, setFrame] = useState({ step: -1, t: 0, completed: 0, looping: false })
  const [packet, setPacket] = useState<Packet | null>(null)
  const [manualStep, setManualStep] = useState<number | null>(null)

  const paths = C_EDGES.map(edgePath)

  useEffect(() => {
    if (!started) return
    let raf: number
    let start: number | undefined
    const total = C_EDGES.length * STEP_MS + TAIL_MS

    const loop = (ts: number) => {
      if (!start) start = ts
      const el = (ts - start) % total
      const idx = Math.floor(el / STEP_MS)

      if (idx < C_EDGES.length) {
        const t = easeOut((el % STEP_MS) / STEP_MS)

        setFrame({ step: idx, t, completed: idx, looping: false })
        const p = pathRefs.current[idx]

        if (p) {
          const L = p.getTotalLength()
          const pt = p.getPointAtLength(t * L)

          setPacket({ x: pt.x, y: pt.y, label: C_EDGES[idx].label, color: paths[idx].color, show: t > 0.02 && t < 0.99 })
        }
      } else {
        setFrame({ step: -1, t: 1, completed: C_EDGES.length, looping: true })
        setPacket(p => (p ? { ...p, show: false } : null))
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, token])

  const shownStep = manualStep != null ? manualStep : frame.step
  const allDone = manualStep == null && frame.looping

  const lit = new Set<string>()
  const completed = manualStep != null ? manualStep + 1 : allDone ? C_EDGES.length : frame.completed

  C_EDGES.forEach((e, i) => {
    if (i < completed) {
      lit.add(e.from)
      lit.add(e.to)
    }
  })
  if (shownStep >= 0) {
    lit.add(C_EDGES[shownStep].from)
    if (frame.t > 0.85 || manualStep != null) lit.add(C_EDGES[shownStep].to)
  }
  if (allDone) Object.keys(C_NODES).forEach(k => lit.add(k))

  const caption = allDone ? (
    <>
      <b style={{ color: '#6B8F71' }}>One ripple, the whole system.</b> Every module shares context — nothing is an island.
    </>
  ) : shownStep >= 0 ? (
    C_EDGES[shownStep].caption
  ) : (
    'Watch a single action ripple across your whole life.'
  )

  const pickStep = (i: number) => {
    setManualStep(prev => (prev === i ? null : i))

    if (manualStep == null) {
      const p = pathRefs.current[i]

      if (p) {
        const pt = p.getPointAtLength(p.getTotalLength())

        setPacket({ x: pt.x, y: pt.y, label: C_EDGES[i].label, color: paths[i].color, show: true })
      }
    }
  }

  return (
    <section
      id='connected'
      style={{ background: 'linear-gradient(180deg,#25293C 0%,#2B2740 100%)', padding: '96px 0 100px', position: 'relative', overflow: 'hidden' }}
    >
      <div ref={ref} style={{ maxWidth: T.maxw, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 14px' }}>
          <div className='ls-eyebrow' style={{ background: 'rgba(201,124,74,.18)', color: T.primaryLight }}>
            <i className='tabler-affiliate' style={{ fontSize: 14 }} /> The big idea
          </div>
          <h2 className='ls-h-section' style={{ color: '#F7F3EE', margin: '18px 0 14px' }}>
            Most apps track one thing.
            <br />
            <span className='ls-serif-em' style={{ color: T.primaryLight }}>
              LifeSync connects everything.
            </span>
          </h2>
          <p className='ls-lead' style={{ color: 'rgba(247,243,238,.6)', margin: '0 auto' }}>
            A finished task becomes income. Income shapes analytics. Habits feed goals. And it all informs the decisions that matter most.
          </p>
        </div>

        {/* board */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 960, margin: '14px auto 0', aspectRatio: '960 / 540' }}>
          <svg viewBox='0 0 960 540' style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              {paths.map((p, i) => (
                <linearGradient key={i} id={`lsflow${i}`} x1='0' y1='0' x2='1' y2='0'>
                  <stop offset='0%' stopColor={C_NODES[C_EDGES[i].from].color} />
                  <stop offset='100%' stopColor={p.color} />
                </linearGradient>
              ))}
            </defs>
            {paths.map((p, i) => (
              <path key={`b${i}`} d={p.d} fill='none' stroke='rgba(231,227,252,.1)' strokeWidth='2' strokeLinecap='round' />
            ))}
            {paths.map((p, i) => {
              const isActive = i === shownStep
              const isDone = i < completed
              const reveal = manualStep != null ? (i <= manualStep ? 1 : 0) : isDone ? 1 : isActive ? frame.t : 0

              return (
                <path
                  key={`a${i}`}
                  ref={el => {
                    pathRefs.current[i] = el
                  }}
                  d={p.d}
                  fill='none'
                  stroke={`url(#lsflow${i})`}
                  strokeWidth={isActive ? 4 : 3}
                  strokeLinecap='round'
                  pathLength={1}
                  strokeDasharray='1'
                  strokeDashoffset={1 - reveal}
                  style={{ opacity: reveal > 0 ? 0.95 : 0, transition: 'stroke-width .2s' }}
                />
              )
            })}
            {packet && packet.show && (
              <g transform={`translate(${packet.x},${packet.y})`}>
                <circle r='13' fill={packet.color} opacity='0.22' />
                <circle r='6.5' fill={packet.color} stroke='#fff' strokeWidth='2' />
                <g transform='translate(0,-30)'>
                  <rect x={-(packet.label.length * 4.3 + 14)} y='-14' width={packet.label.length * 8.6 + 28} height='28' rx='14' fill='#fff' />
                  <text x='0' y='5' textAnchor='middle' fontFamily='Plus Jakarta Sans' fontSize='14.5' fontWeight='700' fill='#2F2B3D'>
                    {packet.label}
                  </text>
                </g>
              </g>
            )}
          </svg>

          {/* nodes overlay */}
          {Object.entries(C_NODES).map(([id, n]) => {
            const on = lit.has(id)
            const size = n.hub ? 76 : 60

            return (
              <div
                key={id}
                style={{
                  position: 'absolute',
                  left: `${n.x / 9.6}%`,
                  top: `${n.y / 5.4}%`,
                  transform: 'translate(-50%,-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 7,
                  transition: 'all .4s',
                  zIndex: 2
                }}
              >
                <div
                  style={{
                    width: size,
                    height: size,
                    borderRadius: n.hub ? 20 : 16,
                    background: on ? n.color : 'rgba(255,255,255,.06)',
                    border: `1.5px solid ${on ? n.color : 'rgba(255,255,255,.12)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: on ? `0 0 0 6px ${n.color}26, 0 10px 30px ${n.color}55` : 'none',
                    transition: 'all .4s cubic-bezier(.22,1,.36,1)',
                    transform: on ? 'scale(1.06)' : 'scale(1)'
                  }}
                >
                  <i className={n.icon} style={{ fontSize: n.hub ? 30 : 24, color: on ? '#fff' : 'rgba(231,227,252,.5)', transition: 'color .4s' }} />
                </div>
                <span
                  style={{
                    fontSize: n.hub ? '.82rem' : '.74rem',
                    fontWeight: 700,
                    color: on ? '#F7F3EE' : 'rgba(231,227,252,.45)',
                    whiteSpace: 'nowrap',
                    transition: 'color .4s'
                  }}
                >
                  {n.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* caption + step dots */}
        <div style={{ maxWidth: 720, margin: '8px auto 0', textAlign: 'center', minHeight: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '1.05rem', color: 'rgba(247,243,238,.8)', lineHeight: 1.55, fontWeight: 500, textWrap: 'balance' }}>{caption}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', marginTop: 14 }}>
          {C_EDGES.map((e, i) => {
            const active = i === shownStep || (manualStep != null && i === manualStep)
            const done = i < completed

            return (
              <button
                key={i}
                onClick={() => pickStep(i)}
                title={`Step ${i + 1}`}
                style={{
                  height: 7,
                  borderRadius: 9999,
                  transition: 'all .3s',
                  width: active ? 30 : 9,
                  background: active ? C_NODES[e.to].color : done ? 'rgba(201,124,74,.5)' : 'rgba(231,227,252,.2)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              />
            )
          })}
          <button
            onClick={() => {
              setManualStep(null)
              replay()
            }}
            style={{
              marginInlineStart: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'rgba(247,243,238,.7)',
              fontSize: '.78rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(255,255,255,.06)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <i className='tabler-refresh' style={{ fontSize: 14 }} /> Replay
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 10, fontSize: '.74rem', color: 'rgba(231,227,252,.4)' }}>
          Tap any step to inspect it · auto-plays on scroll
        </div>
      </div>
    </section>
  )
}
