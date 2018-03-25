/* eslint-disable no-multi-spaces */

import computedSignalsList from '../common/computed/signalsList'

export function updateRenders ({ props, state }) {
  if (props.data.render.components.length) {
    state.unshift('renders', props.data.render)
    if (state.get('renders').length > 20) {
      state.pop('renders')
    }
  }
}

export function storeOptions ({ storage, state }) {
  storage.set('options', state.get('storage'))
}

export function updateSignalPath ({props, state}) {
  const execution = props.data.execution
  const signalPath = state.get(`executedBySignals.${execution.executionId}`) ? (
      `executedBySignals.${execution.executionId}`
    ) : (
      `signals.${execution.executionId}`
    )

  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.path`, execution.path)
}

export function updateSignal ({props, state}) {
  const execution = props.data.execution
  const signalPath = state.get(`executedBySignals.${execution.executionId}`) ? (
      `executedBySignals.${execution.executionId}`
    ) : (
      `signals.${execution.executionId}`
    )

  const signal = state.get(signalPath)

  if (signal.functionsRun[execution.functionIndex]) {
    state.push(`${signalPath}.functionsRun.${execution.functionIndex}.data`, execution.data)
  } else {
    state.merge(`${signalPath}.functionsRun.${execution.functionIndex}`, {
      payload: execution.payload,
      data: execution.data ? [execution.data] : [],
      executedIds: []
    })
  }
  if (execution.data) {
    state.unshift('history', {
      executionId: execution.executionId,
      signalName: signal.name,
      data: execution.data
    })
  }
}

export function updateModel ({props, state}) {
  state.set(['model'].concat(props.path).join('.'), props.value)
}

export function updateExpandedPaths ({ state, props }) {
  if (props.expanded) {
    state.push('expandedPaths', props.path.join('.'))
  } else {
    const expandedPaths = state.get('expandedPaths')
    const pathIndex = expandedPaths.indexOf(props.path.join('.'))
    expandedPaths.splice(pathIndex, 1)
    state.set('expandedPaths', expandedPaths)
  }
}

export function toggleAction ({ props, state }) {
  const expandPath = `signals.${props.executionId}.expandedActions.${props.action.functionIndex}`
  if (state.get(expandPath)) {
    state.unset(expandPath)
  } else {
    state.set(expandPath, true)
  }
}

export function toggleProps ({ props, state }) {
  const expandPath = `signals.${props.executionId}.expandedProps.${props.action.functionIndex}`
  if (props.expanded) {
    state.set(expandPath, true)
  } else {
    state.unset(expandPath)
  }
}

export function updateActionOutput ({props, state}) {
  const execution = props.data.execution
  const signalPath = state.get(`executedBySignals.${execution.executionId}`) ? (
      `executedBySignals.${execution.executionId}`
    ) : (
      `signals.${execution.executionId}`
    )

  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.output`, execution.output)
}

export function updateActionError ({props, state}) {
  const execution = props.data.execution
  const signalPath = state.get(`executedBySignals.${execution.executionId}`) ? (
      `executedBySignals.${execution.executionId}`
    ) : (
      `signals.${execution.executionId}`
    )

  state.set(`${signalPath}.isExecuting`, false)
  state.set(`${signalPath}.hasError`, true)
  state.set(`${signalPath}.functionsRun.${execution.functionIndex}.error`, execution.error)
}

export function showHideAllActions ({props, state}) {
  const showActions = state.get('storage.showActions')

  const currentSignalExecutionId = state.get('currentSignalExecutionId')
  const signalsKey = state.get(`signals.${currentSignalExecutionId}`) ? 'signals' : 'executedBySignals'

  if (!showActions) {
    state.set(`${signalsKey}.${currentSignalExecutionId}.expandedActions`, {})
  } else {
    const functionsRun = state.get(`${signalsKey}.${currentSignalExecutionId}.functionsRun`)
    Object.keys(functionsRun).forEach((key) => {
      state.set(`${signalsKey}.${currentSignalExecutionId}.expandedActions.${key}`, true)
    })
  }
}

export function runRecordedMutation ({props, state}) {
  const args = props.data.args
  const path = ['model'].concat(props.data.path).join('.')

  state.set(path, ...args)
}

export function setInitialPayload ({props, state}) {
  if (props.source === 'c') {
    state.set('initialModel', props.data.initialModel)
    state.set('model', props.data.initialModel)
  }
}

export function setCurrentExecutionId ({props, state}) {
  const expandedSignalGroups = state.get('expandedSignalGroups')
  const currentSignalExecutionId = state.get('currentSignalExecutionId')

  state.set('currentSignalExecutionId', props.executionId)

  if (currentSignalExecutionId !== props.executionId) {
    return
  }

  if (props.groupId && expandedSignalGroups.indexOf(props.groupId) === -1) {
    state.push('expandedSignalGroups', props.groupId)
  } else if (props.groupId) {
    state.splice('expandedSignalGroups', expandedSignalGroups.indexOf(props.groupId), 1)
  }
}

export function runMutation ({props, state}) {
  const execution = props.data.execution
  const data = execution.data

  if (data && data.type === 'mutation') {
    try {
      const args = data.args.slice()
      const method = data.method.split('.').pop()
      const path = ['model'].concat(args.shift()).join('.')

      state[method](path, ...JSON.parse(JSON.stringify(args)))
    } catch (e) {
      state.set('mutationsError', {
        signalName: execution.name,
        mutation: data
      })
    }
  }
}

export function clean ({props, state}) {
  const debuggerType = state.get('config.type')
  const messageSource = props.source

  if (
        (debuggerType === 'c' && messageSource === 'c') ||
        (debuggerType === 'ft' && messageSource === 'ft') ||
        (debuggerType === 'cft' && messageSource === 'c')
    ) {
    state.set('signals', {})
    state.set('mutationsError', false)
    state.set('mutations', [])
    state.set('renders', [])
    state.set('currentRememberedMutationIndex', 0)
    state.set('executingSignalsCount', 0)
    state.set('executedBySignals', {})
  }
}

export function parseAndRunMessages ({props, state, controller}) {
  state.set('isCatchingUp', true)
  props.data.messages.forEach(function (message) {
    controller.getSignal('payloadReceived')(JSON.parse(message))
  })
  state.set('isCatchingUp', false)
}

export function remember ({props, state}) {
  state.set('model', state.get('initialModel'))
  state.set('currentRememberedMutationIndex', props.index)
  const mutations = state.get('history').filter(record => record.data.type === 'mutation')
  let lastMutationIndex = props.index

  for (let x = mutations.length - 1; x >= lastMutationIndex; x--) {
    const mutation = mutations[x].data
    const args = mutation.args.slice()
    const path = args.shift()

    state[mutation.method](['model', ...path].join('.'), ...args)
  }
}

export function reset ({state}) {
  state.merge({
    isExecuting: false,
    currentPage: 'signals',
    lastMutationCount: 0,
    executingSignalsCount: 0,
    currentSignalExecutionId: null,
    currentRememberedSignalExecutionId: null,
    expandedSignalGroups: [],
    currentMutationPath: null,
    mutationsError: false
  })
    // Do update correctly
  state.set('signals', {})
  state.set('history', [])
  state.set('model', state.get('initialModel'))
}

export function endSignalExecution ({props, state}) {
  const type = state.get('config.type')
  const execution = props.data.execution
  const signalPath = state.get(`executedBySignals.${execution.executionId}`) ? (
      `executedBySignals.${execution.executionId}`
    ) : (
      `signals.${execution.executionId}`
    )

  state.set(`${signalPath}.isExecuting`, false)
  if (
      (props.source === 'c' && (type === 'c' || type === 'cft')) ||
      (props.source === 'ft' && type === 'ft')
    ) {
    state.set('executingSignalsCount', state.get('executingSignalsCount') - 1)
  }
}

export function createSignalTest ({ state }) {
  const currentExecutionId = state.get('currentSignalExecutionId')
  const signal = state.get(`signals.${currentExecutionId}`)
  const mutations = state.get('history').filter(record => record.data.type === 'mutation').reverse()
  const filteredMutations = []

  for (let index = 0; index < mutations.length; index++) {
    const mutation = mutations[index]

    if (mutation.executionId === signal.executionId) {
      break
    }

    filteredMutations.push({
      method: mutation.data.method,
      args: mutation.data.args
    })
  }

  const mocks = Object.keys(signal.functionsRun)
      .sort()
      .reduce((mocks, functionRunKey) => {
        const operation = signal.functionsRun[functionRunKey]

        operation.data.forEach((data) => {
          if (data.type !== 'mutation') {
            mocks.push({
              method: data.method,
              args: data.args,
              returnValue: data.returnValue,
              isPromise: data.isPromise,
              isRejected: data.isRejected
            })
          }
        })

        return mocks
      }, [])

  const test = `return Snapshot(app)${
      filteredMutations.length
        ? `\n  ${
          filteredMutations.map(mutation => {
            return `.mutate("${mutation.method}", "${mutation.args[0].join('.')}", ${mutation.args.slice(1).map(arg => JSON.stringify(arg)).join(', ')})`
          }).join('\n  ')
        }`
      : ''
    }${
      mocks.length
        ? `  \n            ${
          mocks.map(mock => {
            if (mock.isPromise) {
              return `.${mock.isRejected ? 'mockRejectedPromise' : 'mockResolvedPromise'}(${JSON.stringify(mock.method)}, ${JSON.stringify(mock.returnValue)}${mock.isRejected ? `, ${JSON.stringify(false)}` : ''})`
            } else {
              return `.mock(${JSON.stringify(mock.method)}, ${JSON.stringify(mock.returnValue)})`
            }
          }).join('\n  ')
        }`
      : ''
    }
  .run("${signal.name}", ${JSON.stringify(signal.functionsRun[0].payload)})
  .then(snapshot => {

  })
  `
  const textarea = document.createElement('textarea')
  textarea.value = test
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function addSignal ({props, state, resolve}) {
  const signalsList = resolve.value(computedSignalsList)
  const execution = props.data.execution
  const prevSignal = signalsList[signalsList.length - 1]
  const newSignal = {
    name: execution.name || String(execution.executionId),
    executionId: execution.executionId,
    source: props.source,
    isExecuting: true,
    datetime: execution.datetime,
    staticTree: execution.staticTree,
    groupId: prevSignal && prevSignal.name === execution.name ? prevSignal.groupId : execution.name,
    functionsRun: {},
    executedBy: execution.executedBy || null,
    expandedProps: {},
    expandedActions: {}
  }

  if (newSignal.executedBy && (state.get(`signals.${newSignal.executedBy.id}`) || state.get(`executedBySignals.${newSignal.executedBy.id}`))) {
    const executedByPath = state.get(`signals.${newSignal.executedBy.id}`) ? `signals.${newSignal.executedBy.id}` : `executedBySignals.${newSignal.executedBy.id}`

    state.set(`executedBySignals.${execution.executionId}`, newSignal)
    state.push(`${executedByPath}.functionsRun.${newSignal.executedBy.functionIndex}.executedIds`, execution.executionId)
  } else {
    state.set(`signals.${execution.executionId}`, newSignal)
    state.set('executingSignalsCount', state.get('executingSignalsCount') + 1)

    const currentSignalExecutionId = state.get('currentSignalExecutionId')
    if (!signalsList.length || currentSignalExecutionId === signalsList[0].executionId) {
      state.set('currentSignalExecutionId', execution.executionId)
    }
  }
}
