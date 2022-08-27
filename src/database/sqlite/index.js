import sqlite3 from "sqlite3"
import * as sqlite from "sqlite"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function sqliteConnection() {
  const dataBase = await sqlite.open({
    filename: path.resolve(__dirname, "..", "database.db"),
    driver: sqlite3.Database,
  })

  return dataBase
}

export { sqliteConnection }
