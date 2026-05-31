'use client'

// CurrencyDropdown — Active-currency picker for the navbar.
// Mirrors the design system's CurrencyPicker (currency.jsx).

// React Imports
import { useMemo, useRef, useState } from 'react'

// MUI Imports
import IconButton from '@mui/material/IconButton'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import InputBase from '@mui/material/InputBase'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

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
      <IconButton ref={anchorRef} onClick={handleToggle} className='text-textPrimary' title='Currency'>
        <span className='text-base font-medium'>{currency.symbol}</span>
      </IconButton>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[260px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={handleClose}>
                <div>
                  {/* Search */}
                  <div className='p-2 border-be'>
                    <Box
                      className='flex items-center gap-2 pli-3 plb-1 rounded'
                      sx={{ bgcolor: 'var(--mui-palette-action-hover)' }}
                    >
                      <i className='tabler-search text-base text-textDisabled' />
                      <InputBase
                        autoFocus
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder='Search currency…'
                        className='is-full text-sm'
                      />
                    </Box>
                  </div>

                  {/* List */}
                  <div className='overflow-y-auto plb-1' style={{ maxHeight: 280 }}>
                    {filtered.map(c => (
                      <Box
                        key={c.code}
                        role='button'
                        onClick={() => {
                          setCurrency(c.code)
                          handleClose()
                        }}
                        className='flex items-center gap-3 plb-2 pli-3 cursor-pointer'
                        sx={{
                          bgcolor: currency.code === c.code ? 'var(--mui-palette-primary-lightOpacity)' : 'transparent',
                          '&:hover': { bgcolor: 'var(--mui-palette-action-hover)' }
                        }}
                      >
                        <span className='text-lg'>{c.flag}</span>
                        <div className='flex-1 min-is-0'>
                          <Typography
                            variant='body2'
                            color={currency.code === c.code ? 'primary.main' : 'text.primary'}
                            className='font-medium'
                          >
                            {c.code} <span className='text-textSecondary font-normal'>· {c.symbol}</span>
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {c.name}
                          </Typography>
                        </div>
                        {currency.code === c.code && <i className='tabler-check text-base text-primary' />}
                      </Box>
                    ))}
                    {filtered.length === 0 && (
                      <Typography variant='body2' color='text.secondary' className='text-center plb-4'>
                        No currency found
                      </Typography>
                    )}
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
