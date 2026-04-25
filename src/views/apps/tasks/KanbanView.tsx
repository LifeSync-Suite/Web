'use client'

import { ALL_TASKS, COLUMNS, PRIORITY_COLOR, type Task } from './taskData'

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

function KanbanCard({ task }: { task: Task }) {
  return (
    <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 9, padding: '12px 13px', marginBottom: 8, boxShadow: '0 1px 6px rgba(47,43,61,.09)', cursor: 'grab' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 7 }}>
        <span style={{ fontSize: '.8125rem', fontWeight: 500, color: 'var(--mui-palette-text-primary)', lineHeight: 1.4, flex: 1 }}>{task.title}</span>
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
        <span style={{ fontSize: '.65rem', color: 'var(--mui-palette-text-disabled)' }}>
          <i className='tabler-clock' style={{ fontSize: 11 }} /> {task.dur}m
        </span>
      </div>
    </div>
  )
}

export default function KanbanView({ search }: { search: string }) {
  const filtered = ALL_TASKS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
      {COLUMNS.map(col => {
        const colTasks = filtered.filter(t => t.status === col.id)
        return (
          <div key={col.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: col.color, flexShrink: 0 }} />
              <span style={{ fontWeight: 600, fontSize: '.8rem', color: 'var(--mui-palette-text-secondary)' }}>{col.label}</span>
              <span style={{ marginLeft: 'auto', background: 'var(--mui-palette-action-selected)', color: 'var(--mui-palette-text-disabled)', fontSize: '.7rem', fontWeight: 600, padding: '1px 7px', borderRadius: 9999 }}>{colTasks.length}</span>
            </div>
            <div style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 10, padding: '10px 8px', minHeight: 120 }}>
              {colTasks.map(t => <KanbanCard key={t.id} task={t} />)}
              <button style={{ width: '100%', background: 'transparent', border: '1px dashed var(--mui-palette-divider)', borderRadius: 8, padding: '7px', fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)', cursor: 'pointer', marginTop: 2 }}>
                <i className='tabler-plus' style={{ marginRight: 4 }} />Add task
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
