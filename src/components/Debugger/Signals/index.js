import './styles.css'
import { Component } from 'inferno'
import { connect } from '@cerebral/inferno'
import { state, signal } from 'cerebral/tags'
import signalsList from '../../../common/computed/signalsList'
import connector from 'connector'

import List from './List'
import Signal from './Signal'

export default connect(
  {
    port: state`config.port`,
    currentPage: state`currentPage`,
    signalsList: signalsList,
    useragent: state`useragent`,
    currentSignalExecutionId: state`currentSignalExecutionId`,
    isExecuting: state`isExecuting`,
    hasCreatedSignalTest: state`hasCreatedSignalTest`,
    showFullPathNames: state`storage.showFullPathNames`,
    resetClicked: signal`resetClicked`,
    toggleFullPathNamesClicked: signal`toggleFullPathNamesClicked`,
    createSignalTestClicked: signal`createSignalTestClicked`,
  },
  class Signals extends Component {
    constructor(props) {
      super(props)
      this.state = { copiedSignals: null }
    }
    shouldComponentUpdate(nextProps, nextState) {
      return (
        this.props.currentPage !== nextProps.currentPage ||
        this.props.useragent.media.small !== nextProps.useragent.media.small ||
        this.props.currentSignalExecutionId !==
          nextProps.currentSignalExecutionId ||
        this.props.mutationsError !== nextProps.mutationsError ||
        this.state.copiedSignals !== nextState.copiedSignals ||
        this.props.isExecuting !== nextProps.isExecuting ||
        this.props.hasCreatedSignalTest !== nextProps.hasCreatedSignalTest
      )
    }
    onResetClick() {
      this.props.resetClicked()
      connector.sendEvent(this.props.port, 'reset')
    }
    onCopySignalsClick() {
      this.setState(
        {
          copiedSignals: JSON.stringify(
            this.props.signalsList.reverse(),
            null,
            2
          ),
        },
        () => {
          this.textarea.select()
        }
      )
    }
    onCreateSignalTestClick() {
      this.props.createSignalTestClicked()
    }
    onToggleFullPathNamesClick() {
      this.props.toggleFullPathNamesClicked()
    }
    render() {
      const currentSignalExecutionId = this.props.currentSignalExecutionId

      return (
        <div className="signals">
          <div className="signals-list">
            <List />
            <button
              onClick={() => this.onToggleFullPathNamesClick()}
              className="signals-toggleFullPathNames"
              disabled={!currentSignalExecutionId}
            >
              <label>
                Full pathnames{' '}
                <input type="checkbox" checked={this.props.showFullPathNames} />
              </label>
            </button>
            <button
              onClick={() => this.onCreateSignalTestClick()}
              className="signals-rewrite"
              disabled={!currentSignalExecutionId}
            >
              Create signal test
            </button>
            <button
              onClick={() => this.onCopySignalsClick()}
              className="signals-rewrite"
              disabled={!currentSignalExecutionId}
            >
              Copy signals data
            </button>
            <button
              onClick={() => this.onResetClick()}
              className="signals-reset"
              disabled={!currentSignalExecutionId || this.props.isExecuting}
            >
              Reset all state
            </button>
          </div>
          <div className="signals-signal">
            <Signal />
          </div>
          {this.state.copiedSignals ? (
            <li className="signals-textarea">
              <textarea
                ref={node => {
                  this.textarea = node
                }}
                value={this.state.copiedSignals}
                onBlur={() => this.setState({ copiedSignals: null })}
              />
            </li>
          ) : null}
          {this.props.hasCreatedSignalTest ? (
            <div className="signals-test-copied">Test copied to clipboard!</div>
          ) : null}
        </div>
      )
    }
  }
)
