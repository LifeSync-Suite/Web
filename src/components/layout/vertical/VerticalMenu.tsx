// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* LifeSync Navigation */}
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='tabler-circle text-xs' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {/* Dashboard */}
        <MenuSection label='Dashboard'>
          <MenuItem href={`/${locale}/dashboards/crm`} icon={<i className='tabler-layout-dashboard' />}>
            Overview
          </MenuItem>
          <MenuItem href={`/${locale}/dashboards/analytics`} icon={<i className='tabler-chart-line' />}>
            Analytics
          </MenuItem>
        </MenuSection>

        {/* Modules */}
        <MenuSection label='Modules'>
          <MenuItem
            href={`/${locale}/apps/tasks`}
            icon={<i className='tabler-checklist' />}
            suffix={<CustomChip label='4' size='small' color='error' round='true' />}
          >
            Tasks
          </MenuItem>
          <MenuItem href={`/${locale}/apps/goals`} icon={<i className='tabler-target' />}>
            Goals
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/habits`}
            icon={<i className='tabler-flame' />}
            suffix={<CustomChip label='12d' size='small' color='success' round='true' />}
          >
            Habits
          </MenuItem>
          <MenuItem href={`/${locale}/apps/mood`} icon={<i className='tabler-mood-smile' />}>
            Mood &amp; Journal
          </MenuItem>
          <MenuItem href={`/${locale}/apps/focus`} icon={<i className='tabler-focus-2' />}>
            Focus Timer
          </MenuItem>
          <MenuItem href={`/${locale}/apps/calendar`} icon={<i className='tabler-calendar' />}>
            Calendar
          </MenuItem>
        </MenuSection>

        {/* Account */}
        <MenuSection label='Account'>
          <MenuItem href={`/${locale}/pages/account-settings`} icon={<i className='tabler-settings' />}>
            Settings
          </MenuItem>
          <MenuItem href={`/${locale}/pages/user-profile`} icon={<i className='tabler-user' />}>
            Profile
          </MenuItem>
        </MenuSection>
      </Menu>

      {/* <GenerateVerticalMenu menuData={menuData(dictionary)} /> */}
    </ScrollWrapper>
  )
}

export default VerticalMenu

// ── Vuexy template menu preserved for future use ─────────────────────────────
// To restore: replace the LifeSync <Menu> block above with this content.
//
// <Menu popoutMenuOffset={{mainAxis:23}} menuItemStyles={...} renderExpandIcon={...} menuSectionStyles={...}>
//   <SubMenu label={dictionary['navigation'].dashboards} icon={<i className='tabler-smart-home'/>} suffix={<CustomChip label='5' size='small' color='error' round='true'/>}>
//     <MenuItem href={`/${locale}/dashboards/crm`}>{dictionary['navigation'].crm}</MenuItem>
//     <MenuItem href={`/${locale}/dashboards/analytics`}>{dictionary['navigation'].analytics}</MenuItem>
//     <MenuItem href={`/${locale}/dashboards/ecommerce`}>{dictionary['navigation'].eCommerce}</MenuItem>
//     <MenuItem href={`/${locale}/dashboards/academy`}>{dictionary['navigation'].academy}</MenuItem>
//     <MenuItem href={`/${locale}/dashboards/logistics`}>{dictionary['navigation'].logistics}</MenuItem>
//   </SubMenu>
//   <SubMenu label={dictionary['navigation'].frontPages} icon={<i className='tabler-files'/>}>
//     <MenuItem href='/' target='_blank'>{dictionary['navigation'].landing}</MenuItem>
//     <MenuItem href='/front-pages/pricing' target='_blank'>{dictionary['navigation'].pricing}</MenuItem>
//     <MenuItem href='/front-pages/payment' target='_blank'>{dictionary['navigation'].payment}</MenuItem>
//     <MenuItem href='/front-pages/checkout' target='_blank'>{dictionary['navigation'].checkout}</MenuItem>
//     <MenuItem href='/front-pages/help-center' target='_blank'>{dictionary['navigation'].helpCenter}</MenuItem>
//   </SubMenu>
//   <MenuSection label={dictionary['navigation'].appsPages}>
//     <SubMenu label={dictionary['navigation'].eCommerce} icon={<i className='tabler-shopping-cart'/>}>
//       <MenuItem href={`/${locale}/apps/ecommerce/dashboard`}>{dictionary['navigation'].dashboard}</MenuItem>
//       ... (products, orders, customers, reviews, referrals, settings submenus)
//     </SubMenu>
//     <SubMenu label={dictionary['navigation'].academy} icon={<i className='tabler-school'/>}>...</SubMenu>
//     <SubMenu label={dictionary['navigation'].logistics} icon={<i className='tabler-truck'/>}>...</SubMenu>
//     <MenuItem href={`/${locale}/apps/email`} ...>{dictionary['navigation'].email}</MenuItem>
//     <MenuItem href={`/${locale}/apps/chat`} ...>{dictionary['navigation'].chat}</MenuItem>
//     <MenuItem href={`/${locale}/apps/calendar`} ...>{dictionary['navigation'].calendar}</MenuItem>
//     <MenuItem href={`/${locale}/apps/kanban`} ...>{dictionary['navigation'].kanban}</MenuItem>
//     <SubMenu label={dictionary['navigation'].invoice} ...>...</SubMenu>
//     <SubMenu label={dictionary['navigation'].user} ...>...</SubMenu>
//     <SubMenu label={dictionary['navigation'].rolesPermissions} ...>...</SubMenu>
//     <SubMenu label={dictionary['navigation'].pages} ...>...</SubMenu>
//     <SubMenu label={dictionary['navigation'].authPages} ...>...</SubMenu>
//     <SubMenu label={dictionary['navigation'].wizardExamples} ...>...</SubMenu>
//     <MenuItem href={`/${locale}/pages/dialog-examples`} ...>...</MenuItem>
//     <SubMenu label={dictionary['navigation'].widgetExamples} ...>...</SubMenu>
//   </MenuSection>
//   <MenuSection label={dictionary['navigation'].formsAndTables}>
//     <MenuItem href={`/${locale}/forms/form-layouts`} ...>...</MenuItem>
//     <MenuItem href={`/${locale}/forms/form-validation`} ...>...</MenuItem>
//     <MenuItem href={`/${locale}/forms/form-wizard`} ...>...</MenuItem>
//     <MenuItem href={`/${locale}/react-table`} ...>...</MenuItem>
//     <MenuItem icon={...} href={DOCS_URL+'/form-elements'} ...>...</MenuItem>
//     <MenuItem icon={...} href={DOCS_URL+'/mui-table'} ...>...</MenuItem>
//   </MenuSection>
//   <MenuSection label={dictionary['navigation'].chartsMisc}>
//     <SubMenu label={dictionary['navigation'].charts} ...>
//       <MenuItem href={`/${locale}/charts/apex-charts`}>...</MenuItem>
//       <MenuItem href={`/${locale}/charts/recharts`}>...</MenuItem>
//     </SubMenu>
//     <MenuItem icon={...} href={DOCS_URL+'/foundation'} ...>...</MenuItem>
//     <MenuItem icon={...} href={DOCS_URL+'/components'} ...>...</MenuItem>
//     <MenuItem icon={...} href={DOCS_URL+'/menu-examples'} ...>...</MenuItem>
//     <MenuItem icon={...} href='https://pixinvent.ticksy.com' ...>...</MenuItem>
//     <MenuItem icon={...} href={DOCS_URL} ...>...</MenuItem>
//     <SubMenu label={dictionary['navigation'].others} ...>...</SubMenu>
//   </MenuSection>
// </Menu>
// ─────────────────────────────────────────────────────────────────────────────
