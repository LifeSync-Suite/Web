// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import LandingPageWrapper from '@views/front-pages/landing-page/v2'
import ScrollToTop from '@core/components/scroll-to-top'

// MUI Imports
import Button from '@mui/material/Button'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'
import { i18n } from '@configs/i18n'

const LandingPage = ({ params }: { params: { lang: Locale } }) => {
  const direction = i18n.langDirection[params.lang]
  const systemMode = getSystemMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <LandingPageWrapper />
        <ScrollToTop className='mui-fixed'>
          <Button variant='contained' className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'>
            <i className='tabler-arrow-up' />
          </Button>
        </ScrollToTop>
      </BlankLayout>
    </Providers>
  )
}

export default LandingPage
