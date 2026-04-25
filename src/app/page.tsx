import { redirect } from 'next/navigation'

// Redirect bare "/" to the default locale landing page
export default function RootPage() {
  redirect('/en')
}
