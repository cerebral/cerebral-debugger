import './styles.css'
import { Component } from 'inferno'
import { connect } from '@cerebral/inferno'
import { state, signal } from 'cerebral/tags'
import Inspector from '../Inspector'
import connector from 'connector'

export default connect(
  {
    port: state`config.port`,
    currentPage: state`currentPage`,
    useragent: state`useragent`,
    model: state`model`,
    path: state`currentMutationPath`,
    pathClicked: signal`pathClicked`,
    searchValue: state`searchValue`,
    modelChanged: signal`modelChanged`,
    modelClicked: signal`modelClicked`,
    expandedPaths: state`expandedPaths`,
  },
  class Model extends Component {
    constructor(props) {
      super(props)
      this.onModelChange = this.onModelChange.bind(this)
    }
    onModelChange(payload) {
      connector.sendEvent(this.props.port, 'changeModel', {
        path: payload.path,
        value: payload.value,
      })
      this.props.modelChanged(payload)
    }
    render() {
      return (
        <div className="model-wrapper">
          <div
            id="model"
            className="model"
            onClick={() => this.props.modelClicked()}
          >
            <Inspector
              value={this.props.model}
              expanded
              canEdit
              path={
                this.props.searchValue
                  ? this.props.searchValue.split('.')
                  : this.props.path
              }
              modelChanged={this.onModelChange}
              pathClicked={this.props.pathClicked}
              expandedPaths={this.props.expandedPaths}
            />
          </div>
        </div>
      )
    }
  }
)
