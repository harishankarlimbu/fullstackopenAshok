const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user') 
const { userExtractor } = require('../utils/middleware')

// 🔹 Get all blogs 
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 }) 
  res.json(blogs)
})

// Create a new blog
blogsRouter.post('/', async (req, res, next) => {
  try {
    const { title, author, url, likes, userId } = req.body

    if (!title || !url) {
      return res.status(400).json({ error: 'title and url are required' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({ error: 'invalid userId' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0, 
      user: user.id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

// Delete all blogs
const { userExtractor } = require('../utils/middleware')

// Delete a blog by ID
blogsRouter.delete('/:id', userExtractor, async (req, res, next) => {
  try {
    const user = req.user
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    if (blog.user.toString() !== user.id.toString()) {
      return res.status(401).json({ error: 'unauthorized: cannot delete this blog' })
    }

    await Blog.findByIdAndRemove(req.params.id)

    user.blogs = user.blogs.filter(b => b.toString() !== req.params.id)
    await user.save()

    res.status(204).end()
  } catch (err) {
    next(err)
  }
})


// Update a blog by ID
blogsRouter.put('/:id', async (req, res, next) => {
  const { title, author, url, likes } = req.body

  const updatedData = {
    title,
    author,
    url,
    likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true, context: 'query' } 
    )

    if (!updatedBlog) {
      return res.status(404).json({ error: 'blog not found' })
    }

    res.json(updatedBlog)
  } catch (err) {
    next(err)
  }
})

module.exports = blogsRouter
