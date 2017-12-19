import pageChanged from './signals/pageChanged'
import signalClicked from './signals/signalClicked'
import payloadReceived from './signals/payloadReceived'
import modelChanged from './signals/modelChanged'
import mutationDoubleClicked from './signals/mutationDoubleClicked'
import mutationClicked from './signals/mutationClicked'
import resetClicked from './signals/resetClicked'
import modelClicked from './signals/modelClicked'
import searchValueChanged from './signals/searchValueChanged'
import escPressed from './signals/escPressed'
import addPortErrored from './signals/addPortErrored'
import pathClicked from './signals/pathClicked'
import toggleFullPathNamesClicked from './signals/toggleFullPathNamesClicked'
import actionToggled from './signals/actionToggled'
import propsToggled from './signals/propsToggled'
import actionsToggled from './signals/actionsToggled'
import showPropsToggled from './signals/showPropsToggled'

export default () => ({
  state: {
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
    expandedPaths: []
  },
  signals: {
    pageChanged,
    escPressed,
    searchValueChanged,
    signalClicked,
    payloadReceived,
    modelChanged,
    mutationDoubleClicked,
    mutationClicked,
    resetClicked,
    modelClicked,
    addPortErrored,
    pathClicked,
    toggleFullPathNamesClicked,
    actionToggled,
    propsToggled,
    actionsToggled,
    showPropsToggled
  }
})
