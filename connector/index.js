import {ipcRenderer} from 'electron'

const addedPorts = []

const connector = {
  sendEvent (port, eventName, payload = null) {
    ipcRenderer.send('message', {
      port,
      type: eventName,
      data: payload
    })
  },
  addPort (config, eventCallback) {
    if (addedPorts.indexOf(config.port) >= 0) {
      return
    }

    addedPorts.push(config.port)
    ipcRenderer.on('port:added', function onPortAdded (event, addedPort) {
      if (addedPort === config.port) {
        ipcRenderer.on('message', (event, message) => {
          if (message.port !== config.port) {
            return
          }

          if (message.type === 'ping') {
            connector.sendEvent(config.port, 'pong')
            return
          }

          eventCallback(message)
        })
        connector.sendEvent(config.port, 'ping')
      }
    })
    ipcRenderer.on('port:exists', function onPortExists () {
      eventCallback(new Error('Something running on this port already'))
    })
    ipcRenderer.send('port:add', config)
  },
  onPortFocus (cb) {
    ipcRenderer.on('port:focus', function onPortAdded (event, port) {
      cb(port)
    })
  },
  removePort (port) {
    ipcRenderer.send('port:remove', port)
  }
}

export default connector
