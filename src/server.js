import "express-async-errors"
import "dotenv/config"
import { routes } from "./routes/index.js"
import express from "express"
import cors from "cors"
import { AppError } from "./utils/AppError.js"
import { UPLOAD_FOLDER } from "./configs/upload.js"
import { migrationsRun } from "./database/sqlite/migrations/index.js"

migrationsRun()

const app = express()

app.use(express.json())
app.use(cors())
app.use("/files", express.static(UPLOAD_FOLDER))
app.use(routes)
app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    })
  }
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  })
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`)
})
