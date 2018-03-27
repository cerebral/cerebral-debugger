import { Compute } from 'cerebral'
import { state } from 'cerebral/tags'

export default Compute(state`signals`, signals => {
  return Object.keys(signals)
    .filter(id => Boolean(signals[id].name))
    .sort((keyA, keyB) => {
      if (signals[keyA].datetime > signals[keyB].datetime) {
        return -1
      } else if (signals[keyA].datetime < signals[keyB].datetime) {
        return 1
      }

      return 0
    })
    .map(key => signals[key])
})
