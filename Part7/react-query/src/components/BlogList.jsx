import React from 'react'
import { Link } from 'react-router-dom'
import Blog from './Blog'

const BlogList = ({ blogs, onDelete, onLike, currentUser }) => {
  return (
    <div>
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <div key={blog.id || blog._id}>
            <Link to={`/blogs/${blog.id || blog._id}`}>
              {blog.title}
            </Link>
            <Blog
              blog={blog}
              onDelete={onDelete}
              onLike={onLike}
              currentUser={currentUser}
            />
          </div>
        ))}
    </div>
  )
}

export default BlogList

