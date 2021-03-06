import './styles.css'
import { connect } from '@cerebral/inferno'
import { state, signal } from 'cerebral/tags'
import classnames from 'classnames'
import { nameToColors } from '../../../common/utils'
import Mutation from '../Signals/Signal/Action/Mutation'
import connector from 'connector'

export default connect(
  {
    port: state`config.port`,
    mutations: state`mutations`,
    currentRememberedMutationIndex: state`currentRememberedMutationIndex`,
    searchValue: state`searchValue`,
    executingSignalsCount: state`executingSignalsCount`,
    mutationDoubleClicked: signal`mutationDoubleClicked`,
    mutationClicked: signal`mutationClicked`,
    signalClicked: signal`signalClicked`,
    pathClicked: signal`pathClicked`,
  },
  function Mutations({
    port,
    mutations,
    currentRememberedMutationIndex,
    searchValue,
    executingSignalsCount,
    mutationDoubleClicked,
    mutationClicked,
    signalClicked,
    pathClicked,
  }) {
    return (
      <div className="mutations">
        <div className="list">
          {mutations.map((mutation, index) => {
            const namePath = mutation.signalName.split('.')
            const name = namePath.pop()
            const colors = nameToColors(mutation.signalName, name)
            const hex = colors.backgroundColor
            const signalStyle = {
              backgroundColor: hex,
            }
            const isSearchHit =
              searchValue &&
              mutation.data.args[0].join('.').indexOf(searchValue) >= 0

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
                    signalClicked({ executionId: mutation.executionId })
                  }
                >
                  {mutation.signalName}
                </div>
                <Mutation
                  mutation={mutation.data}
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
              </li>
            )
          })}
        </div>
      </div>
    )
  }
)
