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
    } as React.CSSProperties
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* View tabs */}
        <div style={{ display: 'flex', background: 'var(--mui-palette-background-paper)', borderRadius: 10, padding: 4, boxShadow: '0 1px 4px rgba(47,43,61,.1)', gap: 2 }}>
          <button style={tabStyle('kanban')} onClick={() => setView('kanban')}>
            <i className='tabler-layout-kanban' style={{ fontSize: 15 }} /> Kanban
          </button>
          <button style={tabStyle('timebox')} onClick={() => setView('timebox')}>
            <i className='tabler-timeline' style={{ fontSize: 15 }} /> Timebox
          </button>
          <button style={tabStyle('folders')} onClick={() => setView('folders')}>
            <i className='tabler-folder' style={{ fontSize: 15 }} /> Folders
          </button>
        </div>

        {/* Search (hidden in timebox — it has its own layout) */}
        {view !== 'timebox' && (
          <div style={{ flex: 1, background: 'var(--mui-palette-background-paper)', border: '1px solid var(--mui-palette-divider)', borderRadius: 8, padding: '8px 13px', display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 1px 4px rgba(47,43,61,.1)' }}>
            <i className='tabler-search' style={{ fontSize: 14, color: 'var(--mui-palette-text-disabled)' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search tasks…'
              style={{ border: 'none', background: 'transparent', fontSize: '.8125rem', color: 'var(--mui-palette-text-primary)', flex: 1, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>
        )}

        <button style={{ background: 'var(--mui-palette-primary-main)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: '.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 6px rgba(201,124,74,.3)', cursor: 'pointer', fontFamily: 'inherit', marginLeft: view === 'timebox' ? 'auto' : 0 }}>
          <i className='tabler-plus' style={{ fontSize: 15 }} /> New Task
        </button>
      </div>

      {/* Views */}
      {view === 'kanban'  && <KanbanView  search={search} />}
      {view === 'timebox' && <TimeboxView />}
      {view === 'folders' && <FoldersView search={search} />}
    </div>
  )
}
