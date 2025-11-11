import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const blogs = useSelector(state => state.blogs)

  return (
    <ul className="blog-list">
      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <li key={blog.id || blog._id} className="blog-list-item">
            <Link to={`/blogs/${blog.id || blog._id}`}>
              {blog.title} by {blog.author}
            </Link>
          </li>
        ))}
    </ul>
  )
}

export default BlogList

