import React, { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LoginForm from './components/LoginForm'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Users from './components/Users'
import Notification from './Notifications'
import { showNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, setBlogs, likeBlog, deleteBlog } from './reducers/blogReducer'
import { initializeUser, loginUser, logoutUser } from './reducers/userReducer'

function App() {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  // Initialize user from localStorage on app start
  useEffect(() => {
    dispatch(initializeUser())
  }, [dispatch])

  // Fetch blogs whenever user state changes
  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs())
    }
  }, [user, dispatch])

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await dispatch(loginUser(credentials))
      dispatch(showNotification(`${loggedUser.username} logged in successfully`, 'success'))
      dispatch(initializeBlogs())
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      dispatch(showNotification(message, 'error'))
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(setBlogs([]))
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
      <div>
        <Link to="/" style={{ padding: 5 }}>blogs</Link>
        <Link to="/users" style={{ padding: 5 }}>users</Link>
        <span style={{ padding: 5 }}>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </span>
      </div>
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/" element={
          <div>
            <h2>blogs</h2>
            <BlogForm onCreate={handleCreate} />
            <BlogList
              onDelete={handleDelete}
              onLike={handleLike}
              currentUser={user}
            />
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App

