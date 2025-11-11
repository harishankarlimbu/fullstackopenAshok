import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import Navigation from './components/Navigation'
import Users from './components/Users'
import User from './components/User'
import Notification from './Notifications'
import { useNotification } from './contexts/NotificationContext'
import { useUser } from './contexts/UserContext'
import { useBlogs, useCreateBlog, useLikeBlog, useDeleteBlog, useAddComment } from './hooks/useBlogs'

function App() {
  const { notification, showNotification } = useNotification()
  const { user, loginUser, logoutUser } = useUser()
  const queryClient = useQueryClient()
  
  const { data: blogs = [], refetch: refetchBlogs } = useBlogs()
  const createBlogMutation = useCreateBlog()
  const likeBlogMutation = useLikeBlog()
  const deleteBlogMutation = useDeleteBlog()
  const addCommentMutation = useAddComment()

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

  const handleAddComment = async (blogId, comment) => {
    try {
      await addCommentMutation.mutateAsync({ id: blogId, comment })
    } catch (error) {
      console.error('Failed to add comment:', error)
      showNotification('Failed to add comment', 'error')
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
      <Navigation user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/blogs/:id" element={<BlogView onLike={handleLike} onDelete={handleDelete} onAddComment={handleAddComment} />} />
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

