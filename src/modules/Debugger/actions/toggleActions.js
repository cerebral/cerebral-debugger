function toggleActions ({ state }) {
  const executionId = state.get('debugger.currentSignalExecutionId')
  const expandedActions = state.get(`debugger.signals.${executionId}.expandedActions`)

  if (Object.keys(expandedActions).length) {
    state.set(`debugger.signals.${executionId}.expandedActions`, {})
  } else {
    const functionsRun = state.get(`debugger.signals.${executionId}.functionsRun`)
    Object.keys(functionsRun).forEach((key) => {
      state.set(`debugger.signals.${executionId}.expandedActions.${key}`, true)
    })
  }
}

export default toggleActions
