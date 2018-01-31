import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import Component from 'inferno-component' // eslint-disable-line
import { nameToColors } from '../../../../../common/utils'

function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
};

class Sequence extends Component {
  constructor (props) {
    super(props)
    this.toggleStickyName = this.toggleStickyName.bind(this)
    this.signalLeft = 0
    this.baseContainerStyle = {
      flexBasis: '20px'
    }
    this.state = { containerStyle: this.baseContainerStyle, nameStyle: {} }
  }
  componentDidMount () {
    const signalEl = document.querySelector('#signal')
    signalEl.addEventListener('scroll', debounce(this.toggleStickyName, 5))
    const bounds = signalEl.getBoundingClientRect()
    this.signalLeft = bounds.left
  }
  componentWillUnmount () {
    const signalEl = document.querySelector('#signal')
    signalEl.removeEventListener('scroll', this.toggleStickyName)
  }
  toggleStickyName (event) {
    if (!this.name) {
      return
    }

    const signalEl = event.target
    const nameBounds = {
      top: this.name.offsetTop,
      left: this.name.offsetLeft,
      height: this.name.offsetHeight,
      bottom: this.name.offsetTop + this.name.offsetHeight
    }
    const nameParentBounds = {
      top: this.name.parentNode.offsetTop,
      bottom: this.name.parentNode.offsetTop + this.name.parentNode.offsetHeight
    }

    let change = {
      type: 'default',
      containerStyle: Object.assign({}, this.baseContainerStyle),
      nameStyle: {}
    }

    if (nameBounds.top < signalEl.scrollTop) {
      change = {
        type: 'initialMoving',
        containerStyle: Object.assign({}, this.baseContainerStyle),
        nameStyle: {
          position: 'fixed',
          left: (nameBounds.left + this.signalLeft) + 'px',
          top: '122px'
        },
        originalNameTop: nameBounds.top,
        originalNameLeft: nameBounds.left,
        scrollTo: nameParentBounds.bottom - nameBounds.height - 5
      }
    }

    if (this.state.scrollTo > signalEl.scrollTop) {
      change = {
        type: 'moving',
        containerStyle: Object.assign({}, this.baseContainerStyle),
        nameStyle: {
          position: 'fixed',
          left: (this.state.originalNameLeft + this.signalLeft) + 'px',
          top: '122px'
        }
      }
    }

    if (signalEl.scrollTop > this.state.scrollTo) {
      change = {
        type: 'bottom',
        containerStyle: Object.assign({}, this.baseContainerStyle, {
          position: 'relative'
        }),
        nameStyle: {
          position: 'absolute',
          // If sequence has name, adjust for thicker width
          left: this.props.sequence.name ? '10px' : '5px',
          bottom: '5px'
        }
      }
    }

    if (this.state.originalNameTop > signalEl.scrollTop) {
      change = {
        type: 'default',
        containerStyle: Object.assign({}, this.baseContainerStyle),
        nameStyle: {}
      }
    }

    if (this.state.type !== change.type) {
      this.setState(change)
    }
  }
  render () {

    // Alter style based on sequence name
    const containerStyle = Object.assign({}, this.state.containerStyle)
    if (this.props.sequence.name) {
      Object.assign(containerStyle, {
        flexBasis: '30px',
        backgroundColor: nameToColors(this.props.sequence.name, this.props.sequence.name, 0.9, 0.2).backgroundColor,
        color: nameToColors(this.props.sequence.name, this.props.sequence.name).backgroundColor
      })
    }
    else {
      Object.assign(containerStyle, {
        flexBasis: '20px',
        backgroundColor: 'inherit',
        color: '#999'
      })
    }

    return (
      <div className='signal-sequence' onClick={(event) => event.stopPropagation()}>
        <div style={containerStyle} className='signal-sequenceNameContainer'>
          <div
            ref={(node) => { this.name = node }}
            className='signal-sequenceName'
            style={this.state.nameStyle}
          >
            {this.props.sequence.name || this.props.sequence.type}
            <span className='signal-sequenceNameHorizontal'>
              {this.props.sequence.name || this.props.sequence.type}
            </span>
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
