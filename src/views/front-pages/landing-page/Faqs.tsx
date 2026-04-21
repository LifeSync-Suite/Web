'use client'

// React Imports
import { useState } from 'react'

const FAQS = [
  { q: 'Is LifeSync really free to get started?', a: 'Yes. Early access is completely free — no credit card required. We plan to keep a generous free tier forever, with optional premium features for power users down the road.' },
  { q: 'How is my journal data protected?', a: 'Journal entries are end-to-end encrypted before they ever leave your device. We cannot read your entries — not even if we wanted to. Your emotional life is yours alone.' },
  { q: 'Is there a mobile app?', a: 'iOS and Android apps are in active development and coming soon. The web app works great on mobile browsers in the meantime — it\'s fully responsive.' },
  { q: 'How is LifeSync different from Notion, Todoist, or Habitica?', a: 'Those are great tools for individual workflows. LifeSync is different because every module talks to every other — your focus session logs to your task, your habit completion feeds your mood analytics, your goal progress updates from linked habits. It\'s a connected system, not a collection of separate trackers.' },
  { q: 'Can I import my data from other apps?', a: 'Imports from Todoist, Notion, Google Tasks, and Apple Reminders are on the early roadmap. We want moving to LifeSync to feel effortless.' },
  { q: 'Do you sell my data or show ads?', a: 'Never. No ads. No data selling. No third-party tracking. LifeSync is funded by optional subscriptions — your attention is not the product.' }
]

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section style={{ padding: '96px 32px', background: '#fff' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,124,74,.08)', color: '#A8612E', borderRadius: 9999, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: 16 }}>
            <i className='tabler-help' /> FAQ
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'rgba(47,43,61,.92)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            Good questions,{' '}
            <em style={{ fontStyle: 'normal', fontFamily: 'Georgia, serif', color: '#C97C4A', fontWeight: 700 }}>honest answers</em>
          </h2>
        </div>

        <div style={{ maxWidth: 720, margin: '48px auto 0' }}>
          {FAQS.map(({ q, a }, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(47,43,61,.09)', overflow: 'hidden' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 600, color: 'rgba(47,43,61,.88)', cursor: 'pointer' }}
              >
                <span>{q}</span>
                <i className='tabler-plus' style={{ fontSize: 18, color: '#C97C4A', transition: 'transform 250ms', transform: open === i ? 'rotate(45deg)' : 'none', flexShrink: 0 }} />
              </button>
              <div style={{ fontSize: '0.9375rem', color: 'rgba(47,43,61,.6)', lineHeight: 1.7, maxHeight: open === i ? 300 : 0, overflow: 'hidden', transition: 'max-height 350ms ease, padding-bottom 300ms', paddingBottom: open === i ? 18 : 0 }}>
                {a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
