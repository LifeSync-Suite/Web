'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import Typography from '@mui/material/Typography'
import type { Locale } from '@configs/i18n'
import { getLocalizedUrl } from '@/utils/i18n'
import { useBreakpoint, isTablet, isMobile } from '@/hooks/useBreakpoint'

// ─── Mock data ────────────────────────────────────────────────────────────────

const WEALTH = {
  netWorth: 36837,
  netWorthDelta: 1240,
  monthlyIncome: 5050,
  monthlyExpenses: 2840,
  savingsRate: 44,
  cashflow6m: [
    { m: 'Nov', income: 4200, expenses: 2940 },
    { m: 'Dec', income: 4850, expenses: 3420 },
    { m: 'Jan', income: 4200, expenses: 2780 },
    { m: 'Feb', income: 4200, expenses: 3100 },
    { m: 'Mar', income: 5050, expenses: 2850 },
    { m: 'Apr', income: 5050, expenses: 2840 },
  ],
  upcomingBills: [
    { name: 'Rent',        amount: 1500,  daysLeft: 3,  icon: 'tabler-home',  color: '#FF4C51' },
    { name: 'Internet',    amount: 79.99, daysLeft: 7,  icon: 'tabler-wifi',  color: '#808390' },
    { name: 'Electricity', amount: 88.00, daysLeft: 9,  icon: 'tabler-bolt',  color: '#FF9F43' },
  ],
  budgetAlerts: [
    { cat: 'Food & Dining', pct: 91, color: '#FF9F43', icon: 'tabler-fork' },
    { cat: 'Subscriptions', pct: 95, color: '#7367F0', icon: 'tabler-refresh' },
  ],
}

const PROJECTS = {
  activeCount: 4,
  totalCount: 5,
  totalAccrued: 16210,
  outstanding: 6360,
  hoursThisWeek: 11.5,
  hoursByDay: [1.5, 2.0, 0, 3.0, 2.5, 1.0, 1.5],
  top: [
    { name: 'Acme — Brand Refresh', pct: 67, color: '#7367F0', icon: 'tabler-palette',  accrued: 2475 },
    { name: 'Pixel Studios — UX',   pct: 60, color: '#00BAD1', icon: 'tabler-device-gamepad-2', accrued: 1852 },
    { name: 'Acme — Retainer',      pct: 75, color: '#6B8F71', icon: 'tabler-refresh',  accrued: 9600 },
  ],
}

function money(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`
  return `$${Math.round(v).toLocaleString()}`
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, iconColor, iconBg, label, value, sub, subColor }: {
  icon: string; iconColor: string; iconBg: string
  label: string; value: string; sub?: string; subColor?: string
}) {
  return (
    <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
      <div style={{ width: 46, height: 46, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <i className={icon} style={{ fontSize: 22, color: iconColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--mui-palette-text-primary)', lineHeight: 1.3 }}>{value}</div>
        {sub && <div style={{ fontSize: '.7rem', color: subColor ?? 'var(--mui-palette-text-disabled)', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  )
}

// ─── Goal progress bar ────────────────────────────────────────────────────────

function GoalBar({ label, pct, color, expected }: { label: string; pct: number; color: string; expected: number }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: '.8125rem', color: 'var(--mui-palette-text-secondary)', fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: '.75rem', color, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 9999, height: 7, position: 'relative', overflow: 'visible' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 9999, transition: 'width 600ms' }} />
        <div style={{ position: 'absolute', top: -3, left: `${expected}%`, width: 2, height: 13, background: 'var(--mui-palette-text-disabled)', borderRadius: 2 }} title={`Expected: ${expected}%`} />
      </div>
      <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', marginTop: 3 }}>Expected: {expected}%</div>
    </div>
  )
}

// ─── Habit heatmap row ────────────────────────────────────────────────────────

function HeatmapRow({ label, days }: { label: string; days: number[] }) {
  const colors = ['var(--mui-palette-action-selected)', 'rgba(40,199,111,.2)', 'rgba(40,199,111,.45)', 'rgba(40,199,111,.7)', '#28C76F']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
      <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)', minWidth: 90, textAlign: 'right' }}>{label}</div>
      <div style={{ display: 'flex', gap: 3 }}>
        {days.map((v, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: colors[Math.min(v, 4)] }} />
        ))}
      </div>
    </div>
  )
}

// ─── Mood dot ─────────────────────────────────────────────────────────────────

const MOOD_COLORS: Record<string, string> = {
  Happy: '#28C76F', Focused: '#C97C4A', Calm: '#00BAD1',
  Tired: '#808390', Anxious: '#FF9F43', Sad: '#7367F0',
}

function MoodDot({ mood, x, y }: { mood: string; x: number; y: number }) {
  return (
    <div title={mood} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: MOOD_COLORS[mood] ?? '#808390', border: '2px solid var(--mui-palette-background-paper)' }} />
  )
}

// ─── Wealth Snapshot ──────────────────────────────────────────────────────────

function WealthSnapshot({ l }: { l: (path: string) => string }) {
  const W = '#C9A96E'
  const { netWorth, netWorthDelta, monthlyIncome, monthlyExpenses, savingsRate, cashflow6m } = WEALTH
  const maxVal = Math.max(...cashflow6m.flatMap(m => [m.income, m.expenses]))

  return (
    <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)' }}>Wealth Snapshot</div>
          <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>Net worth · cash flow · savings</div>
        </div>
        <i className='tabler-report-money' style={{ color: W, fontSize: 20 }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--mui-palette-text-primary)', lineHeight: 1 }}>${netWorth.toLocaleString()}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '.75rem', fontWeight: 700, color: '#28C76F' }}>
          <i className='tabler-trending-up' style={{ fontSize: 13 }} />
          +{money(netWorthDelta)} <span style={{ color: 'var(--mui-palette-text-disabled)', fontWeight: 500 }}>this mo.</span>
        </div>
      </div>

      {/* Cashflow mini bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 62, marginBottom: 8 }}>
        {cashflow6m.map((m, i) => {
          const incH = (m.income / maxVal) * 56
          const expH = (m.expenses / maxVal) * 56
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 56 }}>
                <div title={`Income: $${m.income}`} style={{ width: 7, height: incH, background: '#28C76F', borderRadius: '2px 2px 0 0', opacity: .85 }} />
                <div title={`Expenses: $${m.expenses}`} style={{ width: 7, height: expH, background: '#FF4C51', borderRadius: '2px 2px 0 0', opacity: .7 }} />
              </div>
              <div style={{ fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 600 }}>{m.m}</div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        {[['Income', '#28C76F'], ['Spend', '#FF4C51']].map(([lbl, c]) => (
          <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.65rem', color: 'var(--mui-palette-text-disabled)' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{lbl}
          </div>
        ))}
      </div>

      {/* Savings rate */}
      <div style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-secondary)', fontWeight: 500 }}>Savings rate</span>
          <span style={{ fontSize: '.75rem', color: W, fontWeight: 700 }}>{savingsRate}% <span style={{ color: 'var(--mui-palette-text-disabled)', fontWeight: 500 }}>· target 25%</span></span>
        </div>
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 9999, height: 6, position: 'relative' }}>
          <div style={{ width: `${savingsRate}%`, height: '100%', background: W, borderRadius: 9999 }} />
          <div style={{ position: 'absolute', top: -2, left: '25%', width: 2, height: 10, background: 'var(--mui-palette-text-disabled)', borderRadius: 2 }} />
        </div>
        <div style={{ fontSize: '.65rem', color: 'var(--mui-palette-text-disabled)', marginTop: 4 }}>
          Saving ${(monthlyIncome - monthlyExpenses).toLocaleString()} of ${monthlyIncome.toLocaleString()} this month
        </div>
      </div>

      <Link href={l('/apps/goals')} style={{ display: 'block', background: 'rgba(201,169,110,.12)', color: W, borderRadius: 7, padding: '8px 16px', fontSize: '.8125rem', fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
        Open Wealth →
      </Link>
    </div>
  )
}

// ─── Projects & Earnings ──────────────────────────────────────────────────────

function ProjectsEarnings({ l }: { l: (path: string) => string }) {
  const W = '#C9A96E'
  const { activeCount, totalAccrued, outstanding, hoursThisWeek, hoursByDay, top } = PROJECTS
  const maxH = Math.max(...hoursByDay, 1)
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)' }}>Projects & Earnings</div>
          <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>{activeCount} active · earning live</div>
        </div>
        <i className='tabler-briefcase' style={{ color: W, fontSize: 20 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <div style={{ background: 'rgba(40,199,111,.08)', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: '.65rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Accrued</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#28C76F' }}>{money(totalAccrued)}</div>
        </div>
        <div style={{ background: 'rgba(255,159,67,.08)', borderRadius: 10, padding: '10px 12px' }}>
          <div style={{ fontSize: '.65rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Outstanding</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FF9F43' }}>{money(outstanding)}</div>
        </div>
      </div>

      {/* Hours this week */}
      <div style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Billable this week</span>
          <span style={{ fontSize: '.85rem', color: 'var(--mui-palette-text-primary)', fontWeight: 800 }}>{hoursThisWeek}h</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 30 }}>
          {hoursByDay.map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div style={{ width: '100%', height: h > 0 ? `${(h / maxH) * 22}px` : 2, background: h > 0 ? W : 'var(--mui-palette-divider)', borderRadius: '2px 2px 0 0', minHeight: 2, opacity: h > 0 ? 1 : 0.4 }} />
              <div style={{ fontSize: '.55rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 600 }}>{dayLabels[i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--mui-palette-text-disabled)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 8 }}>Top active projects</div>
      {top.map((p, i) => (
        <div key={i} style={{ marginBottom: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={p.icon} style={{ fontSize: 12, color: p.color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, fontSize: '.75rem', fontWeight: 600, color: 'var(--mui-palette-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
            <div style={{ fontSize: '.7rem', fontWeight: 700, color: p.color }}>{money(p.accrued)}</div>
          </div>
          <div style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 9999, height: 4, marginLeft: 30 }}>
            <div style={{ width: `${p.pct}%`, height: '100%', background: p.color, borderRadius: 9999 }} />
          </div>
        </div>
      ))}

      <Link href={l('/apps/goals')} style={{ display: 'block', marginTop: 8, background: 'rgba(201,169,110,.12)', color: W, borderRadius: 7, padding: '8px 16px', fontSize: '.8125rem', fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
        Open Projects →
      </Link>
    </div>
  )
}

// ─── Bills & Budget ───────────────────────────────────────────────────────────

function BillsAndBudget({ l }: { l: (path: string) => string }) {
  const { upcomingBills, budgetAlerts } = WEALTH
  const totalDueSoon = upcomingBills.reduce((s, b) => s + b.amount, 0)

  return (
    <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)' }}>Bills & Budget</div>
          <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>What needs attention</div>
        </div>
        <i className='tabler-calendar-due' style={{ color: '#FF4C51', fontSize: 20 }} />
      </div>

      <div style={{ background: 'rgba(255,76,81,.06)', border: '1px solid rgba(255,76,81,.18)', borderRadius: 10, padding: '10px 12px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className='tabler-clock-exclamation' style={{ fontSize: 18, color: '#FF4C51' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.4px' }}>Due in next 10 days</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FF4C51' }}>${Math.round(totalDueSoon).toLocaleString()}</div>
        </div>
        <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)' }}>{upcomingBills.length} bills</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        {upcomingBills.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < upcomingBills.length - 1 ? '1px solid var(--mui-palette-divider)' : 'none' }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `${b.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className={b.icon} style={{ fontSize: 13, color: b.color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--mui-palette-text-primary)' }}>{b.name}</div>
              <div style={{ fontSize: '.65rem', color: 'var(--mui-palette-text-disabled)' }}>in {b.daysLeft}d</div>
            </div>
            <div style={{ fontSize: '.8125rem', fontWeight: 700, color: 'var(--mui-palette-text-primary)' }}>${b.amount}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--mui-palette-text-disabled)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 }}>Budgets near limit</div>
      {budgetAlerts.map((a, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
            <i className={a.icon} style={{ fontSize: 12, color: a.color }} />
            <span style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-secondary)', flex: 1 }}>{a.cat}</span>
            <span style={{ fontSize: '.7rem', fontWeight: 700, color: a.pct > 90 ? '#FF4C51' : '#FF9F43' }}>{a.pct}%</span>
          </div>
          <div style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 9999, height: 4 }}>
            <div style={{ width: `${a.pct}%`, height: '100%', background: a.pct > 90 ? '#FF4C51' : '#FF9F43', borderRadius: 9999 }} />
          </div>
        </div>
      ))}

      <Link href={l('/apps/goals')} style={{ display: 'block', marginTop: 8, background: 'rgba(255,76,81,.10)', color: '#FF4C51', borderRadius: 7, padding: '8px 16px', fontSize: '.8125rem', fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
        Review all bills →
      </Link>
    </div>
  )
}

// ─── CTA button ───────────────────────────────────────────────────────────────

function ViewBtn({ href, color, bg, children }: { href: string; color: string; bg: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ display: 'block', marginTop: 10, background: bg, color, border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: '.8125rem', fontWeight: 600, width: '100%', textAlign: 'center', textDecoration: 'none' }}>
      {children}
    </Link>
  )
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export default function OverviewDashboard() {
  const { lang: locale } = useParams()
  const l = (path: string) => getLocalizedUrl(path, locale as Locale)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const bp = useBreakpoint()
  const mobile = isMobile(bp)
  const tablet = isTablet(bp)

  const statCols = mobile ? '1fr 1fr' : tablet ? '1fr 1fr' : 'repeat(4,minmax(0,1fr))'
  const mainCols = mobile ? '1fr'     : tablet ? '1fr 1fr' : 'repeat(3,minmax(0,1fr))'
  const taskSpan = (!mobile && !tablet) ? 'span 2' : undefined

  return (
    <div>

      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <Typography variant='h5' fontWeight={600}>Good morning, Alex 👋</Typography>
        <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
          {today} — You have 4 tasks due today
        </Typography>
      </div>

      {/* Stat row 1 — well-being + productivity */}
      <div style={{ display: 'grid', gridTemplateColumns: statCols, gap: 16, marginBottom: 12 }}>
        <StatCard icon='tabler-checklist'  iconColor='#7367F0' iconBg='rgba(115,103,240,.12)' label='Tasks Today'  value='8/12'    sub='4 remaining'        subColor='#FF9F43' />
        <StatCard icon='tabler-flame'      iconColor='#28C76F' iconBg='rgba(40,199,111,.12)'  label='Habit Streak' value='12 days' sub='Best: 21 days' />
        <StatCard icon='tabler-clock'      iconColor='#C97C4A' iconBg='rgba(201,124,74,.12)'  label='Focus Today'  value='3h 20m'  sub='+40m vs yesterday'  subColor='#28C76F' />
        <StatCard icon='tabler-mood-smile' iconColor='#00BAD1' iconBg='rgba(0,186,209,.12)'   label='Mood Today'   value='Focused' sub='Energy: High'         subColor='#00BAD1' />
      </div>

      {/* Stat row 2 — wealth + projects */}
      <div style={{ display: 'grid', gridTemplateColumns: statCols, gap: 16, marginBottom: 20 }}>
        <StatCard icon='tabler-report-money' iconColor='#C9A96E' iconBg='rgba(201,169,110,.14)' label='Net Worth'        value={`$${WEALTH.netWorth.toLocaleString()}`} sub={`↑ ${money(WEALTH.netWorthDelta)} this month`} subColor='#28C76F' />
        <StatCard icon='tabler-piggy-bank'   iconColor='#7367F0' iconBg='rgba(115,103,240,.12)' label='Savings Rate'     value={`${WEALTH.savingsRate}%`}              sub='Target: 25%'                subColor='#28C76F' />
        <StatCard icon='tabler-coin'         iconColor='#28C76F' iconBg='rgba(40,199,111,.12)'  label='Accrued Earnings' value={money(PROJECTS.totalAccrued)}           sub={`${money(PROJECTS.outstanding)} unpaid`}    subColor='#FF9F43' />
        <StatCard icon='tabler-briefcase'    iconColor='#C9A96E' iconBg='rgba(201,169,110,.14)' label='Active Projects'  value={`${PROJECTS.activeCount}/${PROJECTS.totalCount}`} sub={`${PROJECTS.hoursThisWeek}h billable this week`} />
      </div>

      {/* Main grid row 1 — Wealth / Projects / Bills */}
      <div style={{ display: 'grid', gridTemplateColumns: mainCols, gap: 16, marginBottom: 16 }}>
        <WealthSnapshot l={l} />
        <ProjectsEarnings l={l} />
        <BillsAndBudget l={l} />
      </div>

      {/* Main grid row 2 — Goals / Habits / Mood */}
      <div style={{ display: 'grid', gridTemplateColumns: mainCols, gap: 16, marginBottom: 16 }}>
        {/* Goal Progress */}
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)' }}>Goal Progress</div>
              <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>Actual vs expected pace</div>
            </div>
            <i className='tabler-target' style={{ color: '#FF9F43', fontSize: 20 }} />
          </div>
          <GoalBar label='Read 12 books' pct={58} color='var(--mui-palette-primary-main)' expected={65} />
          <GoalBar label='Run 500km'     pct={72} color='#28C76F'  expected={60} />
          <GoalBar label='Learn Spanish' pct={31} color='#FF9F43'  expected={50} />
          <GoalBar label='Save $5,000'   pct={83} color='#00BAD1'  expected={75} />
          <ViewBtn href={l('/apps/goals')} color='var(--mui-palette-primary-main)' bg='rgba(201,124,74,.08)'>View all goals →</ViewBtn>
        </div>

        {/* Habit Heatmap */}
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)' }}>Habit Tracker</div>
              <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>Last 21 days</div>
            </div>
            <i className='tabler-flame' style={{ color: '#28C76F', fontSize: 20 }} />
          </div>
          <HeatmapRow label='Morning run' days={[4,3,4,4,2,4,4,3,4,4,4,3,2,4,4,4,4,3,4,4,4]} />
          <HeatmapRow label='Meditation'  days={[4,4,4,3,4,4,4,4,4,4,3,4,4,4,4,3,4,4,4,4,4]} />
          <HeatmapRow label='Journaling'  days={[3,4,2,4,4,3,4,4,1,3,4,4,4,2,4,4,3,4,4,3,4]} />
          <HeatmapRow label='Reading'     days={[4,4,4,4,3,4,4,4,4,2,4,4,4,4,4,4,1,4,4,4,3]} />
          <HeatmapRow label='Cold shower' days={[2,3,4,4,4,3,2,4,4,4,4,3,4,4,4,2,4,4,4,4,4]} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 12 }}>
            <span style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)' }}>Less</span>
            {(['var(--mui-palette-action-selected)', 'rgba(40,199,111,.2)', 'rgba(40,199,111,.45)', 'rgba(40,199,111,.7)', '#28C76F'] as const).map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
            ))}
            <span style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)' }}>More</span>
          </div>
          <ViewBtn href={l('/apps/habits')} color='#28C76F' bg='rgba(40,199,111,.08)'>View habits →</ViewBtn>
        </div>

        {/* Mood Map */}
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)' }}>Mood Map</div>
              <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>Energy × Valence — this week</div>
            </div>
            <i className='tabler-mood-smile' style={{ color: '#00BAD1', fontSize: 20 }} />
          </div>
          <div style={{ position: 'relative', height: 140, background: 'var(--mui-palette-action-hover)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--mui-palette-divider)' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'var(--mui-palette-divider)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--mui-palette-divider)' }} />
            <div style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', whiteSpace: 'nowrap' }}>High Energy</div>
            <div style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', whiteSpace: 'nowrap' }}>Low Energy</div>
            <div style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)' }}>−</div>
            <div style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)' }}>+</div>
            <MoodDot mood='Focused' x={70} y={25} />
            <MoodDot mood='Happy'   x={78} y={60} />
            <MoodDot mood='Calm'    x={68} y={65} />
            <MoodDot mood='Tired'   x={45} y={75} />
            <MoodDot mood='Anxious' x={30} y={30} />
            <MoodDot mood='Focused' x={65} y={35} />
            <MoodDot mood='Happy'   x={72} y={50} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {([['Focused', '#C97C4A'], ['Happy', '#28C76F'], ['Calm', '#00BAD1'], ['Tired', '#808390'], ['Anxious', '#FF9F43']] as [string, string][]).map(([m, c]) => (
              <span key={m} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.7rem', color: 'var(--mui-palette-text-secondary)' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, display: 'inline-block' }} />{m}
              </span>
            ))}
          </div>
          <ViewBtn href={l('/apps/mood')} color='#00BAD1' bg='rgba(0,186,209,.08)'>Open journal →</ViewBtn>
        </div>
      </div>

      {/* Main grid row 3 — Tasks + Focus */}
      <div style={{ display: 'grid', gridTemplateColumns: mainCols, gap: 16 }}>

        {/* Today's Tasks — spans 2 cols on desktop */}
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '20px', gridColumn: taskSpan }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)' }}>Today&apos;s Tasks</div>
            <Link href={l('/apps/tasks')} style={{ background: 'rgba(201,124,74,.08)', color: 'var(--mui-palette-primary-main)', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: '.75rem', fontWeight: 600, textDecoration: 'none' }}>
              View all
            </Link>
          </div>
          {[
            { done: true,  label: 'Review Q2 analytics report', tag: 'Work',     tagColor: '#7367F0', tagBg: 'rgba(115,103,240,.12)' },
            { done: true,  label: 'Morning meditation (15 min)', tag: 'Habit',    tagColor: '#28C76F', tagBg: 'rgba(40,199,111,.12)'  },
            { done: false, label: 'Write chapter 3 outline',     tag: 'Writing',  tagColor: '#C97C4A', tagBg: 'rgba(201,124,74,.12)'  },
            { done: false, label: 'Call with design team @ 3pm', tag: 'Meeting',  tagColor: '#FF9F43', tagBg: 'rgba(255,159,67,.12)'  },
            { done: false, label: 'Spanish lesson on Duolingo',  tag: 'Learning', tagColor: '#00BAD1', tagBg: 'rgba(0,186,209,.12)'   },
            { done: false, label: 'Evening 5km run',             tag: 'Fitness',  tagColor: '#28C76F', tagBg: 'rgba(40,199,111,.12)'  },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < 5 ? '1px solid var(--mui-palette-divider)' : 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${t.done ? '#28C76F' : 'var(--mui-palette-divider)'}`, background: t.done ? '#28C76F' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {t.done && <i className='tabler-check' style={{ fontSize: 11, color: '#fff' }} />}
              </div>
              <span style={{ flex: 1, fontSize: '.8125rem', color: t.done ? 'var(--mui-palette-text-disabled)' : 'var(--mui-palette-text-secondary)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.label}</span>
              <span style={{ background: t.tagBg, color: t.tagColor, padding: '2px 8px', borderRadius: 9999, fontSize: '.7rem', fontWeight: 600 }}>{t.tag}</span>
            </div>
          ))}
        </div>

        {/* Focus Sessions */}
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 12, boxShadow: '0 3px 12px rgba(47,43,61,.14)', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontWeight: 600, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)' }}>Focus Sessions</div>
            <i className='tabler-clock' style={{ color: 'var(--mui-palette-primary-main)', fontSize: 20 }} />
          </div>
          {[
            { label: 'Deep Work', duration: '1h 40m', bar: 60, color: 'var(--mui-palette-primary-main)', sessions: 4 },
            { label: 'Writing',   duration: '55m',    bar: 33, color: '#7367F0',                         sessions: 2 },
            { label: 'Learning',  duration: '45m',    bar: 27, color: '#00BAD1',                         sessions: 2 },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '.8rem', color: 'var(--mui-palette-text-secondary)', fontWeight: 500 }}>{s.label}</span>
                <span style={{ fontSize: '.75rem', color: s.color, fontWeight: 600 }}>{s.duration}</span>
              </div>
              <div style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 9999, height: 5 }}>
                <div style={{ width: `${s.bar}%`, height: '100%', background: s.color, borderRadius: 9999 }} />
              </div>
              <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', marginTop: 2 }}>{s.sessions} sessions · 25 min each</div>
            </div>
          ))}
          <Link href={l('/apps/focus')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 4, background: 'var(--mui-palette-primary-main)', color: '#fff', borderRadius: 7, padding: '9px 16px', fontSize: '.8125rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 6px rgba(201,124,74,.35)' }}>
            <i className='tabler-player-play' style={{ fontSize: 14 }} /> Start Focus Session
          </Link>
        </div>

      </div>
    </div>
  )
}
