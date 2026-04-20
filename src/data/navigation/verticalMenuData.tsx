// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const verticalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): VerticalMenuDataType[] => [
  {
    label: 'Overview',
    icon: 'tabler-smart-home',
    href: '/dashboards/crm'
  },

  {
    label: 'Modules',
    isSection: true,
    children: [
      {
        label: 'Tasks & Projects',
        icon: 'tabler-checklist',
        href: '/apps/kanban'
      },
      {
        label: 'Goal Tracking',
        icon: 'tabler-target',
        href: '/apps/goals'
      },
      {
        label: 'Habit Builder',
        icon: 'tabler-flame',
        href: '/apps/habits'
      },
      {
        label: 'Mood & Journal',
        icon: 'tabler-mood-smile',
        href: '/apps/mood'
      },
      {
        label: 'Focus Timer',
        icon: 'tabler-focus-2',
        href: '/apps/focus'
      },
      {
        label: 'Calendar',
        icon: 'tabler-calendar',
        href: '/apps/calendar'
      },
      {
        label: 'Analytics',
        icon: 'tabler-chart-line',
        href: '/dashboards/analytics'
      }
    ]
  },

  {
    label: 'Account',
    isSection: true,
    children: [
      {
        label: 'Profile',
        icon: 'tabler-user',
        href: '/pages/user-profile'
      },
      {
        label: 'Account Settings',
        icon: 'tabler-settings',
        href: '/pages/account-settings'
      }
    ]
  }
]

export default verticalMenuData
