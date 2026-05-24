import classnames from 'classnames'
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'
import WealthView from '@views/apps/wealth/WealthView'

export const metadata = { title: 'Wealth — LifeSync' }

const WealthPage = () => (
  <div className={classnames(commonLayoutClasses.contentHeightFixed, 'flex flex-col is-full min-is-0 overflow-hidden')}>
    <WealthView />
  </div>
)

export default WealthPage
