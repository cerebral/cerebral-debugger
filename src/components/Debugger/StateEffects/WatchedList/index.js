import './styles.css'
import Watched from './Watched'

export default function WatchedList(props) {
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
        path: key,
        watchers: props.map[key].reduce(
          (currentWatchers, watcher) => {
            if (watcher.type === 'View') {
              currentWatchers.views.push(watcher)
            } else if (watcher.type === 'Compute') {
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
          path: key,
          watchers: props.computedMap[key].reduce(
            (currentWatchers, watcher) => {
              if (watcher.type === 'View') {
                currentWatchers.views.push(watcher)
              } else if (watcher.type === 'Compute') {
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
      if (a.path > b.path) {
        return 1
      } else if (a.path < b.path) {
        return -1
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
          return <Watched key={statePath.path} statePath={statePath} />
        })}
      </div>
    </div>
  )
}
