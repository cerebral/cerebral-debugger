import './styles.css'
import Update from './Update'

export default function Updates(props) {
  const updatesWithWatchers = props.updates.map(update => {
    return Object.assign({}, update, {
      watchers: update.watchers.reduce(
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
    })
  })

  return (
    <div className="updates-wrapper">
      <div className="updates-componentsWrapper">
        <div key="header" className="updates-itemHeader">
          <div className="updates-pathName">
            {props.updates.length} <small>updates</small>
          </div>
        </div>
        {updatesWithWatchers.map((update, index) => {
          return <Update key={index} update={update} />
        })}
      </div>
    </div>
  )
}
