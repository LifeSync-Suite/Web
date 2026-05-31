'use client'

import { useState, useMemo } from 'react'

// ─── ACCENTS ──────────────────────────────────────────────────
const P_GOLD    = '#C9A96E'
const P_GOLD_10 = 'rgba(201,169,110,.10)'
const P_GOLD_16 = 'rgba(201,169,110,.16)'
const P_GOLD_30 = 'rgba(201,169,110,.30)'
const P_PRIMARY = '#C97C4A'

// ─── PAYMENT TYPES ────────────────────────────────────────────
const PAY_TYPES: Record<string,{ label:string; icon:string; color:string; desc:string }> = {
  hourly:  { label:'Hourly',         icon:'tabler-clock-hour-4',   color:'#7367F0', desc:'Per hour logged' },
  project: { label:'Project-based',  icon:'tabler-package',        color:'#28C76F', desc:'Fixed on completion' },
  monthly: { label:'Monthly',        icon:'tabler-calendar-month', color:'#00BAD1', desc:'Recurring retainer' },
}

const STATUS_META: Record<string,{ label:string; color:string }> = {
  active:    { label:'Active',    color:'#28C76F' },
  paused:    { label:'Paused',    color:'#FF9F43' },
  completed: { label:'Completed', color:'#7367F0' },
}

// ─── MOCK DATA ────────────────────────────────────────────────
type Task = { id:number; title:string; done:boolean; hours:number; date:string }
type Payment = { id:string; date:string; amount:number; note:string }
type Project = {
  id:string; name:string; client:string; color:string; icon:string
  paymentType:string; rate:number; currency:string; status:string; startDate:string
  tasks:Task[]; paymentsReceived:Payment[]
  milestonePct?:number; monthsAccrued?:number; deadline?:string
}

const SEED_PROJECTS: Project[] = [
  {
    id:'p1', name:'Book — "Quiet Systems"', client:'Self-publish',
    color:'#C97C4A', icon:'tabler-book',
    paymentType:'hourly', rate:75, currency:'USD',
    status:'active', startDate:'Jan 2025',
    tasks:[
      { id:1, title:'Chapter 3 outline',        done:true,  hours:1.5, date:'Apr 18' },
      { id:2, title:'Chapter 3 first draft',    done:true,  hours:4.0, date:'Apr 21' },
      { id:3, title:'Chapter 3 revision pass',  done:true,  hours:2.0, date:'Apr 25' },
      { id:4, title:'Landing page copy',        done:true,  hours:1.0, date:'Apr 27' },
      { id:5, title:'Chapter 4 outline',        done:false, hours:0,   date:'—' },
      { id:6, title:'Cover concept review',     done:false, hours:0,   date:'—' },
    ],
    paymentsReceived:[{ id:'pay1', date:'Apr 1', amount:1200, note:'Mar payout' }],
  },
  {
    id:'p2', name:'Acme — Q2 Brand Refresh', client:'Acme Co.',
    color:'#7367F0', icon:'tabler-palette',
    paymentType:'project', rate:4500, currency:'USD',
    status:'active', startDate:'Apr 2025', deadline:'Jun 30 2025',
    milestonePct:0.55,
    tasks:[
      { id:1, title:'Stakeholder workshop',   done:true,  hours:3.0, date:'Apr 8'  },
      { id:2, title:'Mood board v1',          done:true,  hours:5.5, date:'Apr 12' },
      { id:3, title:'Logo exploration',       done:true,  hours:8.0, date:'Apr 18' },
      { id:4, title:'Color & type system',    done:true,  hours:4.5, date:'Apr 24' },
      { id:5, title:'Brand guidelines doc',   done:false, hours:0,   date:'—' },
      { id:6, title:'Asset handoff package',  done:false, hours:0,   date:'—' },
    ],
    paymentsReceived:[{ id:'pay1', date:'Apr 5', amount:2250, note:'50% deposit' }],
  },
  {
    id:'p3', name:'Acme — Design Retainer', client:'Acme Co.',
    color:'#6B8F71', icon:'tabler-refresh',
    paymentType:'monthly', rate:3200, currency:'USD',
    status:'active', startDate:'Feb 2025',
    monthsAccrued:3,
    tasks:[
      { id:1, title:'Weekly design sync',      done:true,  hours:4.0, date:'Apr 28' },
      { id:2, title:'Marketing site tweaks',   done:true,  hours:6.5, date:'Apr 26' },
      { id:3, title:'Email template update',   done:true,  hours:2.5, date:'Apr 22' },
      { id:4, title:'Onboarding flow polish',  done:false, hours:0,   date:'—' },
    ],
    paymentsReceived:[
      { id:'pay1', date:'Feb 28', amount:3200, note:'February' },
      { id:'pay2', date:'Mar 31', amount:3200, note:'March' },
    ],
  },
  {
    id:'p4', name:'Pixel Studios — Indie Game UX', client:'Pixel Studios',
    color:'#00BAD1', icon:'tabler-device-gamepad-2',
    paymentType:'hourly', rate:95, currency:'USD',
    status:'active', startDate:'Mar 2025',
    tasks:[
      { id:1, title:'UX audit current build',    done:true,  hours:6.0, date:'Apr 9'  },
      { id:2, title:'Tutorial flow wireframes',  done:true,  hours:8.5, date:'Apr 17' },
      { id:3, title:'Inventory UI redesign',     done:true,  hours:5.0, date:'Apr 23' },
      { id:4, title:'Playtest feedback review',  done:false, hours:0,   date:'—' },
    ],
    paymentsReceived:[],
  },
  {
    id:'p5', name:'Personal — Portfolio Site', client:'Self',
    color:'#C9A96E', icon:'tabler-globe',
    paymentType:'project', rate:0, currency:'USD',
    status:'paused', startDate:'Mar 2025',
    milestonePct:0.25,
    tasks:[
      { id:1, title:'Information architecture', done:true,  hours:2.0, date:'Mar 30' },
      { id:2, title:'Home page wireframe',      done:false, hours:0,   date:'—' },
    ],
    paymentsReceived:[],
  },
]

// ─── EARNINGS HELPERS ─────────────────────────────────────────
function earningsFor(p: Project) {
  if (p.paymentType === 'hourly') {
    const hours = p.tasks.filter(t=>t.done).reduce((s,t)=>s+t.hours, 0)
    return { accrued: hours * p.rate, hours, basis:`${hours}h × $${p.rate}/h` }
  }
  if (p.paymentType === 'project') {
    const pct = p.milestonePct ?? 0
    return { accrued: pct * p.rate, hours: p.tasks.filter(t=>t.done).reduce((s,t)=>s+t.hours,0), basis:`${Math.round(pct*100)}% of $${p.rate}` }
  }
  const months = p.monthsAccrued ?? 0
  return { accrued: months * p.rate, hours: p.tasks.filter(t=>t.done).reduce((s,t)=>s+t.hours,0), basis:`${months} × $${p.rate}/mo` }
}

function paidFor(p: Project) {
  return p.paymentsReceived.reduce((s,x)=>s+x.amount, 0)
}

function fmt(n: number) {
  if (n === 0) return '$0'
  if (n >= 1000) return `$${(n/1000).toFixed(1)}k`
  return `$${n.toFixed(0)}`
}
function fmtFull(n: number) {
  return `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits:0, maximumFractionDigits:0 })}`
}

// ─── PILL ─────────────────────────────────────────────────────
function Pill({ label, color, icon }: { label:string; color:string; icon?:string }) {
  return (
    <span style={{ background:`${color}15`, color, fontSize:'.65rem', fontWeight:700, padding:'3px 9px', borderRadius:9999, whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:4 }}>
      {icon && <i className={icon} style={{ fontSize:11 }} />}
      {label}
    </span>
  )
}

// ─── PROJECT CARD ─────────────────────────────────────────────
function ProjectCard({ p, expanded, onToggle, onEdit }: { p:Project; expanded:boolean; onToggle:()=>void; onEdit:()=>void }) {
  const { accrued, hours, basis } = earningsFor(p)
  const paid = paidFor(p)
  const outstanding = accrued - paid
  const pay = PAY_TYPES[p.paymentType]
  const sm = STATUS_META[p.status]
  const tasksDone = p.tasks.filter(t=>t.done).length
  const tasksTotal = p.tasks.length
  const progress = tasksTotal ? Math.round((tasksDone/tasksTotal)*100) : 0

  return (
    <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:14, boxShadow:'0 2px 8px rgba(47,43,61,.08)', overflow:'hidden', border:`1.5px solid ${expanded ? p.color : 'transparent'}`, transition:'border 200ms' }}>
      <div onClick={onToggle} style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:16, cursor:'pointer' }}>
        <div style={{ width:46, height:46, borderRadius:11, background:`${p.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <i className={p.icon} style={{ fontSize:22, color:p.color }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3, flexWrap:'wrap' }}>
            <span style={{ fontSize:'.95rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>{p.name}</span>
            <Pill label={sm.label} color={sm.color} />
            <Pill label={pay.label} color={pay.color} icon={pay.icon} />
          </div>
          <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span><i className='tabler-user' style={{ fontSize:11 }} /> {p.client}</span>
            <span>·</span><span>{basis}</span>
            <span>·</span><span>{tasksDone}/{tasksTotal} tasks</span>
          </div>
        </div>
        <div style={{ textAlign:'end', minWidth:110 }}>
          <div style={{ fontSize:'.65rem', color:'var(--mui-palette-text-secondary)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px' }}>Accrued</div>
          <div style={{ fontWeight:800, color:P_GOLD, fontSize:'1.1rem' }}>{fmtFull(accrued)}</div>
          {outstanding > 0 && <div style={{ fontSize:'.7rem', color:'#FF9F43', fontWeight:600 }}>{fmt(outstanding)} unpaid</div>}
          {outstanding <= 0 && paid > 0 && <div style={{ fontSize:'.7rem', color:'#28C76F', fontWeight:600 }}>Up to date</div>}
        </div>
        <i className={`tabler-chevron-${expanded ? 'up' : 'down'}`} style={{ fontSize:18, color:'var(--mui-palette-text-secondary)', flexShrink:0 }} />
      </div>

      {/* Progress strip */}
      <div style={{ height:3, background:'var(--mui-palette-action-hover)' }}>
        <div style={{ width:`${progress}%`, height:'100%', background:p.color, transition:'width 600ms' }} />
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding:'20px 22px', borderTop:'1px solid var(--mui-palette-divider)', display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:24 }}>
          <div>
            <div style={{ background:'var(--mui-palette-action-hover)', borderRadius:10, padding:'14px 16px', marginBottom:18 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)' }}>Billing Configuration</div>
                <button onClick={e=>{ e.stopPropagation(); onEdit() }} style={{ background:'transparent', border:`1px solid ${P_GOLD_30}`, color:P_GOLD, borderRadius:7, padding:'4px 10px', fontSize:'.7rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
                  <i className='tabler-edit' style={{ fontSize:11 }} /> Edit
                </button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
                <div>
                  <div style={{ fontSize:'.65rem', color:'var(--mui-palette-text-secondary)', marginBottom:3 }}>Payment Type</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <i className={pay.icon} style={{ fontSize:14, color:pay.color }} />
                    <span style={{ fontSize:'.825rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>{pay.label}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:'.65rem', color:'var(--mui-palette-text-secondary)', marginBottom:3 }}>Rate</div>
                  <div style={{ fontSize:'.825rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>
                    ${p.rate}<span style={{ fontWeight:400, color:'var(--mui-palette-text-secondary)', fontSize:'.7rem' }}>{p.paymentType==='hourly'?' / hour':p.paymentType==='monthly'?' / month':' fixed'}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:'.65rem', color:'var(--mui-palette-text-secondary)', marginBottom:3 }}>Client</div>
                  <div style={{ fontSize:'.825rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>{p.client}</div>
                </div>
              </div>
            </div>

            <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:10 }}>Tasks Contributing to Earnings</div>
            {p.tasks.map((t,i) => {
              const taskEarn = t.done && p.paymentType==='hourly' ? t.hours * p.rate : 0
              return (
                <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: i < p.tasks.length-1 ? '1px solid var(--mui-palette-divider)' : 'none' }}>
                  <div style={{ width:16, height:16, borderRadius:4, border:`2px solid ${t.done?'#28C76F':'var(--mui-palette-divider)'}`, background:t.done?'#28C76F':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {t.done && <i className='tabler-check' style={{ fontSize:10, color:'#fff' }} />}
                  </div>
                  <span style={{ flex:1, fontSize:'.825rem', color: t.done ? 'var(--mui-palette-text-secondary)' : 'var(--mui-palette-text-primary)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
                  <span style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', width:65, textAlign:'end' }}>{t.date}</span>
                  {p.paymentType === 'hourly' && <span style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)', fontWeight:600, width:50, textAlign:'end' }}>{t.hours > 0 ? `${t.hours}h` : '—'}</span>}
                  <span style={{ fontSize:'.825rem', fontWeight:700, color: taskEarn > 0 ? '#28C76F' : 'var(--mui-palette-text-disabled)', width:70, textAlign:'end' }}>
                    {taskEarn > 0 ? `+${fmt(taskEarn)}` : '—'}
                  </span>
                </div>
              )
            })}
          </div>

          <div>
            <div style={{ background:`linear-gradient(135deg, ${P_GOLD_10}, ${p.color}10)`, border:`1px solid ${P_GOLD_30}`, borderRadius:12, padding:'18px', marginBottom:16 }}>
              <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:8 }}>Earnings Summary</div>
              {[
                { label:'Accrued total', value:fmtFull(accrued), color:P_GOLD },
                { label:'Paid received', value:fmtFull(paid), color:'#28C76F' },
              ].map(row => (
                <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <span style={{ fontSize:'.8rem', color:'var(--mui-palette-text-secondary)' }}>{row.label}</span>
                  <span style={{ fontWeight:700, color:row.color }}>{row.value}</span>
                </div>
              ))}
              <div style={{ height:1, background:'var(--mui-palette-divider)', margin:'10px 0' }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'.85rem', color:'var(--mui-palette-text-primary)', fontWeight:600 }}>Outstanding</span>
                <span style={{ fontWeight:800, color: outstanding > 0 ? '#FF9F43' : 'var(--mui-palette-text-secondary)' }}>{fmtFull(Math.max(0, outstanding))}</span>
              </div>
              {p.paymentType === 'hourly' && (
                <div style={{ marginTop:14, padding:'10px 12px', background:'var(--mui-palette-background-paper)', borderRadius:8, display:'flex', alignItems:'center', gap:8 }}>
                  <i className='tabler-clock-hour-4' style={{ fontSize:16, color:pay.color }} />
                  <span style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)' }}>Hours logged</span>
                  <span style={{ marginLeft:'auto', fontSize:'.875rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>{hours}h</span>
                </div>
              )}
              {p.paymentType === 'project' && (
                <div style={{ marginTop:14 }}>
                  <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', marginBottom:5 }}>Milestone progress</div>
                  <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:9999, height:7 }}>
                    <div style={{ width:`${(p.milestonePct||0)*100}%`, height:'100%', background:p.color, borderRadius:9999 }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:8 }}>Payments Received</div>
            {p.paymentsReceived.length === 0 ? (
              <div style={{ fontSize:'.8rem', color:'var(--mui-palette-text-secondary)', fontStyle:'italic', padding:'8px 0' }}>No payments yet</div>
            ) : p.paymentsReceived.map(pay => (
              <div key={pay.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid var(--mui-palette-divider)' }}>
                <i className='tabler-cash' style={{ fontSize:15, color:'#28C76F' }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'.8rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>{pay.note}</div>
                  <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)' }}>{pay.date}</div>
                </div>
                <span style={{ fontSize:'.875rem', fontWeight:700, color:'#28C76F' }}>+{fmtFull(pay.amount)}</span>
              </div>
            ))}
            <button style={{ marginTop:12, width:'100%', background:P_GOLD, color:'#fff', border:'none', borderRadius:9, padding:'10px', fontSize:'.8rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, boxShadow:`0 2px 8px ${P_GOLD_30}` }}>
              <i className='tabler-plus' style={{ fontSize:14 }} /> Log payment received
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── NEW PROJECT MODAL ────────────────────────────────────────
function NewProjectModal({ onSave, onClose }: { onSave:(p:Project)=>void; onClose:()=>void }) {
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [type, setType] = useState('hourly')
  const [rate, setRate] = useState(75)

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:16, boxShadow:'0 24px 80px rgba(0,0,0,.25)', width:'100%', maxWidth:520, overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--mui-palette-divider)', display:'flex', alignItems:'center', gap:10 }}>
          <i className='tabler-cash-register' style={{ fontSize:20, color:P_GOLD }} />
          <span style={{ fontWeight:700, fontSize:'1rem', color:'var(--mui-palette-text-primary)', flex:1 }}>New project</span>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--mui-palette-text-secondary)', fontSize:20, lineHeight:1 }}>×</button>
        </div>
        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:18 }}>
          {[{ label:'Project name', value:name, onChange:setName, placeholder:'e.g. Q2 Brand Refresh' }, { label:'Client', value:client, onChange:setClient, placeholder:'e.g. Acme Co.' }].map(f => (
            <div key={f.label}>
              <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:6 }}>{f.label}</div>
              <input value={f.value} onChange={e=>f.onChange(e.target.value)} placeholder={f.placeholder}
                style={{ width:'100%', border:'1.5px solid var(--mui-palette-divider)', borderRadius:8, padding:'9px 12px', fontSize:'.875rem', background:'var(--mui-palette-background-paper)', color:'var(--mui-palette-text-primary)', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }} />
            </div>
          ))}
          <div>
            <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:8 }}>Payment type</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {Object.entries(PAY_TYPES).map(([k,v]) => (
                <button key={k} onClick={() => setType(k)} style={{
                  padding:'12px 10px', borderRadius:10, border:`1.5px solid ${type===k ? v.color : 'var(--mui-palette-divider)'}`,
                  background: type===k ? `${v.color}12` : 'transparent',
                  cursor:'pointer', textAlign:'left', transition:'all 180ms',
                  display:'flex', flexDirection:'column', gap:5,
                }}>
                  <i className={v.icon} style={{ fontSize:18, color: type===k ? v.color : 'var(--mui-palette-text-secondary)' }} />
                  <span style={{ fontSize:'.8125rem', fontWeight:700, color: type===k ? v.color : 'var(--mui-palette-text-secondary)' }}>{v.label}</span>
                  <span style={{ fontSize:'.65rem', color:'var(--mui-palette-text-disabled)' }}>{v.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.6px', color:'var(--mui-palette-text-secondary)', marginBottom:6 }}>
              Rate {type==='hourly' ? '(per hour)' : type==='monthly' ? '(per month)' : '(fixed total)'}
            </div>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--mui-palette-text-secondary)', fontWeight:700 }}>$</span>
              <input type="number" value={rate} onChange={e=>setRate(+e.target.value)}
                style={{ width:'100%', border:'1.5px solid var(--mui-palette-divider)', borderRadius:8, padding:'9px 12px 9px 28px', fontSize:'.875rem', background:'var(--mui-palette-background-paper)', color:'var(--mui-palette-text-primary)', outline:'none', fontFamily:'inherit', boxSizing:'border-box' }} />
            </div>
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:'1px solid var(--mui-palette-divider)', display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ background:'none', border:'1.5px solid var(--mui-palette-divider)', borderRadius:9, padding:'9px 20px', fontSize:'.875rem', fontWeight:600, color:'var(--mui-palette-text-secondary)', cursor:'pointer' }}>Cancel</button>
          <button onClick={() => onSave({ id:`p${Date.now()}`, name, client, paymentType:type, rate, currency:'USD', status:'active', color:P_PRIMARY, icon:'tabler-folder', startDate:'May 2026', tasks:[], paymentsReceived:[] })}
            style={{ background:P_GOLD, color:'#fff', border:'none', borderRadius:9, padding:'9px 24px', fontSize:'.875rem', fontWeight:700, cursor:'pointer', boxShadow:`0 2px 8px ${P_GOLD_30}` }}>
            Create project
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN VIEW ────────────────────────────────────────────────
export default function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS)
  const [expandedId, setExpandedId] = useState<string|null>('p1')
  const [filter, setFilter] = useState('all')
  const [showNew, setShowNew] = useState(false)

  const filtered = useMemo(() => {
    if (filter === 'all') return projects
    return projects.filter(p => p.status === filter)
  }, [projects, filter])

  const stats = useMemo(() => {
    const totalAccrued = projects.reduce((s,p) => s + earningsFor(p).accrued, 0)
    const totalPaid = projects.reduce((s,p) => s + paidFor(p), 0)
    const totalHours = projects.reduce((s,p) => s + p.tasks.filter(t=>t.done).reduce((a,t)=>a+t.hours,0), 0)
    return {
      activeCount: projects.filter(p=>p.status==='active').length,
      totalAccrued, outstanding: totalAccrued - totalPaid, totalHours,
    }
  }, [projects])

  const filters = [
    { id:'all',       label:'All',       count:projects.length },
    { id:'active',    label:'Active',    count:projects.filter(p=>p.status==='active').length },
    { id:'paused',    label:'Paused',    count:projects.filter(p=>p.status==='paused').length },
    { id:'completed', label:'Completed', count:projects.filter(p=>p.status==='completed').length },
  ]

  return (
    <div style={{ maxWidth:1200, padding:'0 4px' }}>
      {/* Header */}
      <div style={{ marginBottom:20, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:P_GOLD_16, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className='tabler-briefcase' style={{ fontSize:18, color:P_GOLD }} />
            </div>
            <h1 style={{ fontSize:'1.375rem', fontWeight:700, color:'var(--mui-palette-text-primary)', margin:0 }}>Projects & Billing</h1>
          </div>
          <div style={{ fontSize:'.8125rem', color:'var(--mui-palette-text-secondary)', marginLeft:44 }}>Set rates, complete tasks, earn — your work auto-syncs with Wealth.</div>
        </div>
        <button onClick={() => setShowNew(true)} style={{ background:P_GOLD, color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontSize:'.8rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, boxShadow:`0 2px 8px ${P_GOLD_30}` }}>
          <i className='tabler-plus' style={{ fontSize:14 }} /> New project
        </button>
      </div>

      {/* Stat row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18 }}>
        {[
          { label:'Active Projects',  value:`${stats.activeCount}`,         sub:`${projects.length} total`,     icon:'tabler-briefcase',   iconColor:P_GOLD,      iconBg:P_GOLD_16 },
          { label:'Accrued Earnings', value:fmtFull(stats.totalAccrued),    sub:'From completed tasks',          icon:'tabler-coin',        iconColor:'#28C76F',   iconBg:'rgba(40,199,111,.12)' },
          { label:'Outstanding',      value:fmtFull(stats.outstanding),     sub:'Awaiting payment',              icon:'tabler-receipt',     iconColor:'#FF9F43',   iconBg:'rgba(255,159,67,.12)' },
          { label:'Hours Logged',     value:`${stats.totalHours}h`,         sub:'Across all projects',           icon:'tabler-clock-hour-4',iconColor:'#7367F0',   iconBg:'rgba(115,103,240,.12)' },
        ].map(s => (
          <div key={s.label} style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'18px 20px', display:'flex', gap:14, alignItems:'center' }}>
            <div style={{ width:46, height:46, borderRadius:10, background:s.iconBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <i className={s.icon} style={{ fontSize:22, color:s.iconColor }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', fontWeight:500, textTransform:'uppercase', letterSpacing:'.5px' }}>{s.label}</div>
              <div style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--mui-palette-text-primary)', lineHeight:1.3 }}>{s.value}</div>
              <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', marginTop:1 }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Integration callout */}
      <div style={{ background:`linear-gradient(135deg, ${P_GOLD_10}, rgba(115,103,240,.06))`, border:`1px solid ${P_GOLD_30}`, borderRadius:12, padding:'14px 18px', marginBottom:18, display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:'var(--mui-palette-background-paper)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <i className='tabler-arrows-exchange' style={{ fontSize:20, color:P_GOLD }} />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'.875rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>Tasks ↔ Wealth integration is live</div>
          <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)', marginTop:2 }}>
            Completing a task on a billable project automatically logs earnings to your Wealth ledger. Tracked across {projects.filter(p=>p.paymentType==='hourly').length} hourly, {projects.filter(p=>p.paymentType==='project').length} fixed-fee, and {projects.filter(p=>p.paymentType==='monthly').length} monthly projects.
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:16, alignItems:'center', flexWrap:'wrap' }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding:'7px 14px', borderRadius:9999, border:`1.5px solid ${filter===f.id ? P_GOLD : 'var(--mui-palette-divider)'}`,
            background: filter===f.id ? P_GOLD_10 : 'transparent',
            color: filter===f.id ? P_GOLD : 'var(--mui-palette-text-secondary)',
            fontSize:'.8rem', fontWeight:700, cursor:'pointer', transition:'all 150ms',
            display:'flex', alignItems:'center', gap:6,
          }}>
            {f.label}
            <span style={{ background: filter===f.id ? P_GOLD_16 : 'var(--mui-palette-action-hover)', color: filter===f.id ? P_GOLD : 'var(--mui-palette-text-secondary)', fontSize:'.65rem', fontWeight:700, padding:'1px 7px', borderRadius:9999 }}>{f.count}</span>
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>Sorted by recent activity</span>
      </div>

      {/* Project list */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.map(p => (
          <ProjectCard key={p.id} p={p}
            expanded={expandedId === p.id}
            onToggle={() => setExpandedId(expandedId === p.id ? null : p.id)}
            onEdit={() => {}} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px 0', color:'var(--mui-palette-text-secondary)' }}>
            <i className='tabler-folder-off' style={{ fontSize:36, display:'block', marginBottom:8 }} />
            No projects in this filter
          </div>
        )}
      </div>

      {showNew && <NewProjectModal onSave={p => { setProjects(prev=>[...prev,p]); setShowNew(false) }} onClose={() => setShowNew(false)} />}
    </div>
  )
}
