'use client'

// React Imports
import { useEffect } from 'react'

// Type Imports
import type { SystemMode } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Component Imports
import HeroSection from './HeroSection'
import UsefulFeature from './UsefulFeature'
import ProductStat from './ProductStat'
import OurTeam from './OurTeam'
import CustomerReviews from './CustomerReviews'
import Faqs from './Faqs'
import GetStarted from './GetStarted'

const LandingPageWrapper = ({ mode }: { mode: SystemMode }) => {
  const { updatePageSettings } = useSettings()

  useEffect(() => {
    return updatePageSettings({ skin: 'default' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <HeroSection mode={mode} />
      <UsefulFeature />
      <ProductStat />
      <OurTeam />
      <CustomerReviews />
      <Faqs />
      <GetStarted mode={mode} />
    </div>
  )
}

export default LandingPageWrapper
