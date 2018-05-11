import './styles.css'
import { Component } from 'inferno'

export default class StatePath extends Component {
  constructor() {
    super()
    this.state = {
      isCollapsed: true,
    }
  }
  toggleCollapse() {
    this.setState({
      isCollapsed: !this.state.isCollapsed,
    })
  }
  render() {
    const { statePath } = this.props
    return (
      <div className="statePath-item" onClick={() => this.toggleCollapse()}>
        <div className="statePath-itemDetails">
          <div className="statePath-pathName">{statePath.path}</div>
          <div className="statePath-watchers">
            <div
              className={`statePath-watcher ${
                statePath.watchers.views.length ? '' : 'disabled'
              }`}
            >
              <i className="icon icon-view" /> {statePath.watchers.views.length}
            </div>
            <div
              className={`statePath-watcher ${
                statePath.watchers.computeds.length ? '' : 'disabled'
              }`}
            >
              <i className="icon icon-computed" />{' '}
              {statePath.watchers.computeds.length}
            </div>
            <div
              className={`statePath-watcher ${
                statePath.watchers.reactions.length ? '' : 'disabled'
              }`}
            >
              <i className="icon icon-reaction" />{' '}
              {statePath.watchers.reactions.length}
            </div>
          </div>
          <div className="statePath-arrow">
            {this.state.isCollapsed ? (
              <i className="icon icon-down" />
            ) : (
              <i className="icon icon-up" />
            )}
          </div>
        </div>
        {this.state.isCollapsed ? null : (
          <div className="statePath-watchers-wrapper">
            {statePath.watchers.views.map((watcher, index) => (
              <div key={`views_${index}`} className="statePath-watchers-item">
                <i className="icon icon-view" /> {watcher.name}{' '}
                <span className="statePath-watchers-item-count">
                  <i className="icon icon-executedCount" />
                  {watcher.executedCount}
                </span>
              </div>
            ))}
            {statePath.watchers.computeds.map((watcher, index) => (
              <div
                key={`computeds_${index}`}
                className="statePath-watchers-item"
              >
                <i className="icon icon-computed" /> {watcher.name}
                <span className="statePath-watchers-item-count">
                  <i className="icon icon-executedCount" />
                  {watcher.executedCount}
                </span>
              </div>
            ))}
            {statePath.watchers.reactions.map((watcher, index) => (
              <div
                key={`reactions_${index}`}
                className="statePath-watchers-item"
              >
                <i className="icon icon-reaction" />
                {watcher.name}
                <span className="statePath-watchers-item-count">
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
