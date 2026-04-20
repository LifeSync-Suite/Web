// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'
import type { getDictionary } from '@/utils/getDictionary'

const horizontalMenuData = (dictionary: Awaited<ReturnType<typeof getDictionary>>): HorizontalMenuDataType[] => [
  {
    label: 'Overview',
    icon: 'tabler-smart-home',
    href: '/dashboards/crm'
  },
  {
    label: 'Tasks',
    icon: 'tabler-checklist',
    href: '/apps/kanban'
  },
  {
    label: 'Goals',
    icon: 'tabler-target',
    href: '/apps/goals'
  },
  {
    label: 'Habits',
    icon: 'tabler-flame',
    href: '/apps/habits'
  },
  {
    label: 'Mood',
    icon: 'tabler-mood-smile',
    href: '/apps/mood'
  },
  {
    label: 'Focus',
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

export default horizontalMenuData
