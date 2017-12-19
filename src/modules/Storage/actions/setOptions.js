function setOptions ({ props, state }) {
  state.merge('storage', Object.assign({
    showFullPathNames: false,
    showProps: true
  }, props.options))
}

export default setOptions
