import { sqliteConnection } from "../database/sqlite/index.js"

export class UserRepositories {
  async findByEmail(email) {
    const db = await sqliteConnection()
    const checkEmail = await db.get(
      "SELECT email FROM users WHERE email = (?)",
      [email]
    )
    return checkEmail
  }

  async create(name, email, password) {
    const db = await sqliteConnection()
    const userId = await db.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    )
    return { id: userId }
  }
}
