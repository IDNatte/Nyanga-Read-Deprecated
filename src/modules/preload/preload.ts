// const { contextBridge, ipcRenderer, ipcMain } = require("electron")

import type { LanguageTypes, MangaTypes } from '../types/preload.types'
import { contextBridge, ipcRenderer } from 'electron'


contextBridge.exposeInMainWorld("backendAPI", {
  // manga save
  triggerSave: (mangaId) => {
    const manga: MangaTypes = {
      mangaId,
    }
    ipcRenderer.send("save:manga", manga)
  },

  onMangaSave: (callback) => {
    ipcRenderer.on("manga:saved", callback)
  },

  // end of manga save

  // manga load
  triggerMangaLoad: () => {
    ipcRenderer.send("load:manga")
  },

  triggerMangaLoadAll: () => {
    ipcRenderer.send("load:manga-all")
  },

  onMangaLoadAll: (callback) => {
    ipcRenderer.on("local:manga-load-all", callback)
  },

  onMangaLoad: (callback) => {
    ipcRenderer.on("local:manga-load", callback)
  },
  // end of manga load

  // application related

  triggerAppFullReload: () => {
    ipcRenderer.send("load:app-full-reload")
  },

  triggerAppCheckInit: () => {
    ipcRenderer.send("load:check-init")
  },

  onAppCheckInit: (callback) => {
    ipcRenderer.on("local:check-init", callback)
  },

  triggerAppGetLanguage: () => {
    ipcRenderer.send("load:app-lang")
  },

  onGetAppLang: (callback) => {
    ipcRenderer.on("local:app-lang", callback)
  },

  triggerAppSetLanguage: (appLang) => {
    const language: LanguageTypes = {
      langCode: appLang.code,
      langTitle: appLang.title,
    }

    ipcRenderer.send("save:app-lang", language)
  },

  onSetAppLanguage: (callback) => {
    ipcRenderer.on("app-lang:saved", callback)
  },

  triggerAppAbout: () => {
    ipcRenderer.send("load:app-about")
  },

  onAppAbout: (callback) => {
    ipcRenderer.on("local:app-about", callback)
  },

  triggerAppUpdate: () => {
    ipcRenderer.send("run:app-update")
  },

  triggerAppApplyUpdate: () => {
    ipcRenderer.send("run:app-apply-update")
  },

  onAppUpdate: (callback) => {
    ipcRenderer.on("app:app-update", callback)
  },

  triggreWinMinimize: () => {
    ipcRenderer.send("win:minimize")
  },

  triggreWinClose: () => {
    ipcRenderer.send("win:close")
  },

  triggerWinResize: () => {
    ipcRenderer.send("win:resize")
  },

  // end of application related
})
