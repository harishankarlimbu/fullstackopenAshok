import React from 'react'
import { useState } from 'react'

const Blog = ({ blog, onLike }) => {
  const [liked, setLiked] = useState(false)
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
      </div>

      <button onClick={() => setVisible(!visible)}>
        {visible ? "Hide" : "View"}
      </button>
      {visible && (
        <div>
          <div>Author: {blog.author}</div>
          <div>URL: {blog.url}</div>
          <div>Likes: {blog.likes}
            <button onClick={() => { onLike(blog); setLiked(true) }}>like</button>
          </div>
          {liked && <div>{blog.author}</div>}

        </div>
      )}
    </div>
  )
}

export default Blog
