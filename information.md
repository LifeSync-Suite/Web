# LifeSync Web App — Feature Context Document

> **Purpose:** AI context doc. Describes current implemented features, UI structure, tech stack, and routing. All data is mock/prototype — no backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.5, React 18, App Router |
| UI Library | MUI v5 (Material-UI) + Emotion CSS-in-JS |
| Styling | Tailwind CSS 3, PostCSS, CSS custom properties |
| State | Redux Toolkit, React Query (TanStack) |
| Forms | React Hook Form + Valibot |
| Charts | ApexCharts, Recharts |
| Calendar | FullCalendar 6 |
| Auth | NextAuth 4 (bypassed in dev — fake user: Alex Johnson) |
| Language | TypeScript 5.5 |
| Icons | Tabler Icons (class prefix: `tabler-*`) |
| Font | Plus Jakarta Sans (body), Lora (serif accents) |

**Primary color:** `#C97C4A` (burnt orange). Background: `#F8F4EF`. Token namespace: `var(--mui-palette-*)`.

---

## Routing Structure

```
/[lang]/(dashboard)/(private)/
├── dashboards/crm          → Overview Dashboard
├── dashboards/analytics    → Analytics (template stub)
├── apps/tasks              → Tasks (Kanban / Timebox / Folders)
├── apps/goals              → Goals
├── apps/decisions          → Decision Compass
├── apps/habits             → Habits
├── apps/mood               → Mood & Journal
├── apps/focus              → Focus Timer
├── apps/calendar           → Calendar
├── apps/wealth             → Wealth
└── apps/projects           → Projects & Billing
```

`[lang]` is an i18n dynamic segment (e.g. `en`). All routes are auth-protected but auth is bypassed in this prototype — every route renders immediately.

---

## Sidebar Navigation

```
DASHBOARD
  Overview          → /dashboards/crm
  Analytics         → /dashboards/analytics

MODULES
  Tasks             → /apps/tasks          [badge: "4"]
  Goals             → /apps/goals
  Decisions         → /apps/decisions      [badge: "NEW"]
  Habits            → /apps/habits         [badge: "12d"]
  Mood & Journal    → /apps/mood
  Focus Timer       → /apps/focus
  Calendar          → /apps/calendar

FINANCE
  Wealth            → /apps/wealth
  Projects          → /apps/projects       [badge: "NEW"]
  Analytics         → /dashboards/analytics

ACCOUNT
  Settings          → /pages/account-settings
  Profile           → /pages/user-profile
```

---

## Modules

### Overview Dashboard (`/dashboards/crm`)
**File:** `src/views/dashboards/overview/OverviewDashboard.tsx`

Unified personal dashboard. Two stat rows + three main widget rows.

**Stat Row 1 — Productivity:**
- Tasks Today (8/12 done)
- Habit Streak (12 days)
- Focus Today (3h 20m)
- Mood Today (Focused)

**Stat Row 2 — Finance:**
- Net Worth ($36,837 ↑ $1,240)
- Savings Rate (44%)
- Accrued Earnings ($16.2k)
- Active Projects (4/5)

**Widget Row 1:**
- **Wealth Snapshot** — Net worth, 6-month cashflow bars, savings rate progress bar
- **Projects & Earnings** — Accrued/outstanding amounts, 7-day hours bar chart, top 3 projects
- **Bills & Budget** — Upcoming bills list, budget overspend alerts

**Widget Row 2:**
- **Goal Progress** — 4 goals with dual-bar (actual vs. expected)
- **Habit Tracker** — 21-day heatmap for 5 habits
- **Mood Map** — 2D scatter (energy × valence) with 7 plotted dots

**Widget Row 3:**
- **Today's Tasks** — Checklist of 6 tasks with color-coded category tags
- **Focus Sessions** — 3 session type bars (Deep Work, Writing, Learning) + Start button

---

### Tasks (`/apps/tasks`)
**File:** `src/views/apps/tasks/TasksView.tsx`

Three view modes toggled via tab bar. Sticky toolbar with search + "New Task" button.

- **Kanban** — Drag-and-drop columns by status. Cards show title, date, priority/tag, pointer-event drag (touch + mouse).
- **Timebox** — Timeline/calendar layout. Time blocks per task. No search bar. Vertical-only drag, edge auto-scroll, drop-to-unscheduled zone.
- **Folders** — Hierarchical folder/project tree with nested task lists. Searchable.

---

### Goals (`/apps/goals`)
**File:** `src/views/apps/goals/GoalsView.tsx`

**KPI strip (4 cards):** Active (6), On pace (4), Behind (1), Completed YTD (3).

**Hero Goal card** — "Read 5,000 pages this year":
- Pace badge (Ahead / On track / Slightly behind / Behind)
- Dual progress bar: actual bar + expected line marker
- Progress stats: actual, expected %, days remaining, pace ratio (×)
- Binding chips (linked habits/tasks)

**Goal grid** — Filter: All / Active / Paused / Completed. Cards show:
- Icon, title, metric type (Cumulative / Count / Streak / Value reach / Checklist)
- Mini dual-bar, actual/target values, pace ratio badge, linked count

---

### Decision Compass (`/apps/decisions`)
**File:** `src/views/apps/decisions/DecisionsView.tsx`

Values-based decision scoring framework. Four screens, client-side routed.

**List screen:**
- Values card (8 values: Growth, Financial Security, Autonomy, Career, Health, Family, Stability, Adventure)
- Stat row: In progress, Decided, Outcome reviews, Calibration
- Active decisions (scored, awaiting commit) — with "See results" button
- Decision journal (committed decisions table: title, chosen option, stakes, date)
- Drafts section

**Results screen:**
- Values-aligned recommendation callout (top-scoring option + score/100)
- Option comparison: horizontal score bars for all options
- Value contributions matrix: values × options with −5 to +5 impact cells (color-coded)
- "Commit to this decision" button

**Detail screen (committed):**
- Chosen option, composite score, decision date
- Stakes + reversibility pills
- Outcome review placeholder (V2)

**New Decision Wizard (4 steps):**
1. Frame it — Title, context, stakes (Low/Med/High)
2. Options — Add 2–5 option labels
3. Score — Matrix grid (prototype routes to sample data)
4. Review — Confirm and view results

Sample decision pre-loaded: "Accept the Concordia MASc offer?" with 3 options, 8 criteria.

---

### Habits (`/apps/habits`)
**File:** `src/views/apps/habits/HabitsView.tsx`

**Header stats (3 cards):** Today X/5 completed, Best Streak (21d), Weekly Rate (84%).

**Habit rows** (5 habits: Morning Meditation, 5km Run, Journaling, Reading 30m, Cold Shower):
- Icon, name, streak + target, completion toggle button
- This week: 7 day checkboxes (Mon–Sun)
- 70-day heatmap with color intensity (0–4 scale, hidden on mobile)

---

### Mood & Journal (`/apps/mood`)
**File:** `src/views/apps/mood/MoodView.tsx`

Two tabs: **Log Mood** | **Journal History**.

**Log Mood:**
- 2D emotion map (SVG): 20 emotions plotted by energy (Y) × valence (X). Click to select.
- Journal panel: random prompt, Lora-font textarea, 5 emoji buttons, Save Entry button, encryption notice.

**Journal History:**
- List of past entries: mood badge + name + timestamp + journal text excerpt.

---

### Focus Timer (`/apps/focus`)
**File:** `src/views/apps/focus/FocusView.tsx`

Pomodoro-style timer. Left panel + right sidebar.

**Left — Timer:**
- Phase badge (Focus / Break, color-coded)
- SVG circular progress ring (200×200px), center shows MM:SS + session number
- Editable task name input
- Controls: Reset | Play/Pause | Skip Phase
- Session dots (4-dot Pomodoro cycle), daily session count

**Right Sidebar:**
- **Session templates** (3 cards): Deep Work 50m/10m, Study 25m/5m, Light 15m/5m
- **Ambient sound** (5 buttons): Rain, Forest, Café, White Noise, Silence
- **Today's log**: completed session list with task name + duration, total time

---

### Calendar (`/apps/calendar`)
**File:** `src/views/apps/calendar/` (FullCalendar integration)

Standard calendar UI: month/week/day/list views, add/edit event dialog, FullCalendar 6.

---

### Wealth (`/apps/wealth`)
**File:** `src/views/apps/wealth/WealthView.tsx`

Header: "LifeSync Wealth" + Beta badge, Sync accounts + Add transaction buttons.

**5 tabs:**

**Overview:**
- Net worth hero ($36,837, ↑$1,240, income $5,050, expenses $2,840, savings 44%)
- 6-month cashflow stacked bar chart (income + expenses overlay)
- Recent transactions list (5 items: icon, desc, category, date, amount)

**Accounts:**
- Stats: Net Worth / Total Assets / Total Liabilities
- 4 accounts: TD Checking ($4,821), TD Savings ($14,200), Wealthsimple TFSA ($17,816), Visa (−$3,200)

**Budgets:**
- Stats: Budgeted / Spent / Remaining
- 6 categories: Housing, Food, Transport, Subscriptions, Entertainment, Health
- Progress bar per category (green < 85%, yellow ≥ 85%, red = over budget)

**Goals (Savings Goals):**
- 4 cards in 2-column grid, each with SVG ring chart:
  - Emergency Fund ($8,200/$10,000), Japan Trip ($1,840/$5,000), MacBook ($900/$2,500), Down Payment ($14,200/$40,000)
- Insight/tip card at bottom

**Bills:**
- Stats: Due this month / Bills remaining / Next due
- Bill list: Rent, Internet, Car Insurance, Gym, Annual Insurance
- Urgency: days left shown, red badge if ≤5 days, "Pay now" button

---

### Projects & Billing (`/apps/projects`)
**File:** `src/views/apps/projects/ProjectsView.tsx`

Freelance/consulting earnings tracker. Three payment models: Hourly, Project-based (fixed), Monthly retainer.

**Stat row (4 cards):** Active Projects (4), Accrued Earnings ($16,210), Outstanding ($6,360), Hours Logged (27h).

**Integration callout:** "Tasks ↔ Wealth integration is live" — completing billable tasks auto-logs to Wealth ledger.

**Filters:** All / Active / Paused / Completed (with counts).

**Project cards** (5 projects, expandable):
- Collapsed: icon, name, status pill, payment type pill, client, billing basis, task count, accrued amount
- Progress strip bar at bottom

Expanded (2-column):
- Left: Billing config (payment type, rate, client), tasks list with per-task earnings and hours
- Right: Earnings summary (accrued / paid / outstanding), payments received history, "Log payment received" button

**New Project modal:** Name, client, payment type selector, rate input.

**Mock projects:**
1. Book "Quiet Systems" — hourly $75/h (self-publish)
2. Acme Q2 Brand Refresh — fixed $4,500 (55% milestone)
3. Acme Design Retainer — $3,200/mo (3 months)
4. Pixel Studios Indie Game UX — hourly $95/h
5. Personal Portfolio — paused, $0 (self)

---

## Key Design Patterns

- **All style via inline `style={{}}`** — no MUI `sx` prop or Tailwind in new module views. Token: `var(--mui-palette-text-primary)`, `var(--mui-palette-background-paper)`, `var(--mui-palette-divider)`, etc.
- **Icons:** `<i className='tabler-icon-name' />` — never `ti ti-*` or `ti-*`.
- **Responsive:** `useBreakpoint()` / `isMobile()` / `isTablet()` hooks from `@/hooks/useBreakpoint`.
- **No backend** — all data is module-level constants. No API calls, no async, no loading states.
- **Auth bypassed** — `AuthGuard` and `GuestOnlyRoute` always render children. Fake user `{ name: 'Alex Johnson', email: 'alex@lifesync.app' }`.
- **Tabler icon prefix is `tabler-`** — e.g. `tabler-flame`, `tabler-chart-line`, not `tabler-icon-flame`.

---

*Generated May 2026 from source at `src/` — update this file when new modules are added.*
