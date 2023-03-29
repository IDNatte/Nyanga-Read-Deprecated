import type { LanguageTypes, MangaTypes } from "../types/preload.types"
import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("backendAPI", {
  // manga save
  triggerSave: (mangaId: MangaTypes) => {
    const manga: MangaTypes = {
      mangaId: mangaId.mangaId,
    }
    ipcRenderer.send("save:manga", manga)
  },

  onMangaSave: (callback: () => any) => {
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

  onMangaLoadAll: (callback: () => any) => {
    ipcRenderer.on("local:manga-load-all", callback)
  },

  onMangaLoad: (callback: () => any) => {
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

  onAppCheckInit: (callback: () => any) => {
    ipcRenderer.on("local:check-init", callback)
  },

  triggerAppGetLanguage: () => {
    ipcRenderer.send("load:app-lang")
  },

  onGetAppLang: (callback: () => any) => {
    ipcRenderer.on("local:app-lang", callback)
  },

  triggerAppSetLanguage: (appLang: any) => {
    const language: LanguageTypes = {
      langCode: appLang.code,
      langTitle: appLang.title,
    }

    ipcRenderer.send("save:app-lang", language)
  },

  onSetAppLanguage: (callback: () => any) => {
    ipcRenderer.on("app-lang:saved", callback)
  },

  triggerAppAbout: () => {
    ipcRenderer.send("load:app-about")
  },

  onAppAbout: (callback: () => any) => {
    ipcRenderer.on("local:app-about", callback)
  },

  triggerAppUpdate: () => {
    ipcRenderer.send("run:app-update")
  },

  triggerAppApplyUpdate: () => {
    ipcRenderer.send("run:app-apply-update")
  },

  onAppUpdate: (callback: () => any) => {
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
