import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'

const usersRouter = express.Router()

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1 })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (req, res, next) => {
  try {
    const { username, name, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'username or password missing' })
    }

    if (password.length < 3) {
      return res.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({ error: 'username must be unique' })
    }
    next(error)
  }
})

export default usersRouter
