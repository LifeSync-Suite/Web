// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Auth is bypassed for frontend development — always render children
export default function AuthGuard({ children }: ChildrenType & { locale: Locale }) {
  return <>{children}</>
}
