import Router from "express"
import { NotesController } from "../controllers/NotesController.js"
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated.js"

const notesRoutes = Router()
const notesController = new NotesController()

notesRoutes.use(ensureAuthenticated)

notesRoutes.get("/", notesController.index)
notesRoutes.post("/", notesController.create)
notesRoutes.get("/:id", notesController.show)
notesRoutes.delete("/:id", notesController.delete)

export { notesRoutes }
