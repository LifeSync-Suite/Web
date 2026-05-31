'use client'

import { useState } from 'react'

// ─── COLORS ───────────────────────────────────────────────────
const PRIMARY = '#C97C4A'
const PRIMARY_16 = 'rgba(201,124,74,.16)'
const GOALS_ORANGE = '#FF9F43'

const TONE: Record<string, { fg:string; bg:string }> = {
  success: { fg:'#28C76F', bg:'rgba(40,199,111,.16)' },
  info:    { fg:'#00BAD1', bg:'rgba(0,186,209,.16)'  },
  warning: { fg:'#FF9F43', bg:'rgba(255,159,67,.16)' },
  error:   { fg:'#FF4C51', bg:'rgba(255,76,81,.16)'  },
}

const METRIC_META: Record<string, { label:string; icon:string }> = {
  cumulative:  { label:'Cumulative',   icon:'tabler-chart-bar'     },
  count:       { label:'Count',        icon:'tabler-list-numbers'  },
  streak:      { label:'Streak',       icon:'tabler-flame'         },
  value_reach: { label:'Value reach',  icon:'tabler-arrow-bar-up'  },
  checklist:   { label:'Checklist',    icon:'tabler-checkbox'      },
}

// ─── MOCK DATA ────────────────────────────────────────────────
type GoalData = {
  id:string; title:string; unit:string; metric_type:string
  target_value:number; actual_value:number; expected_value:number
  baseline_value?:number; due_date:string|null
  linked_count:number; accent:string; emoji_icon:string; status:string
}

const OTHER_GOALS: GoalData[] = [
  { id:'g_save',  title:'Save $10,000 by year-end',    unit:'USD',   metric_type:'cumulative',  target_value:10000, actual_value:4200,  expected_value:3863, due_date:'Dec 2026', linked_count:2,  accent:'#28C76F', emoji_icon:'tabler-pig-money',  status:'active' },
  { id:'g_books', title:'Finish 12 books in 2026',      unit:'books', metric_type:'count',       target_value:12,    actual_value:5,     expected_value:5,    due_date:'Dec 2026', linked_count:4,  accent:'#7367F0', emoji_icon:'tabler-book-2',     status:'active' },
  { id:'g_med',   title:'Meditate every day',           unit:'days',  metric_type:'streak',      target_value:100,   actual_value:27,    expected_value:30,   due_date:null,       linked_count:1,  accent:'#00BAD1', emoji_icon:'tabler-yin-yang',   status:'active' },
  { id:'g_nw',    title:'Net worth reaches $50,000',    unit:'USD',   metric_type:'value_reach', target_value:50000, actual_value:42100, expected_value:41000, baseline_value:30000, due_date:'Dec 2026', linked_count:1, accent:'#C9A96E', emoji_icon:'tabler-chart-line', status:'active' },
  { id:'g_list',  title:'Complete summer reading list', unit:'tasks', metric_type:'checklist',   target_value:10,    actual_value:6,     expected_value:7,    due_date:'Sep 2026', linked_count:10, accent:'#FF9F43', emoji_icon:'tabler-list-check', status:'active' },
]

const HERO = {
  title: 'Read 5,000 pages this year',
  unit: 'pages',
  target: 5000,
  actual: 2280,
  expected: 1932,
  dayOfYear: 141,
  totalDays: 365,
  dueDate: 'Dec 31, 2026',
  bindings: [
    { id:'b1', type:'habit', label:'Daily reading (30m)' },
    { id:'b2', type:'task',  label:'Finish Atomic Habits' },
    { id:'b3', type:'task',  label:'Finish Meditations' },
    { id:'b4', type:'task',  label:'Finish Deep Work' },
  ],
}

// ─── PACE COMPUTATION ─────────────────────────────────────────
function getPace(actual: number, expected: number) {
  const ratio = expected > 0 ? actual / expected : 1
  if (ratio >= 1.1) return { tone:'success', label:'Ahead of pace',   icon:'tabler-trending-up'   }
  if (ratio >= 0.95) return { tone:'info',   label:'On track',         icon:'tabler-checks'         }
  if (ratio >= 0.75) return { tone:'warning', label:'Slightly behind', icon:'tabler-trending-down'  }
  return                     { tone:'error',   label:'Behind pace',     icon:'tabler-alert-triangle' }
}

// ─── DUAL BAR ─────────────────────────────────────────────────
function DualBar({ actual, expected, target, baseline = 0, tone }: { actual:number; expected:number; target:number; baseline?:number; tone:string }) {
  const range = target - baseline || 1
  const actualPct = Math.min(100, Math.max(0, ((actual - baseline)/range)*100))
  const expectedPct = Math.min(100, Math.max(0, ((expected - baseline)/range)*100))
  const t = TONE[tone]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ position:'relative', height:10, background:'var(--mui-palette-action-hover)', borderRadius:5 }}>
        <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${expectedPct}%`, background:'rgba(47,43,61,.12)', borderRadius:5 }} />
        <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${actualPct}%`, background:t.fg, borderRadius:5, transition:'width 600ms' }} />
        <div style={{ position:'absolute', left:`${expectedPct}%`, top:-3, bottom:-3, width:2, background:'var(--mui-palette-text-primary)', borderRadius:1 }} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.75rem' }}>
        <span style={{ color:t.fg, fontWeight:700 }}>{actual.toLocaleString()} actual</span>
        <span style={{ color:'var(--mui-palette-text-secondary)' }}>Expected: {expected.toLocaleString()}</span>
        <span style={{ color:'var(--mui-palette-text-secondary)' }}>Target: {target.toLocaleString()}</span>
      </div>
    </div>
  )
}

// ─── GOAL CARD ────────────────────────────────────────────────
function GoalCard({ g }: { g: GoalData }) {
  const ratio = g.expected_value > 0 ? g.actual_value / g.expected_value : 1
  let tone = 'success'
  if (ratio < 0.7) tone = 'error'
  else if (ratio < 0.9) tone = 'warning'
  else if (ratio < 1.05) tone = 'info'
  const t = TONE[tone]
  const meta = METRIC_META[g.metric_type]
  const baseline = g.baseline_value || 0
  const range = g.target_value - baseline || 1
  const actualPct = Math.min(100, Math.max(0, ((g.actual_value - baseline)/range)*100))
  const expectedPct = Math.min(100, Math.max(0, ((g.expected_value - baseline)/range)*100))

  return (
    <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, padding:16, boxShadow:'0 1px 4px rgba(47,43,61,.06)', cursor:'pointer', transition:'box-shadow 200ms' }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px rgba(47,43,61,.12)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(47,43,61,.06)'}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:`${g.accent}1a`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <i className={g.emoji_icon} style={{ fontSize:18, color:g.accent }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:'13.5px', fontWeight:600, color:'var(--mui-palette-text-primary)', lineHeight:1.35, marginBottom:2 }}>{g.title}</div>
          <div style={{ fontSize:11, color:'var(--mui-palette-text-secondary)', display:'flex', alignItems:'center', gap:4 }}>
            <i className={meta.icon} style={{ fontSize:11 }} />{meta.label}
          </div>
        </div>
        <div style={{ background:t.bg, color:t.fg, fontWeight:600, fontSize:10, padding:'2px 8px', borderRadius:9999, whiteSpace:'nowrap' }}>
          {(Math.round(ratio * 100) / 100).toFixed(2)}×
        </div>
      </div>

      <div style={{ position:'relative', height:8, background:'var(--mui-palette-action-hover)', borderRadius:4, marginBottom:10 }}>
        <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${expectedPct}%`, background:'rgba(47,43,61,.10)', borderRadius:4 }} />
        <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${actualPct}%`, background:t.fg, borderRadius:4 }} />
        <div style={{ position:'absolute', left:`${expectedPct}%`, top:-2, bottom:-2, width:2, background:'var(--mui-palette-text-primary)', borderRadius:1 }} />
      </div>

      <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
        <span style={{ fontSize:16, fontWeight:600, color:'var(--mui-palette-text-primary)', fontVariantNumeric:'tabular-nums' }}>{g.actual_value.toLocaleString()}</span>
        <span style={{ fontSize:11, color:'var(--mui-palette-text-secondary)' }}>/ {g.target_value.toLocaleString()} {g.unit}</span>
        {g.linked_count > 0 && (
          <span style={{ marginLeft:'auto', fontSize:10, color:'var(--mui-palette-text-secondary)', display:'inline-flex', alignItems:'center', gap:3 }}>
            <i className='tabler-link' style={{ fontSize:10 }} />{g.linked_count}
          </span>
        )}
      </div>
    </div>
  )
}

// ─── MAIN VIEW ────────────────────────────────────────────────
type FilterKey = 'all' | 'active' | 'paused' | 'completed'

const GoalsView = () => {
  const [filterGoals, setFilterGoals] = useState<FilterKey>('active')

  const pace = getPace(HERO.actual, HERO.expected)
  const t = TONE[pace.tone]
  const heroPct = Math.round((HERO.actual / HERO.target) * 100)
  const expectedPct = Math.round((HERO.expected / HERO.target) * 100)
  const daysRemaining = HERO.totalDays - HERO.dayOfYear

  const kpis = [
    { label:'Active goals',  value:6, icon:'tabler-target',        color:'#FF9F43', bg:'rgba(255,159,67,.12)'  },
    { label:'On pace',       value:4, icon:'tabler-trending-up',    color:'#28C76F', bg:'rgba(40,199,111,.12)'  },
    { label:'Behind',        value:1, icon:'tabler-alert-triangle', color:'#FF4C51', bg:'rgba(255,76,81,.12)'   },
    { label:'Completed YTD', value:3, icon:'tabler-trophy',         color:'#C9A96E', bg:'rgba(201,169,110,.16)' },
  ]

  return (
    <div style={{ maxWidth:1180, padding:'0 4px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:22, flexWrap:'wrap', gap:12 }}>
        <div>
          <h3 style={{ fontSize:22, fontWeight:600, color:'var(--mui-palette-text-primary)', margin:0 }}>Your goals</h3>
          <p style={{ fontSize:13, color:'var(--mui-palette-text-secondary)', margin:'4px 0 0' }}>
            6 active goals · Today, May 24 2026
          </p>
        </div>
        <button style={{ background:PRIMARY, color:'#fff', border:'none', borderRadius:8, padding:'9px 16px', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 6px rgba(201,124,74,.3)', cursor:'pointer' }}>
          <i className='tabler-plus' style={{ fontSize:14 }} />New goal
        </button>
      </div>

      {/* KPI strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:22 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:10, background:k.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className={k.icon} style={{ fontSize:20, color:k.color }} />
            </div>
            <div>
              <div style={{ fontSize:11, color:'var(--mui-palette-text-secondary)', fontWeight:500, textTransform:'uppercase', letterSpacing:'.4px' }}>{k.label}</div>
              <div style={{ fontSize:22, fontWeight:700, color:'var(--mui-palette-text-primary)', lineHeight:1.1, marginTop:1 }}>{k.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Hero goal card */}
      <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:14, padding:24, boxShadow:'0 2px 8px rgba(47,43,61,.08)', marginBottom:22, cursor:'pointer', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:16, right:16, fontSize:10, fontWeight:700, letterSpacing:'.5px', color:GOALS_ORANGE, background:'rgba(255,159,67,.12)', padding:'4px 10px', borderRadius:999, textTransform:'uppercase' }}>
          Featured
        </div>

        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:t.bg, color:t.fg, fontSize:'.75rem', fontWeight:700, padding:'5px 12px', borderRadius:9999, marginBottom:16 }}>
          <i className={pace.icon} style={{ fontSize:14 }} />{pace.label}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:'rgba(255,159,67,.14)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <i className='tabler-target' style={{ fontSize:26, color:GOALS_ORANGE }} />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:18, fontWeight:600, color:'var(--mui-palette-text-primary)' }}>{HERO.title}</div>
            <div style={{ fontSize:12, color:'var(--mui-palette-text-secondary)', marginTop:3 }}>
              Cumulative · pages · due {HERO.dueDate}
            </div>
          </div>
        </div>

        <DualBar actual={HERO.actual} expected={HERO.expected} target={HERO.target} tone={pace.tone} />

        <div style={{ display:'flex', gap:24, marginTop:16, paddingTop:16, borderTop:'1px solid var(--mui-palette-divider)', flexWrap:'wrap' }}>
          {[
            { label:'Progress',  value:`${heroPct}%`,                         color:t.fg },
            { label:'Expected',  value:`${expectedPct}%`,                     color:'var(--mui-palette-text-secondary)' },
            { label:'Days left', value:`${daysRemaining}d`,                   color:'var(--mui-palette-text-secondary)' },
            { label:'Pace',      value:`${(HERO.actual/HERO.expected).toFixed(2)}×`, color:t.fg },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize:'.65rem', color:'var(--mui-palette-text-secondary)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.4px' }}>{s.label}</div>
              <div style={{ fontSize:'1.125rem', fontWeight:700, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:6, marginTop:14, flexWrap:'wrap', alignItems:'center' }}>
          {HERO.bindings.slice(0,3).map(b => (
            <span key={b.id} style={{ fontSize:11, padding:'3px 9px', borderRadius:9999, background:'var(--mui-palette-action-hover)', color:'var(--mui-palette-text-secondary)', display:'inline-flex', alignItems:'center', gap:5 }}>
              <i className={b.type === 'habit' ? 'tabler-flame' : 'tabler-checklist'} style={{ fontSize:11, color: b.type === 'habit' ? '#28C76F' : '#7367F0' }} />
              {b.label}
            </span>
          ))}
          <span style={{ fontSize:11, padding:'3px 9px', borderRadius:9999, background:'var(--mui-palette-action-hover)', color:'var(--mui-palette-text-secondary)' }}>
            +{HERO.bindings.length - 3} more
          </span>
          <span style={{ marginLeft:'auto', fontSize:12, color:t.fg, fontWeight:600, display:'inline-flex', alignItems:'center', gap:4 }}>
            Open detail <i className='tabler-arrow-right' style={{ fontSize:13 }} />
          </span>
        </div>
      </div>

      {/* Other goals grid */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, flexWrap:'wrap', gap:8 }}>
        <h5 style={{ fontSize:15, fontWeight:600, color:'var(--mui-palette-text-primary)', margin:0 }}>All goals</h5>
        <div style={{ display:'flex', gap:6 }}>
          {(['all','active','paused','completed'] as FilterKey[]).map(lbl => (
            <button key={lbl} onClick={() => setFilterGoals(lbl)} style={{
              fontSize:12, padding:'5px 12px', borderRadius:999, cursor:'pointer',
              background: filterGoals === lbl ? PRIMARY_16 : 'transparent',
              color: filterGoals === lbl ? PRIMARY : 'var(--mui-palette-text-secondary)',
              border: filterGoals === lbl ? '1px solid transparent' : '1px solid var(--mui-palette-divider)',
              fontWeight: filterGoals === lbl ? 600 : 500,
              textTransform:'capitalize',
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(290px, 1fr))', gap:14 }}>
        {OTHER_GOALS.filter(g => filterGoals === 'all' || g.status === filterGoals).map(g => (
          <GoalCard key={g.id} g={g} />
        ))}
      </div>

      {OTHER_GOALS.filter(g => filterGoals === 'all' || g.status === filterGoals).length === 0 && (
        <div style={{ textAlign:'center', padding:'48px 0', color:'var(--mui-palette-text-secondary)' }}>
          <i className='tabler-target' style={{ fontSize:48, display:'block', marginBottom:12, opacity:.3 }} />
          <div style={{ fontWeight:600 }}>No {filterGoals} goals</div>
        </div>
      )}
    </div>
  )
}

export default GoalsView
