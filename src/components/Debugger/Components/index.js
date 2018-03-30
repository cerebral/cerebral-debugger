import './styles.css'
import { connect } from '@cerebral/inferno'
import { state } from 'cerebral/tags'
import StatePaths from './StatePaths'
import Renders from './Renders'

export default connect(
  {
    map: state`componentsMap`,
    renders: state`renders`,
    searchValue: state`searchValue`,
    searchComponentValue: state`searchComponentValue`,
  },
  function Components(props) {
    return (
      <div className="components-wrapper">
        <StatePaths
          map={props.map}
          pathFilter={props.searchValue}
          componentNameFilter={props.searchComponentValue}
        />
        <Renders
          renders={props.renders}
          pathFilter={props.searchValue}
          componentNameFilter={props.searchComponentValue}
        />
      </div>
    )
  }
)
