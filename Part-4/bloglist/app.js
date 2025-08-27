const express = require('express')
const mongoose = require('mongoose')
const { mongoUrl } = require('./utils/config')
const Blog = require('./models/blog')

const app = express()
mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  const body = req.body

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})


app.delete('/api/blogs', async (req, res) => {
  await Blog.deleteMany({})
  res.status(204).end() 
})

app.put('/api/blogs/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body
  const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
  res.json(updatedBlog)
})


module.exports = app
