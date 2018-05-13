import './styles.css'
import { Component } from 'inferno'

class Tooltip extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showTooltip: false,
      tooltipPosition: { x: 0, y: 0 },
    }
  }
  showTooltip(event) {
    const breakPoint = window.innerWidth - 300
    let offset = -20
    if (event.clientX > breakPoint) {
      offset = breakPoint - event.clientX
    }
    this.setState({
      showTooltip: true,
      tooltipPosition: {
        x: event.clientX + offset,
        y: event.clientY - 45,
      },
    })
  }
  hideTooltip() {
    this.setState({
      showTooltip: false,
    })
  }
  render() {
    return (
      <span
        className="tooltip-container"
        onMouseEnter={event => this.showTooltip(event)}
        onMouseLeave={() => this.hideTooltip()}
      >
        {this.props.children}
        {this.state.showTooltip ? (
          <span
            className="tooltip"
            style={{
              left: this.state.tooltipPosition.x + 'px',
              top: this.state.tooltipPosition.y + 'px',
            }}
          >
            {this.props.text}
          </span>
        ) : null}
      </span>
    )
  }
}

export default Tooltip
