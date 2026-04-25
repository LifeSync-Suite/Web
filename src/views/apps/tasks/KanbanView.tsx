'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
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

// ─── Drag state shared via ref ────────────────────────────────────────────────

interface DragState {
  taskId: number
  ghost: HTMLDivElement
  offsetX: number
  offsetY: number
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function KanbanCard({ task, isDragging, onPointerDown }: {
  task: Task
  isDragging: boolean
  onPointerDown: (e: React.PointerEvent, taskId: number) => void
}) {
  return (
    <div
      onPointerDown={e => onPointerDown(e, task.id)}
      style={{
        background: 'var(--mui-palette-background-paper)',
        borderRadius: 9,
        padding: '12px 13px',
        marginBottom: 8,
        boxShadow: '0 1px 6px rgba(47,43,61,.09)',
        cursor: 'grab',
        opacity: isDragging ? 0.35 : 1,
        transition: 'opacity 150ms',
        userSelect: 'none',
        touchAction: 'none', // prevents scroll hijack during drag
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

function KanbanColumn({ col, tasks, draggingId, isOver, onPointerDown }: {
  col: typeof COLUMNS[number]
  tasks: Task[]
  draggingId: number | null
  isOver: boolean
  onPointerDown: (e: React.PointerEvent, taskId: number) => void
}) {
  return (
    // data-col-id lets us find the column via elementFromPoint during pointer drag
    <div style={{ width: 280, flexShrink: 0 }} data-col-id={col.id}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
        <span style={{ fontWeight: 600, fontSize: '.8rem', color: 'var(--mui-palette-text-secondary)' }}>{col.label}</span>
        <span style={{ marginLeft: 'auto', background: 'var(--mui-palette-action-selected)', color: 'var(--mui-palette-text-disabled)', fontSize: '.7rem', fontWeight: 600, padding: '1px 7px', borderRadius: 9999 }}>
          {tasks.length}
        </span>
      </div>
      <div
        data-col-id={col.id}
        style={{
          background: isOver ? `${col.color}14` : 'var(--mui-palette-action-hover)',
          borderRadius: 10,
          padding: '10px 8px',
          minHeight: 120,
          border: `2px solid ${isOver ? col.color + '60' : 'transparent'}`,
          transition: 'background 150ms, border 150ms',
        }}
      >
        {tasks.map(t => (
          <KanbanCard
            key={t.id}
            task={t}
            isDragging={draggingId === t.id}
            onPointerDown={onPointerDown}
          />
        ))}
        {isOver && draggingId !== null && (
          <div style={{ height: 4, borderRadius: 9999, background: col.color, opacity: 0.6, marginBottom: 8 }} />
        )}
        <button style={{ width: '100%', background: 'transparent', border: '1px dashed var(--mui-palette-divider)', borderRadius: 8, padding: '7px', fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)', cursor: 'pointer', marginTop: 2 }}>
          <i className='tabler-plus' style={{ marginRight: 4 }} />Add task
        </button>
      </div>
    </div>
  )
}

// ─── Board ────────────────────────────────────────────────────────────────────

const EDGE_SIZE = 80   // px from edge to trigger scroll
const MAX_SPEED = 18   // max px per frame

function getScrollSpeed(pos: number, start: number, end: number): number {
  if (pos < start + EDGE_SIZE) {
    // left/top edge — scroll negative
    return -MAX_SPEED * (1 - (pos - start) / EDGE_SIZE)
  }
  if (pos > end - EDGE_SIZE) {
    // right/bottom edge — scroll positive
    return MAX_SPEED * (1 - (end - pos) / EDGE_SIZE)
  }
  return 0
}

export default function KanbanView({ search }: { search: string }) {
  const [tasks, setTasks]        = useState<Task[]>(ALL_TASKS)
  const [draggingId, setDragging] = useState<number | null>(null)
  const [overColId, setOverCol]   = useState<string | null>(null)
  const dragRef     = useRef<DragState | null>(null)
  const scrollElRef = useRef<Element | null>(null)  // nearest scrollable ancestor
  const rafRef      = useRef<number | null>(null)
  const pointerPos  = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  // Cancel auto-scroll rAF loop
  function stopAutoScroll() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  // Walk up the DOM to find the nearest element that can scroll horizontally
  function findScrollParent(el: HTMLElement): Element | null {
    let node: HTMLElement | null = el.parentElement
    while (node) {
      const style = window.getComputedStyle(node)
      const overflow = style.overflow + style.overflowX
      if (/auto|scroll/.test(overflow) && node.scrollWidth > node.clientWidth) return node
      node = node.parentElement
    }
    return document.documentElement
  }

  // Start rAF loop that scrolls the nearest overflow container while dragging near edges
  function startAutoScroll() {
    stopAutoScroll()
    function tick() {
      const el = scrollElRef.current as HTMLElement | null
      if (!el || !dragRef.current) return
      const rect = el.getBoundingClientRect()
      const { x } = pointerPos.current
      const dx = getScrollSpeed(x, rect.left, rect.right)
      if (dx !== 0) el.scrollLeft += dx
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  // Find the column id from a point on screen
  function colAtPoint(x: number, y: number): string | null {
    // Temporarily hide ghost so elementFromPoint hits the real DOM
    const ghost = dragRef.current?.ghost
    if (ghost) ghost.style.display = 'none'
    const el = document.elementFromPoint(x, y)
    if (ghost) ghost.style.display = ''
    if (!el) return null
    const col = (el as HTMLElement).closest('[data-col-id]')
    return col ? (col as HTMLElement).dataset.colId ?? null : null
  }

  const onPointerDown = useCallback((e: React.PointerEvent, taskId: number) => {
    // Only primary button or touch
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)

    // Build a ghost clone
    const source = e.currentTarget as HTMLElement
    scrollElRef.current = findScrollParent(source)
    const rect   = source.getBoundingClientRect()
    const ghost  = source.cloneNode(true) as HTMLDivElement
    ghost.style.cssText = `
      position: fixed;
      left: ${rect.left}px;
      top: ${rect.top}px;
      width: ${rect.width}px;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.85;
      border-radius: 9px;
      box-shadow: 0 8px 32px rgba(0,0,0,.22);
      transform: rotate(2deg) scale(1.03);
      transition: none;
    `
    document.body.appendChild(ghost)

    dragRef.current = {
      taskId,
      ghost,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    pointerPos.current = { x: e.clientX, y: e.clientY }
    setDragging(taskId)
    setOverCol(null)
    startAutoScroll()
  }, [])

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      const d = dragRef.current
      if (!d) return
      pointerPos.current = { x: e.clientX, y: e.clientY }
      d.ghost.style.left = `${e.clientX - d.offsetX}px`
      d.ghost.style.top  = `${e.clientY - d.offsetY}px`
      const col = colAtPoint(e.clientX, e.clientY)
      setOverCol(col)
    }

    function onPointerUp(e: PointerEvent) {
      const d = dragRef.current
      if (!d) return
      stopAutoScroll()
      const col = colAtPoint(e.clientX, e.clientY)
      if (col) {
        setTasks(prev => prev.map(t => t.id === d.taskId ? { ...t, status: col as TaskStatus } : t))
      }
      d.ghost.remove()
      dragRef.current = null
      setDragging(null)
      setOverCol(null)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      stopAutoScroll()
    }
  }, [])

  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      {COLUMNS.map(col => (
        <KanbanColumn
          key={col.id}
          col={col}
          tasks={filtered.filter(t => t.status === col.id)}
          draggingId={draggingId}
          isOver={overColId === col.id}
          onPointerDown={onPointerDown}
        />
      ))}
    </div>
  )
}
