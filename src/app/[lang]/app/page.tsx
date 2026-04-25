import { redirect } from 'next/navigation'
import type { Locale } from '@configs/i18n'

// /[lang]/app → redirect to the dashboard home
export default function AppEntryPage({ params }: { params: { lang: Locale } }) {
  redirect(`/${params.lang}/dashboards/crm`)
}
