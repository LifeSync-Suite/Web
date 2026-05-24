import classnames from 'classnames'
import { commonLayoutClasses } from '@layouts/utils/layoutClasses'
import ProjectsView from '@views/apps/projects/ProjectsView'

export const metadata = { title: 'Projects — LifeSync' }

const ProjectsPage = () => (
  <div className={classnames(commonLayoutClasses.contentHeightFixed, 'flex flex-col is-full min-is-0 overflow-hidden')}>
    <ProjectsView />
  </div>
)

export default ProjectsPage
