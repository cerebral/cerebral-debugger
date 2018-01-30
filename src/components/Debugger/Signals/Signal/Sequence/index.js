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
    this.baseNameStyle = {}
    if (this.props.sequence.name) {
      this.baseContainerStyle.flexBasis = '30px'
      this.baseContainerStyle.backgroundColor = nameToColors(this.props.sequence.name, this.props.sequence.name, 0.9, 0.2).backgroundColor
      this.baseContainerStyle.color = nameToColors(this.props.sequence.name, this.props.sequence.name).backgroundColor
    }
    this.state = { containerStyle: this.baseContainerStyle, nameStyle: this.baseNameStyle }
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
      nameStyle: Object.assign({}, this.baseNameStyle)
    }

    if (nameBounds.top < signalEl.scrollTop) {
      change = {
        type: 'initialMoving',
        containerStyle: Object.assign({}, this.baseContainerStyle),
        nameStyle: Object.assign({}, this.baseNameStyle, {
          position: 'fixed',
          left: (nameBounds.left + this.signalLeft) + 'px',
          top: '122px'
        }),
        originalNameTop: nameBounds.top,
        originalNameLeft: nameBounds.left,
        scrollTo: nameParentBounds.bottom - nameBounds.height - 5
      }
    }

    if (this.state.scrollTo > signalEl.scrollTop) {
      change = {
        type: 'moving',
        containerStyle: Object.assign({}, this.baseContainerStyle),
        nameStyle: Object.assign({}, this.baseNameStyle, {
          position: 'fixed',
          left: (this.state.originalNameLeft + this.signalLeft) + 'px',
          top: '122px'
        })
      }
    }

    if (signalEl.scrollTop > this.state.scrollTo) {
      change = {
        type: 'bottom',
        containerStyle: Object.assign({}, this.baseContainerStyle, {
          position: 'relative'
        }),
        nameStyle: Object.assign({}, this.baseNameStyle, {
          position: 'absolute',
          left: this.props.sequence.name ? '10px' : '5px',
          bottom: '5px'
        })
      }
    }

    if (this.state.originalNameTop > signalEl.scrollTop) {
      change = {
        type: 'default',
        containerStyle: Object.assign({}, this.baseContainerStyle),
        nameStyle: Object.assign({}, this.baseNameStyle)
      }
    }

    if (this.state.type !== change.type) {
      this.setState(change)
    }
  }
  render () {
    return (
      <div className='signal-sequence' onClick={(event) => event.stopPropagation()}>
        <div style={this.state.containerStyle} className='signal-sequenceNameContainer'>
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
