import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import Component from 'inferno-component' // eslint-disable-line
import {connect} from '@cerebral/inferno'
import {state, signal} from 'cerebral/tags'
import classnames from 'classnames'

import Action from './Action'
import Props from './Props'
import Path from './Path'
import Sequence from './Sequence'

export default connect({
  currentPage: state`currentPage`,
  useragent: state`useragent`,
  signal: state`signals.${state`currentSignalExecutionId`}`,
  executedBySignals: state`executedBySignals`,
  showProps: state`storage.showProps`,
  showActions: state`storage.showActions`,
  showProviderReturnValue: state`storage.showProviderReturnValue`,
  searchValue: state`searchValue`,
  showPropsToggled: signal`showPropsToggled`,
  showActionsToggled: signal`showActionsToggled`,
  showProviderReturnValueToggled: signal`showProviderReturnValueToggled`,
  actionToggled: signal`actionToggled`,
  propsToggled: signal`propsToggled`,
  mutationClicked: signal`mutationClicked`,
  pathClicked: signal`pathClicked`
},
  class Signal extends Component {
    constructor (props) {
      super()
      this.renderAction = this.renderAction.bind(this)
      this.onMutationClick = this.onMutationClick.bind(this)
    }
    shouldComponentUpdate (nextProps, nextState) {
      return (
        nextProps.currentPage === 'signals' ||
        !nextProps.useragent.media.small
      )
    }
    onMutationClick (path) {
      this.props.mutationClicked({
        path
      })
    }
    actionHasSearchContent (action) {
      const data = this.props.signal.functionsRun[action.functionIndex] ? this.props.signal.functionsRun[action.functionIndex].data : null

      if (action._functionTreePrimitive && action.name && action.name.toLowerCase().indexOf(this.props.searchValue) >= 0) {
        return true
      }

      return (data || []).reduce((currentHasSearchContent, dataItem) => {
        if (currentHasSearchContent) {
          return currentHasSearchContent
        }

        if (dataItem.type === 'mutation' && dataItem.args[0].join('.').indexOf(this.props.searchValue) >= 0) {
          return true
        }

        return false
      }, false)
    }
    renderSequence (sequence, index) {
      return (
        <Sequence key={index} sequence={sequence}>
          {sequence.items.map(this.renderAction)}
        </Sequence>
      )
    }
    renderAction (action, index) {
      const hasSearchContent = (
        this.props.searchValue &&
        this.actionHasSearchContent(action)
      )

      if (action._functionTreePrimitive && action.items && action.items.length) {
        return this.renderSequence(action, index)
      } else if (action._functionTreePrimitive && (!action.items || !action.items.length)) {
        return null
      }

      const isExecuted = Boolean(this.props.signal.functionsRun[action.functionIndex])
      const executedBySignals = (
        this.props.signal.functionsRun[action.functionIndex] && this.props.signal.functionsRun[action.functionIndex].executedIds.length
      ) ? this.props.signal.functionsRun[action.functionIndex].executedIds.map((executedId) => this.props.executedBySignals[executedId]) : []
      const execution = this.props.signal.functionsRun[action.functionIndex]
      const output = Object.keys(action.outputs || {}).reduce((currentOutput, output) => {
        const isOutput = execution && execution.path === output

        if (isOutput) {
          return output
        }

        return currentOutput
      }, null)
      const isPropsExpanded = Boolean(this.props.signal.expandedProps[action.functionIndex])

      return (
        <div className='action-container'>
          {this.props.showProps && execution && execution.payload && Object.keys(execution.payload).length ? <Props
            payload={execution.payload}
            pathClicked={this.props.pathClicked}
            isExpanded={isPropsExpanded}
            onExpand={() => this.props.propsToggled({action, executionId: this.props.signal.executionId, expanded: true})}
            onCollapse={() => this.props.propsToggled({action, executionId: this.props.signal.executionId, expanded: false})}
          /> : null}
          <Action
            action={action}
            output={output}
            actionToggled={() => this.props.actionToggled({action, executionId: this.props.signal.executionId})}
            showProviderReturnValue={this.props.showProviderReturnValue}
            isExpanded={Boolean(this.props.signal.expandedActions[action.functionIndex])}
            faded={(hasSearchContent === false) || !isExecuted}
            execution={execution}
            key={index}
            onMutationClick={this.onMutationClick}
            pathClicked={this.props.pathClicked}
            executed={executedBySignals.map((executedBySignal, index) => (
              <Signal
                key={index}
                className={'executedBy'}
                style={{
                  backgroundColor: '#FAFAFA'
                }}
                executedBy
                signal={executedBySignal}
                pathClicked={this.props.pathClicked}
                showPropsToggled={this.props.showPropsToggled}
                showActionsToggled={this.props.showActionsToggled}
                showProviderReturnValue={this.props.showProviderReturnValue}
                actionToggled={this.props.actionToggled}
                propsToggled={this.props.propsToggled}
                showProps={this.props.showProps}
                useragent={this.props.useragent}
                currentPage={this.props.currentPage}
                executedBySignals={this.props.executedBySignals}
                searchValue={this.props.searchValue}
                mutationClicked={() => {}}
              />
            ))}
          />
          {output ? <Path output={output} /> : null}
          {output ? this.renderAction(action.outputs[output], index + 1) : null}
        </div>
      )
    }
    render () {
      if (!this.props.signal) {
        return <span className='signal-empty'>No signals yet...</span>
      }

      return (
        <div className={classnames('signal', this.props.className)} style={this.props.style}>
          {this.props.executedBy ? <div className='executedByLine' style={{backgroundColor: '#EAEAEA'}} /> : null}
          <h3 className='signal-title' style={{
            backgroundColor: this.props.executedBy ? '#333' : null,
            color: this.props.executedBy ? '#f0f0f0' : null
          }}>
            {this.props.signal.name}
            <div className='signal-settingsContainer'>
              <label>provider returnvalue: <input type='checkbox' onChange={() => this.props.showProviderReturnValueToggled()} checked={this.props.showProviderReturnValue} /></label>
              <label>expand actions: <input type='checkbox' onChange={() => this.props.showActionsToggled({ executionId: this.props.signal.executionId })} checked={this.props.showActions} /></label>
              {this.props.executedBy ? null : <label>props: <input type='checkbox' onChange={() => this.props.showPropsToggled()} checked={this.props.showProps} /></label>}
            </div>
          </h3>
          <div id='signal' className='signal-container'>{this.renderSequence(this.props.signal.staticTree)}</div>
          {this.props.executedBy ? <div className='executedByLine' style={{backgroundColor: '#EAEAEA'}} /> : null}
        </div>
      )
    }
  }
)
