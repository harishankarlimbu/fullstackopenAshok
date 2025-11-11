import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBlogs } from '../hooks/useBlogs'
import { useUser } from '../contexts/UserContext'

const BlogView = ({ onLike, onDelete }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: blogs = [] } = useBlogs()
  const { user: currentUser } = useUser()

  const blog = blogs?.find(b => (b.id || b._id) === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const isCreator = blog.user && currentUser && blog.user.username === currentUser.username

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <h2>{blog.title} by {blog.author}</h2>
      <div>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </div>
      <div>
        {blog.likes} likes
        <button
          type="button"
          onClick={() => onLike(blog.id || blog._id)}
        >
          like
        </button>
      </div>
      {blog.user && (
        <div>
          added by {blog.user.name || blog.user.username}
        </div>
      )}
      {isCreator && (
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                `Remove blog "${blog.title}" by ${blog.author}?`
              )
            ) {
              onDelete(blog.id || blog._id)
              navigate('/')
            }
          }}
        >
          remove
        </button>
      )}
    </div>
  )
}

export default BlogView

