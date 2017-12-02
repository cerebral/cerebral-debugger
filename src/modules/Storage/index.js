import jsonStorage from 'electron-json-storage'
import initialized from './signals/initialized'

export default () => {
  return ({ controller }) => {
    controller.on('initialized', () => {
      controller.getSignal('storage.initialized')()
    })

    return {
      state: {
        showFullPathNames: false,
        showProps: true
      },
      signals: {
        initialized
      },
      provider(context) {
        context.storage = {
          get(key) {
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
          set(key, value) {
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
        }

        return context
      }
    }
  }
}
