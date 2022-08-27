import jwtpkg from "jsonwebtoken"
import { authConfig } from "../configs/auth.js"
import { AppError } from "../utils/AppError.js"

const { verify } = jwtpkg

export function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError("JWT token is missing", 401)
  }

  const [, token] = authHeader.split(" ")

  try {
    const { sub: user_id } = verify(token, authConfig.secret)
    request.user = { id: Number(user_id) }
    return next()
  } catch (error) {
    throw new AppError("Invalid JWT token", 401)
  }
}
