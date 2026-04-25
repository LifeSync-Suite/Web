'use client'

import { useState } from 'react'
import { ALL_TASKS, FOLDERS, STATUS_META, PRIORITY_COLOR, type Task } from './taskData'

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{ background: `${color}18`, color, fontSize: '.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 9999, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

export default function FoldersView({ search }: { search: string }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Work: true, 'Book Project': true, Design: true, 'Personal Growth': true,
  })

  const filtered = ALL_TASKS.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {FOLDERS.map(folder => {
        const folderTasks = filtered.filter(t => t.folder === folder.id)
        if (!folderTasks.length) return null
        const done = folderTasks.filter(t => t.status === 'done').length
        const pct  = Math.round((done / folderTasks.length) * 100)
        const isOpen = expanded[folder.id]

        return (
          <div key={folder.id} style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 14, boxShadow: '0 3px 12px rgba(47,43,61,.14)', overflow: 'hidden' }}>
            <div
              onClick={() => setExpanded(e => ({ ...e, [folder.id]: !e[folder.id] }))}
              style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: isOpen ? '1px solid var(--mui-palette-divider)' : 'none', transition: 'background 150ms' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 9, background: `${folder.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={folder.icon} style={{ fontSize: 17, color: folder.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--mui-palette-text-primary)' }}>{folder.id}</span>
                  <span style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)' }}>{done}/{folderTasks.length} tasks</span>
                  <span style={{ fontSize: '.7rem', fontWeight: 700, color: folder.color, marginLeft: 'auto' }}>{pct}%</span>
                </div>
                <div style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 9999, height: 5 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: folder.color, borderRadius: 9999, transition: 'width 600ms cubic-bezier(.22,1,.36,1)' }} />
                </div>
              </div>
              <i className={`tabler-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: 16, color: 'var(--mui-palette-text-disabled)', flexShrink: 0 }} />
            </div>

            {isOpen && (
              <div>
                <div style={{ padding: '8px 20px', display: 'grid', gridTemplateColumns: '1fr 100px 130px 90px 60px', gap: 12, borderBottom: '1px solid var(--mui-palette-divider)' }}>
                  {['Task', 'Tag', 'Status', 'Priority', 'Time'].map(h => (
                    <div key={h} style={{ fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: 'var(--mui-palette-text-disabled)' }}>{h}</div>
                  ))}
                </div>
                {folderTasks.map((t, i) => {
                  const sm = STATUS_META[t.status]
                  return (
                    <div key={t.id}
                      style={{ padding: '11px 20px', display: 'grid', gridTemplateColumns: '1fr 100px 130px 90px 60px', gap: 12, alignItems: 'center', borderBottom: i < folderTasks.length - 1 ? '1px solid var(--mui-palette-divider)' : 'none', transition: 'background 150ms', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--mui-palette-action-hover)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${t.status === 'done' ? '#28C76F' : 'var(--mui-palette-divider)'}`, background: t.status === 'done' ? '#28C76F' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {t.status === 'done' && <i className='tabler-check' style={{ fontSize: 10, color: '#fff' }} />}
                        </div>
                        <span style={{ fontSize: '.8125rem', color: t.status === 'done' ? 'var(--mui-palette-text-disabled)' : 'var(--mui-palette-text-primary)', fontWeight: 500, textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>{t.title}</span>
                      </div>
                      <div><Tag label={t.tag} color={t.tagColor} /></div>
                      <div>
                        <span style={{ background: `${sm.color}15`, color: sm.color, fontSize: '.65rem', fontWeight: 700, padding: '3px 9px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: sm.color, display: 'inline-block' }} />{sm.label}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_COLOR[t.priority], display: 'inline-block' }} />
                        <span style={{ fontSize: '.75rem', color: PRIORITY_COLOR[t.priority], fontWeight: 600, textTransform: 'capitalize' }}>{t.priority}</span>
                      </div>
                      <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>{t.dur}m</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
