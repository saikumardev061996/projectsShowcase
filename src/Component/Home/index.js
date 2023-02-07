import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

import Header from '../Header'
import ProjectItem from '../ProjectItem'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    projectsList: [],
    apiState: apiStatusConstants.initial,
    activeOptionId: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  getProjectDetails = async () => {
    const {activeOptionId} = this.state
    this.setState({apiState: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    console.log(apiUrl)
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))

      this.setState({projectsList: updatedData}, this.getProjectDetails)
      this.setState({apiState: apiStatusConstants.success})
    } else if (response.status === 401) {
      this.setState({apiState: apiStatusConstants.failure})
    }
  }

  onChangeInput = newId => {
    this.setState({activeOptionId: newId.target.value})
  }

  renderLoadingView = () => (
    <>
      <div data-testid="loader">
        <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <div className="failure-container">
        <imgs
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
          className="failure-image"
        />
      </div>
    </>
  )

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-total-list">
        {projectsList.map(eachProject => (
          <ProjectItem key={projectsList.id} projectsList={eachProject} />
        ))}
      </ul>
    )
  }

  renderApiStatus = () => {
    const {apiState} = this.state

    switch (apiState) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <Header />
        <div className="body-container">
          <select className="select-container" onChange={this.onChangeInput}>
            {categoriesList.map(eachOption => (
              <option
                key={eachOption.id}
                value={eachOption.id}
                className="select-option"
              >
                {eachOption.displayText}
              </option>
            ))}
          </select>
          {this.renderApiStatus()}
        </div>
      </div>
    )
  }
}

export default Home
