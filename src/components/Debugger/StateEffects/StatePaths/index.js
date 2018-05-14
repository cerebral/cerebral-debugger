import './styles.css'
import StatePath from './StatePath'

export default function StatePaths(props) {
  const allWatchers = Object.keys(props.map).reduce((watchers, stateKey) => {
    const statePathWatchers = props.map[stateKey]

    return statePathWatchers.reduce((allWatchers, watcher) => {
      allWatchers[watcher.id] = watcher

      return allWatchers
    }, watchers)
  }, {})
  const paths = Object.keys(props.map)
    .map(key => {
      return {
        path: `state.${key}`,
        watchers: props.map[key].reduce(
          (currentWatchers, watcher) => {
            if (watcher.type === 'View') {
              currentWatchers.views.push(watcher)
            } else if (watcher.type === 'Computed') {
              currentWatchers.computeds.push(watcher)
            } else if (watcher.type === 'Reaction') {
              currentWatchers.reactions.push(watcher)
            }

            return currentWatchers
          },
          {
            computeds: [],
            views: [],
            reactions: [],
          }
        ),
      }
    })
    .concat(
      Object.keys(props.computedMap).map(key => {
        return {
          path: `computed.${key}`,
          watchers: props.computedMap[key].reduce(
            (currentWatchers, watcher) => {
              if (watcher.type === 'View') {
                currentWatchers.views.push(watcher)
              } else if (watcher.type === 'Computed') {
                currentWatchers.computeds.push(watcher)
              } else if (watcher.type === 'Reaction') {
                currentWatchers.reactions.push(watcher)
              }

              return currentWatchers
            },
            {
              computeds: [],
              views: [],
              reactions: [],
            }
          ),
        }
      })
    )
    .sort((a, b) => {
      const aTotalCount =
        a.watchers.computeds.length +
        a.watchers.reactions.length +
        a.watchers.views.length
      const bTotalCount =
        b.watchers.computeds.length +
        b.watchers.reactions.length +
        b.watchers.views.length

      if (aTotalCount > bTotalCount) {
        return -1
      } else if (aTotalCount < bTotalCount) {
        return 1
      }
      return 0
    })

  return (
    <div className="statePaths-wrapper">
      <div className="statePaths-componentsWrapper">
        <div key="header" className="statePaths-itemHeader">
          <div className="statePaths-pathName">
            {paths.length} <small>watched</small>
          </div>
          <div className="statePaths-watchers">
            <span>
              {Object.keys(allWatchers).length} <small>watching</small>
            </span>
          </div>
        </div>
        {paths.map(statePath => {
          return <StatePath key={statePath.path} statePath={statePath} />
        })}
      </div>
    </div>
  )
}
