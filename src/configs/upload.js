import path, { dirname } from "path"
import { fileURLToPath } from "url"
import multer from "multer"
import crypto from "crypto"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp")
export const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads")

export const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(req, file, cb) {
      const fileHash = crypto.randomBytes(10).toString("hex")
      const fileName = `${fileHash}-${file.originalname}`

      return cb(null, fileName)
    },
  }),
}
