const { ipcMain, app } = require("electron")
const { autoUpdater } = require("electron-updater")
const { readFile } = require("fs")
const path = require("path")
const fs = require("fs")
const os = require("os")

const { initDatabase } = require("../init/init")
const Database = require("../database/database")

let database = new Database(".nyanga")

function rendererEventModule(win) {
  // intialize first database

  ipcMain.on("load:check-init", (event) => {
    fs.access(path.join(os.homedir(), ".nyanga/nyangaread.database.json"), (err) => {
      if (err) {
        initDatabase().then((result) => {
          if (result.created) {
            let data = {
              reloadRequired: true,
            }
            event.sender.send("local:check-init", data)
          }
        })
      }
    })
  })

  // call reload if full reload required

  ipcMain.on("load:app-full-reload", () => {
    app.relaunch()
    app.quit()
  })

  // event
  ipcMain.on("win:minimize", () => {
    if (!win.isMinimized()) {
      win.minimize()
    }
  })

  ipcMain.on("win:resize", () => {
    if (win.isMaximized()) {
      win.unmaximize()
    } else {
      win.maximize()
    }
  })

  ipcMain.on("win:close", () => {
    win.close()
  })

  ipcMain.on("run:app-apply-update", (event) => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on("run:app-update", (event) => {
    autoUpdater.checkForUpdates()

    autoUpdater.on("checking-for-update", () => {
      let data = {
        checking: true,
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("update-available", (info) => {
      let data = {
        checking: false,
        info: info,
        status: "update-available",
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("update-not-available", (info) => {
      let data = {
        checking: false,
        info: info,
        status: "update-unavailable",
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("error", (err) => {
      let data = {
        checking: false,
        info: err,
        status: "error",
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("download-progress", () => {
      let data = {
        checking: false,
        info: "downloading update !",
        status: "downloading",
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("update-downloaded", () => {
      let data = {
        checking: false,
        info: "update downloaded !",
        status: "downloaded",
      }
      event.sender.send("app:app-update", data)
    })
  })

  ipcMain.on("load:app-about", (event) => {
    readFile(path.join(__dirname, "../other/docs/about.md"), "utf-8", (err, data) => {
      if (err) {
        console.log(err)
        event.sender.send("local:app-about", err)
      }

      event.sender.send("local:app-about", {
        about: JSON.stringify(data),
        appVersion: app.getVersion(),
      })
    })
  })

  ipcMain.on("load:app-lang", (event) => {
    let dbAppSettings = database.getCollection("appSettings")

    if (dbAppSettings) {
      let language = dbAppSettings
        .chain()
        .find({ settingsID: "language" })
        .data({ removeMeta: true })

      let data = language[0]
      event.sender.send("local:app-lang", data)
    }
  })

  ipcMain.on("save:app-lang", (event, language) => {
    let dbAppSettings = database.getCollection("appSettings")

    if (dbAppSettings) {
      let checkDbIfPopulated = dbAppSettings.chain().find({ settingsID: "language" }).count()

      if (checkDbIfPopulated === 0) {
        dbAppSettings.insert({ settingsID: "language", data: language })
      }

      if (checkDbIfPopulated !== 0) {
        dbAppSettings.findAndUpdate({ settingsID: "language" }, (app) => {
          app.data = language
        })
      }
    }
  })

  ipcMain.on("load:manga-all", (event) => {
    let mangaCollection = database.getCollection("mangaCollection")
    let data = {
      manga: mangaCollection.chain().data({ removeMeta: true }).reverse(),
    }

    event.sender.send("local:manga-load-all", data)
  })

  ipcMain.on("load:manga", (event) => {
    let mangaCollection = database.getCollection("mangaCollection")

    let checkCollection = database.listCollection().find(({ name }) => name === "mangaCollection")

    if (checkCollection) {
      let count = mangaCollection.count()
      let data

      if (count > 3) {
        let manga = mangaCollection.chain().data({ removeMeta: true }).reverse()
        let mangaData = manga.slice(0, 3)

        data = {
          manga: mangaData,
          page: true,
        }
      } else {
        data = {
          manga: mangaCollection.chain().data({ removeMeta: true }).reverse(),
          page: false,
        }
      }
      event.sender.send("local:manga-load", data)
    } else {
      let data = {
        manga: [],
        page: false,
      }

      event.sender.send("local:manga-load", data)
    }
  })

  ipcMain.on("save:manga", (event, manga) => {
    let mangaCollection = database.getCollection("mangaCollection")
    let checkMangaId = mangaCollection.findOne({ mangaId: manga.mangaId })
    if (!checkMangaId) {
      mangaCollection.insert(manga)
      event.sender.send("manga:saved", "Manga Saved")
    } else {
      event.sender.send("manga:saved", "Manga Already Saved !")
    }
  })
}

module.exports = rendererEventModule
