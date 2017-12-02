import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import Component from 'inferno-component' // eslint-disable-line

class Sequence extends Component {
  constructor(props) {
    super(props)
    this.toggleStickyName = this.toggleStickyName.bind(this)
    this.state = { containerStyle: null, nameStyle: null }
    this.signalLeft = 0
  }
  componentDidMount() {
    const signalEl = document.querySelector('#signal')
    signalEl.addEventListener('scroll', this.toggleStickyName)
    const bounds = signalEl.getBoundingClientRect()
    this.signalLeft = bounds.left
  }
  componentWillUnmount() {
    const signalEl = document.querySelector('#signal')
    signalEl.removeEventListener('scroll', this.toggleStickyName)
  }
  toggleStickyName(event) {
    const signalEl = event.target;
    const nameBounds = {
      top: this.name.offsetTop,
      left: this.name.offsetLeft,
      height: this.name.offsetHeight,
      bottom: this.name.offsetTop + this.name.offsetHeight
    }
    const nameParentBounds = {
      top: this.name.parentNode.offsetTop,
      bottom: this.name.parentNode.offsetTop + this.name.parentNode.offsetHeight,
    }

    if (!this.state.containerStyle && this.state.nameStyle && signalEl.scrollTop > this.state.scrollTo) {
      this.setState({
        containerStyle: {
          position: 'relative'
        },
        nameStyle: {
          position: 'absolute',
          left: '10px',
          bottom: '5px'
        }
      })
    } else if (nameBounds.top < signalEl.scrollTop && !this.state.nameStyle) {
      this.setState({
        containerStyle: null,
        nameStyle: {
          position: 'fixed',
          left: (nameBounds.left + this.signalLeft) + 'px',
          top: '122px'
        },
        originalNameTop: nameBounds.top,
        originalNameLeft: nameBounds.left,
        scrollTo: nameParentBounds.bottom - nameBounds.height - 5
      })
    } else if (this.state.scrollTo > signalEl.scrollTop && this.state.nameStyle && this.state.containerStyle) {
      this.setState({
        containerStyle: null,
        nameStyle: {
          position: 'fixed',
          left: (this.state.originalNameLeft + this.signalLeft) + 'px',
          top: '122px'
        }
      })
    } else if (this.state.nameStyle && !this.state.containerStyle && this.state.originalNameTop > signalEl.scrollTop) {
      this.setState({containerStyle: null, nameStyle: null})
    }
  }
  render () {
    return (
      <div className='signal-sequence' onClick={(event) => event.stopPropagation()}>
        <div style={this.state.containerStyle} className='signal-sequenceNameContainer'>
          <div
            ref={(node) => this.name = node}
            className='signal-sequenceName'
            style={this.state.nameStyle}
          >
            {this.props.sequence.name || this.props.sequence.type}
          </div>
        </div>
        <div className='signal-sequenceContainer'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Sequence
