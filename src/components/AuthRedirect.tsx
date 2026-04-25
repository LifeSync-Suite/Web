'use client'

// Type Imports
import type { Locale } from '@configs/i18n'

// Auth is bypassed for frontend development — never redirect
const AuthRedirect = ({ lang }: { lang: Locale }) => null

export default AuthRedirect
