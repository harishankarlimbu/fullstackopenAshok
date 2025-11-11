import React, { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import Users from './components/Users'
import User from './components/User'
import Notification from './Notifications'
import { useNotification } from './contexts/NotificationContext'
import { useUser } from './contexts/UserContext'
import { useBlogs, useCreateBlog, useLikeBlog, useDeleteBlog } from './hooks/useBlogs'

function App() {
  const { notification, showNotification } = useNotification()
  const { user, loginUser, logoutUser } = useUser()
  const queryClient = useQueryClient()
  
  const { data: blogs = [], refetch: refetchBlogs } = useBlogs()
  const createBlogMutation = useCreateBlog()
  const likeBlogMutation = useLikeBlog()
  const deleteBlogMutation = useDeleteBlog()

  // Fetch blogs whenever user state changes
  useEffect(() => {
    if (user) {
      refetchBlogs()
    } else {
      // Clear blogs when user logs out
      queryClient.setQueryData(['blogs'], [])
    }
  }, [user, refetchBlogs, queryClient])

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginUser(credentials)
      showNotification(`${loggedUser.username} logged in successfully`, 'success')
      refetchBlogs()
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      showNotification(message, 'error')
    }
  }

  const handleLogout = () => {
    logoutUser()
    queryClient.setQueryData(['blogs'], [])
    showNotification('Logged out successfully', 'success')
  }

  const handleCreate = async (newBlog) => {
    try {
      const createdBlog = await createBlogMutation.mutateAsync(newBlog)
      // Enrich with user data for immediate UI update
      const enrichedBlog = {
        ...createdBlog,
        user: createdBlog.user && typeof createdBlog.user === 'string'
          ? user
          : createdBlog.user
      }
      // Update the query cache with enriched blog
      queryClient.setQueryData(['blogs'], (oldBlogs) => {
        return oldBlogs ? [...oldBlogs, enrichedBlog] : [enrichedBlog]
      })
      showNotification(`A new blog "${createdBlog.title}" by ${createdBlog.author} added`, 'success')
    } catch (error) {
      console.error(error)
      showNotification('Failed to create blog', 'error')
    }
  }

  const handleLike = async (blogId) => {
    try {
      const blog = blogs.find(b => (b.id || b._id) === blogId)
      if (!blog) return
      
      await likeBlogMutation.mutateAsync({ id: blogId, blog })
    } catch (error) {
      console.error('Failed to like blog:', error)
      showNotification('Failed to like blog', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteBlogMutation.mutateAsync(id)
      showNotification('Blog deleted successfully', 'success')
    } catch (error) {
      console.log(error)
      showNotification('Failed to delete blog', 'error')
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
        <Route path="/blogs/:id" element={<BlogView onLike={handleLike} onDelete={handleDelete} />} />
        <Route path="/users/:id" element={<User />} />
        <Route path="/users" element={<Users />} />
        <Route path="/" element={
          <div>
            <h2>blogs</h2>
            <BlogForm onCreate={handleCreate} />
            <BlogList blogs={blogs} />
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App

