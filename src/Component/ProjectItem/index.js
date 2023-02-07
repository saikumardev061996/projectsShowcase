import './index.css'

const ProjectItem = props => {
  const {projectsList} = props
  const {name, imageUrl} = projectsList
  return (
    <li className="project-item-container">
      <img src={imageUrl} alt={name} className="project-item-image" />
      <p className="project-item-name">{name}</p>
    </li>
  )
}

export default ProjectItem
