require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./person")

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static("dist"))

morgan.token("body", (req) => JSON.stringify(req.body))
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

// Routes

// GET all
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => next(err))
})

// GET one
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((err) => next(err))
})

// INFO
app.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `)
    })
    .catch((err) => next(err))
})

// DELETE
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((err) => next(err))
})

// POST
app.post("/api/persons", (req, res, next) => {
  const postingData = req.body

  if (!postingData.name || !postingData.number) {
    return res.status(400).json({ error: "name or number is missing" })
  }

  const person = new Person({
    name: postingData.name,
    number: postingData.number,
  })

  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((err) => next(err))
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.name, err.message)

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  } else if (err.name === "MongoServerError") {
    return res.status(500).json({ error: err.message })
  }

  res.status(500).json({ error: "Something went wrong on the server" })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
