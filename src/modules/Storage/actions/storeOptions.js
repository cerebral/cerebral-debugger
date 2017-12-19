function storeOptions ({ storage, state }) {
  storage.set('options', state.get('storage'))
}

export default storeOptions
