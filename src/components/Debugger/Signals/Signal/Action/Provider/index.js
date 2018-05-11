import './styles.css'

import Inspector from '../../../../Inspector'

function Provider({ service, pathClicked, showReturnValue }) {
  const serviceNameStyle = {
    color: '#28a0aa',
  }

  return (
    <div className="service">
      <span className="service-serviceName" style={serviceNameStyle}>
        {service.method}
      </span>
      <span className="service-serviceArgs">
        {service.args.map((arg, index) => {
          return <Inspector key={index} value={arg} pathClicked={pathClicked} />
        })}
      </span>
      <span className="service-returnValue">
        {!showReturnValue || typeof service.returnValue === 'undefined'
          ? null
          : '=>'}
      </span>
      <span className="service-serviceArgs">
        {showReturnValue ? (
          <Inspector value={service.returnValue} pathClicked={pathClicked} />
        ) : null}
      </span>
    </div>
  )
}

export default Provider
