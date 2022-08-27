import path, { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const config = {
  development: {
    client: "sqlite3",
    connection: {
      filename: path.join(__dirname, "src", "database", "database.db"),
    },
    pool: {
      afterCreate: (connection, callback) =>
        connection.run("PRAGMA foreign_keys = ON", callback),
    },
    migrations: {
      directory: path.join(__dirname, "src", "database", "knex", "migrations"),
    },
    useNullAsDefault: true,
  },
}

export default config
