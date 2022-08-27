import bcryptpkg from "bcryptjs"
import { connection } from "../database/knex/index.js"
import { AppError } from "../utils/AppError.js"
import jwtpkg from "jsonwebtoken"
import { authConfig } from "../configs/auth.js"

const { sign } = jwtpkg
const { compare } = bcryptpkg

export class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

    const user = await connection("users").where("email", email).first()
    if (!user) {
      throw new AppError(`User or password incorrect.`, 401)
    }

    const checkPassword = await compare(password, user.password)
    if (!checkPassword) {
      throw new AppError(`User or password incorrect.`, 401)
    }

    const { secret, expiresIn } = authConfig
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    return response.json({ user, token })
  }
}
