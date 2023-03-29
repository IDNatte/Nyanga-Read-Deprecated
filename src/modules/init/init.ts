import type { initDatabaseReturnType } from "../types/electron.types"
import Database from "../database/database"

export default async function initDatabase(): Promise<initDatabaseReturnType> {
  const database = new Database(".nyanga")
  const appSettingsCol = database.getCollection("appSettings")
  const mangaCol = database.getCollection("mangaCollection")

  if (appSettingsCol === null && mangaCol === null) {
    database.createCollection("mangaCollection")
    database.createCollection("appSettings")

    const initSettings = database.getCollection("appSettings")
    initSettings.insert({
      settingsId: "language",
      data: {
        langCode: "en",
        langTitle: "english",
      },
    })
  }

  const timer: any = setTimeout(() => {
    const test: initDatabaseReturnType = {
      created: true,
    }
    return test
  }, 7000)

  return timer
}
