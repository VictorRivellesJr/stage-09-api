import { connection } from "../database/knex/index.js"
import { AppError } from "../utils/AppError.js"
import { DiskStorageProvider } from "../providers/diskStorage.js"

export class UsersAvatarController {
  async update(request, response) {
    const user_id = request.user.id
    const avatarFilename = request.file.filename

    const diskStorageProvider = new DiskStorageProvider()

    const user = await connection("users").where({ id: user_id }).first()

    if (!user) {
      throw new AppError("Only authenticated users can change avatar.", 401)
    }

    if (user.avatar) {
      await diskStorageProvider.deleteFile(user.avatar)
    }

    const filename = await diskStorageProvider.saveFile(avatarFilename)
    user.avatar = filename

    await connection("users").where({ id: user_id }).update(user)

    return response.json(user)
  }
}
