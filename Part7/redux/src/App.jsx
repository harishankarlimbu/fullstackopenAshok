import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './Notifications'
import { showNotification } from './reducers/notificationReducer'

function App() {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  // Load logged-in user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Fetch blogs whenever user state changes
  useEffect(() => {
    const fetch = async () => {
      if (user) {
        try {
          const blogs = await blogService.getAll()
          setBlogs(blogs)
        } catch (error) {
          console.error('fetch blogs failed', error)
        }
      }
    }
    fetch()
  }, [user])

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedUser))
      dispatch(showNotification(`${loggedUser.username} logged in successfully`, 'success'))
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      dispatch(showNotification(message, 'error'))
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    setBlogs([])
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(showNotification('Logged out successfully', 'success'))
  }

  const handleCreate = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)

      // enrich user to current user (so remove button shows immediately)
      const enrichedBlog = {
        ...createdBlog,
        user: createdBlog.user && typeof createdBlog.user === 'string'
          ? user
          : createdBlog.user
      }

      setBlogs(blogs.concat(enrichedBlog))
      dispatch(showNotification(`A new blog "${createdBlog.title}" by ${createdBlog.author} added`, 'success'))
    } catch (error) {
      console.error(error)
      dispatch(showNotification('Failed to create blog', 'error'))
    }
  }

  const handleLike = async (blogId) => {
    const blog = blogs.find(b => b.id === blogId || b._id === blogId)
    if (!blog) return

    try {
      const updatedData = { likes: (blog.likes || 0) + 1 }
      const returned = await blogService.update(blogId, updatedData)

      const enriched = {
        ...returned,
        user: typeof returned.user === 'string' ? blog.user : returned.user
      }

      setBlogs(prev =>
        prev.map(b => (b.id === blogId || b._id === blogId ? enriched : b))
      )
    } catch (error) {
      console.error('Failed to like blog:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(prev => prev.filter((b) => b.id !== id && b._id !== id))
      dispatch(showNotification('Blog deleted successfully', 'success'))
    } catch (error) {
      console.log(error)
      dispatch(showNotification('Failed to delete blog', 'error'))
    }
  }

  if (!user) {
    return (
      <div>
        <Notification message={notification.message} type={notification.type} />
        <h2>Log in to application</h2>
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <BlogForm onCreate={handleCreate} />
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id || blog._id}
            blog={blog}
            onDelete={handleDelete}
            onLike={handleLike}
            currentUser={user}
          />
        ))}
    </div>
  )
}

export default App

