export type Priority = 'high' | 'med' | 'low'
export type TaskStatus = 'todo' | 'inprogress' | 'review' | 'done'

export interface Task {
  id: number
  title: string
  tag: string
  tagColor: string
  priority: Priority
  status: TaskStatus
  folder: string
  dur: number
  progress?: number
}

export interface TimeboxEntry {
  taskId: number
  startMin: number
  durMin: number
}

export interface TemplateBlock {
  id: string
  label: string
  startMin: number
  durMin: number
  type: 'fixed' | 'free'
  color: string
}

export interface DayTemplate {
  id: string
  name: string
  color: string
  schedule: Record<string, boolean>
  blocks: TemplateBlock[]
}

export const ALL_TASKS: Task[] = [
  { id: 1,  title: 'Write chapter 3 outline',  tag: 'Writing',  tagColor: '#C97C4A', priority: 'high', status: 'todo',       folder: 'Book Project',    dur: 60 },
  { id: 2,  title: 'Research competitors',      tag: 'Work',     tagColor: '#7367F0', priority: 'med',  status: 'todo',       folder: 'Work',            dur: 45 },
  { id: 3,  title: 'Spanish lesson',            tag: 'Learning', tagColor: '#00BAD1', priority: 'low',  status: 'todo',       folder: 'Personal Growth', dur: 30 },
  { id: 4,  title: 'Q2 analytics report',       tag: 'Work',     tagColor: '#7367F0', priority: 'high', status: 'inprogress', folder: 'Work',            dur: 90, progress: 65 },
  { id: 5,  title: 'Design system tokens',      tag: 'Design',   tagColor: '#C97C4A', priority: 'med',  status: 'inprogress', folder: 'Design',          dur: 60, progress: 40 },
  { id: 6,  title: 'Landing page copy',         tag: 'Writing',  tagColor: '#C97C4A', priority: 'med',  status: 'review',     folder: 'Book Project',    dur: 45 },
  { id: 7,  title: 'Morning meditation',        tag: 'Habit',    tagColor: '#28C76F', priority: 'low',  status: 'done',       folder: 'Personal Growth', dur: 15 },
  { id: 8,  title: 'Team standup call',         tag: 'Meeting',  tagColor: '#FF9F43', priority: 'med',  status: 'done',       folder: 'Work',            dur: 30 },
  { id: 9,  title: 'Evening 5km run',           tag: 'Fitness',  tagColor: '#28C76F', priority: 'low',  status: 'todo',       folder: 'Personal Growth', dur: 40 },
  { id: 10, title: 'Review pull requests',      tag: 'Work',     tagColor: '#7367F0', priority: 'high', status: 'todo',       folder: 'Work',            dur: 30 },
  { id: 11, title: 'Update portfolio site',     tag: 'Design',   tagColor: '#C97C4A', priority: 'med',  status: 'inprogress', folder: 'Design',          dur: 60, progress: 20 },
  { id: 12, title: 'Read — Atomic Habits ch.7', tag: 'Learning', tagColor: '#00BAD1', priority: 'low',  status: 'todo',       folder: 'Personal Growth', dur: 25 },
]

export const COLUMNS = [
  { id: 'todo',       label: 'To Do',       color: '#808390' },
  { id: 'inprogress', label: 'In Progress', color: '#FF9F43' },
  { id: 'review',     label: 'Review',      color: '#00BAD1' },
  { id: 'done',       label: 'Done',        color: '#28C76F' },
] as const

export const STATUS_META: Record<TaskStatus, { label: string; color: string }> = {
  todo:       { label: 'To Do',       color: '#808390' },
  inprogress: { label: 'In Progress', color: '#FF9F43' },
  review:     { label: 'Review',      color: '#00BAD1' },
  done:       { label: 'Done',        color: '#28C76F' },
}

export const PRIORITY_COLOR: Record<Priority, string> = {
  high: '#FF4C51',
  med:  '#FF9F43',
  low:  '#28C76F',
}

export const FOLDERS = [
  { id: 'Work',            color: '#7367F0', icon: 'tabler-briefcase' },
  { id: 'Book Project',    color: '#C97C4A', icon: 'tabler-book' },
  { id: 'Design',          color: '#C9A96E', icon: 'tabler-palette' },
  { id: 'Personal Growth', color: '#28C76F', icon: 'tabler-leaf' },
]

export const DAY_START  = 7
export const DAY_END    = 22
export const TOTAL_MINS = (DAY_END - DAY_START) * 60
export const HOUR_PX    = 56

export const DAYS_SHORT = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
export const DAYS_LABEL: Record<string, string> = { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' }

const dayIdx = new Date().getDay()
export const TODAY_KEY = DAYS_SHORT[dayIdx === 0 ? 6 : dayIdx - 1]

export const BLOCK_COLORS = ['#C97C4A', '#7367F0', '#28C76F', '#00BAD1', '#FF9F43', '#FF4C51', '#6B8F71', '#C9A96E']

export const DEFAULT_TEMPLATES: DayTemplate[] = [
  {
    id: 't1', name: 'Weekday Routine', color: '#C97C4A',
    schedule: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false },
    blocks: [
      { id: 'b1', label: 'Wake up & stretch',    startMin: 0,   durMin: 30,  type: 'fixed', color: '#28C76F' },
      { id: 'b2', label: 'Shower & get ready',   startMin: 30,  durMin: 30,  type: 'fixed', color: '#00BAD1' },
      { id: 'b3', label: 'Breakfast',            startMin: 60,  durMin: 45,  type: 'fixed', color: '#FF9F43' },
      { id: 'b4', label: 'Morning work block',   startMin: 150, durMin: 150, type: 'free',  color: '#7367F0' },
      { id: 'b5', label: 'Lunch & rest',         startMin: 300, durMin: 60,  type: 'fixed', color: '#FF9F43' },
      { id: 'b6', label: 'Afternoon work block', startMin: 360, durMin: 180, type: 'free',  color: '#7367F0' },
      { id: 'b7', label: 'Exercise',             startMin: 540, durMin: 45,  type: 'fixed', color: '#28C76F' },
      { id: 'b8', label: 'Wind down',            startMin: 630, durMin: 60,  type: 'fixed', color: '#00BAD1' },
    ],
  },
  {
    id: 't2', name: 'Weekend Mode', color: '#6B8F71',
    schedule: { mon: false, tue: false, wed: false, thu: false, fri: false, sat: true, sun: true },
    blocks: [
      { id: 'b1', label: 'Slow morning',       startMin: 90,  durMin: 90,  type: 'fixed', color: '#C9A96E' },
      { id: 'b2', label: 'Creative time',      startMin: 180, durMin: 120, type: 'free',  color: '#C97C4A' },
      { id: 'b3', label: 'Lunch & socialise',  startMin: 300, durMin: 90,  type: 'fixed', color: '#FF9F43' },
      { id: 'b4', label: 'Personal projects',  startMin: 390, durMin: 120, type: 'free',  color: '#7367F0' },
      { id: 'b5', label: 'Outdoor activity',   startMin: 510, durMin: 60,  type: 'fixed', color: '#28C76F' },
    ],
  },
]

export function fmtHour(h: number) {
  return h === 12 ? '12 PM' : h < 12 ? `${h} AM` : `${h - 12} PM`
}

export function fmtTime(totalMin: number) {
  const abs  = DAY_START * 60 + totalMin
  const h    = Math.floor(abs / 60) % 12 || 12
  const m    = String(abs % 60).padStart(2, '0')
  const ampm = Math.floor(abs / 60) < 12 ? 'AM' : 'PM'
  return `${h}:${m} ${ampm}`
}

export function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export function nowMinutes() {
  const n = new Date()
  return (n.getHours() - DAY_START) * 60 + n.getMinutes()
}
