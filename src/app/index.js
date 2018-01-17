import { Module } from 'cerebral'
import UserAgent from '@cerebral/useragent'
import * as sequences from './sequences'
import storage from './modules/storage'

export default (config) => Module({
  modules: {
    storage,
    useragent: UserAgent({
      media: {
        small: '(max-width: 1270px)'
      }
    })
  },
  state: {
    config,
    settings: {},
    initialModel: null,
    executingSignalsCount: 0,
    model: {},
    currentPage: 'signals',
    lastMutationCount: 0,
    currentSignalExecutionId: null,
    currentRememberedMutationIndex: 0,
    signals: {},
    executedBySignals: {},
    mutations: [],
    expandedSignalGroups: [],
    currentMutationPath: null,
    componentsMap: {},
    renders: [],
    mutationsError: false,
    searchValue: '',
    searchComponentValue: '',
    expandedPaths: [],
    hasCreatedSignalTest: false
  },
  signals: {
    pageChanged: sequences.changePage,
    escPressed: sequences.emptySearchValue,
    searchValueChanged: sequences.changeSearchValue,
    searchComponentValueChanged: sequences.changeSearchComponentValue,
    signalClicked: sequences.setSignal,
    payloadReceived: sequences.handlePayload,
    modelChanged: sequences.updateModel,
    mutationDoubleClicked: sequences.remember,
    mutationClicked: sequences.setMutationPath,
    resetClicked: sequences.reset,
    modelClicked: sequences.resetMutationPath,
    addPortErrored: sequences.setError,
    pathClicked: sequences.updateExpandedPaths,
    toggleFullPathNamesClicked: sequences.toggleFullPathName,
    actionToggled: sequences.toggleAction,
    propsToggled: sequences.toggleProps,
    actionsToggled: sequences.toggleActions,
    showPropsToggled: sequences.toggleShowProps,
    createSignalTestClicked: sequences.createSignalTest
  }
})
