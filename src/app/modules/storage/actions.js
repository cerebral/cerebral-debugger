export function getOptions({ storage }) {
  return storage.get('options').then(data => ({ options: data }))
}

export function setOptions({ props, state }) {
  state.merge(
    'storage',
    Object.assign(
      {
        showFullPathNames: false,
        showProps: true,
      },
      props.options
    )
  )
}
