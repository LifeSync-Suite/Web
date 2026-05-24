'use client'

import { useState } from 'react'
import { useBreakpoint, isMobile } from '@/hooks/useBreakpoint'

const EMOTIONS: [string, number, number, string][] = [
  ['Excited',    80, 12, '#FF9F43'], ['Elated',     88, 22, '#28C76F'],
  ['Happy',      82, 42, '#28C76F'], ['Content',    78, 60, '#6B8F71'],
  ['Relaxed',    70, 72, '#00BAD1'], ['Calm',       65, 80, '#00BAD1'],
  ['Sleepy',     50, 88, '#808390'], ['Bored',      35, 82, '#808390'],
  ['Sad',        22, 68, '#7367F0'], ['Depressed',  15, 55, '#7367F0'],
  ['Distressed', 18, 35, '#FF4C51'], ['Frustrated', 25, 25, '#FF4C51'],
  ['Angry',      15, 15, '#FF4C51'], ['Tense',      28, 18, '#FF9F43'],
  ['Anxious',    32, 28, '#FF9F43'], ['Nervous',    38, 20, '#FF9F43'],
  ['Alert',      60, 15, '#C97C4A'], ['Focused',    68, 22, '#C97C4A'],
  ['Interested', 72, 35, '#C9A96E'], ['Pleased',    76, 50, '#28C76F'],
]

const JOURNAL_PROMPTS = [
  'What made you smile today?',
  "What's one thing you're grateful for right now?",
  'How did your energy feel throughout the day?',
  "What's one thing you want to let go of?",
]

const HISTORY = [
  { date: 'Today, 9:14 AM',     mood: 'Focused',  color: '#C97C4A', note: 'Feeling sharp and ready for deep work.' },
  { date: 'Yesterday, 8:50 PM', mood: 'Relaxed',  color: '#00BAD1', note: 'Good wind-down session. Meditation helped.' },
  { date: 'Yesterday, 2:30 PM', mood: 'Anxious',  color: '#FF9F43', note: 'Big presentation coming up. Breathe.' },
  { date: 'Mon, 9:05 AM',       mood: 'Happy',    color: '#28C76F', note: 'Great morning run. Sun was out!' },
  { date: 'Sun, 9:00 PM',       mood: 'Content',  color: '#6B8F71', note: 'Slow Sunday. Read half a chapter.' },
]

const PROMPT = JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]

export default function MoodView() {
  const [selectedMood, setSelectedMood] = useState('Focused')
  const [note, setNote]                 = useState('')
  const [saved, setSaved]               = useState(false)
  const [tab, setTab]                   = useState<'log' | 'history'>('log')
  const mobile = isMobile(useBreakpoint())

  const moodColor = EMOTIONS.find(e => e[0] === selectedMood)?.[3] ?? '#C97C4A'

  function tabStyle(active: boolean): React.CSSProperties {
    return {
      padding: '7px 16px', borderRadius: 7, border: 'none', fontSize: '.8125rem', fontWeight: 500,
      background: active ? 'var(--mui-palette-primary-main)' : 'transparent',
      color: active ? '#fff' : 'var(--mui-palette-text-disabled)', cursor: 'pointer', fontFamily: 'inherit',
    }
  }

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Tabs */}
      <div style={{ display: 'flex', background: 'var(--mui-palette-background-paper)', borderRadius: 9, padding: 4, boxShadow: '0 2px 8px rgba(47,43,61,.12)', gap: 2, width: 'fit-content', marginBottom: 20 }}>
        <button style={tabStyle(tab === 'log')}     onClick={() => setTab('log')}>Log Mood</button>
        <button style={tabStyle(tab === 'history')} onClick={() => setTab('history')}>Journal History</button>
      </div>

      {tab === 'log' && (
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 340px', gap: 16 }}>
          {/* Emotion map */}
          <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 14, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '20px' }}>
            <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)', marginBottom: 4 }}>How are you feeling?</div>
            <div style={{ fontSize: '.8rem', color: 'var(--mui-palette-text-disabled)', marginBottom: 14 }}>Tap an emotion on the map below</div>

            <div style={{ position: 'relative', width: '100%', paddingBottom: '80%', background: 'var(--mui-palette-action-hover)', borderRadius: 10, border: '1px solid var(--mui-palette-divider)', overflow: 'hidden' }}>
              {/* Axis lines */}
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--mui-palette-divider)' }} />
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--mui-palette-divider)' }} />
              {/* Labels */}
              <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 500, whiteSpace: 'nowrap' }}>High Energy</div>
              <div style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 500, whiteSpace: 'nowrap' }}>Low Energy</div>
              <div style={{ position: 'absolute', top: '50%', left: 6, transform: 'translateY(-50%)', fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 500, writingMode: 'vertical-rl', rotate: '180deg' }}>Negative</div>
              <div style={{ position: 'absolute', top: '50%', right: 6, transform: 'translateY(-50%)', fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 500, writingMode: 'vertical-rl' }}>Positive</div>

              {/* Emotion dots */}
              {EMOTIONS.map(([label, x, y, color]) => {
                const isSelected = selectedMood === label
                return (
                  <div
                    key={label}
                    onClick={() => setSelectedMood(label)}
                    title={label}
                    style={{
                      position: 'absolute', left: `${x}%`, top: `${y}%`,
                      transform: 'translate(-50%,-50%)',
                      width: isSelected ? 14 : 9, height: isSelected ? 14 : 9,
                      borderRadius: '50%', background: color,
                      border: isSelected ? '2px solid var(--mui-palette-background-paper)' : '1.5px solid rgba(255,255,255,.5)',
                      boxShadow: isSelected ? `0 0 0 3px ${color}50` : 'none',
                      cursor: 'pointer', transition: 'all 200ms', zIndex: isSelected ? 2 : 1,
                    }}
                  />
                )
              })}
            </div>

            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: moodColor, flexShrink: 0 }} />
              <div style={{ fontWeight: 600, color: moodColor, fontSize: '1rem' }}>{selectedMood}</div>
              <div style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>Tap map to change</div>
            </div>
          </div>

          {/* Journal panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '16px 18px' }}>
              <div style={{ fontSize: '.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--mui-palette-text-disabled)', marginBottom: 8 }}>Journal Prompt</div>
              <div style={{ fontSize: '.875rem', color: 'var(--mui-palette-text-primary)', fontStyle: 'italic', lineHeight: 1.5 }}>
                &ldquo;{PROMPT}&rdquo;
              </div>
            </div>

            <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '16px 18px', flex: 1 }}>
              <div style={{ fontSize: '.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--mui-palette-text-disabled)', marginBottom: 8 }}>Your note</div>
              <textarea
                value={note}
                onChange={e => { setNote(e.target.value); setSaved(false) }}
                placeholder='Write freely — this is encrypted and only yours…'
                style={{ width: '100%', minHeight: 120, border: '1px solid var(--mui-palette-divider)', borderRadius: 8, padding: '10px 12px', fontSize: '.8125rem', color: 'var(--mui-palette-text-primary)', background: 'var(--mui-palette-action-hover)', resize: 'vertical', fontFamily: '"Lora", Georgia, serif', lineHeight: 1.75, outline: 'none', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['😊', '😔', '😤', '😴', '🧘'].map(e => (
                    <button key={e} style={{ background: 'var(--mui-palette-action-hover)', border: 'none', borderRadius: 6, width: 30, height: 30, fontSize: 16, cursor: 'pointer' }}>{e}</button>
                  ))}
                </div>
                <button
                  onClick={() => setSaved(true)}
                  style={{ marginLeft: 'auto', background: moodColor, color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontSize: '.8125rem', fontWeight: 600, cursor: 'pointer', boxShadow: `0 2px 6px ${moodColor}50`, fontFamily: 'inherit' }}
                >
                  {saved ? '✓ Saved' : 'Save Entry'}
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(40,199,111,.1)', borderRadius: 9, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <i className='tabler-lock' style={{ color: '#28C76F', fontSize: 15, flexShrink: 0 }} />
              <span style={{ fontSize: '.75rem', color: '#28C76F', fontWeight: 500 }}>End-to-end encrypted. Only you can read this.</span>
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div style={{ maxWidth: 700 }}>
          {HISTORY.map((entry, i) => (
            <div key={i} style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, padding: '16px 18px', marginBottom: 10, boxShadow: '0 2px 8px rgba(47,43,61,.12)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${entry.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className='tabler-mood-smile' style={{ fontSize: 20, color: entry.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: '.875rem', color: entry.color }}>{entry.mood}</span>
                  <span style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)' }}>{entry.date}</span>
                </div>
                <div style={{ fontSize: '.8125rem', color: 'var(--mui-palette-text-secondary)', fontStyle: 'italic', lineHeight: 1.5 }}>&ldquo;{entry.note}&rdquo;</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
