import fs from "fs"
import { TMP_FOLDER, UPLOAD_FOLDER } from "../configs/upload.js"
import path, { dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class DiskStorageProvider {
  async saveFile(file) {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOAD_FOLDER, file)
    )

    return file
  }

  async deleteFile(file) {
    const filePath = path.resolve(UPLOAD_FOLDER, file)

    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}
