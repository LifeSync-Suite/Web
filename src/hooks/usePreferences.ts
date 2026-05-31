'use client'

// usePreferences.ts — App-wide display preferences (calendar system, week start,
// currency) persisted to localStorage and synced across components via custom
// events. Ported from the LifeSync design system (calendar.jsx / currency.jsx).

import { useEffect, useState } from 'react'

// ─── CALENDAR SYSTEMS ─────────────────────────────────────────
export type CalendarSystem = {
  id: string
  name: string
  desc: string
  flag: string
  short: string
}

export const CALENDARS: CalendarSystem[] = [
  { id: 'gregory', name: 'Gregorian', desc: 'International standard', flag: '🗓️', short: 'GRG' },
  { id: 'persian', name: 'Jalali (Persian)', desc: 'Solar Hijri calendar', flag: '☀️', short: 'JAL' },
  { id: 'islamic', name: 'Hijri (Lunar)', desc: 'Islamic lunar calendar', flag: '🌙', short: 'HJR' }
]

// ─── WEEK STARTS ──────────────────────────────────────────────
export type WeekStart = {
  id: number
  code: string
  label: string
  short: string
  desc: string
}

export const WEEK_STARTS: WeekStart[] = [
  { id: 1, code: 'mon', label: 'Monday', short: 'Mon', desc: 'Most of Europe & ISO 8601' },
  { id: 0, code: 'sun', label: 'Sunday', short: 'Sun', desc: 'United States & Canada' },
  { id: 6, code: 'sat', label: 'Saturday', short: 'Sat', desc: 'Middle East & North Africa' }
]

// ─── CURRENCIES ───────────────────────────────────────────────
export type Currency = {
  code: string
  symbol: string
  name: string
  locale: string
  rate: number
  flag: string
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US', rate: 1.0, flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE', rate: 0.92, flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB', rate: 0.79, flag: '🇬🇧' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA', rate: 1.36, flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU', rate: 1.51, flag: '🇦🇺' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP', rate: 152, flag: '🇯🇵' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH', rate: 0.88, flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN', rate: 7.24, flag: '🇨🇳' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN', rate: 83.4, flag: '🇮🇳' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'en-AE', rate: 3.67, flag: '🇦🇪' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA', rate: 3.75, flag: '🇸🇦' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR', rate: 32.4, flag: '🇹🇷' },
  { code: 'IRR', symbol: '﷼', name: 'Iranian Rial', locale: 'fa-IR', rate: 42000, flag: '🇮🇷' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR', rate: 5.05, flag: '🇧🇷' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX', rate: 17.1, flag: '🇲🇽' }
]

// ─── STORAGE KEYS / EVENTS ────────────────────────────────────
const KEYS = {
  calendar: 'ls-calendar',
  weekStart: 'ls-weekstart',
  currency: 'ls-currency'
} as const

const EVENTS = {
  calendar: 'ls-calendar-change',
  weekStart: 'ls-weekstart-change',
  currency: 'ls-currency-change'
} as const

// ─── GENERIC PERSISTED-PREFERENCE HELPER ──────────────────────
function readStored(key: string, fallback: string) {
  if (typeof window === 'undefined') return fallback

  return localStorage.getItem(key) ?? fallback
}

function usePersistedPref(key: string, eventName: string, fallback: string): [string, (value: string) => void] {
  const [value, setValue] = useState<string>(fallback)

  // Hydrate from localStorage after mount to avoid SSR mismatch.
  useEffect(() => {
    setValue(readStored(key, fallback))
  }, [key, fallback])

  useEffect(() => {
    const handler = (e: Event) => setValue((e as CustomEvent<string>).detail)

    window.addEventListener(eventName, handler)

    return () => window.removeEventListener(eventName, handler)
  }, [eventName])

  const update = (next: string) => {
    localStorage.setItem(key, next)
    window.dispatchEvent(new CustomEvent(eventName, { detail: next }))
  }

  return [value, update]
}

// ─── PUBLIC HOOKS ─────────────────────────────────────────────
export function useCalendarSystem(): [CalendarSystem, (id: string) => void] {
  const [id, setId] = usePersistedPref(KEYS.calendar, EVENTS.calendar, 'gregory')

  return [CALENDARS.find(c => c.id === id) || CALENDARS[0], setId]
}

export function useWeekStart(): [WeekStart, (id: number) => void] {
  const [id, setId] = usePersistedPref(KEYS.weekStart, EVENTS.weekStart, '1')

  return [WEEK_STARTS.find(w => w.id === parseInt(id, 10)) || WEEK_STARTS[0], (next: number) => setId(String(next))]
}

export function useCurrency(): [Currency, (code: string) => void] {
  const [code, setCode] = usePersistedPref(KEYS.currency, EVENTS.currency, 'USD')

  return [CURRENCIES.find(c => c.code === code) || CURRENCIES[0], setCode]
}

// ─── MONEY FORMATTER ──────────────────────────────────────────
// Source amounts are stored as USD-equivalent; convert + format to active currency.
export function fmtMoney(usdValue: number, currency: Currency, mode: 'round' | 'full' = 'full') {
  const converted = usdValue * currency.rate
  const fractionDigits = mode === 'round' || currency.rate >= 100 ? 0 : 2

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits
    }).format(converted)
  } catch {
    return `${currency.symbol}${converted.toFixed(fractionDigits)}`
  }
}
