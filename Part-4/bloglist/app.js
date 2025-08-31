const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
// Config
const { mongoUrl } = require('./utils/config')

// Routers
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')

// Middleware
const middleware = require('./utils/middleware')

const app = express()

// Connect to MongoDB
mongoose.connect(mongoUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error.message))

// Middlewares
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger) 

// Routes
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

// Unknown endpoint
app.use(middleware.unknownEndpoint)

// Centralized error handler
app.use(middleware.errorHandler)

module.exports = app
