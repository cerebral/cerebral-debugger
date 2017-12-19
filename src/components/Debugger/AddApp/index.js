import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import Component from 'inferno-component' // eslint-disable-line
import {shell} from 'electron'
import connector from 'connector'
import path from 'path'

class AddApp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      port: '',
      name: '',
      type: 'c',
      ssl: null,
      error: null
    }
  }
  onPortChange (port) {
    this.setState({
      port,
      error: null
    })
  }
  onNameChange (name) {
    this.setState({
      name,
      error: null
    })
  }
  onTypeChange (type) {
    this.setState({
      type
    })
  }
  addPort () {
    const isAdded = this.props.addPort({
      type: this.state.type,
      name: this.state.name,
      port: this.state.port,
      ssl: this.state.ssl
    })

    if (isAdded && this.state.ssl) {
      alert('When adding SSL the debugger needs to restart') // eslint-disable-line
      connector.relaunch()
    }

    if (!isAdded) {
      this.setState({
        error: 'Port in use'
      })
    }
  }
  openDocs () {
    shell.openExternal('https://cerebraljs.com/docs/introduction/debugger.html')
  }
  openSsl () {
    shell.openExternal('https://github.com/christianalfoni/create-ssl-certificate')
  }
  onDrop (event) {
    event.preventDefault()
    const sslFiles = Array.prototype.reduce.call(event.dataTransfer.files, (files, file) => {
      if (path.extname(file.name) === '.crt') {
        files.cert = file
      } else if (path.extname(file.name) === '.key') {
        files.key = file
      } else {
        alert(`Sorry, ${file.name} is not a valid file`) // eslint-disable-line
      }

      return files
    }, {})

    const fileTypes = Object.keys(sslFiles)

    Promise.all(fileTypes.map((fileType) => {
      return this.readFile(sslFiles[fileType])
    }))
      .then((results) => {
        const ssl = Object.assign(this.state.ssl || {}, results.reduce((sslUpdate, result, index) => {
          sslUpdate[fileTypes[index]] = result

          return sslUpdate
        }, {}))

        this.setState({ ssl })
      })
  }
  readFile (file) {
    const reader = new FileReader() // eslint-disable-line

    return new Promise((resolve, reject) => {
      reader.onload = (event) => resolve(event.target.result)
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    })
  }
  onDragOver (event) {
    event.preventDefault()
  }
  getSslText () {
    if (!this.state.ssl || !Object.keys(this.state.ssl).length) {
      return <span><b>ssl.crt</b> and <b>ssl.key</b> files here</span>
    }

    if (this.state.ssl.cert) {
      return <span><b>ssl.key</b> file here</span>
    }

    return <span><b>ssl.crt</b> file here</span>
  }
  render () {
    return (
      <div>
        <div className='app-disabled'>
          <img src='logo.png' width='200' role='presentation' />
          <h1>add new app</h1>
          <input
            className='app-input'
            autoFocus
            placeholder='name...'
            value={this.state.name}
            onInput={(event) => this.onNameChange(event.target.value)}
          />
          <input
            className='app-input app-input-port'
            placeholder='port...'
            value={this.state.port}
            onInput={(event) => this.onPortChange(event.target.value)}
          />
          <div className='app-type-wrapper'>
            <div>
              <label>
                <input
                  type='radio'
                  checked={this.state.type === 'c'}
                  onClick={(event) => {
                    event.stopPropagation()
                    this.onTypeChange('c')
                  }}
                />
                Cerebral
              </label>
              <label>
                <input
                  type='radio'
                  checked={this.state.type === 'ft'}
                  onClick={(event) => {
                    event.stopPropagation()
                    this.onTypeChange('ft')
                  }}
                />
                Function-Tree
              </label>
              <label>
                <input
                  type='radio'
                  checked={this.state.type === 'cft'}
                  onClick={(event) => {
                    event.stopPropagation()
                    this.onTypeChange('cft')
                  }}
                />
                Client (C) + Server (FT)
              </label>
            </div>
            {
              this.state.ssl && this.state.ssl.cert && this.state.ssl.key ? (
                <div className='app-drop-ssl-ready'>HTTPS Ready!</div>
              ) : (
                <div className='app-drop-ssl' onDrop={(event) => this.onDrop(event)} onDragOver={this.onDragOver}>
                  <span>
                    <b>If app running on HTTPS</b>
                    <ol>
                      <li>Go to <a href='#' onClick={this.openSsl}>create-ssl-certificate</a></li>
                      <li>Create certificate on hostname: <b>cerebral-debugger</b></li>
                      <li>Drop the created {this.getSslText()}</li>
                      <li>Connect with host: <b>cerebral-debugger.dev</b> and port</li>
                    </ol>
                  </span>
                </div>
              )
            }
          </div>
          <div>
            <button
              disabled={!this.state.name || !this.state.port}
              className='app-button'
              onClick={() => this.addPort()}
            >
              ADD
            </button>
            {this.props.portsCount ? (
              <button
                className='app-button'
                onClick={() => this.props.cancelAddNewPort()}
              >
                Cancel
              </button>
            ) : null}
            {!this.props.portsCount ? (
              <button
                className='app-button'
                onClick={() => this.props.addPort('c', 'tutorial', '8585')}
              >
                ADD TUTORIAL
              </button>
            ) : null}
          </div>
          {this.state.error ? (
            <div className='app-error'>
              <small><strong>error:</strong></small> {this.state.error}
            </div>
          ) : null}
          <div className='requirementsList'>
            More information can be found <a onClick={this.openDocs}>at the Cerebral website</a>
          </div>
        </div>
      </div>
    )
  }
}

export default AddApp
