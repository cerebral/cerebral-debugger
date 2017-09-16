function updateExpandedPaths ({ state, props }) {
  if (props.expanded) {
    state.push('debugger.expandedPaths', props.path.join('.'))
  } else {
    const expandedPaths = state.get('debugger.expandedPaths')
    const pathIndex = expandedPaths.indexOf(props.path.join('.'))
    expandedPaths.splice(pathIndex, 1)
    state.set('debugger.expandedPaths', expandedPaths)
  }
}

export default updateExpandedPaths
