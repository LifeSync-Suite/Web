'use client'

// CurrencyDropdown — Active-currency picker for the navbar. Mirrors the design
// system's CurrencyPicker (currency.jsx): a labeled pill trigger that opens a
// searchable panel with a count header and a footer note.

// React Imports
import { useMemo, useRef, useState } from 'react'

// MUI Imports
import ButtonBase from '@mui/material/ButtonBase'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import InputBase from '@mui/material/InputBase'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { useCurrency, CURRENCIES } from '@/hooks/usePreferences'

const CurrencyDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  // Refs
  const anchorRef = useRef<HTMLButtonElement>(null)

  // Hooks
  const { settings } = useSettings()
  const [currency, setCurrency] = useCurrency()

  const handleClose = () => {
    setOpen(false)
    setQuery('')
  }

  const handleToggle = () => setOpen(prev => !prev)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) return CURRENCIES

    return CURRENCIES.filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
  }, [query])

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
        <span style={{ fontSize: 14, lineHeight: 1 }}>{currency.flag}</span>
        <span>{currency.code}</span>
        <i className='tabler-chevron-down text-sm text-textDisabled' />
      </ButtonBase>

      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='!mbs-2 z-[1]'
        style={{ width: 260 }}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <div className='flex flex-col' style={{ maxHeight: 360 }}>
                  {/* Search */}
                  <div className='plb-2.5 pli-3 border-be'>
                    <Box
                      className='flex items-center gap-2 pli-2.5 plb-1.5 rounded'
                      sx={{ bgcolor: 'var(--mui-palette-action-hover)' }}
                    >
                      <i className='tabler-search text-sm text-textDisabled' />
                      <InputBase
                        autoFocus
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder='Search currency…'
                        className='is-full text-sm'
                      />
                    </Box>
                  </div>

                  {/* Count header */}
                  <Typography
                    variant='caption'
                    className='uppercase font-bold pli-3.5 plb-2'
                    sx={{ letterSpacing: '.6px', fontSize: '.62rem' }}
                    color='text.secondary'
                  >
                    {filtered.length} {filtered.length === 1 ? 'currency' : 'currencies'}
                  </Typography>

                  {/* List */}
                  <div className='overflow-y-auto pli-1.5 pbe-1.5 flex-1'>
                    {filtered.map(c => {
                      const active = c.code === currency.code

                      return (
                        <Box
                          key={c.code}
                          role='button'
                          onClick={() => {
                            setCurrency(c.code)
                            handleClose()
                          }}
                          className='flex items-center gap-2.5 plb-2 pli-2.5 rounded cursor-pointer'
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
                              {c.code} <span className='text-textSecondary font-normal mis-1'>{c.symbol}</span>
                            </Typography>
                            <Typography variant='caption' color='text.secondary'>
                              {c.name}
                            </Typography>
                          </div>
                          {active && <i className='tabler-check text-base text-primary' />}
                        </Box>
                      )
                    })}
                    {filtered.length === 0 && (
                      <Typography variant='body2' color='text.secondary' className='text-center plb-5'>
                        No match
                      </Typography>
                    )}
                  </div>

                  <Divider />

                  {/* Footer note */}
                  <div className='flex items-center gap-1.5 plb-2 pli-3.5'>
                    <i className='tabler-info-circle text-textDisabled' style={{ fontSize: 11 }} />
                    <Typography variant='caption' color='text.secondary'>
                      Rates are illustrative · Display only
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

export default CurrencyDropdown
