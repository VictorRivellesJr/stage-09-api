import pkg from "bcryptjs"
import { AppError } from "../utils/AppError.js"
import { sqliteConnection } from "../database/sqlite/index.js"

const { hash } = pkg
const { compare } = pkg

export class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body

    const db = await sqliteConnection()
    const checkUser = await db.get("SELECT name FROM users WHERE name = (?)", [
      name,
    ])
    const checkEmail = await db.get(
      "SELECT email FROM users WHERE email = (?)",
      [email]
    )

    if (checkEmail) {
      throw new AppError(`Email ${email} already exists.`)
    }

    const hashedPassword = await hash(password, 8)

    await db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ])

    return res.status(201).json({ name, email, password })
  }

  async update(req, res) {
    const { name, email, password, new_password } = req.body
    const id = req.user.id

    const db = await sqliteConnection()
    const user = await db.get("SELECT * FROM users WHERE id = (?)", [id])

    if (!user) {
      throw new AppError(`User not found.`)
    }

    if (email) {
      const checkEmail = await db.get("SELECT * FROM users WHERE email = (?)", [
        email,
      ])

      if (checkEmail && checkEmail.id !== id) {
        throw new AppError(`This email already exists.`)
      }
    }

    if (new_password && !password) {
      throw new AppError("Password not sent.")
    }

    if (password && new_password) {
      const checkPassword = await compare(password, user.password)

      if (!checkPassword) {
        throw new AppError("Incorrect password.")
      }

      user.password = await hash(new_password, 8)
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    await db.run(
      `
      UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now')
      WHERE id = ?
      `,
      [user.name, user.email, user.password, id]
    )

    return res.send(user)
  }
}
