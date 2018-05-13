import './styles.css'
import { Component } from 'inferno'
import Tooltip from '../../Tooltip'

export default class Update extends Component {
  constructor() {
    super()
    this.state = {
      isCollapsed: true,
    }
  }
  getPerformanceIndication(duration) {
    if (duration < 2) {
      return <div className="performance performance-high" />
    } else if (duration < 5) {
      return <div className="performance performance-medium" />
    }

    return <div className="performance performance-low" />
  }
  getPerformanceMetric(duration) {
    return Math.round(duration) + 'ms'
  }
  toggleCollapsed() {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    })
  }
  render() {
    const { update } = this.props

    return (
      <div className="update-item" onClick={() => this.toggleCollapsed()}>
        <div className="update-itemDetails">
          <div className="update-performance">
            {this.getPerformanceIndication(update.duration)}
            {this.getPerformanceMetric(update.duration)}
          </div>
          <div className="update-pathName">
            <strong>{update.changes.length}</strong> changes
          </div>
          <div className="update-watchers">
            <div
              className={`update-watcher ${
                update.watchers.views.length ? '' : 'disabled'
              }`}
            >
              {update.watchers.views.length ? (
                <Tooltip text="Views affected by this update">
                  <i className="icon icon-view" />
                </Tooltip>
              ) : (
                <i className="icon icon-view" />
              )}{' '}
              {update.watchers.views.length}
            </div>
            <div
              className={`update-watcher ${
                update.watchers.computeds.length ? '' : 'disabled'
              }`}
            >
              {update.watchers.computeds.length ? (
                <Tooltip text="Computed affected by this update">
                  <i className="icon icon-computed" />
                </Tooltip>
              ) : (
                <i className="icon icon-computed" />
              )}{' '}
              {update.watchers.computeds.length}
            </div>
            <div
              className={`update-watcher ${
                update.watchers.reactions.length ? '' : 'disabled'
              }`}
            >
              {update.watchers.reactions.length ? (
                <Tooltip text="Reactions affected by this update">
                  <i className="icon icon-reaction" />
                </Tooltip>
              ) : (
                <i className="icon icon-reaction" />
              )}{' '}
              {update.watchers.reactions.length}
            </div>
          </div>
          <div className="update-arrow">
            {this.state.isCollapsed ? (
              <i className="icon icon-down" />
            ) : (
              <i className="icon icon-up" />
            )}
          </div>
        </div>
        {this.state.isCollapsed ? null : (
          <div className="update-watchers-wrapper">
            <div className="update-watchers-subTitle">changes</div>
            {update.changes.map(change => {
              return <div>{change.path.join('.')}</div>
            })}
            <div className="update-watchers-subTitle">watchers</div>
            {update.watchers.views.map((watcher, index) => (
              <div key={`views_${index}`} className="update-watchers-item">
                <i className="icon icon-view" /> {watcher.name}{' '}
                <span className="update-watchers-item-count">
                  <i className="icon icon-executedCount" />
                  {watcher.executedCount}
                </span>
              </div>
            ))}
            {update.watchers.computeds.map((watcher, index) => (
              <div key={`computeds_${index}`} className="update-watchers-item">
                <i className="icon icon-computed" /> {watcher.name}
                <span className="update-watchers-item-count">
                  <i className="icon icon-executedCount" />
                  {watcher.executedCount}
                </span>
              </div>
            ))}
            {update.watchers.reactions.map((watcher, index) => (
              <div key={`reactions_${index}`} className="update-watchers-item">
                <i className="icon icon-reaction" />
                {watcher.name}
                <span className="update-watchers-item-count">
                  <i className="icon icon-executedCount" />
                  {watcher.executedCount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}
