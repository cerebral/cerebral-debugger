import './styles.css'
import { connect } from '@cerebral/inferno'
import { state } from 'cerebral/tags'
import StatePaths from './StatePaths'
import Updates from './Updates'

export default connect(
  {
    map: state`watchMap`,
    updates: state`watchUpdates`,
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
        <div>&nbsp;</div>
        <Updates
          updates={props.updates}
          map={props.map}
          pathFilter={props.searchValue}
          componentNameFilter={props.searchComponentValue}
        />
      </div>
    )
  }
)
