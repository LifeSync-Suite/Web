'use client'

import { useState, useRef } from 'react'
import { ALL_TASKS, COLUMNS, PRIORITY_COLOR, type Task, type TaskStatus } from './taskData'

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ background: `${color}18`, color, fontSize: '.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 9999, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function PriorityDot({ priority }: { priority: Task['priority'] }) {
  return <span style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_COLOR[priority], display: 'inline-block', flexShrink: 0 }} />
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function KanbanCard({ task, onDragStart, onDragEnd, isDragging }: {
  task: Task
  onDragStart: () => void
  onDragEnd: () => void
  isDragging: boolean
}) {
  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; onDragStart() }}
      onDragEnd={onDragEnd}
      style={{
        background: 'var(--mui-palette-background-paper)',
        borderRadius: 9,
        padding: '12px 13px',
        marginBottom: 8,
        boxShadow: '0 1px 6px rgba(47,43,61,.09)',
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        transition: 'opacity 150ms',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 7 }}>
        <span style={{ fontSize: '.8125rem', fontWeight: 500, color: 'var(--mui-palette-text-primary)', lineHeight: 1.4, flex: 1, marginRight: 6 }}>{task.title}</span>
        <PriorityDot priority={task.priority} />
      </div>
      {task.progress != null && (
        <div style={{ marginBottom: 7 }}>
          <div style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 9999, height: 4 }}>
            <div style={{ width: `${task.progress}%`, height: '100%', background: '#FF9F43', borderRadius: 9999 }} />
          </div>
          <div style={{ fontSize: '.65rem', color: 'var(--mui-palette-text-disabled)', marginTop: 2 }}>{task.progress}% complete</div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <Tag label={task.tag} color={task.tagColor} />
        <span style={{ fontSize: '.65rem', color: 'var(--mui-palette-text-disabled)', flexShrink: 0 }}>
          <i className='tabler-clock' style={{ fontSize: 11 }} /> {task.dur}m
        </span>
      </div>
    </div>
  )
}

// ─── Column ───────────────────────────────────────────────────────────────────

function KanbanColumn({ col, tasks, draggingId, onDragStart, onDragEnd, onDrop }: {
  col: typeof COLUMNS[number]
  tasks: Task[]
  draggingId: number | null
  onDragStart: (id: number) => void
  onDragEnd: () => void
  onDrop: (status: TaskStatus) => void
}) {
  const [isOver, setIsOver] = useState(false)
  const enterCount = useRef(0)

  return (
    <div
      style={{ width: 280, flexShrink: 0 }}
      onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }}
      onDragEnter={() => { enterCount.current++; setIsOver(true) }}
      onDragLeave={() => { if (--enterCount.current === 0) setIsOver(false) }}
      onDrop={e => { e.preventDefault(); enterCount.current = 0; setIsOver(false); onDrop(col.id as TaskStatus) }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
        <span style={{ fontWeight: 600, fontSize: '.8rem', color: 'var(--mui-palette-text-secondary)' }}>{col.label}</span>
        <span style={{ marginLeft: 'auto', background: 'var(--mui-palette-action-selected)', color: 'var(--mui-palette-text-disabled)', fontSize: '.7rem', fontWeight: 600, padding: '1px 7px', borderRadius: 9999 }}>
          {tasks.length}
        </span>
      </div>
      <div style={{
        background: isOver ? `${col.color}0e` : 'var(--mui-palette-action-hover)',
        borderRadius: 10,
        padding: '10px 8px',
        minHeight: 120,
        border: `2px solid ${isOver ? col.color + '50' : 'transparent'}`,
        transition: 'background 150ms, border 150ms',
      }}>
        {tasks.map(t => (
          <KanbanCard
            key={t.id}
            task={t}
            isDragging={draggingId === t.id}
            onDragStart={() => onDragStart(t.id)}
            onDragEnd={onDragEnd}
          />
        ))}
        {isOver && draggingId !== null && (
          <div style={{ height: 4, borderRadius: 9999, background: col.color, opacity: 0.5, marginBottom: 8 }} />
        )}
        <button style={{ width: '100%', background: 'transparent', border: '1px dashed var(--mui-palette-divider)', borderRadius: 8, padding: '7px', fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)', cursor: 'pointer', marginTop: 2 }}>
          <i className='tabler-plus' style={{ marginRight: 4 }} />Add task
        </button>
      </div>
    </div>
  )
}

// ─── Board ────────────────────────────────────────────────────────────────────

export default function KanbanView({ search }: { search: string }) {
  const [tasks, setTasks] = useState<Task[]>(ALL_TASKS)
  const [draggingId, setDraggingId] = useState<number | null>(null)

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  function handleDrop(targetStatus: TaskStatus) {
    if (draggingId === null) return
    setTasks(prev => prev.map(t => t.id === draggingId ? { ...t, status: targetStatus } : t))
    setDraggingId(null)
  }

  // flex row — parent scroll container handles overflow
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      {COLUMNS.map(col => (
        <KanbanColumn
          key={col.id}
          col={col}
          tasks={filtered.filter(t => t.status === col.id)}
          draggingId={draggingId}
          onDragStart={setDraggingId}
          onDragEnd={() => setDraggingId(null)}
          onDrop={handleDrop}
        />
      ))}
    </div>
  )
}
