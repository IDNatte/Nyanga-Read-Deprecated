import type { BrowserWindow } from "electron"

import { autoUpdater } from "electron-updater"
import { ipcMain, app } from "electron"
import * as path from "path"
import * as fs from "fs"
import * as os from "os"

import Database from "../database/database"
import initDatabase from "../init/init"

const database = new Database(".nyanga")

export default function rendererEventModule(win: BrowserWindow): void {
  ipcMain.on("load:check-init", (event: any) => {
    fs.access(path.join(os.homedir(), ".nyanga/nyangaread.database.json"), (err) => {
      if (err) {
        initDatabase().then((result: any) => {
          if (result.created) {
            const data = {
              reloadRequired: true,
            }

            event.sender.send("local:check-init", data)
          }
        })
      }
    })
  })

  ipcMain.on("load:app-full-reload", (event: any) => {
    app.relaunch()
    app.quit()
  })

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

  ipcMain.on("run:app-apply-update", (event: any) => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on("run:app-update", (event) => {
    autoUpdater.checkForUpdates()

    autoUpdater.on("checking-for-update", () => {
      const data = {
        checking: true,
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("update-available", (info) => {
      const data = {
        checking: false,
        info: info,
        status: "update-available",
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("update-not-available", (info) => {
      const data = {
        checking: false,
        info: info,
        status: "update-unavailable",
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("error", (err) => {
      const data = {
        checking: false,
        info: err,
        status: "error",
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("download-progress", () => {
      const data = {
        checking: false,
        info: "downloading update !",
        status: "downloading",
      }
      event.sender.send("app:app-update", data)
    })

    autoUpdater.on("update-downloaded", () => {
      const data = {
        checking: false,
        info: "update downloaded !",
        status: "downloaded",
      }
      event.sender.send("app:app-update", data)
    })
  })

  ipcMain.on("load:app-about", (event) => {
    fs.readFile(path.join(__dirname, "../../docs/about.md"), "utf-8", (err, data) => {
      if (err) {
        event.sender.send("local:app-about", err)
      }

      event.sender.send("local:app-about", {
        about: JSON.stringify(data),
        appVersion: app.getVersion(),
      })
    })
  })

  ipcMain.on("load:app-lang", (event) => {
    const dbAppSettings = database.getCollection("appSettings")

    if (dbAppSettings) {
      const language = dbAppSettings
        .chain()
        .find({ settingsID: "language" })
        .data({ removeMeta: true })

      const data = language[0]
      event.sender.send("local:app-lang", data)
    }
  })

  ipcMain.on("save:app-lang", (event, language) => {
    const dbAppSettings = database.getCollection("appSettings")

    if (dbAppSettings) {
      const checkDbIfPopulated = dbAppSettings.chain().find({ settingsID: "language" }).count()

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
    const mangaCollection = database.getCollection("mangaCollection")
    const data = {
      manga: mangaCollection.chain().data({ removeMeta: true }).reverse(),
    }

    event.sender.send("local:manga-load-all", data)
  })

  ipcMain.on("load:manga", (event) => {
    const mangaCollection = database.getCollection("mangaCollection")

    const checkCollection = database.listCollection().find(({ name }) => name === "mangaCollection")

    if (checkCollection) {
      const count = mangaCollection.count()
      let data

      if (count > 3) {
        const manga = mangaCollection.chain().data({ removeMeta: true }).reverse()
        const mangaData = manga.slice(0, 3)

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
      const data = {
        manga: [],
        page: false,
      }

      event.sender.send("local:manga-load", data)
    }
  })

  ipcMain.on("save:manga", (event, manga) => {
    const mangaCollection = database.getCollection("mangaCollection")
    const checkMangaId = mangaCollection.findOne({ mangaId: manga.mangaId })
    if (!checkMangaId) {
      mangaCollection.insert(manga)
      event.sender.send("manga:saved", "Manga Saved")
    } else {
      event.sender.send("manga:saved", "Manga Already Saved !")
    }
  })
}
