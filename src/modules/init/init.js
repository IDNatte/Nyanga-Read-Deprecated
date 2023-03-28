const Database = require("../database/database")

function initDatabase(app) {
  return new Promise((resolve, reject) => {
    try {
      let database = new Database(".nyanga")
      let firstRun = database.listCollection()

      if (firstRun.length === 0) {
        database.createCollection("mangaCollection")
        database.createCollection("appSettings")

        let initSettings = database.getCollection("appSettings")
        initSettings.insert({
          settingsID: "language",
          data: { langCode: "en", langTitle: "english" },
        })
      }

      setTimeout(() => {
        resolve({ created: true })
      }, 7000)
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = { initDatabase }
