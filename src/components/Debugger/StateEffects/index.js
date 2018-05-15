import './styles.css'
import { connect } from '@cerebral/inferno'
import { state } from 'cerebral/tags'
import WatchedList from './WatchedList'
import Updates from './Updates'

export default connect(
  {
    watchMap: state`watchMap`,
    computedMap: state`computedMap`,
    updates: state`watchUpdates`,
    searchValue: state`searchValue`,
    searchComponentValue: state`searchComponentValue`,
  },
  function Components(props) {
    return (
      <div className="components-wrapper">
        <WatchedList
          map={props.watchMap}
          computedMap={props.computedMap}
          pathFilter={props.searchValue}
          componentNameFilter={props.searchComponentValue}
        />
        <div>&nbsp;</div>
        <Updates
          updates={props.updates}
          map={props.watchMap}
          pathFilter={props.searchValue}
          componentNameFilter={props.searchComponentValue}
        />
      </div>
    )
  }
)
