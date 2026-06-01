'use client'

// index.tsx — assembles the v2 landing page: nav, hero, stats, the connected-story
// centerpiece, every module demo, core suite, testimonials, FAQ, CTA and footer.
// Ported from landing/app.jsx.

import { useEffect, useState } from 'react'

import { Reveal, SectionHead, T } from './shared'
import { CTA, FAQ, Footer, Hero, Nav, StatsBand, Testimonials } from './Sections'
import { ConnectedStory } from './ConnectedStory'
import {
  AnalyticsSection,
  DecisionSection,
  FocusSection,
  GoalsSection,
  HabitsSection,
  MoodSection,
  ProjectsSection,
  WealthSection
} from './Modules'

// ─── CORE SUITE STRIP ─────────────────────────────────────────
const CORE = [
  { name: 'Smart Tasks', icon: 'tabler-checklist', color: '#7367F0', desc: 'Priorities, subtasks, recurring rules and project links — your day, organized.' },
  { name: 'Calendar', icon: 'tabler-calendar-month', color: '#808390', desc: 'Time-block tasks, habits and focus sessions in one unified week & month view.' },
  { name: 'Daily Dashboard', icon: 'tabler-layout-dashboard', color: '#C97C4A', desc: 'Every module distilled into one morning glance — what matters, right now.' }
]

function CoreSuite() {
  return (
    <section style={{ padding: '88px 0', background: T.paper }}>
      <div style={{ maxWidth: T.maxw, margin: '0 auto', padding: '0 32px' }}>
        <SectionHead
          accent={T.primary}
          icon='tabler-apps'
          eyebrow='The rest of the suite'
          title={
            <>
              And the everyday{' '}
              <span className='ls-serif-em' style={{ color: T.primary }}>
                essentials
              </span>
            </>
          }
          sub='The connective tissue that keeps it all running — quietly powerful, never in the way.'
        />
        <div className='ls-grid-3' style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 50 }}>
          {CORE.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.1}>
              <div
                style={{ background: T.paper2, border: `1px solid ${T.border}`, borderRadius: 18, padding: '28px 26px', height: '100%', transition: 'transform .25s, box-shadow .25s' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = T.shadowMd
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${m.color}1a`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <i className={m.icon} style={{ fontSize: 26, color: m.color }} />
                </div>
                <h3 style={{ fontSize: '1.12rem', fontWeight: 700, color: T.fg1, marginBottom: 8 }}>{m.name}</h3>
                <p style={{ fontSize: '.9rem', color: T.fg2, lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function ModulesIntro() {
  return (
    <section style={{ padding: '78px 0 12px', textAlign: 'center' }}>
      <div style={{ maxWidth: T.maxw, margin: '0 auto', padding: '0 32px' }}>
        <SectionHead
          accent={T.primary}
          icon='tabler-stack-2'
          eyebrow='Explore every module'
          title={
            <>
              Eleven modules,{' '}
              <span className='ls-serif-em' style={{ color: T.primary }}>
                one living system
              </span>
            </>
          }
          sub="Each demo below plays itself as you scroll — then it's yours to poke, drag and try. Go ahead."
        />
      </div>
    </section>
  )
}

const LandingPageWrapper = () => {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const prefers = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefers) setReduceMotion(true)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('ls-reduce-motion', reduceMotion)
  }, [reduceMotion])

  return (
    <div style={{ background: T.page, color: T.fg1, fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>
      <Nav reduceMotion={reduceMotion} onToggleMotion={() => setReduceMotion(m => !m)} />
      <Hero />
      <StatsBand />
      <ConnectedStory />
      <ModulesIntro />
      <GoalsSection />
      <HabitsSection />
      <FocusSection />
      <MoodSection />
      <ProjectsSection />
      <WealthSection />
      <AnalyticsSection />
      <DecisionSection />
      <CoreSuite />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

export default LandingPageWrapper
