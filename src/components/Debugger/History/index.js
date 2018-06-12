import './styles.css'
import { connect } from '@cerebral/inferno'
import { state, signal } from 'cerebral/tags'
import classnames from 'classnames'
import { nameToColors } from '../../../common/utils'
import Mutation from '../Signals/Signal/Action/Mutation'
import Provider from '../Signals/Signal/Action/Provider'
import connector from 'connector'

function getWatcherIcon(record) {
  if (record.data.watcher.type === 'View') {
    return <i className="icon icon-view" />
  } else if (record.data.watcher.type === 'Compute') {
    return <i className="icon icon-computed" />
  } else if (record.data.watcher.type === 'Reaction') {
    return <i className="icon icon-computed" />
  }
  return null
}

export default connect(
  {
    port: state`config.port`,
    history: state`history`,
    watchUpdates: state`watchUpdates`,
    currentRememberedMutationIndex: state`currentRememberedMutationIndex`,
    searchValue: state`searchValue`,
    showProvidersInHistory: state`storage.showProvidersInHistory`,
    showActionNamesInHistory: state`storage.showActionNamesInHistory`,
    showStateEffectsInHistory: state`storage.showStateEffectsInHistory`,
    executingSignalsCount: state`executingSignalsCount`,
    showProvidersInHistoryToggled: signal`showProvidersInHistoryToggled`,
    showActionNamesInHistoryToggled: signal`showActionNamesInHistoryToggled`,
    showStateEffectsInHistoryToggled: signal`showStateEffectsInHistoryToggled`,
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
    showActionNamesInHistory,
    showStateEffectsInHistory,
    showProvidersInHistoryToggled,
    showActionNamesInHistoryToggled,
    showStateEffectsInHistoryToggled,
    mutationDoubleClicked,
    mutationClicked,
    signalClicked,
    pathClicked,
  }) {
    const filteredHistory = history
      .filter(
        record =>
          record.data.type === 'mutation' ||
          (showProvidersInHistory && record.data.type === 'provider') ||
          (showStateEffectsInHistory && record.data.type === 'watcher')
      )
      .sort((a, b) => {
        if (a.data.datetime < b.data.datetime) {
          return 1
        } else if (a.data.datetime > b.data.datetime) {
          return -1
        }

        return 0
      })

    const mutations = history.filter(record => record.data.type === 'mutation')
    const counts = history.reduce(
      (currentCounts, record) => {
        return {
          mutations:
            record.data.type === 'mutation'
              ? currentCounts.mutations + 1
              : currentCounts.mutations,
          providers:
            record.data.type === 'provider'
              ? currentCounts.providers + 1
              : currentCounts.providers,
          watchers:
            record.data.type === 'watcher'
              ? currentCounts.watchers + 1
              : currentCounts.watchers,
        }
      },
      {
        mutations: 0,
        providers: 0,
        watchers: 0,
      }
    )

    const getRecordComponent = record => {
      if (record.data.type === 'mutation') {
        return (
          <div className="list-content">
            <Mutation
              mutation={record.data}
              onMutationClick={path => mutationClicked({ path })}
              pathClicked={pathClicked}
            />
            {currentRememberedMutationIndex === mutations.indexOf(record) ? (
              <button disabled className="timetravel-button active">
                now
              </button>
            ) : (
              <button
                disabled={executingSignalsCount}
                onClick={() => {
                  const mutationIndex = mutations.indexOf(record)
                  mutationDoubleClicked({
                    index: mutationIndex,
                  })
                  connector.sendEvent(port, 'remember', mutationIndex)
                }}
                className="timetravel-button"
              >
                travel
              </button>
            )}
          </div>
        )
      } else if (record.data.type === 'provider') {
        return (
          <Provider
            showReturnValue
            service={record.data}
            pathClicked={pathClicked}
          />
        )
      } else if (record.data.type === 'watcher') {
        return <div className="watcher-name">{record.data.watcher.name}</div>
      }

      return null
    }

    return (
      <div className="mutations">
        <h3 className="mutations-title">
          <span className="mutations-stat-mutations">Mutations:</span>
          {` ${counts.mutations}`}
          <span className="mutations-stat-divider">|</span>
          <span className="mutations-stat-providers">Provider calls:</span>
          {`${counts.providers}`}
          <span className="mutations-stat-divider">|</span>
          <span className="mutations-stat-stateEffects">State effects:</span>
          {`${counts.watchers}`}
          <div className="mutations-settingsContainer">
            <label>
              action names:{' '}
              <input
                type="checkbox"
                onChange={() => showActionNamesInHistoryToggled()}
                checked={showActionNamesInHistory}
              />
            </label>
            <label>
              providers:{' '}
              <input
                type="checkbox"
                onChange={() => showProvidersInHistoryToggled()}
                checked={showProvidersInHistory}
              />
            </label>
            <label>
              state effects:{' '}
              <input
                type="checkbox"
                onChange={() => showStateEffectsInHistoryToggled()}
                checked={showStateEffectsInHistory}
              />
            </label>
          </div>
        </h3>
        <div className="list">
          {filteredHistory.map((record, index) => {
            if (
              record.data.type === 'mutation' ||
              record.data.type === 'provider'
            ) {
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
                  <div className="record-wrapper">
                    {showActionNamesInHistory ? (
                      <div className="action-name">{record.actionName}</div>
                    ) : null}
                    {getRecordComponent(record)}
                  </div>
                </li>
              )
            }

            return (
              <li
                className={classnames('list-item', {
                  faded: Boolean(searchValue),
                })}
                key={index}
              >
                <div className="watcher-type">
                  {getWatcherIcon(record)} {record.data.watcher.type}
                </div>
                <div className="record-wrapper">
                  {getRecordComponent(record)}
                </div>
              </li>
            )
          })}
        </div>
      </div>
    )
  }
)
