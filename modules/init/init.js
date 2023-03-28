const Database = require("../database/database")

function initDatabase() {
  return new Promise((resolve, reject) => {
    try {
      let database = new Database(".nyanga")
      let firstRun = database.getCollection("appSettings")

      if (firstRun === null) {
        database.createCollection("mangaCollection")
        database.createCollection("appSettings")

        let initSettings = database.getCollection("appSettings")
        initSettings.insert({
          settingsID: "language",
          data: { langCode: "en", langTitle: "english" }
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
