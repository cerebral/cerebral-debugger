'use strict'
const electron = require('electron')
const WebSocketServer = require('ws').Server
const app = electron.app
const appVersion = app.getVersion()
const BrowserWindow = electron.BrowserWindow
const path = require('path')
const url = require('url')
const checkForUpdates = require('./autoUpdate')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
function createWindow () {
  checkForUpdates()
  const clients = {}

  mainWindow = new BrowserWindow({icon: path.resolve('icons', 'icon.png'), width: 800, height: 600})
  mainWindow.on('closed', function () { mainWindow = null })
  mainWindow.loadURL(url.format({
    pathname: __dirname + '/index.html', // eslint-disable-line
    protocol: 'file:',
    slashes: true
  }))

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate([
    {
      label: 'Application',
      submenu: [
        { label: 'Cerebral Debugger v' + appVersion },
        { type: 'separator' },
        {
          label: 'Learn More',
          click () {
            require('electron').shell.openExternal(
              'http://cerebraljs.com/docs/introduction/debugger.html'
            )
          }
        },
        {
          label: 'Release Notes',
          click () {
            require('electron').shell.openExternal(
              'https://github.com/cerebral/cerebral-debugger/releases/tag/v' + appVersion
            )
          }
        },
        {
          label: 'License',
          click () {
            require('electron').shell.openExternal(
              'https://github.com/cerebral/cerebral-debugger/blob/master/LICENSE'
            )
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    }
  ]))

  electron.ipcMain.on('message', function (event, payload) {
    if (!clients[payload.port] || !clients[payload.port].ws) {
      return
    }

    clients[payload.port].ws.send(JSON.stringify(payload))
  })

  electron.ipcMain.on('port:add', function (event, port) {
    if (clients[port]) {
      mainWindow.webContents.send('port:added', port)
      return
    }

    clients[port] = {
      wss: new WebSocketServer({ port: Number(port) })
    }
    clients[port].wss.on('connection', function (ws) {
      clients[port].ws = ws

      ws.on('message', function (message) {
        const parsedMessage = JSON.parse(message)

        if (parsedMessage.type === 'focusApp') {
          mainWindow.webContents.send('port:focus', port)
        } else {
          mainWindow.webContents.send('message', Object.assign(parsedMessage, {
            port
          }))
        }
      })
    })
    clients[port].wss.on('error', function (ws) {
      mainWindow.webContents.send('port:exists', port)
    })
    mainWindow.webContents.send('port:added', port)
  })

  electron.ipcMain.on('port:remove', function (event, port) {
    clients[port].wss.close()

    delete clients[port]
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
