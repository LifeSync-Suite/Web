'use client'

// React Imports
import { useEffect, useRef } from 'react'

// Type Imports
import type { SystemMode } from '@core/types'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

const PARTICLE_COLORS = ['201,124,74', '115,103,240', '40,199,111', '0,186,209']

const HeroSection = ({ mode }: { mode: SystemMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0, H = 0
    let raf: number

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; color: string }
    const particles: Particle[] = []

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', resize)
    resize()

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: PARTICLE_COLORS[Math.floor(Math.random() * 4)]
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(201,124,74,${0.07 * (1 - dist / 120)})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`
        ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section style={{ background: '#2B2740', padding: '160px 32px 120px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,124,74,.12) 0%, transparent 70%)' }} />
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className='ls-hero-tag' style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(201,124,74,.18)', color: '#DBA07A', border: '1px solid rgba(201,124,74,.22)', borderRadius: 9999, padding: '5px 14px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.3px', marginBottom: 28 }}>
          <i className='tabler-sparkles' style={{ fontSize: 14 }} />
          Now in early access
        </div>

        <Typography component='h1' className='ls-hero-h1' style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, color: '#F7F3EE', lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 22 }}>
          Your whole life,{' '}
          <em style={{ fontStyle: 'normal', fontFamily: 'Georgia, serif', fontWeight: 700, color: '#DBA07A' }}>beautifully in sync</em>
        </Typography>

        <p className='ls-hero-sub' style={{ fontSize: '1.125rem', color: 'rgba(247,243,238,.65)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
          Tasks, habits, goals, mood, focus — all connected. LifeSync is the calm, private space where your daily life comes together and compounds into the life you want.
        </p>

        <div className='ls-hero-actions' style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 0 }}>
          <Button variant='contained' size='large' startIcon={<i className='tabler-rocket' />} href='/register'
            sx={{ background: '#C97C4A', fontWeight: 700, borderRadius: '11px', px: 4, py: 1.75, fontSize: '1rem', boxShadow: '0 4px 18px rgba(201,124,74,.4)', '&:hover': { background: '#A8612E', transform: 'translateY(-2px)', boxShadow: '0 6px 22px rgba(201,124,74,.45)' }, '&:active': { transform: 'scale(.98)' } }}>
            Get early access — it&apos;s free
          </Button>
          <Button variant='outlined' size='large' startIcon={<i className='tabler-play' />}
            sx={{ color: 'rgba(247,243,238,.85)', borderColor: 'rgba(247,243,238,.22)', fontWeight: 600, borderRadius: '11px', px: 3.5, py: 1.625, fontSize: '1rem', '&:hover': { background: 'rgba(255,255,255,.06)', borderColor: 'rgba(247,243,238,.4)' } }}>
            See how it works
          </Button>
        </div>

        <div className='ls-hero-trust' style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          {[{ icon: 'tabler-lock', label: 'End-to-end encrypted' }, { icon: 'tabler-device-mobile', label: 'iOS & Android coming soon' }, { icon: 'tabler-heart', label: 'No ads, ever' }].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.8125rem', color: 'rgba(247,243,238,.55)', fontWeight: 500 }}>
              <i className={icon} style={{ fontSize: 15, color: '#DBA07A' }} />{label}
            </div>
          ))}
        </div>

        {/* App Mockup */}
        <div className='ls-hero-mockup' style={{ marginTop: 60, position: 'relative', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto' }}>
          <MockupBadge icon='tabler-flame' iconColor='#FF9F43' label='🔥 12-day streak!' style={{ top: '18%', left: -80 }} delay='1.4s' />
          <MockupBadge icon='tabler-circle-check' iconColor='#28C76F' label='Goal: ahead of pace' style={{ bottom: '22%', right: -80 }} delay='1.7s' />
          <MockupBadge icon='tabler-focus-2' iconColor='#C97C4A' label='3h 20m focus today' style={{ top: '50%', left: -90 }} delay='2s' />

          <div style={{ background: '#2F3349', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.06)', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: 48, background: '#25293C', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: 14 }}>
              {[['tabler-layout-dashboard', true], ['tabler-checklist', false], ['tabler-flame', false], ['tabler-mood-smile', false], ['tabler-focus-2', false], ['tabler-target', false]].map(([icon, active], i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, background: active ? 'rgba(201,124,74,.2)' : 'transparent', color: active ? '#C97C4A' : 'rgba(231,227,252,.35)' }}>
                  <i className={icon as string} />
                </div>
              ))}
            </div>
            <div style={{ flex: 1, padding: 16 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(231,227,252,.5)', marginBottom: 8 }}>Good morning, Jordan 👋</div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                {[['8/12', 'Tasks today', '#C97C4A', '66%'], ['12 days', 'Habit streak', '#28C76F', '80%'], ['Focused', 'Mood today', '#00BAD1', '75%']].map(([num, label, color, pct]) => (
                  <div key={label as string} style={{ flex: 1, background: '#373B50', borderRadius: 8, padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: color as string }}>{num}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(231,227,252,.4)', marginTop: 1 }}>{label}</div>
                    <div style={{ background: '#25293C', height: 4, borderRadius: 9999, marginTop: 6 }}>
                      <div style={{ background: color as string, width: pct as string, height: 4, borderRadius: 9999 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 2, background: '#373B50', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(231,227,252,.45)', marginBottom: 7 }}>Goal Progress</div>
                  {[['Read 12 books', '58%', '#C97C4A'], ['Run 500km', '72%', '#28C76F']].map(([label, pct, color]) => (
                    <div key={label as string} style={{ marginBottom: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: '0.6rem', color: 'rgba(231,227,252,.6)' }}>{label}</span>
                        <span style={{ fontSize: '0.6rem', color: color as string, fontWeight: 700 }}>{pct}</span>
                      </div>
                      <div style={{ background: '#25293C', height: 3, borderRadius: 9999 }}>
                        <div style={{ background: color as string, width: pct as string, height: 3, borderRadius: 9999 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, background: '#373B50', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(231,227,252,.45)', marginBottom: 4 }}>Focus today</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#C97C4A' }}>3h 20m</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(231,227,252,.35)', marginTop: 2 }}>4 sessions</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 3 }}>
                    {[1, 2, 3, 4].map(i => <div key={i} style={{ width: 10, height: 10, borderRadius: 3, background: i < 4 ? '#C97C4A' : 'rgba(201,124,74,.25)' }} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ls-fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ls-floatSlow { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-14px); } }
        @keyframes ls-badgePop { 0% { transform:scale(0) rotate(-10deg); opacity:0; } 70% { transform:scale(1.1) rotate(2deg); } 100% { transform:scale(1) rotate(0); opacity:1; } }
        .ls-hero-tag { animation: ls-fadeUp .7s cubic-bezier(.22,1,.36,1) .1s both; }
        .ls-hero-h1 { animation: ls-fadeUp .8s cubic-bezier(.22,1,.36,1) .25s both; }
        .ls-hero-sub { animation: ls-fadeUp .8s cubic-bezier(.22,1,.36,1) .4s both; }
        .ls-hero-actions { animation: ls-fadeUp .8s cubic-bezier(.22,1,.36,1) .55s both; }
        .ls-hero-trust { animation: ls-fadeUp .7s cubic-bezier(.22,1,.36,1) .7s both; }
        .ls-hero-mockup { animation: ls-fadeUp 1s cubic-bezier(.22,1,.36,1) .85s both, ls-floatSlow 7s ease-in-out 2s infinite; }
      `}</style>
    </section>
  )
}

const MockupBadge = ({ icon, iconColor, label, style, delay }: { icon: string; iconColor: string; label: string; style: React.CSSProperties; delay: string }) => (
  <div style={{ position: 'absolute', background: '#fff', borderRadius: 12, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.75rem', fontWeight: 700, color: 'rgba(47,43,61,.85)', boxShadow: '0 8px 24px rgba(47,43,61,.18)', whiteSpace: 'nowrap', zIndex: 2, animation: `ls-badgePop .6s cubic-bezier(.22,1,.36,1) ${delay} both`, ...style }}>
    <i className={icon} style={{ fontSize: 16, color: iconColor }} />{label}
  </div>
)

export default HeroSection
