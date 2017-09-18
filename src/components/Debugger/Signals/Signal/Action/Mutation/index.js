import './styles.css'
import Inferno from 'inferno' // eslint-disable-line

import Inspector from '../../../../Inspector'

const colors = {
  set: '#dc6428',
  import: '',
  unset: '#872841',
  push: '#004b87',
  splice: '#eb1e64',
  merge: '#007355',
  concat: '#1eaa6e',
  pop: '#872841',
  shift: '#4b2332',
  unshift: '#28a0aa'
}

function Mutation ({mutation, onMutationClick, pathClicked}) {
  const mutationNameStyle = {
    color: colors[mutation.method]
  }
  const args = mutation.args.slice(1)

  return (
    <div className='mutation'>
      <span className='mutation-mutationName' style={mutationNameStyle}>{mutation.method}</span>
      <span className='mutation-mutationPath' onClick={() => onMutationClick(mutation.args[0])}>{mutation.args[0].join('.')}</span>
      <span className='mutation-mutationArgs'>
        {args.map((arg, index) => {
          return <Inspector key={index} value={arg} pathClicked={pathClicked} />
        })}
      </span>
    </div>
  )
}

export default Mutation
