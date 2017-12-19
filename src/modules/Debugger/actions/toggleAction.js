function toggleAction ({ props, state }) {
  const expandPath = `debugger.signals.${props.executionId}.expandedActions.${props.action.functionIndex}`
  if (state.get(expandPath)) {
    state.unset(expandPath)
  } else {
    state.set(expandPath, true)
  }
}

export default toggleAction
