// Third-party Imports
import classnames from 'classnames'

// Component Imports
import TasksView from '@views/apps/tasks/TasksView'

// Util Imports
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'

export const metadata = {
  title: 'Tasks & Projects — LifeSync',
}

const TasksPage = () => {
  return (
    <div className={classnames(commonLayoutClasses.contentHeightFixed, 'flex flex-col is-full min-is-0 overflow-hidden')}>
      <TasksView />
    </div>
  )
}

export default TasksPage
