import {toggle} from 'cerebral/operators'
import {state} from 'cerebral/tags'
import storeOptions from '../../Storage/actions/storeOptions'

export default [
  toggle(state`storage.showFullPathNames`),
  storeOptions
]
