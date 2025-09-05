import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './Notifications'

function App() {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: '' })


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
        } catch (e) {
          console.error('fetch blogs failed', e)
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
      setNotification({ message: `${loggedUser.username} logged in successfully`, type: 'success' })
      setTimeout(() => setNotification({ message: '', type: '' }), 3000)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      setNotification({ message, type: 'error' })
      setTimeout(() => setNotification({ message: '', type: '' }), 3000)
    }
  }
console.log("hi") 
console.log("hi") 

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    setBlogs([])
    window.localStorage.removeItem('loggedBlogAppUser')
    setNotification({ message: 'Logged out successfully', type: 'success' })
    setTimeout(() => setNotification({ message: '', type: '' }), 3000)
  }

  const handleCreate = async (newBlog) => {
     const { title, author, url } = newBlog

    if (!title || !author || !url) {
    setNotification({ message: 'Please fill in all fields', type: 'error' })
    setTimeout(() => setNotification({ message: '', type: '' }), 3000)
    return
    }

    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      setNotification({ message: `A new blog "${createdBlog.title}" by ${createdBlog.author} added`, type: 'success' })
      setTimeout(() => setNotification({ message: '', type: '' }), 3000)
    } catch (error) {
      setNotification({ message: 'Failed to create blog', type: 'error' })
      setTimeout(() => setNotification({ message: '', type: '' }), 3000)
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
      {blogs.map((blog) => (
        <li><Blog key={blog.id} blog={blog} />
        </li>
      ))}
    </div>
  
  )
}

export default App
// test  
