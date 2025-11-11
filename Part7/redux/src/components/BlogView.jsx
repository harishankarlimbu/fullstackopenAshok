import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const BlogView = ({ onLike, onDelete }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const blogs = useSelector(state => state.blogs)
  const currentUser = useSelector(state => state.user)

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
      <div style={{ marginTop: 20 }}>
        <h3>comments</h3>
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

