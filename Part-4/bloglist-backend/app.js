import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import usersRouter from "./controllers/users.js"
import blogsRouter from "./controllers/blogs.js"
import loginRouter from "./controllers/login.js"
import {
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  errorHandler,
} from "./utils/middleware.js"
import dotenv from "dotenv"
dotenv.config()

const app = express()
console.log("hello")
// Connect to MongoDB
mongoose.connect(process.env.MONGODB)
  .then(() => console.log("Connected to MongoDB"))
  .catch(error=> console.error("Error connecting to MongoDB:", error.message))

// Middlewares
app.use(cors())
app.use(express.json())
app.use(requestLogger)

// Routes
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)
app.use("/api/blogs", tokenExtractor, blogsRouter)

// Unknown endpoint & error handling
app.use(unknownEndpoint)
app.use(errorHandler)

export default app
