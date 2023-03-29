import { app, BrowserWindow } from "electron"
import serve from "electron-serve"
import * as path from "path"

import rendererEventModule from "./modules/event/main.event"
import { UpsertKeyValue } from "./modules/other/cors"

const loadURL = serve({ directory: "./layout/build" })

function mainWindow() {
  const win = new BrowserWindow({
    width: 1024,
    minWidth: 1024,
    height: 700,
    minHeight: 700,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "modules/preload/preload.js"),
    },
  })

  if (process.env.APP_DEV) {
    win.loadURL("http://localhost:5173")
  } else {
    loadURL(win)
  }

  win.webContents.session.webRequest.onBeforeSendHeaders((details, callback) => {
    const { requestHeaders } = details
    UpsertKeyValue(requestHeaders, "Access-Control-Allow-Origin", ["*"])
    callback({ requestHeaders })
  })

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const { responseHeaders } = details
    UpsertKeyValue(responseHeaders, "Access-Control-Allow-Origin", ["*"])
    UpsertKeyValue(responseHeaders, "Access-Control-Allow-Headers", ["*"])
    callback({
      responseHeaders,
    })
  })

  win.setTitle("Read Nyanga")

  rendererEventModule(win)
}

app.whenReady().then(() => {
  mainWindow()
})
