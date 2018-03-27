import './styles.css'
import Inferno from 'inferno'; // eslint-disable-line
import Component from 'inferno-component'; // eslint-disable-line
import classNames from 'classnames'
import connector from 'connector'
import { connect } from '@cerebral/inferno'
import { state, signal } from 'cerebral/tags'
import Toolbar from '../Toolbar'
import Signals from '../Signals'
import History from '../History'
import Components from '../Components'
import Model from '../Model'

export default connect(
  {
    config: state`config`,
    error: state`error`,
    currentPage: state`currentPage`,
    executingSignalsCount: state`executingSignalsCount`,
    settings: state`settings`,
    isSmall: state`useragent.media.small`,
    mutationsError: state`mutationsError`,
    escPressed: signal`escPressed`,
    payloadReceived: signal`payloadReceived`,
    addPortErrored: signal`addPortErrored`,
  },
  class App extends Component {
    componentDidMount() {
      document.body.addEventListener('keydown', event => {
        if (event.keyCode === 27) {
          this.props.escPressed()
        }
      })

      connector.addPort(this.props.config, payload => {
        if (payload instanceof Error) {
          this.props.addPortErrored({ error: payload.message })
        } else {
          this.props.payloadReceived(payload)
        }
      })
    }
    renderLayout() {
      if (this.props.isSmall) {
        switch (this.props.currentPage) {
          case 'signals':
            return (
              <div className="app-content">
                <Signals />
              </div>
            )
          case 'components':
            return (
              <div className="app-content">
                <Components />
              </div>
            )
          case 'history':
            return (
              <div className="app-content">
                <History />
              </div>
            )
          case 'model':
            return (
              <div className="app-content">
                <Model />
              </div>
            )
          default:
            return null
        }
      } else {
        switch (this.props.currentPage) {
          case 'signals':
            return (
              <div className="app-content">
                <Signals />
              </div>
            )
          case 'components':
            return (
              <div className="app-content">
                <Components />
              </div>
            )
          case 'history':
            return (
              <div className="app-content">
                <History />
              </div>
            )
          case 'model':
            return (
              <div className="app-content">
                {this.props.config.type === 'c' ||
                this.props.config.type === 'cft' ? (
                  <Model />
                ) : null}
              </div>
            )
          default:
            return null
        }
      }
    }
    renderError() {
      return (
        <div className="error">
          <div className="error-title">warning</div>
          {this.props.error}
        </div>
      )
    }
    render() {
      const mutationsError = this.props.mutationsError

      return (
        <div className="debugger">
          {mutationsError ? (
            <div className="app-mutationsError">
              <h1>Ops!</h1>
              <h4>
                Signal "{mutationsError.signalName}" causes an error doing{' '}
                <strong>{mutationsError.mutation.name}</strong>("{mutationsError.mutation.args[0].join(
                  '.'
                )}",{' '}
                {JSON.stringify(mutationsError.mutation.args)
                  .replace(/^\[/, '')
                  .replace(/]$/, '')})
              </h4>
            </div>
          ) : (
            <div className="app-toolbar">
              <Toolbar />
            </div>
          )}
          {this.props.error ? this.renderError() : this.renderLayout()}
          <div className="execution">
            {this.props.executingSignalsCount ? 'executing' : 'idle'}
            <div
              className={classNames('execution-led', {
                'execution-led--idle': !this.props.executingSignalsCount,
                'execution-led--executing': !!this.props.executingSignalsCount,
              })}
            />
          </div>
        </div>
      )
    }
  }
)
