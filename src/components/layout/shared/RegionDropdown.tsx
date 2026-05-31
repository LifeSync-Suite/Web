'use client'

// RegionDropdown — Calendar system + week-start preference picker for the navbar.
// Mirrors the design system's RegionPicker (calendar.jsx).

// React Imports
import { useRef, useState } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useCalendarSystem, useWeekStart, CALENDARS, WEEK_STARTS } from '@/hooks/usePreferences'

const RegionDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { settings } = useSettings()
  const [calendar, setCalendar] = useCalendarSystem()
  const [weekStart, setWeekStart] = useWeekStart()

  const handleClose = () => setOpen(false)
  const handleToggle = () => setOpen(prev => !prev)

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary' title='Calendar & week start'>
        <i className='tabler-calendar-cog' />
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[280px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='p-3'>
                  {/* Calendar system */}
                  <Typography variant='caption' className='uppercase font-medium plb-1 pli-2'>
                    Calendar system
                  </Typography>
                  <div className='flex flex-col gap-1 mbe-3'>
                    {CALENDARS.map(c => (
                      <Box
                        key={c.id}
                        role='button'
                        onClick={() => setCalendar(c.id)}
                        className='flex items-center gap-3 plb-2 pli-2 rounded cursor-pointer'
                        sx={{
                          bgcolor: calendar.id === c.id ? 'var(--mui-palette-primary-lightOpacity)' : 'transparent',
                          '&:hover': { bgcolor: 'var(--mui-palette-action-hover)' }
                        }}
                      >
                        <span className='text-lg'>{c.flag}</span>
                        <div className='flex-1 min-is-0'>
                          <Typography
                            variant='body2'
                            color={calendar.id === c.id ? 'primary.main' : 'text.primary'}
                            className='font-medium'
                          >
                            {c.name}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {c.desc}
                          </Typography>
                        </div>
                        {calendar.id === c.id && <i className='tabler-check text-base text-primary' />}
                      </Box>
                    ))}
                  </div>

                  {/* Week starts on */}
                  <Typography variant='caption' className='uppercase font-medium plb-1 pli-2'>
                    Week starts on
                  </Typography>
                  <div className='flex flex-col gap-1'>
                    {WEEK_STARTS.map(w => (
                      <Box
                        key={w.id}
                        role='button'
                        onClick={() => setWeekStart(w.id)}
                        className='flex items-center gap-3 plb-2 pli-2 rounded cursor-pointer'
                        sx={{
                          bgcolor: weekStart.id === w.id ? 'var(--mui-palette-primary-lightOpacity)' : 'transparent',
                          '&:hover': { bgcolor: 'var(--mui-palette-action-hover)' }
                        }}
                      >
                        <div className='flex-1 min-is-0'>
                          <Typography
                            variant='body2'
                            color={weekStart.id === w.id ? 'primary.main' : 'text.primary'}
                            className='font-medium'
                          >
                            {w.label}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {w.desc}
                          </Typography>
                        </div>
                        {weekStart.id === w.id && <i className='tabler-check text-base text-primary' />}
                      </Box>
                    ))}
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
