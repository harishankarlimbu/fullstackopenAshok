import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBlogs } from '../hooks/useBlogs'
import { useUser } from '../contexts/UserContext'

const BlogView = ({ onLike, onDelete, onAddComment }) => {
  const [comment, setComment] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: blogs = [] } = useBlogs()
  const { user: currentUser } = useUser()

  const blog = blogs?.find(b => (b.id || b._id) === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  const isCreator = blog.user && currentUser && blog.user.username === currentUser.username

  return (
    <div className="blog-view">
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
      <div className="comments-section">
        <h3>comments</h3>
        <form onSubmit={(e) => {
          e.preventDefault()
          if (comment.trim()) {
            onAddComment(blog.id || blog._id, comment.trim())
            setComment('')
          }
        }}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button type="submit">add comment</button>
        </form>
        {blog.comments && blog.comments.length > 0 ? (
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>
                {typeof comment === 'string' ? comment : comment.content || comment.text || comment}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  )
}

export default BlogView

