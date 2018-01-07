function createSignalTest ({ state }) {
  const currentExecutionId = state.get('debugger.currentSignalExecutionId');
  const signal = state.get(`debugger.signals.${currentExecutionId}`);
  const mutations = state.get('debugger.mutations');
  const filteredMutations = []

  console.log(signal);
  for (let index = 0; index < mutations.length; index++) {
    const mutation = mutations[index];

    if (mutation.executionId === signal.executionId) {
      break;
    }

    filteredMutations.push({
      method: mutation.data.method,
      args: mutation.data.args
    })
  }
  mutations.reverse().filter((mutation) => {
    console.log(mutation);
    return false
  })
  const mocks = Object.keys(signal.functionsRun)
    .sort()
    .reduce((mocks, functionRunKey) => {
      const operation = signal.functionsRun[functionRunKey]

      operation.data.forEach((data) => {
        if (data.type !== 'mutation') {
          mocks.push({
            method: data.method,
            args: data.args
          })
        }
      })

      return mocks;
    }, [])
  const test = `Snapshot(app)${
    filteredMutations.length ?
      `\n  ${
        filteredMutations.map(mutation => {
          return `.${mutation.method}("${mutation.args[0].join('.')}", ${mutation.args.slice(1).map(arg => JSON.stringify(arg)).join(', ')})`
        }).join('\n')
      }`
    :
      ''
  }${
    mocks.length ?
      `  \n  ${
        mocks.map(mock => {
          return `.mock(${JSON.stringify(mock.method)}, ${mock.returnValue})`
        }).join('\n')
      }`
    :
      ''
  }
  .run("${signal.name}", ${JSON.stringify(signal.functionsRun[0].payload)})
  .then(snapshot => {

  })
`
  const textarea = document.createElement('textarea')
  textarea.value = test;
  document.body.appendChild(textarea)
  textarea.select()
  const isSuccess = document.execCommand('copy');

  if (isSuccess) {
    alert('Test copied to clipboard!')
  }
}

export default createSignalTest
