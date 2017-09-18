import './styles.css'
import Inferno from 'inferno' // eslint-disable-line

import Inspector from '../../../../Inspector'

function Service ({service, pathClicked}) {
  const serviceNameStyle = {
    color: '#28a0aa'
  }

  return (
    <div className='service'>
      <span className='service-serviceName' style={serviceNameStyle}>{service.method}</span>
      <span className='service-serviceArgs'>
        {service.args.map((arg, index) => {
          return <Inspector key={index} value={arg} pathClicked={pathClicked} />
        })}
      </span>
    </div>
  )
}

export default Service
