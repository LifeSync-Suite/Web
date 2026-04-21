'use client'

// React Imports
import { useState } from 'react'

const MODULES = [
  {
    id: 'tasks', icon: 'tabler-checklist', color: '#7367F0', label: 'Tasks',
    title: 'Tasks & Projects',
    desc: 'A calm, focused task manager that gets out of your way. Kanban boards, subtasks, recurring schedules, and smart prioritization — all connected to your goals and habits.',
    features: ['Kanban, list, and calendar views', 'Subtasks, tags, priorities, and due dates', 'Auto-log to focus sessions', 'Recurring tasks and smart reminders'],
    featureColor: '#28C76F'
  },
  {
    id: 'goals', icon: 'tabler-target', color: '#FF9F43', label: 'Goals',
    title: 'Goal Tracking',
    desc: 'Set meaningful goals and always know if you\'re on pace. The Dual-Progress System shows actual vs. expected progress so you can course-correct before it\'s too late.',
    features: ['Actual vs. expected pace indicator', 'Annual, quarterly, or custom timeframes', 'Linked tasks and habits feed progress', 'Milestone celebrations and streaks'],
    featureColor: '#FF9F43'
  },
  {
    id: 'habits', icon: 'tabler-flame', color: '#28C76F', label: 'Habits',
    title: 'Habit Builder',
    desc: 'Build the routines that compound into the person you want to become. Streaks, heatmaps, and gentle psychology-backed nudges help habits feel effortless over time.',
    features: ['Daily streaks and heatmap calendar', 'Habit stacking and scheduling', 'Milestone badges and gamification', 'Feeds into weekly analytics'],
    featureColor: '#28C76F'
  },
  {
    id: 'mood', icon: 'tabler-mood-smile', color: '#00BAD1', label: 'Mood',
    title: 'Mood & Journal',
    desc: 'A private, safe space to understand your emotional life. Log from 48 emotions on an Energy × Valence axis, write freely, and discover what shapes how you feel.',
    features: ['48-emotion Energy × Valence map', 'Encrypted journal entries', 'AI-generated daily prompts', 'Mood trends correlated with habits'],
    featureColor: '#00BAD1'
  },
  {
    id: 'focus', icon: 'tabler-focus-2', color: '#C97C4A', label: 'Focus',
    title: 'Focus Timer',
    desc: 'Deep work, made effortless. A full Pomodoro suite with ambient soundscapes, custom session templates, and automatic time logging to your tasks and goals.',
    features: ['Custom session templates (25/50/90m)', 'Ambient soundscapes (rain, forest, café)', 'Auto-logs time to tasks and projects', 'Daily and weekly focus analytics'],
    featureColor: '#C97C4A'
  },
  {
    id: 'calendar', icon: 'tabler-calendar', color: '#808390', label: 'Calendar',
    title: 'Smart Calendar',
    desc: 'A fully integrated calendar that understands your life. Time-block your tasks, visualize your habits, and let LifeSync surface the best time for deep work.',
    features: ['Drag-and-drop time blocking', 'Tasks and habits appear automatically', 'Smart scheduling suggestions', 'Day, week, and month views'],
    featureColor: '#808390'
  }
]

const OurTeam = () => {
  const [active, setActive] = useState('tasks')
  const mod = MODULES.find(m => m.id === active) ?? MODULES[0]

  return (
    <section style={{ padding: '96px 32px', background: '#fff' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ marginBottom: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,124,74,.08)', color: '#A8612E', borderRadius: 9999, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: 16 }}>
            <i className='tabler-apps' /> Every module
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'rgba(47,43,61,.92)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 8 }}>
            One app.{' '}
            <em style={{ fontStyle: 'normal', fontFamily: 'Georgia, serif', color: '#C97C4A', fontWeight: 700 }}>Every dimension</em>{' '}
            of your life.
          </h2>
          <p style={{ fontSize: '1.0625rem', color: 'rgba(47,43,61,.58)', lineHeight: 1.7, maxWidth: 520, marginBottom: 36 }}>
            From micro-habits to decade-long goals — LifeSync holds it all.
          </p>
        </div>

        {/* Module tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
          {MODULES.map(m => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '9px 18px', borderRadius: 10,
                border: `1.5px solid ${active === m.id ? m.color : 'rgba(47,43,61,.12)'}`,
                background: active === m.id ? `${m.color}14` : 'transparent',
                fontFamily: 'inherit', fontSize: '0.875rem', fontWeight: 600,
                color: active === m.id ? m.color : 'rgba(47,43,61,.55)',
                cursor: 'pointer', transition: 'all 200ms'
              }}
            >
              <i className={m.icon} style={{ fontSize: 16 }} /> {m.label}
            </button>
          ))}
        </div>

        {/* Module pane */}
        <div key={active} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', animation: 'ls-fadeUp .4s cubic-bezier(.22,1,.36,1) both' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'rgba(47,43,61,.92)', marginBottom: 14, letterSpacing: '-0.01em' }}>{mod.title}</h3>
            <p style={{ fontSize: '0.9375rem', color: 'rgba(47,43,61,.6)', lineHeight: 1.7, marginBottom: 22 }}>{mod.desc}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {mod.features.map(feat => (
                <div key={feat} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: 'rgba(47,43,61,.7)', lineHeight: 1.5 }}>
                  <i className='tabler-check' style={{ fontSize: 16, flexShrink: 0, marginTop: 1, color: mod.featureColor }} />
                  {feat}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #2B2740 0%, #2F3349 100%)', borderRadius: 16, padding: 28, boxShadow: '0 12px 40px rgba(47,43,61,.15)', minHeight: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <ModuleVisual mod={active} color={mod.color} />
          </div>
        </div>
      </div>

      <style>{`@keyframes ls-fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </section>
  )
}

const ModuleVisual = ({ mod, color }: { mod: string; color: string }) => {
  if (mod === 'tasks') return (
    <div>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(231,227,252,.4)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>Today&apos;s Tasks</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {[['To Do','rgba(231,227,252,.45)'],['In Progress','#FF9F43'],['Review','#00BAD1'],['Done','#28C76F']].map(([label, c]) => (
          <div key={label} style={{ fontSize: '0.65rem', fontWeight: 700, color: c }}>{label}</div>
        ))}
        {[['Write chapter 3\nResearch competitors', ''],['Q2 analytics (65%)',''],['Landing page copy',''],['Morning standup\nMeditation (done)','']].map(([content], i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {content.split('\n').map(t => <div key={t} style={{ background: '#373B50', borderRadius: 5, padding: '6px 7px', fontSize: '0.6rem', color: i === 3 ? 'rgba(231,227,252,.4)' : 'rgba(231,227,252,.7)', textDecoration: i === 3 ? 'line-through' : 'none' }}>{t}</div>)}
          </div>
        ))}
      </div>
    </div>
  )

  if (mod === 'goals') return (
    <div>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(231,227,252,.4)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 }}>Goal Progress</div>
      {[['Read 12 books','58%','#C97C4A','65%','slightly behind'],['Run 500km','72%','#28C76F','60%','ahead of pace'],['Save $5,000','83%','#00BAD1','75%','ahead']].map(([label, pct, c, expected, note]) => (
        <div key={label as string} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(231,227,252,.75)' }}>{label}</span>
            <span style={{ fontSize: '0.7rem', color: c as string, fontWeight: 700 }}>{pct}</span>
          </div>
          <div style={{ background: '#25293C', height: 6, borderRadius: 9999, position: 'relative' }}>
            <div style={{ background: c as string, width: pct as string, height: 6, borderRadius: 9999 }} />
          </div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(231,227,252,.3)', marginTop: 2 }}>Expected {expected} — {note}</div>
        </div>
      ))}
    </div>
  )

  if (mod === 'habits') return (
    <div>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(231,227,252,.4)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 12 }}>Habit Tracker</div>
      {[['tabler-yin-yang','Morning Meditation','#00BAD1',21,19,'21d'],['tabler-run','5km Run','#28C76F',21,12,'12d'],['tabler-notebook','Journaling','#C97C4A',21,8,'8d']].map(([icon, label, c, total, done, streak]) => (
        <div key={label as string} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: `${c}26`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className={icon as string} style={{ fontSize: 14, color: c as string }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(231,227,252,.8)' }}>{label}</div>
            <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
              {Array.from({ length: total as number }, (_, i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i < (done as number) ? c as string : 'rgba(255,255,255,.08)' }} />
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,159,67,.15)', color: '#FF9F43', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 9999, flexShrink: 0 }}>🔥 {streak}</div>
        </div>
      ))}
    </div>
  )

  if (mod === 'focus') return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
      <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
        <svg width='140' height='140' style={{ transform: 'rotate(-90deg)' }}>
          <circle cx='70' cy='70' r='56' fill='none' stroke='rgba(255,255,255,.06)' strokeWidth='8' />
          <circle cx='70' cy='70' r='56' fill='none' stroke='#C97C4A' strokeWidth='8' strokeDasharray={`${2 * Math.PI * 56}`} strokeDashoffset={`${2 * Math.PI * 56 * 0.35}`} strokeLinecap='round' />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'rgba(231,227,252,.9)' }}>32:17</div>
          <div style={{ fontSize: '0.6rem', color: 'rgba(231,227,252,.35)' }}>Focus Session</div>
        </div>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'rgba(231,227,252,.55)', marginBottom: 14 }}>Deep Work · Session 2 of 4</div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className='tabler-player-skip-back' style={{ fontSize: 16, color: 'rgba(231,227,252,.5)' }} /></div>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#C97C4A', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(201,124,74,.5)' }}><i className='tabler-player-pause' style={{ fontSize: 22, color: '#fff' }} /></div>
        <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className='tabler-player-skip-forward' style={{ fontSize: 16, color: 'rgba(231,227,252,.5)' }} /></div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(231,227,252,.4)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 10 }}>Module Preview</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: 32 }}>
        <i className={`tabler-${mod === 'mood' ? 'mood-smile' : 'calendar'}`} style={{ fontSize: 64, color: `${color}66` }} />
      </div>
    </div>
  )
}

export default OurTeam
