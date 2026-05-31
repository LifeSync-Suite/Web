'use client'

import { useState } from 'react'

// ─── PALETTE ──────────────────────────────────────────────────
const PRIMARY = '#C97C4A'
const PRIMARY_8  = 'rgba(201,124,74,.08)'
const PRIMARY_16 = 'rgba(201,124,74,.16)'
const SUCCESS = '#28C76F'
const WARNING = '#FF9F43'
const DANGER  = '#FF4C51'

// ─── STATIC DATA ─────────────────────────────────────────────
const USER_VALUES = [
  { id:'v1', name:'Growth',             icon:'tabler-trending-up',  color:'#7367F0', weight:0.20 },
  { id:'v2', name:'Financial Security', icon:'tabler-coin',          color:'#28C76F', weight:0.18 },
  { id:'v3', name:'Autonomy',           icon:'tabler-key',           color:'#C97C4A', weight:0.14 },
  { id:'v4', name:'Career Trajectory',  icon:'tabler-stairs-up',    color:'#C9A96E', weight:0.13 },
  { id:'v5', name:'Health',             icon:'tabler-heartbeat',     color:'#FF4C51', weight:0.10 },
  { id:'v6', name:'Family',             icon:'tabler-users',         color:'#00BAD1', weight:0.10 },
  { id:'v7', name:'Stability',          icon:'tabler-anchor',        color:'#6B8F71', weight:0.08 },
  { id:'v8', name:'Adventure',          icon:'tabler-mountain',      color:'#FF9F43', weight:0.07 },
]

const STAKES_META: Record<string, { label:string; color:string; icon:string }> = {
  low:  { label:'Low',    color:'#6B8F71', icon:'tabler-leaf'     },
  med:  { label:'Medium', color:'#FF9F43', icon:'tabler-flame'    },
  high: { label:'High',   color:'#FF4C51', icon:'tabler-mountain' },
}

type Decision = {
  id:string; title:string; description:string; stakes:string; reversibility:string
  status:string; created_at:string; decided_at:string|null; chosen_label?:string; winning_score?:number
  criteria?:{ id:string; name:string; color:string; weight:number }[]
  options?:{ id:string; label:string; description:string; scores:Record<string,{ impact:number; confidence:string }> }[]
}

const SAMPLE_DECISION: Decision = {
  id:'d-concordia',
  title:'Accept the Concordia MASc offer?',
  description:"Two-year funded research master's. Decision deadline May 28.",
  stakes:'high', reversibility:'hard',
  status:'scored', created_at:'2026-05-12', decided_at:null,
  criteria: USER_VALUES.map(v => ({ id:'c'+v.id, name:v.name, color:v.color, weight:v.weight })),
  options: [
    {
      id:'o1', label:'Accept Concordia MASc', description:'Move to Montreal, start September, two-year program',
      scores:{ cv1:{impact:+5,confidence:'high'}, cv2:{impact:-3,confidence:'high'}, cv3:{impact:+2,confidence:'med'}, cv4:{impact:+4,confidence:'med'}, cv5:{impact:-1,confidence:'med'}, cv6:{impact:+1,confidence:'med'}, cv7:{impact:-2,confidence:'med'}, cv8:{impact:+3,confidence:'high'} },
    },
    {
      id:'o2', label:'Stay at current job', description:'Continue as Senior Engineer, decline the offer',
      scores:{ cv1:{impact:-2,confidence:'high'}, cv2:{impact:+2,confidence:'high'}, cv3:{impact:0,confidence:'med'}, cv4:{impact:-1,confidence:'med'}, cv5:{impact:+1,confidence:'med'}, cv6:{impact:0,confidence:'high'}, cv7:{impact:+4,confidence:'high'}, cv8:{impact:-2,confidence:'high'} },
    },
    {
      id:'o3', label:'Apply elsewhere next cycle', description:'Decline, work on stronger applications for Fall 2027',
      scores:{ cv1:{impact:+1,confidence:'low'}, cv2:{impact:0,confidence:'low'}, cv3:{impact:0,confidence:'low'}, cv4:{impact:0,confidence:'low'}, cv5:{impact:-1,confidence:'low'}, cv6:{impact:0,confidence:'low'}, cv7:{impact:-3,confidence:'med'}, cv8:{impact:0,confidence:'low'} },
    },
  ],
}

const HISTORY: Decision[] = [
  SAMPLE_DECISION,
  { id:'d-roomate', title:'Move out of the apartment or renew lease?', description:'Lease ends June 30. Rent has gone up 8%.', stakes:'med', reversibility:'reversible', status:'committed', created_at:'2026-04-02', decided_at:'2026-04-09', chosen_label:'Renew with a 1-year', winning_score:71 },
  { id:'d-bike',    title:'Buy the e-bike now or wait for fall sale?', description:'$2,200 vs likely $1,650 in October.', stakes:'low', reversibility:'reversible', status:'committed', created_at:'2026-03-21', decided_at:'2026-03-22', chosen_label:'Wait until October', winning_score:64 },
  { id:'d-fitness', title:'Hire a strength coach for 3 months?', description:'$420/mo. Goal: rebuild posture after office injury.', stakes:'med', reversibility:'reversible', status:'draft', created_at:'2026-05-18', decided_at:null },
]

// ─── SCORING ──────────────────────────────────────────────────
type DecisionOption = { id:string; label:string; description:string; scores:Record<string,{ impact:number; confidence:string }> }
type DecisionCriterion = { id:string; name:string; color:string; weight:number }

function computeDisplayScore(option: DecisionOption, criteria: DecisionCriterion[]) {
  let raw = 0
  for (const c of criteria) {
    const sc = option.scores['c' + c.id] || option.scores[c.id]
    if (!sc) continue
    raw += c.weight * sc.impact
  }
  return Math.round(((raw + 5) / 10) * 100)
}

function rankOptions(decision: Decision) {
  if (!decision.options || !decision.criteria) return []
  const criteria = decision.criteria as DecisionCriterion[]
  return decision.options.map(o => ({
    ...o,
    score: computeDisplayScore(o as DecisionOption, criteria),
  })).sort((a,b) => b.score - a.score)
}

// ─── SHARED COMPONENTS ────────────────────────────────────────
function StakesPill({ value }: { value:string }) {
  const s = STAKES_META[value] || STAKES_META.med
  return (
    <span style={{ fontSize:'.65rem', fontWeight:700, padding:'3px 9px', borderRadius:9999, background:`${s.color}15`, color:s.color, display:'inline-flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>
      <i className={s.icon} style={{ fontSize:11 }} />{s.label} stakes
    </span>
  )
}

function GhostBtn({ children, icon, onClick }: { children:React.ReactNode; icon?:string; onClick?:()=>void }) {
  return (
    <button onClick={onClick} style={{ background:'none', border:'1.5px solid var(--mui-palette-divider)', borderRadius:8, padding:'8px 16px', fontSize:'.8rem', fontWeight:600, color:'var(--mui-palette-text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
      {icon && <i className={icon} style={{ fontSize:14 }} />}{children}
    </button>
  )
}
function PrimaryBtn({ children, icon, onClick }: { children:React.ReactNode; icon?:string; onClick?:()=>void }) {
  return (
    <button onClick={onClick} style={{ background:PRIMARY, color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontSize:'.8rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 6px rgba(201,124,74,.3)' }}>
      {icon && <i className={icon} style={{ fontSize:14 }} />}{children}
    </button>
  )
}

// ─── LIST VIEW ────────────────────────────────────────────────
function ListView({ history, onOpen, onNew, onResults }: { history:Decision[]; onOpen:(id:string)=>void; onNew:()=>void; onResults:(id:string)=>void }) {
  const drafts    = history.filter(d => d.status === 'draft')
  const active    = history.filter(d => d.status === 'scored')
  const committed = history.filter(d => d.status === 'committed' || d.status === 'reviewed')

  return (
    <div style={{ maxWidth:1100, margin:'0 auto' }}>
      {/* Hero */}
      <div style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:24, flexWrap:'wrap' }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.7px', color:PRIMARY, marginBottom:6 }}>
            <i className='tabler-compass' style={{ marginRight:5 }} />Decision Compass
          </div>
          <h1 style={{ fontSize:'1.875rem', fontWeight:600, color:'var(--mui-palette-text-primary)', lineHeight:1.2, fontFamily:"'Lora', serif", marginBottom:8, marginTop:0 }}>
            Decide against your values, not your mood.
          </h1>
          <div style={{ fontSize:'.9375rem', color:'var(--mui-palette-text-secondary)', maxWidth:560 }}>
            For the choices that actually matter. Score your options against the things you've already said you care about — and see where your gut and your values agree (or don't).
          </div>
        </div>
        <PrimaryBtn icon='tabler-plus' onClick={onNew}>New decision</PrimaryBtn>
      </div>

      {/* Values card */}
      <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'14px 20px', marginBottom:20, display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:34, height:34, borderRadius:9, background:`${SUCCESS}20`, display:'flex', alignItems:'center', justifyContent:'center', color:SUCCESS }}>
          <i className='tabler-check' style={{ fontSize:18 }} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'.875rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>Your values are set</div>
          <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>
            {USER_VALUES.length} values · top three: {USER_VALUES.slice(0,3).map(v=>v.name).join(' · ')}
          </div>
        </div>
        <GhostBtn icon='tabler-edit'>Adjust</GhostBtn>
      </div>

      {/* Stat row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { label:'In progress',     value: active.length + drafts.length, sub:'2 drafts · 1 scored', icon:'tabler-pencil',        color:WARNING  },
          { label:'Decided',          value: committed.length,               sub:'lifetime',             icon:'tabler-flag-check',    color:SUCCESS  },
          { label:'Outcome reviews',  value:'0',                              sub:'opens in V2',          icon:'tabler-rotate-360',    color:'#00BAD1'},
          { label:'Calibration',      value:'—',                              sub:'opens in V2',          icon:'tabler-target-arrow',  color:'#7367F0'},
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'14px 16px', display:'flex', alignItems:'center', gap:11 }}>
            <div style={{ width:38, height:38, borderRadius:9, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', color:s.color, flexShrink:0 }}>
              <i className={s.icon} style={{ fontSize:18 }} />
            </div>
            <div>
              <div style={{ fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px', color:'var(--mui-palette-text-secondary)' }}>{s.label}</div>
              <div style={{ fontSize:'1.125rem', fontWeight:700, color:'var(--mui-palette-text-primary)', lineHeight:1.2 }}>{s.value}</div>
              <div style={{ fontSize:'.65rem', color:'var(--mui-palette-text-secondary)' }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Active decisions */}
      {active.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:10 }}>Awaiting your commitment</div>
          {active.map(d => (
            <div key={d.id} style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'18px 20px', marginBottom:10, border:`1.5px solid ${PRIMARY_16}`, display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <div style={{ width:46, height:46, borderRadius:11, background:PRIMARY_16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <i className='tabler-compass' style={{ fontSize:22, color:PRIMARY }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                  <span style={{ fontSize:'1rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>{d.title}</span>
                  <StakesPill value={d.stakes} />
                  <span style={{ fontSize:'.65rem', fontWeight:700, color:'var(--mui-palette-text-secondary)', background:'var(--mui-palette-action-hover)', padding:'3px 9px', borderRadius:9999 }}>
                    {d.reversibility === 'hard' ? 'Hard to undo' : 'Reversible'}
                  </span>
                </div>
                <div style={{ fontSize:'.8125rem', color:'var(--mui-palette-text-secondary)' }}>{d.description}</div>
              </div>
              <PrimaryBtn icon='tabler-eye' onClick={() => onResults(d.id)}>See results</PrimaryBtn>
            </div>
          ))}
        </div>
      )}

      {/* Decision journal */}
      <div style={{ marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:10 }}>
          <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)' }}>Decision journal</div>
          <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)' }}>{committed.length} decided</div>
        </div>
        <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', overflow:'hidden' }}>
          {committed.map((d,i) => (
            <div key={d.id} onClick={() => onOpen(d.id)}
              style={{ padding:'14px 20px', display:'grid', gridTemplateColumns:'1fr 200px 130px 100px', gap:14, alignItems:'center', cursor:'pointer', borderBottom: i < committed.length-1 ? '1px solid var(--mui-palette-divider)' : 'none', transition:'background 150ms' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'var(--mui-palette-action-hover)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
              <div>
                <div style={{ fontSize:'.875rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>{d.title}</div>
                <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', marginTop:2 }}>{d.description}</div>
              </div>
              <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>
                <span>Chose </span><b style={{ color:'var(--mui-palette-text-primary)' }}>{d.chosen_label}</b>
              </div>
              <div><StakesPill value={d.stakes} /></div>
              <div style={{ display:'flex', alignItems:'center', gap:5, justifyContent:'flex-end', fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>
                <i className='tabler-calendar' style={{ fontSize:12 }} />
                {d.decided_at ? new Date(d.decided_at).toLocaleDateString('en-US', { month:'short', day:'numeric' }) : '—'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drafts */}
      {drafts.length > 0 && (
        <div>
          <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:10 }}>Drafts</div>
          <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'14px 20px', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:38, height:38, borderRadius:9, background:'rgba(255,159,67,.16)', display:'flex', alignItems:'center', justifyContent:'center', color:WARNING }}>
              <i className='tabler-pencil' style={{ fontSize:18 }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'.875rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>{drafts[0].title}</div>
              <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)' }}>Saved {new Date(drafts[0].created_at).toLocaleDateString('en-US', { month:'short', day:'numeric' })} · pick up where you left off</div>
            </div>
            <GhostBtn icon='tabler-arrow-right'>Resume</GhostBtn>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── RESULTS VIEW ─────────────────────────────────────────────
function ResultsView({ decision, onBack, onCommit }: { decision:Decision; onBack:()=>void; onCommit:(optionId:string)=>void }) {
  const ranked = rankOptions(decision)
  const winner = ranked[0]

  return (
    <div style={{ maxWidth:900, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--mui-palette-text-secondary)', display:'flex', alignItems:'center', gap:4, padding:'4px 0', fontSize:'.875rem' }}>
          <i className='tabler-arrow-left' style={{ fontSize:16 }} /> Back
        </button>
      </div>

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:PRIMARY, marginBottom:6 }}>Results</div>
        <h2 style={{ fontSize:'1.5rem', fontWeight:600, color:'var(--mui-palette-text-primary)', marginBottom:4, marginTop:0 }}>{decision.title}</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <StakesPill value={decision.stakes} />
          <span style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>{decision.description}</span>
        </div>
      </div>

      {/* Winner callout */}
      <div style={{ background:`linear-gradient(135deg, ${PRIMARY_8}, rgba(40,199,111,.06))`, border:`1.5px solid ${PRIMARY_16}`, borderRadius:14, padding:24, marginBottom:24 }}>
        <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:PRIMARY, marginBottom:8 }}>Values-aligned recommendation</div>
        <div style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--mui-palette-text-primary)', marginBottom:4 }}>{winner?.label}</div>
        <div style={{ fontSize:'.875rem', color:'var(--mui-palette-text-secondary)', marginBottom:16 }}>{winner?.description}</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
          <div style={{ fontSize:'2rem', fontWeight:800, color:PRIMARY }}>{winner?.score}</div>
          <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>/ 100 composite score</div>
          <div style={{ marginLeft:'auto' }}>
            <PrimaryBtn onClick={() => winner && onCommit(winner.id)}>Commit to this decision</PrimaryBtn>
          </div>
        </div>
      </div>

      {/* Score bars for all options */}
      <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'20px', marginBottom:24 }}>
        <div style={{ fontWeight:600, fontSize:'.9375rem', color:'var(--mui-palette-text-primary)', marginBottom:16 }}>Option comparison</div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {ranked.map((opt, i) => (
            <div key={opt.id}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {i === 0 && <span style={{ fontSize:'.65rem', fontWeight:700, color:PRIMARY, background:PRIMARY_16, padding:'2px 8px', borderRadius:9999 }}>Top pick</span>}
                  <span style={{ fontSize:'.875rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>{opt.label}</span>
                </div>
                <span style={{ fontSize:'1.125rem', fontWeight:800, color: i === 0 ? PRIMARY : 'var(--mui-palette-text-secondary)' }}>{opt.score}</span>
              </div>
              <div style={{ height:10, background:'var(--mui-palette-action-hover)', borderRadius:5 }}>
                <div style={{ width:`${opt.score}%`, height:'100%', background: i === 0 ? PRIMARY : 'var(--mui-palette-text-disabled)', borderRadius:5, transition:'width 600ms' }} />
              </div>
              <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)', marginTop:4 }}>{opt.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Value contributions */}
      <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'20px' }}>
        <div style={{ fontWeight:600, fontSize:'.9375rem', color:'var(--mui-palette-text-primary)', marginBottom:16 }}>How each value was scored</div>
        <div style={{ display:'grid', gridTemplateColumns:'200px 1fr 1fr 1fr', gap:'10px 16px', alignItems:'center' }}>
          <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--mui-palette-text-secondary)' }}>Value</div>
          {ranked.map(opt => (
            <div key={opt.id} style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'var(--mui-palette-text-secondary)', textAlign:'center' }}>{opt.label.length > 20 ? opt.label.substring(0,18)+'…' : opt.label}</div>
          ))}
          {decision.criteria!.map(c => (
            <>
              <div key={c.id} style={{ display:'flex', alignItems:'center', gap:6, fontSize:'.8rem', color:'var(--mui-palette-text-primary)' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:c.color, flexShrink:0 }} />
                {c.name}
              </div>
              {ranked.map(opt => {
                const sc = opt.scores['c' + c.id] || opt.scores[c.id]
                const impact = sc?.impact ?? 0
                const color = impact > 0 ? SUCCESS : impact < 0 ? DANGER : 'var(--mui-palette-text-disabled)'
                return (
                  <div key={opt.id} style={{ textAlign:'center', fontSize:'.875rem', fontWeight:700, color }}>
                    {impact > 0 ? `+${impact}` : impact}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── DETAIL VIEW ──────────────────────────────────────────────
function DetailView({ decision, onBack }: { decision:Decision; onBack:()=>void }) {
  return (
    <div style={{ maxWidth:700, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--mui-palette-text-secondary)', display:'flex', alignItems:'center', gap:4, padding:'4px 0', fontSize:'.875rem' }}>
          <i className='tabler-arrow-left' style={{ fontSize:16 }} /> Back to decisions
        </button>
      </div>

      <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:14, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:28, marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:16 }}>
          <div style={{ width:46, height:46, borderRadius:11, background:`${SUCCESS}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <i className='tabler-flag-check' style={{ fontSize:24, color:SUCCESS }} />
          </div>
          <div>
            <div style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--mui-palette-text-primary)', marginBottom:4 }}>{decision.title}</div>
            <div style={{ fontSize:'.875rem', color:'var(--mui-palette-text-secondary)' }}>{decision.description}</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, padding:'16px 0', borderTop:'1px solid var(--mui-palette-divider)', borderBottom:'1px solid var(--mui-palette-divider)', marginBottom:16 }}>
          {[
            { label:'Chose', value:decision.chosen_label || '—', color:'var(--mui-palette-text-primary)' },
            { label:'Score', value:`${decision.winning_score || 0}/100`, color:PRIMARY },
            { label:'Decided', value:decision.decided_at ? new Date(decision.decided_at).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : '—', color:'var(--mui-palette-text-secondary)' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.4px', color:'var(--mui-palette-text-secondary)', marginBottom:3 }}>{s.label}</div>
              <div style={{ fontSize:'1rem', fontWeight:700, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <StakesPill value={decision.stakes} />
          <span style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>{decision.reversibility === 'hard' ? 'Hard to undo' : 'Reversible'}</span>
        </div>
      </div>

      <div style={{ background:`${SUCCESS}10`, border:`1px solid ${SUCCESS}30`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', gap:14 }}>
        <i className='tabler-rotate-360' style={{ fontSize:20, color:SUCCESS, flexShrink:0 }} />
        <div>
          <div style={{ fontSize:'.875rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>Outcome review coming in V2</div>
          <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)', marginTop:2 }}>Set a check-in date to reflect on whether this decision played out as expected.</div>
        </div>
      </div>
    </div>
  )
}

// ─── NEW DECISION WIZARD ──────────────────────────────────────
function NewDecisionWizard({ onCancel, onFinish }: { onCancel:()=>void; onFinish:()=>void }) {
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [stakes, setStakes] = useState('med')

  const steps = ['Frame it', 'Options', 'Score', 'Review']

  return (
    <div style={{ maxWidth:700, margin:'0 auto' }}>
      {/* Progress */}
      <div style={{ display:'flex', gap:0, marginBottom:32, background:'var(--mui-palette-background-paper)', borderRadius:12, padding:'4px', boxShadow:'0 1px 4px rgba(47,43,61,.06)' }}>
        {steps.map((s,i) => (
          <button key={s} onClick={() => i <= step && setStep(i)} style={{
            flex:1, padding:'10px 8px', borderRadius:9, border:'none', fontSize:'.8125rem', fontWeight:600,
            background: i === step ? PRIMARY : 'transparent',
            color: i === step ? '#fff' : i < step ? PRIMARY : 'var(--mui-palette-text-secondary)',
            cursor: i <= step ? 'pointer' : 'default',
            transition:'all 180ms',
          }}>
            {i < step && <i className='tabler-check' style={{ fontSize:12, marginRight:4 }} />}
            {s}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div>
            <h2 style={{ fontSize:'1.25rem', fontWeight:600, color:'var(--mui-palette-text-primary)', marginTop:0, marginBottom:4 }}>What decision are you facing?</h2>
            <p style={{ fontSize:'.875rem', color:'var(--mui-palette-text-secondary)', margin:'0 0 16px' }}>Be specific. "Should I accept X?" is better than "Job decision".</p>
          </div>
          <div>
            <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:6 }}>Decision title</div>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='e.g. Accept the Concordia MASc offer?'
              style={{ width:'100%', border:'1.5px solid var(--mui-palette-divider)', borderRadius:8, padding:'12px 14px', fontSize:'1rem', background:'var(--mui-palette-background-paper)', color:'var(--mui-palette-text-primary)', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div>
            <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:6 }}>Context (optional)</div>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder='Key context, deadline, what makes this hard...' rows={3}
              style={{ width:'100%', border:'1.5px solid var(--mui-palette-divider)', borderRadius:8, padding:'12px 14px', fontSize:'.875rem', background:'var(--mui-palette-background-paper)', color:'var(--mui-palette-text-primary)', outline:'none', resize:'vertical', boxSizing:'border-box' }} />
          </div>
          <div>
            <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:8 }}>Stakes</div>
            <div style={{ display:'flex', gap:8 }}>
              {Object.entries(STAKES_META).map(([k,v]) => (
                <button key={k} onClick={() => setStakes(k)} style={{
                  flex:1, padding:'12px 10px', borderRadius:10, border:`1.5px solid ${stakes===k ? v.color : 'var(--mui-palette-divider)'}`,
                  background: stakes===k ? `${v.color}12` : 'transparent',
                  cursor:'pointer', transition:'all 180ms', display:'flex', flexDirection:'column', alignItems:'center', gap:6,
                }}>
                  <i className={v.icon} style={{ fontSize:18, color: stakes===k ? v.color : 'var(--mui-palette-text-secondary)' }} />
                  <span style={{ fontSize:'.825rem', fontWeight:700, color: stakes===k ? v.color : 'var(--mui-palette-text-secondary)' }}>{v.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <h2 style={{ fontSize:'1.25rem', fontWeight:600, color:'var(--mui-palette-text-primary)', marginTop:0, marginBottom:4 }}>What are your options?</h2>
            <p style={{ fontSize:'.875rem', color:'var(--mui-palette-text-secondary)', margin:0 }}>List 2–5 options including a "do nothing" or status quo where relevant.</p>
          </div>
          {['Option A', 'Option B', 'Option C (optional)'].map((ph, i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ width:28, height:28, borderRadius:8, background:PRIMARY_16, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.8rem', fontWeight:700, color:PRIMARY }}>{String.fromCharCode(65+i)}</div>
              <input placeholder={ph} style={{ flex:1, border:'1.5px solid var(--mui-palette-divider)', borderRadius:8, padding:'10px 12px', fontSize:'.875rem', background:'var(--mui-palette-background-paper)', color:'var(--mui-palette-text-primary)', outline:'none' }} />
            </div>
          ))}
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ fontSize:'1.25rem', fontWeight:600, color:'var(--mui-palette-text-primary)', marginTop:0, marginBottom:4 }}>Score each option</h2>
          <p style={{ fontSize:'.875rem', color:'var(--mui-palette-text-secondary)', margin:'0 0 20px' }}>Rate the impact of each option on your values (−5 to +5).</p>
          <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:20 }}>
            <p style={{ fontSize:'.875rem', color:'var(--mui-palette-text-secondary)', textAlign:'center', padding:'20px 0' }}>
              In a full build, each value × each option gets a −5 to +5 slider. For this prototype, the sample decision already has scores loaded. Click "Use sample" below to see results.
            </p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 style={{ fontSize:'1.25rem', fontWeight:600, color:'var(--mui-palette-text-primary)', marginTop:0, marginBottom:4 }}>Ready to see results?</h2>
          <p style={{ fontSize:'.875rem', color:'var(--mui-palette-text-secondary)', margin:'0 0 20px' }}>We'll show you which option scored highest against your values.</p>
          <div style={{ background:`${PRIMARY_8}`, border:`1px solid ${PRIMARY_16}`, borderRadius:12, padding:'16px 20px' }}>
            <p style={{ margin:0, fontSize:'.875rem', color:'var(--mui-palette-text-secondary)' }}>The sample decision "Accept the Concordia MASc offer?" will be used for demonstration.</p>
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:10, justifyContent:'space-between', marginTop:32 }}>
        <GhostBtn onClick={onCancel}>Cancel</GhostBtn>
        <div style={{ display:'flex', gap:10 }}>
          {step > 0 && <GhostBtn icon='tabler-arrow-left' onClick={() => setStep(s=>s-1)}>Back</GhostBtn>}
          {step < 3
            ? <PrimaryBtn icon='tabler-arrow-right' onClick={() => setStep(s=>s+1)}>Next</PrimaryBtn>
            : <PrimaryBtn icon='tabler-chart-bar' onClick={onFinish}>View results</PrimaryBtn>
          }
        </div>
      </div>
    </div>
  )
}

// ─── MAIN VIEW ────────────────────────────────────────────────
type Screen = 'list' | 'results' | 'detail' | 'new'

export default function DecisionsView() {
  const [screen, setScreen] = useState<Screen>('list')
  const [activeId, setActiveId] = useState<string|null>(null)
  const [history, setHistory] = useState<Decision[]>(HISTORY)

  const activeDecision = history.find(d => d.id === activeId) || SAMPLE_DECISION

  function commitDecision(optionId: string) {
    const opt = activeDecision.options?.find(o => o.id === optionId)
    const ranked = rankOptions(activeDecision)
    setHistory(prev => prev.map(d => d.id === activeDecision.id
      ? { ...d, status:'committed', chosen_label: opt?.label || 'Chosen option', decided_at:new Date().toISOString(), winning_score: ranked[0]?.score || 0 }
      : d))
    setScreen('detail')
  }

  return (
    <div style={{ padding:'0 4px' }}>
      {screen === 'list' && (
        <ListView
          history={history}
          onOpen={id => { setActiveId(id); setScreen('detail') }}
          onNew={() => setScreen('new')}
          onResults={id => { setActiveId(id); setScreen('results') }}
        />
      )}
      {screen === 'results' && (
        <ResultsView
          decision={activeDecision}
          onBack={() => setScreen('list')}
          onCommit={commitDecision}
        />
      )}
      {screen === 'detail' && (
        <DetailView
          decision={
            activeDecision.status === 'committed' || activeDecision.status === 'reviewed'
              ? activeDecision
              : { ...activeDecision, chosen_label: activeDecision.options?.[0]?.label || 'Option A', winning_score:65, decided_at:new Date().toISOString() }
          }
          onBack={() => setScreen('list')}
        />
      )}
      {screen === 'new' && (
        <NewDecisionWizard
          onCancel={() => setScreen('list')}
          onFinish={() => { setActiveId('d-concordia'); setScreen('results') }}
        />
      )}
    </div>
  )
}
