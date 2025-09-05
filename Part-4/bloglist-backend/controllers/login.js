import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import express from "express"
import User from "../models/user.js"

const loginRouter = express.Router()
loginRouter.post("/", async (req, res, next) => {
  console.log("Login request body:", req.body)
  try {
    const { username, password } = req.body
  
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" })
    }

    const user = await User.findOne({ username })
    if (!user) {
      return res.status(401).json({ error: "invalid username or password" })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
    if (!passwordCorrect) {
      return res.status(401).json({ error: "invalid username or password" })
    }

    if (!process.env.SECRET) {
      return res.status(500).json({ error: "server misconfigured: missing JWT_SECRET" })
    }

    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.SECRET,
      { expiresIn: "100h" }
    )

    res.json({ token, username: user.username, name: user.name })
  } catch (error) {
    next(error)
  }
})

export default loginRouter
