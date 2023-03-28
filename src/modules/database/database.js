const loki = require("lokijs")
const path = require("path")
const os = require("os")
const fs = require("fs")

class Database {
  constructor(filepath) {
    this.databasePath = path.join(os.homedir(), filepath)
    try {
      fs.readdirSync(this.databasePath)
      this.database = new loki(path.join(this.databasePath, "nyangaread.database.json"), {
        autoload: true,
        autosave: true,
      })
    } catch {
      fs.mkdirSync(this.databasePath, { recursive: true })
      this.database = new loki(path.join(this.databasePath, "nyangaread.database.json"), {
        autoload: true,
        autosave: true,
      })
    }
  }

  getCollection(collectionName) {
    return this.database.getCollection(collectionName)
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
