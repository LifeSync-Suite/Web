'use client'

import { useState, useEffect } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg'

// xs < 600  sm 600-899  md 900-1199  lg 1200+
export function useBreakpoint(): Breakpoint {
  const getBreakpoint = (): Breakpoint => {
    if (typeof window === 'undefined') return 'lg'
    const w = window.innerWidth
    if (w < 600)  return 'xs'
    if (w < 900)  return 'sm'
    if (w < 1200) return 'md'
    return 'lg'
  }

  const [bp, setBp] = useState<Breakpoint>(getBreakpoint)

  useEffect(() => {
    const handler = () => setBp(getBreakpoint())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return bp
}

export const isMobile = (bp: Breakpoint) => bp === 'xs'
export const isTablet = (bp: Breakpoint) => bp === 'xs' || bp === 'sm'
