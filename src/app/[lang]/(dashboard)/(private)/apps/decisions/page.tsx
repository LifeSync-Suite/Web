import classnames from 'classnames'
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'
import DecisionsView from '@views/apps/decisions/DecisionsView'

export const metadata = { title: 'Decision Compass — LifeSync' }

const DecisionsPage = () => (
  <div className={classnames(commonLayoutClasses.contentHeightFixed, 'flex flex-col is-full min-is-0 overflow-hidden')}>
    <DecisionsView />
  </div>
)

export default DecisionsPage
