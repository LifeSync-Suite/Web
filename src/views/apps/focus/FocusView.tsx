'use client'

import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import { useBreakpoint, isTablet } from '@/hooks/useBreakpoint'

const TEMPLATES = [
  { id: 'deep',  label: 'Deep Work', focus: 50, break: 10, color: '#C97C4A', icon: 'tabler-brain' },
  { id: 'study', label: 'Study',     focus: 25, break: 5,  color: '#7367F0', icon: 'tabler-book' },
  { id: 'light', label: 'Light',     focus: 15, break: 5,  color: '#28C76F', icon: 'tabler-leaf' },
]

const SOUNDSCAPES = [
  { id: 'rain',   label: 'Rain',        icon: 'tabler-cloud-rain' },
  { id: 'forest', label: 'Forest',      icon: 'tabler-trees' },
  { id: 'cafe',   label: 'Café',        icon: 'tabler-coffee' },
  { id: 'white',  label: 'White Noise', icon: 'tabler-wave-sine' },
  { id: 'none',   label: 'Silence',     icon: 'tabler-volume-off' },
]

type Phase = 'focus' | 'break'

const FocusView = () => {
  const [template, setTemplate] = useState(TEMPLATES[0])
  const [phase,    setPhase]    = useState<Phase>('focus')
  const [running,  setRunning]  = useState(false)
  const [seconds,  setSeconds]  = useState(TEMPLATES[0].focus * 60)
  const [sound,    setSound]    = useState('rain')
  const [sessions, setSessions] = useState(0)
  const [task,     setTask]     = useState('Design system tokens')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = phase === 'focus' ? template.focus * 60 : template.break * 60
  const pct   = ((total - seconds) / total) * 100
  const mins  = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs  = String(seconds % 60).padStart(2, '0')

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            if (phase === 'focus') {
              setSessions(n => n + 1)
              setPhase('break')
              setSeconds(template.break * 60)
            } else {
              setPhase('focus')
              setSeconds(template.focus * 60)
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, phase, template])

  function selectTemplate(t: typeof TEMPLATES[number]) {
    setTemplate(t)
    setRunning(false)
    setPhase('focus')
    setSeconds(t.focus * 60)
  }

  function reset() {
    setRunning(false)
    setSeconds(template.focus * 60)
    setPhase('focus')
  }

  function skipPhase() {
    setRunning(false)
    if (phase === 'focus') {
      setPhase('break')
      setSeconds(template.break * 60)
    } else {
      setPhase('focus')
      setSeconds(template.focus * 60)
    }
  }

  const R    = 80
  const C    = 2 * Math.PI * R
  const dash = C - (pct / 100) * C
  const bp   = useBreakpoint()
  const stacked = isTablet(bp)

  return (
    <Box sx={{ maxWidth: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: stacked ? '1fr' : '1fr 320px', gap: 16 }}>

        {/* Timer card */}
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 16, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '32px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: phase === 'focus' ? `${template.color}18` : 'rgba(40,199,111,.12)', color: phase === 'focus' ? template.color : '#28C76F', padding: '4px 14px', borderRadius: 9999, fontSize: '.75rem', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 20 }}>
            {phase === 'focus' ? 'Focus Session' : 'Break Time'}
          </div>

          <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 24 }}>
            <svg width='200' height='200' style={{ transform: 'rotate(-90deg)' }}>
              <circle cx='100' cy='100' r={R} fill='none' stroke='var(--mui-palette-action-hover)' strokeWidth='10' />
              <circle cx='100' cy='100' r={R} fill='none' stroke={template.color} strokeWidth='10'
                strokeDasharray={C} strokeDashoffset={dash} strokeLinecap='round'
                style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--mui-palette-text-primary)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{mins}:{secs}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)', marginTop: 4 }}>Session {sessions + 1}</div>
            </div>
          </div>

          <div style={{ marginBottom: 20, width: '100%', maxWidth: 320 }}>
            <div style={{ fontSize: '.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--mui-palette-text-disabled)', marginBottom: 5, textAlign: 'center' }}>Logging to task</div>
            <input value={task} onChange={e => setTask(e.target.value)}
              style={{ width: '100%', border: '1px solid var(--mui-palette-divider)', borderRadius: 8, padding: '9px 13px', fontSize: '.875rem', color: 'var(--mui-palette-text-primary)', background: 'var(--mui-palette-action-hover)', textAlign: 'center', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={reset} style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--mui-palette-action-hover)', border: '1px solid var(--mui-palette-divider)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mui-palette-text-disabled)', fontSize: 18, cursor: 'pointer' }}>
              <i className='tabler-player-skip-back' />
            </button>
            <button onClick={() => setRunning(r => !r)} style={{ width: 60, height: 60, borderRadius: 15, background: template.color, color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: `0 4px 16px ${template.color}50`, cursor: 'pointer' }}>
              <i className={running ? 'tabler-player-pause' : 'tabler-player-play'} />
            </button>
            <button onClick={skipPhase} style={{ width: 42, height: 42, borderRadius: 11, background: 'var(--mui-palette-action-hover)', border: '1px solid var(--mui-palette-divider)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--mui-palette-text-disabled)', fontSize: 18, cursor: 'pointer' }}>
              <i className='tabler-player-skip-forward' />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 7, marginTop: 22 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < sessions % 4 ? template.color : 'var(--mui-palette-action-hover)', border: `2px solid ${i < sessions % 4 ? template.color : 'var(--mui-palette-divider)'}` }} />
            ))}
          </div>
          <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', marginTop: 5 }}>{sessions} sessions completed today</div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '16px' }}>
            <div style={{ fontWeight: 600, fontSize: '.875rem', color: 'var(--mui-palette-text-primary)', marginBottom: 12 }}>Session Template</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {TEMPLATES.map(t => (
                <div key={t.id} onClick={() => selectTemplate(t)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, cursor: 'pointer', border: `1.5px solid ${template.id === t.id ? t.color : 'var(--mui-palette-divider)'}`, background: template.id === t.id ? `${t.color}0f` : 'var(--mui-palette-action-hover)', transition: 'all 180ms' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: `${t.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className={t.icon} style={{ color: t.color, fontSize: 16 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--mui-palette-text-primary)' }}>{t.label}</div>
                    <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)' }}>{t.focus}m focus · {t.break}m break</div>
                  </div>
                  {template.id === t.id && <i className='tabler-circle-check-filled' style={{ color: t.color, fontSize: 18 }} />}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '16px' }}>
            <div style={{ fontWeight: 600, fontSize: '.875rem', color: 'var(--mui-palette-text-primary)', marginBottom: 12 }}>Ambient Sound</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
              {SOUNDSCAPES.map(s => (
                <button key={s.id} onClick={() => setSound(s.id)} style={{ background: sound === s.id ? 'rgba(201,124,74,.16)' : 'var(--mui-palette-action-hover)', color: sound === s.id ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-text-disabled)', border: `1.5px solid ${sound === s.id ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-divider)'}`, borderRadius: 9, padding: '9px 6px', cursor: 'pointer', fontSize: '.7rem', fontWeight: 600, transition: 'all 180ms', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
                  <i className={s.icon} style={{ fontSize: 18 }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '16px' }}>
            <div style={{ fontWeight: 600, fontSize: '.875rem', color: 'var(--mui-palette-text-primary)', marginBottom: 10 }}>Today&apos;s Log</div>
            {[
              { task: 'Deep Work',     duration: '50m', color: '#C97C4A' },
              { task: 'Study session', duration: '25m', color: '#7367F0' },
              { task: 'Email review',  duration: '25m', color: '#28C76F' },
            ].map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '.8rem', color: 'var(--mui-palette-text-secondary)' }}>{l.task}</span>
                <span style={{ fontSize: '.75rem', fontWeight: 600, color: l.color }}>{l.duration}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--mui-palette-divider)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>Total today</span>
              <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--mui-palette-primary-main)' }}>1h 40m</span>
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default FocusView
