import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import Component from 'inferno-component' // eslint-disable-line
import { nameToColors } from '../../../../../common/utils'

class Sequence extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showName: false,
      namePosition: { x: 0, y: 0 }
    }
  }
  showSequenceName (event) {
    this.setState({
      showName: true,
      namePosition: {
        x: event.clientX - 20,
        y: event.clientY - 40
      }
    })
  }
  hideSequenceName () {
    this.setState({
      showName: false
    })
  }
  render () {
    // Alter style based on sequence name
    let containerStyle = null
    if (this.props.sequence.name) {
      containerStyle = {
        flexBasis: '30px',
        backgroundColor: nameToColors(this.props.sequence.name, this.props.sequence.name, 0.9, 0.2).backgroundColor,
        color: nameToColors(this.props.sequence.name, this.props.sequence.name).backgroundColor
      }
    } else {
      containerStyle = {
        flexBasis: '20px',
        backgroundColor: 'inherit',
        color: '#999'
      }
    }

    return (
      <div className='signal-sequence' onClick={(event) => event.stopPropagation()}>
        <div
          style={containerStyle}
          className='signal-sequenceNameContainer'
          onMouseEnter={(event) => this.showSequenceName(event)}
          onMouseLeave={() => this.hideSequenceName()}
        >
          <div
            ref={(node) => { this.name = node }}
            className='signal-sequenceName'
          >
            {this.props.sequence.name || this.props.sequence.type}
            {this.state.showName ? (
              <span
                className='signal-sequenceNameHorizontal'
                style={{ left: this.state.namePosition.x + 'px', top: this.state.namePosition.y + 'px' }}
              >
                {this.props.sequence.name || this.props.sequence.type}
              </span>
            ) : null}
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
