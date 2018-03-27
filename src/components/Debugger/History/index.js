import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import { connect } from '@cerebral/inferno'
import { state, signal } from 'cerebral/tags'
import classnames from 'classnames'
import { nameToColors } from '../../../common/utils'
import Mutation from '../Signals/Signal/Action/Mutation'
import Service from '../Signals/Signal/Action/Service'
import connector from 'connector'

export default connect(
  {
    port: state`config.port`,
    history: state`history`,
    currentRememberedMutationIndex: state`currentRememberedMutationIndex`,
    searchValue: state`searchValue`,
    showProvidersInHistory: state`storage.showProvidersInHistory`,
    executingSignalsCount: state`executingSignalsCount`,
    showProvidersInHistoryToggled: signal`showProvidersInHistoryToggled`,
    mutationDoubleClicked: signal`mutationDoubleClicked`,
    mutationClicked: signal`mutationClicked`,
    signalClicked: signal`signalClicked`,
    pathClicked: signal`pathClicked`,
  },
  function History({
    port,
    history,
    currentRememberedMutationIndex,
    searchValue,
    executingSignalsCount,
    showProvidersInHistory,
    showProvidersInHistoryToggled,
    mutationDoubleClicked,
    mutationClicked,
    signalClicked,
    pathClicked,
  }) {
    const filteredHistory = history.filter(
      record => record.data.type === 'mutation' || showProvidersInHistory
    )
    const counts = history.reduce(
      (currentCounts, record) => {
        return {
          mutations:
            record.data.type === 'mutation'
              ? currentCounts.mutations + 1
              : currentCounts.mutations,
          providers:
            record.data.type !== 'mutation'
              ? currentCounts.providers + 1
              : currentCounts.providers,
        }
      },
      {
        mutations: 0,
        providers: 0,
      }
    )
    return (
      <div className="mutations">
        <h3 className="mutations-title">
          <span className="mutations-stat-mutations">Mutations </span>:{' '}
          {counts.mutations}
          <span className="mutations-stat-divider">|</span>
          <span className="mutations-stat-providers">Providers </span>:{' '}
          {counts.providers}
          <div className="mutations-settingsContainer">
            <label>
              providers:{' '}
              <input
                type="checkbox"
                onChange={() => showProvidersInHistoryToggled()}
                checked={showProvidersInHistory}
              />
            </label>
          </div>
        </h3>
        <div className="list">
          {filteredHistory.map((record, index) => {
            const namePath = record.signalName.split('.')
            const name = namePath.pop()
            const colors = nameToColors(record.signalName, name)
            const hex = colors.backgroundColor
            const signalStyle = {
              backgroundColor: hex,
            }
            const isSearchHit =
              searchValue &&
              record.data.type === 'mutation' &&
              record.data.args[0].join('.').indexOf(searchValue) >= 0

            return (
              <li
                className={classnames('list-item', {
                  faded: searchValue && !isSearchHit,
                })}
                key={index}
              >
                <div className="list-indicator" style={signalStyle} />
                <div
                  className="signal-name"
                  onClick={() =>
                    signalClicked({ executionId: record.executionId })
                  }
                >
                  {record.signalName}
                </div>
                {record.data.type === 'mutation' ? (
                  <div className="list-content">
                    <Mutation
                      mutation={record.data}
                      onMutationClick={path => mutationClicked({ path })}
                      pathClicked={pathClicked}
                    />
                    {currentRememberedMutationIndex === index ? (
                      <button disabled className="timetravel-button active">
                        now
                      </button>
                    ) : (
                      <button
                        disabled={executingSignalsCount}
                        onClick={() => {
                          mutationDoubleClicked({ index })
                          connector.sendEvent(port, 'remember', index)
                        }}
                        className="timetravel-button"
                      >
                        travel
                      </button>
                    )}
                  </div>
                ) : (
                  <Service
                    showReturnValue
                    service={record.data}
                    pathClicked={pathClicked}
                  />
                )}
              </li>
            )
          })}
        </div>
      </div>
    )
  }
)
