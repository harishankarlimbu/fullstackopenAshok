import React from 'react'

const Blog = ({ blog }) => (
  <div className="blog">
    <strong>{blog.title}</strong> by {blog.author}
  </div>
)

export default Blog
