import { mkdirSync, readdirSync } from "fs"
import Loki from "lokijs"
import { homedir } from "os"
import { join } from "path"

export default class Database {
  public databasePath: string
  public database: any

  constructor(filepath: string) {
    this.databasePath = join(homedir(), filepath)

    try {
      readdirSync(this.databasePath)
      this.database = new Loki(this.databasePath, {
        autoload: true,
        autosave: true,
      })
    } catch {
      mkdirSync(this.databasePath, { recursive: true })
      this.database = new Loki(this.databasePath, {
        autoload: true,
        autosave: true,
      })
    }
  }

  getCollection(collectionName: string) {
    return this.database.getCollection(collectionName)
  }

  createCollection(collectionName: string) {
    const collection = this.database.addCollection(collectionName)
    return collection
  }

  listCollection() {
    return this.database.listCollections()
  }
}
