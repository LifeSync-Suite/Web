// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Auth is bypassed for frontend development — always render children
const GuestOnlyRoute = ({ children }: ChildrenType & { lang: Locale }) => <>{children}</>

export default GuestOnlyRoute
