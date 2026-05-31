'use client'

import { useState } from 'react'

// ─── ACCENT PALETTE ───────────────────────────────────────────
const W = '#C97C4A'
const W10 = 'rgba(201,124,74,.10)'
const W16 = 'rgba(201,124,74,.16)'
const W30 = 'rgba(201,124,74,.30)'
const SUCCESS = '#28C76F'
const DANGER = '#FF4C51'
const WARNING = '#FF9F43'

// ─── MOCK DATA ────────────────────────────────────────────────
const ACCOUNTS = [
  { id:'a1', name:'TD Checking',       type:'Checking',  balance:4821,   color:'#00BAD1', icon:'tabler-building-bank',   updated:'Just now' },
  { id:'a2', name:'TD Savings',        type:'Savings',   balance:14200,  color:'#28C76F', icon:'tabler-piggy-bank',      updated:'2h ago'   },
  { id:'a3', name:'Wealthsimple TFSA', type:'TFSA',      balance:17816,  color:'#7367F0', icon:'tabler-chart-line',      updated:'1d ago'   },
  { id:'a4', name:'Visa Infinite',     type:'Credit',    balance:-3200,  color:'#FF4C51', icon:'tabler-credit-card',     updated:'3h ago'   },
]

const TRANSACTIONS = [
  { id:'t1', desc:'Salary deposit',       category:'Income',      amount:+4200, date:'May 1', icon:'tabler-cash',           color:'#28C76F' },
  { id:'t2', desc:'Rent – May',           category:'Housing',     amount:-1500, date:'May 1', icon:'tabler-home',            color:'#FF4C51' },
  { id:'t3', desc:'Grocery Store',        category:'Food',        amount:-112,  date:'May 2', icon:'tabler-shopping-cart',   color:'#FF9F43' },
  { id:'t4', desc:'Netflix',              category:'Subscriptions', amount:-17, date:'May 3', icon:'tabler-device-tv',       color:'#7367F0' },
  { id:'t5', desc:'Freelance payment',    category:'Income',      amount:+600,  date:'May 5', icon:'tabler-coin',            color:'#28C76F' },
  { id:'t6', desc:'Transit pass',         category:'Transport',   amount:-128,  date:'May 6', icon:'tabler-bus',             color:'#00BAD1' },
  { id:'t7', desc:'Restaurant — dinner',  category:'Food',        amount:-74,   date:'May 7', icon:'tabler-fork',            color:'#FF9F43' },
  { id:'t8', desc:'Spotify',              category:'Subscriptions', amount:-10, date:'May 7', icon:'tabler-music',           color:'#7367F0' },
]

const BUDGETS = [
  { id:'b1', category:'Housing',     icon:'tabler-home',          color:'#FF4C51', budgeted:1500, spent:1500 },
  { id:'b2', category:'Food',        icon:'tabler-shopping-cart', color:'#FF9F43', budgeted:600,  spent:412  },
  { id:'b3', category:'Transport',   icon:'tabler-bus',           color:'#00BAD1', budgeted:200,  spent:128  },
  { id:'b4', category:'Subscriptions',icon:'tabler-apps',         color:'#7367F0', budgeted:100,  spent:87   },
  { id:'b5', category:'Entertainment',icon:'tabler-confetti',     color:'#C97C4A', budgeted:200,  spent:43   },
  { id:'b6', category:'Health',      icon:'tabler-heartbeat',     color:'#28C76F', budgeted:150,  spent:60   },
]

const SAVINGS_GOALS = [
  { id:'sg1', name:'Emergency Fund',   icon:'tabler-shield',       color:'#28C76F', saved:8200,  target:10000, deadline:'Dec 2026', linked:'Wealthsimple TFSA' },
  { id:'sg2', name:'Japan Trip',       icon:'tabler-plane',        color:'#00BAD1', saved:1840,  target:5000,  deadline:'Oct 2026',  linked:'TD Savings' },
  { id:'sg3', name:'MacBook Pro',      icon:'tabler-device-laptop',color:'#7367F0', saved:900,   target:2500,  deadline:'Aug 2026',  linked:'TD Savings' },
  { id:'sg4', name:'Down Payment',     icon:'tabler-home',         color:'#C9A96E', saved:14200, target:40000, deadline:'Dec 2028',  linked:'Wealthsimple TFSA' },
]

const BILLS = [
  { id:'bl1', name:'Rent',             icon:'tabler-home',          color:'#FF4C51', amount:1500, due:'May 1',  daysLeft:1, recurring:'Monthly' },
  { id:'bl2', name:'Internet',         icon:'tabler-wifi',          color:'#00BAD1', amount:70,   due:'May 8',  daysLeft:8, recurring:'Monthly' },
  { id:'bl3', name:'Car Insurance',    icon:'tabler-car',           color:'#FF9F43', amount:180,  due:'May 15', daysLeft:15, recurring:'Monthly' },
  { id:'bl4', name:'Gym membership',   icon:'tabler-barbell',       color:'#28C76F', amount:45,   due:'May 20', daysLeft:20, recurring:'Monthly' },
  { id:'bl5', name:'Annual Insurance', icon:'tabler-shield',        color:'#7367F0', amount:380,  due:'May 20', daysLeft:20, recurring:'Annual' },
]

const CASHFLOW_MONTHS = ['Nov','Dec','Jan','Feb','Mar','Apr'].map((m, i) => ({
  month: m,
  income: [4200,4850,4200,4200,4800,5050][i],
  expenses: [2900,3400,2600,2700,2800,2840][i],
}))

// ─── HELPERS ──────────────────────────────────────────────────
function fmt(n: number) {
  const abs = Math.abs(n)
  const s = abs >= 1000 ? `$${(abs/1000).toFixed(1)}k` : `$${abs.toFixed(0)}`
  return n < 0 ? `-${s}` : s
}
function fmtFull(n: number) {
  return `$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

// ─── SHARED UI ────────────────────────────────────────────────
function SectionHeader({ title, sub, icon, action }: { title: string; sub: string; icon: string; action?: React.ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
      <div style={{ width:32, height:32, borderRadius:9, background:W16, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <i className={icon} style={{ fontSize:16, color:W }} />
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:700, fontSize:'1rem', color:'var(--mui-palette-text-primary)' }}>{title}</div>
        <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>{sub}</div>
      </div>
      {action && (
        <button style={{ background:W16, border:'none', borderRadius:8, padding:'7px 14px', fontSize:'.8rem', fontWeight:700, color:W, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          {action}
        </button>
      )}
    </div>
  )
}

// ─── OVERVIEW TAB ─────────────────────────────────────────────
function OverviewTab() {
  const netWorth = ACCOUNTS.reduce((s,a) => s + a.balance, 0)
  const maxCashflow = Math.max(...CASHFLOW_MONTHS.map(m => m.income))
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {/* Net worth hero */}
      <div style={{ background:`linear-gradient(135deg, ${W16}, rgba(201,169,110,.08))`, border:`1px solid ${W30}`, borderRadius:14, padding:'24px 28px', display:'flex', gap:32, alignItems:'center', flexWrap:'wrap' }}>
        <div>
          <div style={{ fontSize:'.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:W, marginBottom:4 }}>Net Worth</div>
          <div style={{ fontSize:'2.25rem', fontWeight:800, color:'var(--mui-palette-text-primary)', lineHeight:1 }}>{fmtFull(netWorth)}</div>
          <div style={{ fontSize:'.8125rem', color:SUCCESS, marginTop:4, display:'flex', alignItems:'center', gap:4 }}>
            <i className='tabler-trending-up' style={{ fontSize:14 }} /> +$1,240 this month
          </div>
        </div>
        <div style={{ display:'flex', gap:28, flexWrap:'wrap' }}>
          {[
            { label:'Monthly Income', value:fmtFull(5050), color:SUCCESS },
            { label:'Monthly Expenses', value:fmtFull(2840), color:DANGER },
            { label:'Savings Rate', value:'44%', color:W },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', fontWeight:500, textTransform:'uppercase', letterSpacing:'.4px' }}>{s.label}</div>
              <div style={{ fontSize:'1.25rem', fontWeight:700, color:s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cashflow bars */}
      <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'20px' }}>
        <div style={{ fontWeight:600, fontSize:'.9375rem', color:'var(--mui-palette-text-primary)', marginBottom:16 }}>6-Month Cashflow</div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:100 }}>
          {CASHFLOW_MONTHS.map(m => (
            <div key={m.month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
              <div style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap:2, justifyContent:'flex-end', height:80 }}>
                <div style={{ width:'100%', height:`${(m.income/maxCashflow)*70}px`, background:`${SUCCESS}40`, borderRadius:'4px 4px 0 0', position:'relative' }}>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:`${(m.expenses/m.income)*100}%`, background:`${DANGER}50`, borderRadius:'4px 4px 0 0' }} />
                </div>
              </div>
              <span style={{ fontSize:'.65rem', color:'var(--mui-palette-text-secondary)' }}>{m.month}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:16, marginTop:12 }}>
          {[{ label:'Income', color:SUCCESS }, { label:'Expenses', color:DANGER }].map(l => (
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:`${l.color}60` }} />
              <span style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--mui-palette-divider)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontWeight:600, fontSize:'.9375rem', color:'var(--mui-palette-text-primary)' }}>Recent Transactions</span>
          <span style={{ fontSize:'.75rem', color:W, fontWeight:600, cursor:'pointer' }}>View all</span>
        </div>
        {TRANSACTIONS.slice(0,5).map((t, i) => (
          <div key={t.id} style={{ padding:'13px 20px', display:'flex', alignItems:'center', gap:14, borderBottom: i < 4 ? '1px solid var(--mui-palette-divider)' : 'none' }}>
            <div style={{ width:38, height:38, borderRadius:10, background:`${t.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <i className={t.icon} style={{ fontSize:18, color:t.color }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'.875rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>{t.desc}</div>
              <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>{t.category} · {t.date}</div>
            </div>
            <div style={{ fontWeight:700, fontSize:'1rem', color: t.amount > 0 ? SUCCESS : 'var(--mui-palette-text-primary)' }}>
              {t.amount > 0 ? '+' : ''}{fmtFull(t.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ACCOUNTS TAB ─────────────────────────────────────────────
function AccountsTab() {
  const total = ACCOUNTS.reduce((s,a) => s + a.balance, 0)
  const assets = ACCOUNTS.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance,0)
  const liabilities = ACCOUNTS.filter(a=>a.balance<0).reduce((s,a)=>s+Math.abs(a.balance),0)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <SectionHeader title="Accounts" sub="All linked financial accounts" icon="tabler-building-bank" action={<><i className='tabler-plus' style={{ fontSize:13 }} /> Link account</>} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { label:'Net Worth', value:fmtFull(total), color:'var(--mui-palette-text-primary)' },
          { label:'Total Assets', value:fmtFull(assets), color:SUCCESS },
          { label:'Total Liabilities', value:fmtFull(liabilities), color:DANGER },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'16px 20px' }}>
            <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', fontWeight:500, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:'1.375rem', fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {ACCOUNTS.map(a => (
          <div key={a.id} style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'18px 22px', display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:46, height:46, borderRadius:11, background:`${a.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <i className={a.icon} style={{ fontSize:22, color:a.color }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'.9375rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>{a.name}</div>
              <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>{a.type} · Updated {a.updated}</div>
            </div>
            <div style={{ textAlign:'end' }}>
              <div style={{ fontSize:'1.25rem', fontWeight:800, color: a.balance >= 0 ? 'var(--mui-palette-text-primary)' : DANGER }}>{fmtFull(a.balance)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── BUDGETS TAB ──────────────────────────────────────────────
function BudgetsTab() {
  const totalBudgeted = BUDGETS.reduce((s,b)=>s+b.budgeted,0)
  const totalSpent = BUDGETS.reduce((s,b)=>s+b.spent,0)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <SectionHeader title="Budgets" sub="Monthly spend tracking" icon="tabler-wallet" action={<><i className='tabler-plus' style={{ fontSize:13 }} /> Add category</>} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { label:'Total Budgeted', value:fmtFull(totalBudgeted), color:'var(--mui-palette-text-primary)' },
          { label:'Total Spent', value:fmtFull(totalSpent), color: totalSpent/totalBudgeted > 0.9 ? DANGER : WARNING },
          { label:'Remaining', value:fmtFull(totalBudgeted-totalSpent), color:SUCCESS },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'16px 20px' }}>
            <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', fontWeight:500, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:'1.375rem', fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {BUDGETS.map(b => {
          const pct = Math.min(100, Math.round((b.spent/b.budgeted)*100))
          const over = b.spent > b.budgeted
          const warn = pct > 85
          const barColor = over ? DANGER : warn ? WARNING : SUCCESS
          return (
            <div key={b.id} style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'16px 20px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:`${b.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <i className={b.icon} style={{ fontSize:18, color:b.color }} />
                </div>
                <span style={{ flex:1, fontSize:'.9375rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>{b.category}</span>
                {over && <span style={{ fontSize:'.7rem', fontWeight:700, color:DANGER, background:`${DANGER}15`, padding:'2px 8px', borderRadius:9999 }}>Over budget</span>}
                <span style={{ fontSize:'.875rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>{fmtFull(b.spent)} <span style={{ fontWeight:400, color:'var(--mui-palette-text-secondary)' }}>/ {fmtFull(b.budgeted)}</span></span>
              </div>
              <div style={{ background:'var(--mui-palette-action-hover)', borderRadius:9999, height:8 }}>
                <div style={{ width:`${pct}%`, height:'100%', background:barColor, borderRadius:9999, transition:'width 500ms' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
                <span style={{ fontSize:'.75rem', color:barColor, fontWeight:700 }}>{fmtFull(b.spent)} spent</span>
                <span style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>{fmtFull(b.budgeted - b.spent)} left</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── GOALS TAB ────────────────────────────────────────────────
function GoalsTab() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <SectionHeader title="Savings Goals" sub="Track your financial targets" icon="tabler-target" action={<><i className='tabler-plus' style={{ fontSize:13 }} /> New goal</>} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
        {SAVINGS_GOALS.map(g => {
          const pct = Math.round((g.saved/g.target)*100)
          const remaining = g.target - g.saved
          const r = 28
          const circ = 2 * Math.PI * r
          return (
            <div key={g.id} style={{ background:'var(--mui-palette-background-paper)', borderRadius:14, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'22px', display:'flex', gap:18, alignItems:'flex-start' }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r={r} fill="none" stroke="var(--mui-palette-action-hover)" strokeWidth="7" />
                  <circle cx="36" cy="36" r={r} fill="none" stroke={g.color} strokeWidth="7"
                    strokeDasharray={`${circ*pct/100} ${circ*(1-pct/100)}`}
                    strokeDashoffset={circ*0.25} strokeLinecap="round" />
                </svg>
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <i className={g.icon} style={{ fontSize:18, color:g.color }} />
                </div>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                  <div style={{ fontSize:'.9375rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>{g.name}</div>
                  <span style={{ fontSize:'.8rem', fontWeight:700, color:g.color }}>{pct}%</span>
                </div>
                <div style={{ fontSize:'.8125rem', color:'var(--mui-palette-text-secondary)', marginBottom:8 }}>
                  {fmtFull(g.saved)} <span style={{ color:'var(--mui-palette-text-disabled)' }}>/ {fmtFull(g.target)}</span>
                </div>
                <div style={{ background:'var(--mui-palette-action-hover)', borderRadius:9999, height:5, marginBottom:8 }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:g.color, borderRadius:9999 }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>
                  <span>{fmtFull(remaining)} to go</span>
                  <span>Due {g.deadline}</span>
                </div>
                <div style={{ marginTop:8, display:'flex', alignItems:'center', gap:5 }}>
                  <i className='tabler-link' style={{ fontSize:12, color:'var(--mui-palette-text-secondary)' }} />
                  <span style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', fontStyle:'italic' }}>{g.linked}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ background:W10, border:`1px solid ${W30}`, borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', gap:14 }}>
        <i className='tabler-bulb' style={{ fontSize:22, color:W, flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:'.875rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>At your current pace you'll reach Emergency Fund by October</div>
          <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)', marginTop:2 }}>Increase your monthly contribution by $150 to hit your December target.</div>
        </div>
        <button style={{ background:W, color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontSize:'.8rem', fontWeight:700, cursor:'pointer', flexShrink:0, whiteSpace:'nowrap' }}>Adjust plan</button>
      </div>
    </div>
  )
}

// ─── BILLS TAB ────────────────────────────────────────────────
function BillsTab() {
  const totalDue = BILLS.reduce((s,b)=>s+b.amount,0)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <SectionHeader title="Bills & Commitments" sub="Upcoming recurring charges" icon="tabler-calendar-due" action={<><i className='tabler-plus' style={{ fontSize:13 }} /> Add bill</>} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { label:'Due this month', value:fmtFull(totalDue), color:DANGER },
          { label:'Bills remaining', value:`${BILLS.length}`, color:W },
          { label:'Next due', value:'May 1 — Rent', color:'var(--mui-palette-text-secondary)' },
        ].map((s,i) => (
          <div key={i} style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', padding:'16px 20px' }}>
            <div style={{ fontSize:'.7rem', color:'var(--mui-palette-text-secondary)', fontWeight:500, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontSize:'1.375rem', fontWeight:700, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ background:'var(--mui-palette-background-paper)', borderRadius:12, boxShadow:'0 2px 8px rgba(47,43,61,.08)', overflow:'hidden' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--mui-palette-divider)', display:'flex', alignItems:'center', gap:8 }}>
          <i className='tabler-calendar' style={{ color:W, fontSize:16 }} />
          <span style={{ fontWeight:600, fontSize:'.875rem', color:'var(--mui-palette-text-primary)', flex:1 }}>May 2026</span>
        </div>
        {BILLS.map((b, i) => {
          const urgent = b.daysLeft <= 5
          return (
            <div key={b.id} style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:14, borderBottom: i < BILLS.length-1 ? '1px solid var(--mui-palette-divider)' : 'none' }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${b.color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <i className={b.icon} style={{ fontSize:18, color:b.color }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'.875rem', fontWeight:600, color:'var(--mui-palette-text-primary)' }}>{b.name}</div>
                <div style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)', marginTop:1 }}>
                  {b.recurring} · Due {b.due}
                </div>
              </div>
              {urgent ? (
                <span style={{ fontSize:'.7rem', fontWeight:700, color:DANGER, background:`${DANGER}15`, padding:'2px 8px', borderRadius:9999 }}>{b.daysLeft}d</span>
              ) : (
                <span style={{ fontSize:'.75rem', color:'var(--mui-palette-text-secondary)' }}>in {b.daysLeft}d</span>
              )}
              <div style={{ fontSize:'1rem', fontWeight:700, color:'var(--mui-palette-text-primary)' }}>{fmtFull(b.amount)}</div>
              <button style={{ background:W16, color:W, border:'none', borderRadius:7, padding:'6px 12px', fontSize:'.75rem', fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>Pay now</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── MAIN VIEW ────────────────────────────────────────────────
const TABS = [
  { id:'overview', label:'Overview',  icon:'tabler-layout-dashboard' },
  { id:'accounts', label:'Accounts',  icon:'tabler-building-bank'   },
  { id:'budgets',  label:'Budgets',   icon:'tabler-wallet'          },
  { id:'goals',    label:'Goals',     icon:'tabler-target'          },
  { id:'bills',    label:'Bills',     icon:'tabler-calendar-due'    },
]

export default function WealthView() {
  const [tab, setTab] = useState('overview')

  function renderTab() {
    switch (tab) {
      case 'overview': return <OverviewTab />
      case 'accounts': return <AccountsTab />
      case 'budgets':  return <BudgetsTab />
      case 'goals':    return <GoalsTab />
      case 'bills':    return <BillsTab />
      default:         return null
    }
  }

  return (
    <div style={{ maxWidth:1200, padding:'0 4px' }}>
      {/* Header */}
      <div style={{ marginBottom:20, display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:W16, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className='tabler-report-money' style={{ fontSize:18, color:W }} />
            </div>
            <h1 style={{ fontSize:'1.375rem', fontWeight:700, color:'var(--mui-palette-text-primary)', margin:0 }}>LifeSync Wealth</h1>
            <span style={{ background:W16, color:W, fontSize:'.7rem', fontWeight:700, padding:'3px 9px', borderRadius:9999 }}>Beta</span>
          </div>
          <div style={{ fontSize:'.8125rem', color:'var(--mui-palette-text-secondary)', marginLeft:44 }}>Your financial operating system</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ background:'var(--mui-palette-background-paper)', border:'1px solid var(--mui-palette-divider)', borderRadius:8, padding:'8px 14px', fontSize:'.8rem', fontWeight:600, color:'var(--mui-palette-text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            <i className='tabler-refresh' style={{ fontSize:14 }} /> Sync accounts
          </button>
          <button style={{ background:W, color:'#fff', border:'none', borderRadius:8, padding:'8px 16px', fontSize:'.8rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, boxShadow:`0 2px 8px ${W30}` }}>
            <i className='tabler-plus' style={{ fontSize:14 }} /> Add transaction
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:'flex', background:'var(--mui-palette-background-paper)', borderRadius:12, padding:5, gap:2, marginBottom:20, width:'fit-content', boxShadow:'0 1px 4px rgba(47,43,61,.06)', flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding:'8px 16px', borderRadius:9, border:'none', fontSize:'.8125rem', fontWeight:600,
            background: tab===t.id ? W : 'transparent',
            color: tab===t.id ? '#fff' : 'var(--mui-palette-text-secondary)',
            cursor:'pointer', transition:'all 180ms',
            display:'flex', alignItems:'center', gap:6,
            boxShadow: tab===t.id ? `0 2px 8px ${W30}` : 'none',
          }}>
            <i className={t.icon} style={{ fontSize:15 }} />
            {t.label}
          </button>
        ))}
      </div>

      {renderTab()}
    </div>
  )
}
