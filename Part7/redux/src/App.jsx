import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './Notifications'
import { showNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, setBlogs, likeBlog, deleteBlog } from './reducers/blogReducer'

function App() {
  const blogs = useSelector(state => state.blogs)
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
    if (user) {
      dispatch(initializeBlogs())
    }
  }, [user, dispatch])

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedUser))
      dispatch(showNotification(`${loggedUser.username} logged in successfully`, 'success'))
      dispatch(initializeBlogs())
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      dispatch(showNotification(message, 'error'))
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    dispatch(setBlogs([]))
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(showNotification('Logged out successfully', 'success'))
  }

  const handleCreate = async (newBlog) => {
    try {
      const createdBlog = await dispatch(createBlog(newBlog, user))
      dispatch(showNotification(`A new blog "${createdBlog.title}" by ${createdBlog.author} added`, 'success'))
    } catch (error) {
      console.error(error)
      dispatch(showNotification('Failed to create blog', 'error'))
    }
  }

  const handleLike = async (blogId) => {
    try {
      await dispatch(likeBlog(blogId))
    } catch (error) {
      console.error('Failed to like blog:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteBlog(id))
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

