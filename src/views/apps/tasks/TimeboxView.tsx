'use client'

import { useState, useEffect, useRef } from 'react'
import { useBreakpoint, isMobile, isTablet } from '@/hooks/useBreakpoint'
import type { Task, DayTemplate, TemplateBlock, TimeboxEntry } from './taskData'
import {
  ALL_TASKS, PRIORITY_COLOR, BLOCK_COLORS, DEFAULT_TEMPLATES,
  DAY_START, DAY_END, TOTAL_MINS, HOUR_PX, DAYS_SHORT, DAYS_LABEL, TODAY_KEY,
  fmtHour, fmtTime, uid, nowMinutes,
} from './taskData'

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

// ─── Template editor modal ────────────────────────────────────────────────────

function TemplateEditorModal({ template, onSave, onClose, mobile }: {
  template: DayTemplate | null
  onSave: (tpl: DayTemplate) => void
  onClose: () => void
  mobile: boolean
}) {
  const [name,     setName]     = useState(template?.name  ?? '')
  const [color,    setColor]    = useState(template?.color ?? '#C97C4A')
  const [schedule, setSchedule] = useState<Record<string, boolean>>(
    template?.schedule ?? { mon: true, tue: true, wed: true, thu: true, fri: true, sat: false, sun: false }
  )
  const [blocks,  setBlocks]  = useState<TemplateBlock[]>(template?.blocks ?? [])
  const [editing, setEditing] = useState<string | null>(null)

  const sorted = [...blocks].sort((a, b) => a.startMin - b.startMin)

  function addBlock() {
    const nb: TemplateBlock = { id: uid(), label: 'New block', startMin: 480, durMin: 60, type: 'free', color: '#7367F0' }
    setBlocks(b => [...b, nb])
    setEditing(nb.id)
  }
  function updateBlock(id: string, key: keyof TemplateBlock, val: unknown) {
    setBlocks(b => b.map(bl => bl.id === id ? { ...bl, [key]: val } : bl))
  }
  function removeBlock(id: string) {
    setBlocks(b => b.filter(bl => bl.id !== id))
    if (editing === id) setEditing(null)
  }

  // On mobile: full-screen bottom sheet. On desktop: centered modal with preview pane.
  const modalStyle: React.CSSProperties = mobile
    ? { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', background: 'var(--mui-palette-background-paper)' }
    : { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }

  const innerStyle: React.CSSProperties = mobile
    ? { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }
    : { background: 'var(--mui-palette-background-paper)', borderRadius: 16, boxShadow: '0 24px 80px rgba(0,0,0,.25)', width: '100%', maxWidth: 820, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }

  return (
    <div style={modalStyle} onClick={e => { if (!mobile && e.target === e.currentTarget) onClose() }}>
      <div style={innerStyle}>
        {/* Header */}
        <div style={{ padding: mobile ? '16px 16px 12px' : '20px 24px', borderBottom: '1px solid var(--mui-palette-divider)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <input value={name} onChange={e => setName(e.target.value)} placeholder='Template name…'
            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '1rem', fontWeight: 700, color: 'var(--mui-palette-text-primary)', outline: 'none', fontFamily: 'inherit' }} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mui-palette-text-disabled)', fontSize: 22, lineHeight: 1, padding: '0 4px' }}>×</button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Form — always visible */}
          <div style={{ flex: 1, padding: mobile ? '14px 16px' : '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20, borderRight: mobile ? 'none' : '1px solid var(--mui-palette-divider)' }}>

            {/* Color */}
            <div>
              <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--mui-palette-text-disabled)', marginBottom: 8 }}>Template Color</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {BLOCK_COLORS.map(c => (
                  <div key={c} onClick={() => setColor(c)} style={{ width: 26, height: 26, borderRadius: '50%', background: c, cursor: 'pointer', border: `3px solid ${color === c ? 'var(--mui-palette-text-primary)' : 'transparent'}`, transition: 'border 150ms' }} />
                ))}
              </div>
            </div>

            {/* Schedule */}
            <div>
              <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--mui-palette-text-disabled)', marginBottom: 8 }}>Auto-apply on</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {DAYS_SHORT.map(d => (
                  <button key={d} onClick={() => setSchedule(s => ({ ...s, [d]: !s[d] }))}
                    style={{ padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${schedule[d] ? color : 'var(--mui-palette-divider)'}`, background: schedule[d] ? `${color}18` : 'transparent', color: schedule[d] ? color : 'var(--mui-palette-text-disabled)', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms' }}>
                    {DAYS_LABEL[d]}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)', marginTop: 7 }}>
                {Object.values(schedule).some(Boolean)
                  ? `Auto-applies on ${DAYS_SHORT.filter(d => schedule[d]).map(d => DAYS_LABEL[d]).join(', ')}`
                  : 'No auto-apply — apply manually'}
              </div>
            </div>

            {/* Blocks */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--mui-palette-text-disabled)' }}>Time Blocks · {blocks.length}</div>
                <button onClick={addBlock} style={{ background: 'var(--mui-palette-primary-main)', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 14px', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'inherit' }}>
                  <i className='tabler-plus' style={{ fontSize: 13 }} /> Add block
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sorted.map(bl => (
                  <div key={bl.id} style={{ background: 'var(--mui-palette-action-hover)', borderRadius: 10, overflow: 'hidden', border: `1.5px solid ${editing === bl.id ? bl.color : 'transparent'}`, transition: 'border 150ms' }}>
                    <div onClick={() => setEditing(editing === bl.id ? null : bl.id)} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: bl.color, flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: '.8125rem', fontWeight: 600, color: 'var(--mui-palette-text-primary)' }}>{bl.label}</span>
                      <span style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)' }}>{fmtTime(bl.startMin)} · {bl.durMin}m</span>
                      <span style={{ fontSize: '.65rem', fontWeight: 700, background: `${bl.color}18`, color: bl.color, padding: '2px 7px', borderRadius: 9999 }}>{bl.type === 'free' ? 'Free' : 'Fixed'}</span>
                      <button onClick={e => { e.stopPropagation(); removeBlock(bl.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mui-palette-text-disabled)', fontSize: 16, lineHeight: 1, padding: '0 2px' }}>×</button>
                    </div>
                    {editing === bl.id && (
                      <div style={{ padding: '0 12px 14px', display: 'flex', flexDirection: 'column', gap: 10, borderTop: '1px solid var(--mui-palette-divider)' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                          <div>
                            <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--mui-palette-text-disabled)', marginBottom: 4 }}>Label</div>
                            <input value={bl.label} onChange={e => updateBlock(bl.id, 'label', e.target.value)}
                              style={{ width: '100%', border: '1px solid var(--mui-palette-divider)', borderRadius: 7, padding: '8px 10px', fontSize: '.875rem', background: 'var(--mui-palette-background-paper)', color: 'var(--mui-palette-text-primary)', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                          </div>
                          <div>
                            <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--mui-palette-text-disabled)', marginBottom: 4 }}>Type</div>
                            <div style={{ display: 'flex', gap: 6 }}>
                              {(['fixed', 'free'] as const).map(t => (
                                <button key={t} onClick={() => updateBlock(bl.id, 'type', t)} style={{ flex: 1, padding: '8px', borderRadius: 7, border: `1.5px solid ${bl.type === t ? bl.color : 'var(--mui-palette-divider)'}`, background: bl.type === t ? `${bl.color}18` : 'transparent', color: bl.type === t ? bl.color : 'var(--mui-palette-text-disabled)', fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>{t}</button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div>
                            <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--mui-palette-text-disabled)', marginBottom: 4 }}>Start time</div>
                            <input type='range' min={0} max={TOTAL_MINS - 15} step={15} value={bl.startMin} onChange={e => updateBlock(bl.id, 'startMin', +e.target.value)} style={{ width: '100%' }} />
                            <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', marginTop: 2 }}>{fmtTime(bl.startMin)}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--mui-palette-text-disabled)', marginBottom: 4 }}>Duration</div>
                            <input type='range' min={15} max={240} step={15} value={bl.durMin} onChange={e => updateBlock(bl.id, 'durMin', +e.target.value)} style={{ width: '100%' }} />
                            <div style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', marginTop: 2 }}>{bl.durMin}m ({Math.floor(bl.durMin / 60)}h{bl.durMin % 60 ? ` ${bl.durMin % 60}m` : ''})</div>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '.7rem', fontWeight: 600, color: 'var(--mui-palette-text-disabled)', marginBottom: 6 }}>Block color</div>
                          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                            {BLOCK_COLORS.map(c => (
                              <div key={c} onClick={() => updateBlock(bl.id, 'color', c)} style={{ width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer', border: `2px solid ${bl.color === c ? 'var(--mui-palette-text-primary)' : 'transparent'}` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {blocks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--mui-palette-text-disabled)', fontSize: '.8125rem' }}>
                    No blocks yet — add one above
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview pane — desktop only */}
          {!mobile && (
            <div style={{ width: 320, flexShrink: 0, overflowY: 'auto', padding: '20px', background: 'var(--mui-palette-action-hover)' }}>
              <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--mui-palette-text-disabled)', marginBottom: 12 }}>Preview</div>
              <div style={{ position: 'relative', paddingLeft: 44 }}>
                {Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => i + DAY_START).map(h => (
                  <div key={h} style={{ position: 'absolute', left: 0, top: (h - DAY_START) * HOUR_PX * 0.6, fontSize: '.55rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmtHour(h)}</div>
                ))}
                <div style={{ position: 'relative', height: (DAY_END - DAY_START) * HOUR_PX * 0.6 }}>
                  {Array.from({ length: DAY_END - DAY_START }, (_, i) => (
                    <div key={i} style={{ position: 'absolute', top: i * HOUR_PX * 0.6, left: 0, right: 0, height: 1, background: 'var(--mui-palette-divider)' }} />
                  ))}
                  {sorted.map(bl => (
                    <div key={bl.id} style={{
                      position: 'absolute', top: (bl.startMin / 60) * HOUR_PX * 0.6,
                      height: Math.max((bl.durMin / 60) * HOUR_PX * 0.6 - 1, 10),
                      left: 0, right: 0,
                      background: `${bl.color}${bl.type === 'free' ? '12' : '22'}`,
                      borderLeft: `3px solid ${bl.color}`,
                      borderRadius: 4, display: 'flex', alignItems: 'flex-start', padding: '2px 5px', overflow: 'hidden',
                      opacity: editing === bl.id ? 1 : 0.85,
                      border: editing === bl.id ? `1.5px solid ${bl.color}` : `1px solid ${bl.color}30`,
                    }}>
                      <span style={{ fontSize: '.55rem', fontWeight: 700, color: 'var(--mui-palette-text-primary)', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bl.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: mobile ? '12px 16px' : '16px 24px', borderTop: '1px solid var(--mui-palette-divider)', display: 'flex', gap: 10, justifyContent: 'flex-end', flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: mobile ? 1 : undefined, background: 'none', border: '1.5px solid var(--mui-palette-divider)', borderRadius: 9, padding: '11px 20px', fontSize: '.875rem', fontWeight: 600, color: 'var(--mui-palette-text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          <button onClick={() => onSave({ id: template?.id ?? uid(), name, color, schedule, blocks })}
            style={{ flex: mobile ? 1 : undefined, background: 'var(--mui-palette-primary-main)', color: '#fff', border: 'none', borderRadius: 9, padding: '11px 24px', fontSize: '.875rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(201,124,74,.3)' }}>
            Save template
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Templates panel ──────────────────────────────────────────────────────────
// On mobile: fixed bottom sheet with backdrop. On desktop: inline grid column.

function TemplatesPanel({ templates, activeTemplateId, onApply, onEdit, onAdd, onDelete, onClose, mobile }: {
  templates: DayTemplate[]
  activeTemplateId: string | null
  onApply: (id: string | null) => void
  onEdit: (t: DayTemplate) => void
  onAdd: () => void
  onDelete: (id: string) => void
  onClose: () => void
  mobile: boolean
}) {
  const inner = (
    <div style={{
      background: 'var(--mui-palette-background-paper)',
      borderRadius: mobile ? '16px 16px 0 0' : 14,
      boxShadow: mobile ? '0 -4px 32px rgba(0,0,0,.18)' : '0 3px 12px rgba(47,43,61,.14)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      border: mobile ? 'none' : '1px solid var(--mui-palette-divider)',
      width: mobile ? '100%' : 300,
      maxHeight: mobile ? '80vh' : undefined,
    }}>
      {/* Drag handle on mobile */}
      {mobile && <div style={{ width: 36, height: 4, borderRadius: 9999, background: 'var(--mui-palette-divider)', margin: '10px auto 4px' }} />}

      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--mui-palette-divider)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className='tabler-template' style={{ fontSize: 18, color: 'var(--mui-palette-primary-main)' }} />
        <span style={{ fontWeight: 700, fontSize: '.9375rem', color: 'var(--mui-palette-text-primary)', flex: 1 }}>Day Templates</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mui-palette-text-disabled)', fontSize: 20, lineHeight: 1, padding: '0 4px' }}>×</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {templates.map(t => {
          const isActive = t.id === activeTemplateId
          const isAutoToday = t.schedule[TODAY_KEY]
          return (
            <div key={t.id} style={{ marginBottom: 10 }}>
              <div style={{ background: isActive ? `${t.color}10` : 'var(--mui-palette-action-hover)', borderRadius: 12, border: `1.5px solid ${isActive ? t.color : 'var(--mui-palette-divider)'}`, overflow: 'hidden', transition: 'all 200ms' }}>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 700, fontSize: '.875rem', color: 'var(--mui-palette-text-primary)', flex: 1 }}>{t.name}</span>
                    {isAutoToday && (
                      <span style={{ fontSize: '.6rem', fontWeight: 700, background: `${t.color}20`, color: t.color, padding: '2px 7px', borderRadius: 9999 }}>Today</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
                    {DAYS_SHORT.map(d => (
                      <span key={d} style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5, background: t.schedule[d] ? `${t.color}18` : 'var(--mui-palette-divider)', color: t.schedule[d] ? t.color : 'var(--mui-palette-text-disabled)' }}>{DAYS_LABEL[d]}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)', marginBottom: 10 }}>
                    {t.blocks.filter(b => b.type === 'fixed').length} fixed · {t.blocks.filter(b => b.type === 'free').length} free blocks
                  </div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                    {[...t.blocks].sort((a, b) => a.startMin - b.startMin).map(bl => (
                      <div key={bl.id} title={bl.label} style={{ height: 6, borderRadius: 3, background: bl.color, flex: bl.durMin, opacity: bl.type === 'free' ? 0.4 : 0.85 }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => onApply(isActive ? null : t.id)} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, background: isActive ? t.color : `${t.color}18`, color: isActive ? '#fff' : t.color, border: `1.5px solid ${t.color}`, fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 180ms' }}>
                      {isActive ? '✓ Applied' : 'Apply today'}
                    </button>
                    <button onClick={() => onEdit(t)} style={{ background: 'var(--mui-palette-action-hover)', border: '1px solid var(--mui-palette-divider)', borderRadius: 8, padding: '8px 12px', fontSize: '.75rem', color: 'var(--mui-palette-text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <i className='tabler-edit' style={{ fontSize: 14 }} />
                    </button>
                    <button onClick={() => onDelete(t.id)} style={{ background: 'rgba(255,76,81,.08)', border: '1px solid rgba(255,76,81,.2)', borderRadius: 8, padding: '8px 12px', fontSize: '.75rem', color: '#FF4C51', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <i className='tabler-trash' style={{ fontSize: 14 }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ padding: '12px', borderTop: '1px solid var(--mui-palette-divider)' }}>
        <button onClick={onAdd} style={{ width: '100%', background: 'var(--mui-palette-primary-main)', color: '#fff', border: 'none', borderRadius: 9, padding: '12px', fontSize: '.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(201,124,74,.25)' }}>
          <i className='tabler-plus' style={{ fontSize: 15 }} /> New template
        </button>
      </div>
    </div>
  )

  if (mobile) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {/* Backdrop */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.4)' }} onClick={onClose} />
        <div style={{ position: 'relative', zIndex: 1 }}>{inner}</div>
      </div>
    )
  }

  return inner
}

// ─── Main Timebox view ────────────────────────────────────────────────────────

export default function TimeboxView() {
  const [scheduled, setScheduled] = useState<TimeboxEntry[]>([
    { taskId: 4, startMin: 60,  durMin: 90 },
    { taskId: 8, startMin: 0,   durMin: 30 },
    { taskId: 5, startMin: 180, durMin: 60 },
  ])
  const [templates,        setTemplates]        = useState<DayTemplate[]>(DEFAULT_TEMPLATES)
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(() => {
    const auto = DEFAULT_TEMPLATES.find(t => t.schedule[TODAY_KEY])
    return auto?.id ?? null
  })
  const [showPanel,  setShowPanel]  = useState(false)
  const [editingTpl, setEditingTpl] = useState<DayTemplate | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [dragging,   setDragging]   = useState<{ taskId: number; durMin: number } | null>(null)
  const [dragOver,   setDragOver]   = useState<number | null>(null)
  const [now,        setNow]        = useState(nowMinutes())
  const timelineRef = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const bp          = useBreakpoint()
  const mobile      = isMobile(bp)
  const tablet      = isTablet(bp)
  const compact     = mobile || tablet   // single-column layout

  useEffect(() => {
    const t = setInterval(() => setNow(nowMinutes()), 30000)
    return () => clearInterval(t)
  }, [])

  const activeTemplate = templates.find(t => t.id === activeTemplateId) ?? null
  const scheduledIds   = new Set(scheduled.map(s => s.taskId))
  const unscheduled    = ALL_TASKS.filter(t => t.status !== 'done' && !scheduledIds.has(t.id))
  const totalPlanned   = scheduled.reduce((a, s) => a + s.durMin, 0)

  function snapToSlot(y: number) {
    if (!timelineRef.current) return 0
    const rect      = timelineRef.current.getBoundingClientRect()
    const scrollTop = scrollRef.current?.scrollTop ?? 0
    const relY      = Math.max(0, y - rect.top + scrollTop - 8)
    const mins      = Math.round((relY / HOUR_PX) * 60 / 15) * 15
    return Math.min(Math.max(0, mins), TOTAL_MINS - 15)
  }

  function onTimelineDrop(e: React.DragEvent) {
    e.preventDefault()
    if (!dragging || !timelineRef.current) return
    const snapMin = snapToSlot(e.clientY)
    setScheduled(prev => [...prev.filter(s => s.taskId !== dragging.taskId), { taskId: dragging.taskId, startMin: snapMin, durMin: dragging.durMin }])
    setDragging(null); setDragOver(null)
  }

  function removeScheduled(taskId: number) { setScheduled(p => p.filter(s => s.taskId !== taskId)) }

  function saveTemplate(tpl: DayTemplate) {
    setTemplates(prev => {
      const idx = prev.findIndex(t => t.id === tpl.id)
      return idx >= 0 ? prev.map(t => t.id === tpl.id ? tpl : t) : [...prev, tpl]
    })
    setShowEditor(false); setEditingTpl(null)
  }

  function deleteTemplate(id: string) {
    setTemplates(p => p.filter(t => t.id !== id))
    if (activeTemplateId === id) setActiveTemplateId(null)
  }

  // Grid columns: compact = 1 col, desktop = sidebar + timeline [+ panel]
  const gridCols = compact
    ? '1fr'
    : showPanel ? '240px 1fr 300px' : '240px 1fr'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%', minWidth: 0 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, minWidth: 0 }}>
        {activeTemplate ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: `${activeTemplate.color}12`, border: `1px solid ${activeTemplate.color}30`, borderRadius: 8, padding: '6px 12px', minWidth: 0, overflow: 'hidden' }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: activeTemplate.color, flexShrink: 0 }} />
            <span style={{ fontSize: '.8rem', fontWeight: 600, color: activeTemplate.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{activeTemplate.name}</span>
            <span style={{ fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', flexShrink: 0 }}>active</span>
          </div>
        ) : (
          <div style={{ fontSize: '.8rem', color: 'var(--mui-palette-text-disabled)', fontStyle: 'italic' }}>No template applied</div>
        )}
        <button onClick={() => setShowPanel(p => !p)}
          style={{ marginLeft: 'auto', flexShrink: 0, background: showPanel ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-background-paper)', color: showPanel ? '#fff' : 'var(--mui-palette-text-secondary)', border: `1.5px solid ${showPanel ? 'var(--mui-palette-primary-main)' : 'var(--mui-palette-divider)'}`, borderRadius: 9, padding: '8px 16px', fontSize: '.8125rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit', boxShadow: '0 1px 4px rgba(47,43,61,.1)', transition: 'all 180ms', whiteSpace: 'nowrap' }}>
          <i className='tabler-template' style={{ fontSize: 15 }} /> Templates
          <span style={{ background: 'var(--mui-palette-action-selected)', color: 'var(--mui-palette-text-disabled)', fontSize: '.6rem', fontWeight: 700, padding: '1px 6px', borderRadius: 9999 }}>{templates.length}</span>
        </button>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 14, alignItems: 'start', minWidth: 0 }}>

        {/* Unscheduled tasks — horizontal scroll on compact */}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.6px', color: 'var(--mui-palette-text-disabled)', marginBottom: 10 }}>
            Unscheduled · {unscheduled.length}
          </div>
          <div style={{ display: 'flex', flexDirection: compact ? 'row' : 'column', gap: 7, overflowX: compact ? 'auto' : 'visible', paddingBottom: compact ? 4 : 0 }}>
            {unscheduled.map(t => (
              <div key={t.id} draggable
                onDragStart={() => setDragging({ taskId: t.id, durMin: t.dur })}
                onDragEnd={() => { setDragging(null); setDragOver(null) }}
                style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 9, padding: '10px 12px', boxShadow: '0 1px 6px rgba(47,43,61,.08)', cursor: 'grab', border: `1.5px solid ${dragging?.taskId === t.id ? 'var(--mui-palette-primary-main)' : 'transparent'}`, opacity: dragging?.taskId === t.id ? 0.5 : 1, transition: 'all 150ms', flexShrink: compact ? 0 : undefined, minWidth: compact ? 180 : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: '.8125rem', fontWeight: 600, color: 'var(--mui-palette-text-primary)', flex: 1, lineHeight: 1.3 }}>{t.title}</span>
                  <PriorityDot priority={t.priority} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Tag label={t.tag} color={t.tagColor} />
                  <span style={{ fontSize: '.65rem', color: 'var(--mui-palette-text-disabled)', marginLeft: 'auto' }}>
                    <i className='tabler-clock' style={{ fontSize: 11 }} /> {t.dur}m
                  </span>
                </div>
              </div>
            ))}
            {unscheduled.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--mui-palette-text-disabled)', fontSize: '.8125rem' }}>
                <i className='tabler-checks' style={{ fontSize: 28, display: 'block', marginBottom: 6, color: '#28C76F' }} />All scheduled!
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ background: 'var(--mui-palette-background-paper)', borderRadius: 14, boxShadow: '0 3px 12px rgba(47,43,61,.14)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '80vh', minWidth: 0 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--mui-palette-divider)', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <i className='tabler-calendar-time' style={{ color: 'var(--mui-palette-primary-main)', fontSize: 18 }} />
            <span style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--mui-palette-text-primary)' }}>Today&apos;s Timeline</span>
            <span style={{ marginLeft: 'auto', fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)', whiteSpace: 'nowrap' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div ref={scrollRef} style={{ display: 'flex', padding: '0 0 16px', overflowY: 'auto', flex: 1 }}>
            {/* Hour labels */}
            <div style={{ width: 52, flexShrink: 0, paddingTop: 8 }}>
              {Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => i + DAY_START).map(h => (
                <div key={h} style={{ height: HOUR_PX, display: 'flex', alignItems: 'flex-start', paddingTop: 2, paddingLeft: 10 }}>
                  <span style={{ fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', fontWeight: 600, whiteSpace: 'nowrap' }}>{fmtHour(h)}</span>
                </div>
              ))}
            </div>

            {/* Drop zone */}
            <div style={{ flex: 1, position: 'relative', paddingTop: 8, paddingRight: 16, minHeight: (DAY_END - DAY_START) * HOUR_PX }}
              ref={timelineRef}
              onDragOver={e => { e.preventDefault(); setDragOver(snapToSlot(e.clientY)) }}
              onDragLeave={() => setDragOver(null)}
              onDrop={onTimelineDrop}>

              {Array.from({ length: DAY_END - DAY_START }, (_, i) => (
                <div key={i} style={{ position: 'absolute', top: 8 + i * HOUR_PX, left: 0, right: 16, height: 1, background: 'var(--mui-palette-divider)' }} />
              ))}
              {Array.from({ length: (DAY_END - DAY_START) * 2 }, (_, i) => (
                <div key={i} style={{ position: 'absolute', top: 8 + i * HOUR_PX / 2, left: 0, right: 16, height: 1, background: 'var(--mui-palette-divider)', opacity: i % 2 === 0 ? 0 : 0.35 }} />
              ))}

              {activeTemplate && [...activeTemplate.blocks].sort((a, b) => a.startMin - b.startMin).map(bl => (
                <div key={bl.id} title={`${bl.label} (${bl.type})`} style={{ position: 'absolute', left: 0, right: 0, top: 8 + (bl.startMin / 60) * HOUR_PX, height: Math.max((bl.durMin / 60) * HOUR_PX - 1, 10), background: bl.type === 'free' ? `${bl.color}08` : `${bl.color}14`, borderLeft: `2px solid ${bl.color}${bl.type === 'free' ? '50' : '90'}`, borderRadius: 4, pointerEvents: 'none', zIndex: 1, display: 'flex', alignItems: 'flex-start', padding: '3px 8px', overflow: 'hidden' }}>
                  <span style={{ fontSize: '.6rem', fontWeight: 600, color: `${bl.color}cc`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {bl.type === 'free' ? '○ ' : '● '}{bl.label}
                  </span>
                </div>
              ))}

              {now >= 0 && now <= TOTAL_MINS && (
                <div style={{ position: 'absolute', top: 8 + (now / 60) * HOUR_PX, left: 0, right: 16, pointerEvents: 'none', zIndex: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF4C51', flexShrink: 0 }} />
                    <div style={{ flex: 1, height: 1.5, background: '#FF4C51', opacity: 0.6 }} />
                    <span style={{ fontSize: '.6rem', color: '#FF4C51', fontWeight: 700, flexShrink: 0 }}>
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )}

              {dragging && dragOver !== null && (
                <div style={{ position: 'absolute', left: 4, right: 0, top: 8 + (dragOver / 60) * HOUR_PX, height: (dragging.durMin / 60) * HOUR_PX, background: 'rgba(201,124,74,.15)', border: '1.5px dashed var(--mui-palette-primary-main)', borderRadius: 8, pointerEvents: 'none', zIndex: 4 }} />
              )}

              {scheduled.map(s => {
                const task = ALL_TASKS.find(t => t.id === s.taskId)
                if (!task) return null
                const top    = 8 + (s.startMin / 60) * HOUR_PX
                const height = Math.max((s.durMin / 60) * HOUR_PX - 3, 22)
                const endMin = s.startMin + s.durMin
                return (
                  <div key={s.taskId} draggable
                    onDragStart={() => setDragging({ taskId: s.taskId, durMin: s.durMin })}
                    onDragEnd={() => { setDragging(null); setDragOver(null) }}
                    style={{ position: 'absolute', left: 4, right: 0, top, height, background: `${task.tagColor}20`, border: `1.5px solid ${task.tagColor}60`, borderLeft: `3px solid ${task.tagColor}`, borderRadius: 7, padding: '4px 8px', cursor: 'grab', zIndex: 3, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--mui-palette-text-primary)', lineHeight: 1.3 }}>{task.title}</span>
                      <button onClick={() => removeScheduled(s.taskId)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mui-palette-text-disabled)', fontSize: 12, lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
                    </div>
                    {height > 32 && <div style={{ fontSize: '.6rem', color: 'var(--mui-palette-text-disabled)', marginTop: 2 }}>{fmtTime(s.startMin)} – {fmtTime(endMin)}</div>}
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ padding: '10px 18px', borderTop: '1px solid var(--mui-palette-divider)', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF4C51', flexShrink: 0 }} />
            <span style={{ fontSize: '.75rem', color: 'var(--mui-palette-text-disabled)' }}>
              {scheduled.length} tasks · {Math.round(totalPlanned / 60 * 10) / 10}h planned
            </span>
            {activeTemplate && (
              <span style={{ marginLeft: 8, fontSize: '.7rem', color: activeTemplate.color, fontWeight: 600 }}>
                <i className='tabler-template' style={{ fontSize: 11 }} /> {activeTemplate.name}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '.7rem', color: 'var(--mui-palette-text-disabled)', whiteSpace: 'nowrap' }}>Drag tasks to schedule</span>
          </div>
        </div>

        {/* Templates panel — desktop inline grid column only */}
        {showPanel && !compact && (
          <TemplatesPanel
            templates={templates}
            activeTemplateId={activeTemplateId}
            onApply={id => setActiveTemplateId(id)}
            onEdit={t => { setEditingTpl(t); setShowEditor(true) }}
            onAdd={() => { setEditingTpl(null); setShowEditor(true) }}
            onDelete={deleteTemplate}
            onClose={() => setShowPanel(false)}
            mobile={false}
          />
        )}
      </div>

      {/* Templates panel — mobile/tablet bottom sheet (outside grid flow) */}
      {showPanel && compact && (
        <TemplatesPanel
          templates={templates}
          activeTemplateId={activeTemplateId}
          onApply={id => setActiveTemplateId(id)}
          onEdit={t => { setEditingTpl(t); setShowEditor(true) }}
          onAdd={() => { setEditingTpl(null); setShowEditor(true) }}
          onDelete={deleteTemplate}
          onClose={() => setShowPanel(false)}
          mobile={true}
        />
      )}

      {/* Template editor */}
      {showEditor && (
        <TemplateEditorModal
          template={editingTpl}
          onSave={saveTemplate}
          onClose={() => { setShowEditor(false); setEditingTpl(null) }}
          mobile={mobile}
        />
      )}
    </div>
  )
}
