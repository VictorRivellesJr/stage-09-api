import Router from "express"
import multer from "multer"
import { MULTER } from "../configs/upload.js"
import { UsersController } from "../controllers/usersController.js"
import { UsersAvatarController } from "../controllers/UsersAvatarController.js"
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js"

const usersRoutes = Router()
const usersController = new UsersController()
const usersAvatarController = new UsersAvatarController()
const upload = multer(MULTER)

usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  usersAvatarController.update
)

export { usersRoutes }
