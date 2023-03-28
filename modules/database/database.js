const lfsa = require("lokijs/src/loki-fs-structured-adapter")
const EventEmitter = require("events")
const loki = require("lokijs")
const path = require("path")
const os = require("os")
const fs = require("fs")

const adapter = lfsa()

class Database {
  constructor(filepath) {
    this.databasePath = path.join(os.homedir(), filepath)
    this.eventEmitter = new EventEmitter()
    try {
      fs.readdirSync(this.databasePath)
      this.database = new loki(
        path.join(this.databasePath, "nyangaread.database.json"),
        {
          adapter: adapter,
          autoload: true,
          autosave: true
        }
      )
    } catch {
      fs.mkdirSync(this.databasePath, { recursive: true })
      this.database = new loki(
        path.join(this.databasePath, "nyangaread.database.json"),
        {
          autoload: true,
          autosave: true,
          adapter: adapter
        }
      )
    }
  }

  getCollection(collectionName) {
    let collection = this.database.getCollection(collectionName)
    return collection
  }

  createCollection(collectionName) {
    let collection = this.database.addCollection(collectionName)
    return collection
  }

  listCollection() {
    return this.database.listCollections()
  }
}

module.exports = Database
