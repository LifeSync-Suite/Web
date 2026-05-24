'use client'

import { useState } from 'react'
import { useBreakpoint, isMobile } from '@/hooks/useBreakpoint'

const HABITS = [
  { id: 1, name: 'Morning Meditation', icon: 'tabler-yin-yang',  color: '#00BAD1', streak: 21, target: 'Daily', completedToday: true,
    week: [true, true, true, false, true, true, true] },
  { id: 2, name: '5km Run',            icon: 'tabler-run',       color: '#28C76F', streak: 12, target: 'Daily', completedToday: true,
    week: [true, true, false, true, true, true, true] },
  { id: 3, name: 'Journaling',         icon: 'tabler-notebook',  color: '#C97C4A', streak: 8,  target: 'Daily', completedToday: false,
    week: [true, true, true, true, false, false, false] },
  { id: 4, name: 'Reading (30m)',       icon: 'tabler-book',      color: '#7367F0', streak: 5,  target: 'Daily', completedToday: false,
    week: [false, true, true, true, false, true, false] },
  { id: 5, name: 'Cold Shower',        icon: 'tabler-droplet',   color: '#C9A96E', streak: 3,  target: 'Daily', completedToday: true,
    week: [false, false, true, true, true, false, true] },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function makeHeatmap() {
  return Array.from({ length: 70 }, () => Math.random() > 0.25 ? Math.floor(Math.random() * 4) + 1 : 0)
}

const HEATMAPS: Record<number, number[]> = HABITS.reduce((acc, h) => {
  acc[h.id] = makeHeatmap()
  return acc
}, {} as Record<number, number[]>)

function HabitRow({ habit, onToggle, mobile }: { habit: typeof HABITS[number]; onToggle: (id: number) => void; mobile: boolean }) {
  function heatColor(v: number) {
    if (!v) return 'var(--mui-palette-action-selected)'
    const alpha = [0.2, 0.45, 0.7, 1][v - 1]
    const hex = habit.color
    return `${hex}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
  }

  return (
    <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, padding: '16px 18px', marginBottom: 10, boxShadow: '0 2px 8px rgba(47,43,61,.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: `${habit.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className={habit.icon} style={{ fontSize: 20, color: habit.color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '.875rem', color: 'var(--mui-palette-text-primary)' }}>{habit.name}</div>
          <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)', marginTop: 2 }}>
            <i className='tabler-flame' style={{ color: '#FF9F43', fontSize: 12 }} />
            {' '}{habit.streak}-day streak · {habit.target}
          </div>
        </div>
        <button
          onClick={() => onToggle(habit.id)}
          style={{ width: 36, height: 36, borderRadius: 9, border: `2px solid ${habit.completedToday ? habit.color : 'var(--mui-palette-divider)'}`, background: habit.completedToday ? habit.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          {habit.completedToday && <i className='tabler-check' style={{ fontSize: 16, color: '#fff' }} />}
        </button>
      </div>

      {/* This week */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {DAYS.map((day, i) => (
          <div key={day} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', marginBottom: 4 }}>{day}</div>
            <div style={{ height: 22, borderRadius: 5, background: habit.week[i] ? `${habit.color}30` : 'var(--mui-palette-action-hover)', border: `1px solid ${habit.week[i] ? habit.color : 'var(--mui-palette-divider)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {habit.week[i] && <i className='tabler-check' style={{ fontSize: 10, color: habit.color }} />}
            </div>
          </div>
        ))}
      </div>

      {/* Mini heatmap — hide on very small screens */}
      {!mobile && (
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {HEATMAPS[habit.id].map((v, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: 2, background: heatColor(v) }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function HabitsView() {
  const [habits, setHabits] = useState(HABITS)
  const mobile = isMobile(useBreakpoint())

  function toggle(id: number) {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, completedToday: !h.completedToday } : h))
  }

  const done = habits.filter(h => h.completedToday).length

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header stats */}
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3,1fr)', gap: 14, marginBottom: 22 }}>
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(40,199,111,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className='tabler-checks' style={{ fontSize: 22, color: '#28C76F' }} />
          </div>
          <div>
            <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.4px' }}>Today</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--mui-palette-text-primary)' }}>{done}/{habits.length}</div>
            <div style={{ fontSize: '.7rem', color: '#28C76F' }}>habits completed</div>
          </div>
        </div>
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,159,67,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className='tabler-flame' style={{ fontSize: 22, color: '#FF9F43' }} />
          </div>
          <div>
            <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.4px' }}>Best Streak</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--mui-palette-text-primary)' }}>21 days</div>
            <div style={{ fontSize: '.7rem', color: '#FF9F43' }}>Morning Meditation</div>
          </div>
        </div>
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(201,124,74,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className='tabler-trophy' style={{ fontSize: 22, color: '#C97C4A' }} />
          </div>
          <div>
            <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.4px' }}>Weekly Rate</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--mui-palette-text-primary)' }}>84%</div>
            <div style={{ fontSize: '.7rem', color: '#C97C4A' }}>above your average</div>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)' }}>My Habits</div>
        <button style={{ background: 'var(--mui-palette-primary-main)', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: '.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5, boxShadow: '0 2px 6px rgba(201,124,74,.3)', cursor: 'pointer', fontFamily: 'inherit' }}>
          <i className='tabler-plus' style={{ fontSize: 14 }} /> New Habit
        </button>
      </div>

      {habits.map(h => <HabitRow key={h.id} habit={h} onToggle={toggle} mobile={mobile} />)}
    </div>
  )
}
