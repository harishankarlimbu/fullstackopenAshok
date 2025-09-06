import express from "express"
import Blog from "../models/blog.js"
import { userExtractor } from "../utils/middleware.js"

const blogsRouter = express.Router()

// GET all blogs
blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
  res.json(blogs)
})

// CREATE new blog (only if logged in)
blogsRouter.post("/", userExtractor, async (req, res, next) => {
  try {
    const { title, author, url, likes } = req.body
    const user = req.user

    if (!user) {
      return res.status(401).json({ error: "invalid or missing token" })
    }

    if (!title || !url) {
      return res.status(400).json({ error: "title and url are required" })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user.id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()

    res.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

// DELETE a blog (only by creator)
blogsRouter.delete("/:id", userExtractor, async (req, res, next) => {
  try {
    const user = req.user
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: "blog not found" })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return res.status(401).json({ error: "unauthorized: cannot delete this blog" })
    }

    await Blog.findByIdAndDelete(req.params.id)

    user.blogs = user.blogs.filter((b) => b.toString() !== req.params.id)
    await user.save()

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

//update the likes
blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const body = req.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: body.user
    }

    // findByIdAndUpdate with new:true to return updated doc
    const updated = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
      .populate('user', { username: 1, name: 1 })

    res.json(updated)
  } catch (error) {
    next(error)
  }
})

export default blogsRouter
