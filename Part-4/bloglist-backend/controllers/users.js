const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1 })
    res.json(users)
  } catch (err) {
    next(err)
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
      passwordHash    
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)

  } catch (err) {
    next(err)
  }
})

module.exports = usersRouter
