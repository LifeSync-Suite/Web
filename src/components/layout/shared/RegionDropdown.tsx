'use client'

// RegionDropdown — Calendar system + week-start + display-language picker for the
// navbar. Mirrors the design system's RegionPicker (calendar.jsx): a labeled pill
// trigger that opens a panel with three sections and a footer note.

// React Imports
import { useRef, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

// MUI Imports
import ButtonBase from '@mui/material/ButtonBase'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Type Imports
import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useCalendarSystem, useWeekStart, CALENDARS, WEEK_STARTS } from '@/hooks/usePreferences'

// Display languages map onto the app's i18n route locales.
type LanguageOption = {
  id: Locale
  label: string
  native: string
  flag: string
  script: string
}

const LANGUAGES: LanguageOption[] = [
  { id: 'en', label: 'English', native: 'English', flag: '🇺🇸', script: 'Latin script · Plus Jakarta Sans' },
  { id: 'fr', label: 'French', native: 'Français', flag: '🇫🇷', script: 'Latin script · Plus Jakarta Sans' },
  { id: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦', script: 'Arabic script · Noto Sans Arabic' }
]

const getLocalePath = (pathName: string, locale: string) => {
  if (!pathName) return '/'
  const segments = pathName.split('/')

  segments[1] = locale

  return segments.join('/')
}

const RegionDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { settings } = useSettings()
  const pathName = usePathname()
  const { lang } = useParams()
  const [calendar, setCalendar] = useCalendarSystem()
  const [weekStart, setWeekStart] = useWeekStart()

  const activeLang = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0]

  const handleClose = () => setOpen(false)
  const handleToggle = () => setOpen(prev => !prev)

  return (
    <>
      {/* Trigger pill */}
      <ButtonBase
        ref={anchorRef}
        onClick={handleToggle}
        className='flex items-center gap-1.5 pli-2.5 rounded'
        sx={{
          height: 34,
          border: '1px solid var(--mui-palette-divider)',
          color: 'text.secondary',
          fontSize: '0.8rem',
          fontWeight: 600,
          bgcolor: open ? 'var(--mui-palette-action-hover)' : 'transparent',
          '&:hover': { bgcolor: 'var(--mui-palette-action-hover)' }
        }}
      >
        <span style={{ fontSize: 13, lineHeight: 1 }}>{calendar.flag}</span>
        <span>{calendar.short}</span>
        <span className='text-textDisabled font-normal'>·</span>
        <span>{weekStart.short}</span>
        <span className='text-textDisabled font-normal'>·</span>
        <span style={{ fontSize: 13, lineHeight: 1 }}>{activeLang.flag}</span>
        <i className='tabler-chevron-down text-sm text-textDisabled' />
      </ButtonBase>

      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='!mbs-2 z-[1]'
        style={{ width: 300 }}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <div>
                  {/* Calendar system */}
                  <div className='plb-3 pli-3.5'>
                    <Typography
                      variant='caption'
                      className='uppercase font-bold mbe-2 block'
                      sx={{ letterSpacing: '.6px', fontSize: '.62rem' }}
                      color='text.secondary'
                    >
                      Calendar system
                    </Typography>
                    {CALENDARS.map(c => {
                      const active = c.id === calendar.id

                      return (
                        <Box
                          key={c.id}
                          role='button'
                          onClick={() => setCalendar(c.id)}
                          className='flex items-center gap-2.5 plb-2 pli-2.5 rounded cursor-pointer mbe-0.5'
                          sx={{
                            bgcolor: active ? 'var(--mui-palette-primary-lightOpacity)' : 'transparent',
                            '&:hover': { bgcolor: active ? 'var(--mui-palette-primary-lightOpacity)' : 'var(--mui-palette-action-hover)' }
                          }}
                        >
                          <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>{c.flag}</span>
                          <div className='flex-1 min-is-0'>
                            <Typography
                              variant='body2'
                              color={active ? 'primary.main' : 'text.primary'}
                              sx={{ fontWeight: active ? 700 : 600 }}
                            >
                              {c.name}
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {c.desc}
                            </Typography>
                          </div>
                          {active && <i className='tabler-check text-base text-primary' />}
                        </Box>
                      )
                    })}
                  </div>

                  <Divider />

                  {/* Week start */}
                  <div className='plb-3 pli-3.5'>
                    <Typography
                      variant='caption'
                      className='uppercase font-bold mbe-2 block'
                      sx={{ letterSpacing: '.6px', fontSize: '.62rem' }}
                      color='text.secondary'
                    >
                      Week starts on
                    </Typography>
                    <div className='grid grid-cols-3 gap-1.5'>
                      {WEEK_STARTS.map(w => {
                        const active = w.id === weekStart.id

                        return (
                          <ButtonBase
                            key={w.id}
                            onClick={() => setWeekStart(w.id)}
                            title={w.desc}
                            className='plb-2 rounded'
                            sx={{
                              border: theme =>
                                `1.5px solid ${active ? theme.palette.primary.main : 'var(--mui-palette-divider)'}`,
                              bgcolor: active ? 'var(--mui-palette-primary-lightOpacity)' : 'transparent',
                              color: active ? 'primary.main' : 'text.secondary',
                              fontSize: '.75rem',
                              fontWeight: 700
                            }}
                          >
                            {w.short}
                          </ButtonBase>
                        )
                      })}
                    </div>
                    <Typography variant='caption' color='text.secondary' className='mbs-2 block'>
                      {weekStart.desc}
                    </Typography>
                  </div>

                  <Divider />

                  {/* Display language */}
                  <div className='plb-3 pli-3.5'>
                    <Typography
                      variant='caption'
                      className='uppercase font-bold mbe-2 block'
                      sx={{ letterSpacing: '.6px', fontSize: '.62rem' }}
                      color='text.secondary'
                    >
                      Display language
                    </Typography>
                    {LANGUAGES.map(l => {
                      const active = l.id === activeLang.id

                      return (
                        <Box
                          key={l.id}
                          component={Link}
                          href={getLocalePath(pathName, l.id)}
                          onClick={handleClose}
                          className='flex items-center gap-2.5 plb-2 pli-2.5 rounded cursor-pointer mbe-0.5'
                          sx={{
                            textDecoration: 'none',
                            bgcolor: active ? 'var(--mui-palette-primary-lightOpacity)' : 'transparent',
                            '&:hover': { bgcolor: active ? 'var(--mui-palette-primary-lightOpacity)' : 'var(--mui-palette-action-hover)' }
                          }}
                        >
                          <span style={{ fontSize: 18, width: 22, textAlign: 'center' }}>{l.flag}</span>
                          <div className='flex-1 min-is-0'>
                            <Typography
                              variant='body2'
                              color={active ? 'primary.main' : 'text.primary'}
                              sx={{ fontWeight: active ? 700 : 600 }}
                            >
                              {l.label}
                              <span className='text-textSecondary font-normal mis-1.5'>{l.native}</span>
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {l.script}
                            </Typography>
                          </div>
                          {active && <i className='tabler-check text-base text-primary' />}
                        </Box>
                      )
                    })}
                  </div>

                  <Divider />

                  {/* Footer note */}
                  <div className='flex items-center gap-1.5 plb-2 pli-3.5'>
                    <i className='tabler-info-circle text-textDisabled' style={{ fontSize: 11 }} />
                    <Typography variant='caption' color='text.secondary'>
                      Affects dates, week views &amp; analytics buckets
                    </Typography>
                  </div>
                </div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default RegionDropdown
