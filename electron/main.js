"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var electron_serve_1 = __importDefault(require("electron-serve"));
var path = __importStar(require("path"));
var cors_1 = require("./modules/other/cors");
var loadURL = (0, electron_serve_1.default)({ directory: "../layout/build" });
function mainWindow() {
    var win = new electron_1.BrowserWindow({
        width: 1024,
        minWidth: 1024,
        height: 700,
        minHeight: 700,
        autoHideMenuBar: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "modules/preload/preload.js"),
        },
    });
    if (process.env.APP_DEV) {
        win.loadURL("http://localhost:5173");
    }
    else {
        loadURL(win);
    }
    win.webContents.session.webRequest.onBeforeSendHeaders(function (details, callback) {
        var requestHeaders = details.requestHeaders;
        (0, cors_1.UpsertKeyValue)(requestHeaders, "Access-Control-Allow-Origin", ["*"]);
        callback({ requestHeaders: requestHeaders });
    });
    win.webContents.session.webRequest.onHeadersReceived(function (details, callback) {
        var responseHeaders = details.responseHeaders;
        (0, cors_1.UpsertKeyValue)(responseHeaders, "Access-Control-Allow-Origin", ["*"]);
        (0, cors_1.UpsertKeyValue)(responseHeaders, "Access-Control-Allow-Headers", ["*"]);
        callback({
            responseHeaders: responseHeaders,
        });
    });
    win.setTitle("Read Nyanga");
}
electron_1.app.whenReady().then(function () {
    mainWindow();
});
