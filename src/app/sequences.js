import { equals, set, toggle, wait } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'

import * as actions from './actions'

export const toggleAction = actions.toggleAction

export const setError = set(state`error`, props`error`)

export const createSignalTest = [
  actions.createSignalTest,
  set(state`hasCreatedSignalTest`, true),
  wait(2000),
  set(state`hasCreatedSignalTest`, false),
]

export const emptySearchValue = set(state`searchValue`, '')

export const updateModel = actions.updateModel

export const resetMutationPath = set(state`currentMutationPath`, null)

export const setMutationPath = [
  set(state`currentPage`, 'model'),
  set(state`currentMutationPath`, props`path`),
]

export const remember = actions.remember

export const changePage = set(state`currentPage`, props`page`)

export const updateExpandedPaths = actions.updateExpandedPaths

export const handlePayload = [
  equals(props`type`),
  {
    init: [actions.clean, actions.setInitialPayload, actions.setComputedState],
    reinit: [actions.setInitialPayload, actions.setComputedState],
    bulk: [actions.clean, actions.parseAndRunMessages],
    executionStart: actions.addSignal,
    execution: [actions.updateSignal, actions.runMutation],
    executionFunctionEnd: actions.updateActionOutput,
    executionPathStart: actions.updateSignalPath,
    executionEnd: actions.endSignalExecution,
    executionFunctionError: actions.updateActionError,
    watchMap: [
      set(state`watchMap`, props`data.watchMap`),
      set(state`computedMap`, props`data.computedMap`),
      actions.updateWatchUpdates,
      actions.addWatchersToHistory,
    ],
    recorderMutation: actions.runRecordedMutation,
    computedUpdate: actions.setComputedStateUpdate,
    otherwise: [],
  },
]

export const toggleProps = actions.toggleProps

export const reset = actions.reset

export const changeSearchValue = set(state`searchValue`, props`value`)

export const changeSearchComponentValue = set(
  state`searchComponentValue`,
  props`value`
)

export const toggleShowActions = [
  toggle(state`storage.showActions`),
  actions.storeOptions,
]

export const toggleShowActionNamesInHistory = [
  toggle(state`storage.showActionNamesInHistory`),
  actions.storeOptions,
]

export const toggleShowStateEffectsInHistory = [
  toggle(state`storage.showStateEffectsInHistory`),
  actions.storeOptions,
]

export const toggleShowOperatorName = [
  toggle(state`storage.showOperatorName`),
  actions.storeOptions,
]

export const toggleShowProviderReturnValue = [
  toggle(state`storage.showProviderReturnValue`),
  actions.storeOptions,
]

export const toggleProvidersInHistory = [
  toggle(state`storage.showProvidersInHistory`),
  actions.storeOptions,
]

export const toggleShowProps = [
  toggle(state`storage.showProps`),
  actions.storeOptions,
]

export const setSignal = [
  set(state`currentPage`, 'signals'),
  actions.setCurrentExecutionId,
]

export const toggleFullPathName = [
  toggle(state`storage.showFullPathNames`),
  actions.storeOptions,
]
