'use client'

// React Imports
import { useState } from 'react'

// Type Imports
import type { SystemMode } from '@core/types'

const GetStarted = ({ mode }: { mode: SystemMode }) => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #2B2740 0%, #372E50 100%)', padding: '96px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'rgba(201,124,74,.18)', top: -80, left: -60, filter: 'blur(60px)', pointerEvents: 'none', animation: 'ls-orb1 18s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: 'rgba(115,103,240,.12)', bottom: -60, right: -40, filter: 'blur(60px)', pointerEvents: 'none', animation: 'ls-orb2 22s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'rgba(40,199,111,.08)', top: '40%', right: '20%', filter: 'blur(60px)', pointerEvents: 'none', animation: 'ls-orb3 14s ease-in-out infinite' }} />

      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, color: '#F7F3EE', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Ready to build the life{' '}
          <em style={{ fontStyle: 'normal', fontFamily: 'Georgia, serif', color: '#DBA07A', fontWeight: 700 }}>you actually want?</em>
        </h2>
        <p style={{ fontSize: '1.0625rem', color: 'rgba(247,243,238,.6)', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Join thousands of people using LifeSync to turn scattered habits, tasks, and goals into a life that compounds in the right direction.
        </p>

        {submitted ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#28C76F', fontWeight: 600, fontSize: '1rem' }}>
            <i className='tabler-circle-check' style={{ fontSize: 22 }} />
            You&apos;re on the list! We&apos;ll be in touch soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 460, margin: '0 auto', background: 'rgba(255,255,255,.07)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 13, padding: '7px 7px 7px 18px' }}>
            <input
              type='email'
              placeholder='your@email.com'
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'inherit', fontSize: '0.9375rem', color: 'rgba(247,243,238,.9)' }}
            />
            <button
              type='submit'
              style={{ background: '#C97C4A', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 22px', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'background 200ms', whiteSpace: 'nowrap', boxShadow: '0 2px 10px rgba(201,124,74,.4)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#A8612E')}
              onMouseLeave={e => (e.currentTarget.style.background = '#C97C4A')}
            >
              Get early access
            </button>
          </form>
        )}
        <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'rgba(247,243,238,.35)' }}>Free forever · No credit card · Unsubscribe anytime</div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#1E1B2E', margin: '96px -32px -96px', padding: '60px 32px 32px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: '#C97C4A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 17, fontWeight: 800 }}>L</div>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'rgba(247,243,238,.9)' }}>Life<span style={{ color: '#DBA07A' }}>Sync</span></span>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(247,243,238,.4)', lineHeight: 1.6, maxWidth: 220 }}>
                Your personal OS for habits, goals, mood, tasks, and focus — all beautifully connected.
              </div>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Modules', 'Pricing', 'Roadmap', 'Changelog'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Security', 'Cookie Policy'] }
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'rgba(247,243,238,.7)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 }}>{title}</h4>
                {links.map(link => <a key={link} href='#' style={{ display: 'block', fontSize: '0.875rem', color: 'rgba(247,243,238,.4)', textDecoration: 'none', marginBottom: 8 }}>{link}</a>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(247,243,238,.5)' }}>© 2026 LifeSync. All rights reserved.</span>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(247,243,238,.25)' }}>Made with care for people who care about their lives.</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes ls-orb1 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(60px,-40px) scale(1.1); } 66% { transform:translate(-30px,50px) scale(.95); } }
        @keyframes ls-orb2 { 0%,100% { transform:translate(0,0) scale(1); } 33% { transform:translate(-50px,30px) scale(.9); } 66% { transform:translate(40px,-60px) scale(1.05); } }
        @keyframes ls-orb3 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(-40px,-30px); } }
      `}</style>
    </div>
  )
}

export default GetStarted
