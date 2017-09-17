import {set, toggle} from 'cerebral/operators'
import {state} from 'cerebral/tags'

export default [
  toggle(state`debugger.showFullPathNames`)
]
