'use client'

import { useState } from 'react'
import KanbanView from './KanbanView'
import TimeboxView from './TimeboxView'
import FoldersView from './FoldersView'

type ViewMode = 'kanban' | 'timebox' | 'folders'

export default function TasksView() {
  const [view, setView]     = useState<ViewMode>('kanban')
  const [search, setSearch] = useState('')

  function tabStyle(id: ViewMode) {
    const active = view === id
    return {
      padding: '7px 14px',
      borderRadius: 7,
      border: 'none',
      fontSize: '.8125rem',
      fontWeight: 600,
      background: active ? 'var(--mui-palette-primary-main)' : 'transparent',
      color: active ? '#fff' : 'var(--mui-palette-text-disabled)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      transition: 'all 180ms',
      fontFamily: 'inherit',
      whiteSpace: 'nowrap' as const,
    } as React.CSSProperties
  }

  return (
    // Outer: full height flex column — toolbar fixed, board scrolls
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* ── Toolbar (never scrolls) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, flexShrink: 0 }}>

        {/* Row 1: view tabs — full width, each tab takes equal share */}
        <div style={{ display: 'flex', background: 'var(--mui-palette-background-paper)', borderRadius: 10, padding: 4, boxShadow: '0 1px 4px rgba(47,43,61,.1)', gap: 2 }}>
          <button style={{ ...tabStyle('kanban'), flex: 1, justifyContent: 'center' }} onClick={() => setView('kanban')}>
            <i className='tabler-layout-kanban' style={{ fontSize: 15 }} /> Kanban
          </button>
          <button style={{ ...tabStyle('timebox'), flex: 1, justifyContent: 'center' }} onClick={() => setView('timebox')}>
            <i className='tabler-timeline' style={{ fontSize: 15 }} /> Timebox
          </button>
          <button style={{ ...tabStyle('folders'), flex: 1, justifyContent: 'center' }} onClick={() => setView('folders')}>
            <i className='tabler-folder' style={{ fontSize: 15 }} /> Folders
          </button>
        </div>

        {/* Row 2: search + New Task button */}
        {view !== 'timebox' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0, background: 'var(--mui-palette-background-paper)', border: '1px solid var(--mui-palette-divider)', borderRadius: 8, padding: '8px 13px', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 1px 4px rgba(47,43,61,.1)' }}>
              <i className='tabler-search' style={{ fontSize: 14, color: 'var(--mui-palette-text-disabled)', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search tasks…'
                style={{ border: 'none', background: 'transparent', fontSize: '.8125rem', color: 'var(--mui-palette-text-primary)', flex: 1, outline: 'none', fontFamily: 'inherit', minWidth: 0 }}
              />
            </div>
            <button style={{ flexShrink: 0, background: 'var(--mui-palette-primary-main)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: '.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 6px rgba(201,124,74,.3)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              <i className='tabler-plus' style={{ fontSize: 15 }} /> New Task
            </button>
          </div>
        )}

        {/* Row 2 (timebox): just the New Task button at the end */}
        {view === 'timebox' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{ flexShrink: 0, background: 'var(--mui-palette-primary-main)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: '.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 6px rgba(201,124,74,.3)', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              <i className='tabler-plus' style={{ fontSize: 15 }} /> New Task
            </button>
          </div>
        )}

      </div>

      {/* ── Board area (scrolls) ── */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        {view === 'kanban'  && <KanbanView  search={search} />}
        {view === 'timebox' && <TimeboxView />}
        {view === 'folders' && <FoldersView search={search} />}
      </div>
    </div>
  )
}
