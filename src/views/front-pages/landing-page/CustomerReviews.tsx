'use client'

// React Imports
import { useState, useEffect } from 'react'

const SLIDES = [
  [
    { initials: 'SK', bg: 'rgba(201,124,74,.12)', color: '#C97C4A', name: 'Sara K.', role: 'Freelance designer, early tester', quote: 'I\'ve tried every productivity app out there. LifeSync is the first one that feels like it actually understands me — not just my tasks.' },
    { initials: 'MR', bg: 'rgba(0,186,209,.12)', color: '#00BAD1', name: 'Marcus R.', role: 'Software engineer, beta user', quote: 'The mood + habit correlation insight blew my mind. I had no idea my energy crashes were tied to skipping my morning run.' },
    { initials: 'JL', bg: 'rgba(40,199,111,.12)', color: '#28C76F', name: 'Jess L.', role: 'Therapist & coach, early tester', quote: 'The journal is the first place I\'ve felt truly safe writing. Knowing it\'s encrypted makes me more honest with myself.' }
  ],
  [
    { initials: 'AP', bg: 'rgba(115,103,240,.12)', color: '#7367F0', name: 'Alex P.', role: 'Entrepreneur, early tester', quote: 'I finally understand why some weeks feel great and others feel off. The analytics are genuinely eye-opening.' },
    { initials: 'NW', bg: 'rgba(255,159,67,.12)', color: '#FF9F43', name: 'Nina W.', role: 'Product manager, beta user', quote: 'Setting up goals linked to daily habits was a game-changer. I can see exactly how my small actions compound.' },
    { initials: 'DT', bg: 'rgba(201,124,74,.12)', color: '#C97C4A', name: 'David T.', role: 'Writer & researcher', quote: 'The focus timer with ambient sounds is so good I actually look forward to deep work sessions now. Wild.' }
  ]
]

const CustomerReviews = () => {
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % 2), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section style={{ padding: '96px 32px', background: '#F8F4EF' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(201,124,74,.08)', color: '#A8612E', borderRadius: 9999, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase', marginBottom: 16 }}>
            <i className='tabler-heart' /> Early users
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'rgba(47,43,61,.92)', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            People are{' '}
            <em style={{ fontStyle: 'normal', fontFamily: 'Georgia, serif', color: '#C97C4A', fontWeight: 700 }}>already loving it</em>
          </h2>
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', transition: 'transform .55s cubic-bezier(.22,1,.36,1)', transform: `translateX(-${slide * 100}%)` }}>
            {SLIDES.map((group, si) => (
              <div key={si} style={{ minWidth: '100%', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, padding: '4px' }}>
                {group.map(({ initials, bg, color, name, role, quote }) => (
                  <div key={name} style={{ background: '#fff', borderRadius: 16, padding: '26px 24px', boxShadow: '0 2px 16px rgba(47,43,61,.07)' }}>
                    <div style={{ color: '#FF9F43', fontSize: '0.75rem', marginBottom: 12, letterSpacing: 1 }}>★★★★★</div>
                    <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '0.9375rem', color: 'rgba(47,43,61,.78)', lineHeight: 1.7, marginBottom: 18 }}>&ldquo;{quote}&rdquo;</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{initials}</div>
                      <div>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(47,43,61,.85)' }}>{name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(47,43,61,.45)' }}>{role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}>
          {[0, 1].map(i => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              style={{ border: 'none', cursor: 'pointer', borderRadius: 9999, background: slide === i ? '#C97C4A' : 'rgba(47,43,61,.2)', width: slide === i ? 22 : 7, height: 7, padding: 0, transition: 'all .3s' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CustomerReviews
