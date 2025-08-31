const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Get all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

// Add a new blog
blogsRouter.post('/', async (req, res, next) => {
  const body = req.body

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    // user will be added in 4.17/4.19 when token auth is implemented
  })

  try {
    const savedBlog = await blog.save()
    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

// Delete all blogs
blogsRouter.delete('/', async (req, res) => {
  await Blog.deleteMany({})
  res.status(204).end()
})

// Update a blog
blogsRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id
  const body = req.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, body, { new: true })
    res.json(updatedBlog)
  } catch (err) {
    next(err)
  }
})

module.exports = blogsRouter
