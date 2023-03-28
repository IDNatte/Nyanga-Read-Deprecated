"use strict";
// const { contextBridge, ipcRenderer, ipcMain } = require("electron")
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld("backendAPI", {
    // manga save
    triggerSave: function (mangaId) {
        var manga = {
            mangaId: mangaId,
        };
        electron_1.ipcRenderer.send("save:manga", manga);
    },
    onMangaSave: function (callback) {
        electron_1.ipcRenderer.on("manga:saved", callback);
    },
    // end of manga save
    // manga load
    triggerMangaLoad: function () {
        electron_1.ipcRenderer.send("load:manga");
    },
    triggerMangaLoadAll: function () {
        electron_1.ipcRenderer.send("load:manga-all");
    },
    onMangaLoadAll: function (callback) {
        electron_1.ipcRenderer.on("local:manga-load-all", callback);
    },
    onMangaLoad: function (callback) {
        electron_1.ipcRenderer.on("local:manga-load", callback);
    },
    // end of manga load
    // application related
    triggerAppFullReload: function () {
        electron_1.ipcRenderer.send("load:app-full-reload");
    },
    triggerAppCheckInit: function () {
        electron_1.ipcRenderer.send("load:check-init");
    },
    onAppCheckInit: function (callback) {
        electron_1.ipcRenderer.on("local:check-init", callback);
    },
    triggerAppGetLanguage: function () {
        electron_1.ipcRenderer.send("load:app-lang");
    },
    onGetAppLang: function (callback) {
        electron_1.ipcRenderer.on("local:app-lang", callback);
    },
    triggerAppSetLanguage: function (appLang) {
        var language = {
            langCode: appLang.code,
            langTitle: appLang.title,
        };
        electron_1.ipcRenderer.send("save:app-lang", language);
    },
    onSetAppLanguage: function (callback) {
        electron_1.ipcRenderer.on("app-lang:saved", callback);
    },
    triggerAppAbout: function () {
        electron_1.ipcRenderer.send("load:app-about");
    },
    onAppAbout: function (callback) {
        electron_1.ipcRenderer.on("local:app-about", callback);
    },
    triggerAppUpdate: function () {
        electron_1.ipcRenderer.send("run:app-update");
    },
    triggerAppApplyUpdate: function () {
        electron_1.ipcRenderer.send("run:app-apply-update");
    },
    onAppUpdate: function (callback) {
        electron_1.ipcRenderer.on("app:app-update", callback);
    },
    triggreWinMinimize: function () {
        electron_1.ipcRenderer.send("win:minimize");
    },
    triggreWinClose: function () {
        electron_1.ipcRenderer.send("win:close");
    },
    triggerWinResize: function () {
        electron_1.ipcRenderer.send("win:resize");
    },
    // end of application related
});
