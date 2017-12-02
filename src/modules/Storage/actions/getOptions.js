function getOptions ({ storage }) {
  return storage.get('options').then((data) => ({options: data}))
}

export default getOptions
