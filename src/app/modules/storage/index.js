import { Module, Provider } from 'cerebral'
import jsonStorage from 'electron-json-storage'
import * as sequences from './sequences'

const storage = Provider({
  get (key) {
    return new Promise((resolve, reject) => {
      jsonStorage.get(key, (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
    })
  },
  set (key, value) {
    return new Promise((resolve, reject) => {
      jsonStorage.set(key, value, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
})

export default Module(({ controller }) => {
  controller.on('initialized', () => {
    controller.getSignal('storage.initialized')()
  })

  return {
    state: {
      showFullPathNames: false,
      showProps: true,
      showActions: false,
      showProviderReturnValue: false,
      showProvidersInHistory: false
    },
    signals: {
      initialized: sequences.initialize
    },
    providers: {
      storage
    }
  }
})
