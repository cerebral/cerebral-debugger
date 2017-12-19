function toggleProps ({ props, state }) {
  const expandPath = `debugger.signals.${props.executionId}.expandedProps.${props.action.functionIndex}`
  if (props.expanded) {
    state.set(expandPath, true)
  } else {
    state.unset(expandPath)
  }
}

export default toggleProps
