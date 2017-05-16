const { app, ipcMain, BrowserWindow, dialog } = require('electron')
const log = require('electron-log')

const {autoUpdater} = require('electron-updater')
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update... Please wait.')
})
autoUpdater.on('update-available', (ev, info) => {
  log.info('Update available.')
})
autoUpdater.on('update-not-available', (ev, info) => {
  log.info('Update not available.')
})
autoUpdater.on('error', (ev, err) => {
  log.info('Error in auto-updater.')
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  log.info('Download progress...')
})
autoUpdater.on('update-downloaded', (ev, info) => {
  log.info('Update downloaded; will install in 5 seconds')
})
log.info('App starting...')

const userDataDir = app.getPath('userData')
const fs = require('fs')
const path = require('path')
const updateStoreFile = 'update.json'
let checkForUpdatesEvent

autoUpdater.autoDownload = false

let updateFile = {}
try {
  updateFile = JSON.parse(fs.readFileSync(path.join(userDataDir, updateStoreFile)))
} catch (err) {
  updateFile = {}
}

function updateDownloaded () {
  dialog.showMessageBox({
    title: 'Update Ready to Install',
    message: 'Update has been downloaded',
    buttons: [
      'Install Later',
      'Install Now'
    ],
    defaultId: 1
  }, (response) => {
    if (response === 0) {
      dialog.showMessageBox({
        title: 'Installing Later',
        message: 'Update will be installed when you exit the app'
      })
    } else {
      autoUpdater.quitAndInstall()
    }
  })
}

function updateAvailable ({version, releaseNotes}) {
  if (checkForUpdatesEvent) {
    checkForUpdatesEvent.sender.send('update-result', true)
  } else if (updateFile.skip === version) {
    console.log(`Skipping version: ${version}`)
    return
  }

  let window = new BrowserWindow({
    title: 'Update Available',
    width: 600,
    height: 630,
    show: false,
    center: true,
    resizable: true,
    maximizable: false,
    minimizable: false
  })

  window.loadURL(`file://${__dirname}/update.html`)
  window.setMenuBarVisibility(false)

  window.webContents.on('did-finish-load', () => {
    window.webContents.send('new-notes', releaseNotes)
    window.webContents.send('new-version', version)
    window.show()
  })

  ipcMain.once('update-response', (e, type) => {
    switch (type) {
      case 'skip':
        updateFile.skip = version
        fs.writeFileSync(path.join(userDataDir, updateStoreFile), JSON.stringify(updateFile))
        dialog.showMessageBox({
          title: 'Skip Update',
          message: 'We will notify you when the next update is available.'
        }, () => window.close())
        break
      case 'remind':
        dialog.showMessageBox({
          title: 'Remind Later',
          message: 'We will remind you next time you start the app'
        }, () => window.close())
        break
      case 'update':
        dialog.showMessageBox({
          title: 'Downloading Update',
          message: 'You will be notified when the update is ready to be installed'
        }, () => window.close())
        autoUpdater.downloadUpdate()
        break
    }
  })

  window.on('closed', () => {
    window = null
    ipcMain.removeAllListeners('update-response')
  })
}

function checkForUpdates () {
  autoUpdater.on('update-available', updateAvailable)

  autoUpdater.on('download-progress', ({percent}) => {
    console.log(`Update progress: ${percent}`)
  })

  autoUpdater.on('update-downloaded', updateDownloaded)

    // Event from about window
  ipcMain.on('check-for-updates', (e, autoUpdate) => {
    if (autoUpdate === true || autoUpdate === false) {
      updateFile.autoUpdate = autoUpdate
      fs.writeFileSync(path.join(userDataDir, updateStoreFile), JSON.stringify(updateFile))
    } else if (autoUpdate === 'auto') {
      e.returnValue = updateFile.autoUpdate
    } else {
      checkForUpdatesEvent = e
      autoUpdater.checkForUpdates()
    }
  })

  if (updateFile.autoUpdate !== false) {
    autoUpdater.checkForUpdates()
  }
}
module.exports = checkForUpdates
