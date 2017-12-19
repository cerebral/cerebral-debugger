function toggleActions ({ props, state }) {
  const signalsKey = state.get(`debugger.signals.${props.executionId}`) ? 'signals' : 'executedBySignals'
  const expandedActions = state.get(`debugger.${signalsKey}.${props.executionId}.expandedActions`)

  if (Object.keys(expandedActions).length) {
    state.set(`debugger.${signalsKey}.${props.executionId}.expandedActions`, {})
  } else {
    const functionsRun = state.get(`debugger.${signalsKey}.${props.executionId}.functionsRun`)
    Object.keys(functionsRun).forEach((key) => {
      state.set(`debugger.${signalsKey}.${props.executionId}.expandedActions.${key}`, true)
    })
  }
}

export default toggleActions
