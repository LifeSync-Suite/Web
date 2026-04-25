// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'
import LandingPageWrapper from '@views/front-pages/landing-page'
import ScrollToTop from '@core/components/scroll-to-top'

// MUI Imports
import Button from '@mui/material/Button'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'

// Util Imports
import { getSystemMode, getServerMode } from '@core/utils/serverHelpers'
import { i18n } from '@configs/i18n'

const LandingPage = ({ params }: { params: { lang: Locale } }) => {
  const direction = i18n.langDirection[params.lang]
  const systemMode = getSystemMode()
  const mode = getServerMode()

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode}>
        <IntersectionProvider>
          <FrontLayout>
            <LandingPageWrapper mode={mode} />
            <ScrollToTop className='mui-fixed'>
              <Button
                variant='contained'
                className='is-10 bs-10 rounded-full p-0 min-is-0 flex items-center justify-center'
              >
                <i className='tabler-arrow-up' />
              </Button>
            </ScrollToTop>
          </FrontLayout>
        </IntersectionProvider>
      </BlankLayout>
    </Providers>
  )
}

export default LandingPage
