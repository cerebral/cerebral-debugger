import './styles.css'

import Inspector from '../../../../Inspector'

function Mutation({ mutation, onMutationClick, pathClicked }) {
  const mutationNameStyle = {
    color: '#dc6428',
  }
  const args = mutation.args.slice(1)

  return (
    <div className="mutation">
      <span className="mutation-mutationName" style={mutationNameStyle}>
        {mutation.method}
      </span>
      <span
        className="mutation-mutationPath"
        onClick={() => onMutationClick(mutation.args[0])}
      >
        {mutation.args[0].join('.')}
      </span>
      <span className="mutation-mutationArgs">
        {args.map((arg, index) => {
          return <Inspector key={index} value={arg} pathClicked={pathClicked} />
        })}
      </span>
    </div>
  )
}

export default Mutation
