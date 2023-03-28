// const loki = require("lokijs")
// const lfsa = require("lokijs/src/loki-fs-structured-adapter")

// var adapter = new lfsa()
// var db = new loki("sandbox.json", {
//   adapter: adapter,
//   autoload: true,
//   autosave: true,
//   autosaveInterval: 1000
// })

// let c = db.getCollection("log")

// if (c === null) {
//   db.addCollection("log")
//   // db.save()
//   // d.insert({ testing: "coba" })
// }

// e = db.getCollection("log")
// e.insert({ testing: "coba" })
// db.saveDatabase()
// // console.log(c)

const PouchDB = require("pouchdb")
PouchDB.plugin(require("pouchdb-adapter-node-websql"))

let database = new PouchDB("test-databas", { adapter: "websql" })
database.put({
  test: "coba"
})
