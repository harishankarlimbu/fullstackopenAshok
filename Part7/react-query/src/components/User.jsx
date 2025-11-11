import React from 'react'
import { useParams } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'

const User = () => {
  const { id } = useParams()
  const { data: users = [], isLoading } = useUsers()

  if (isLoading) {
    return <div>Loading user...</div>
  }

  const user = users.find(u => (u.id || u._id) === id)

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <h2>{user.name || user.username}</h2>
      <h3>Added blogs</h3>
      {user.blogs && user.blogs.length > 0 ? (
        <ul>
          {user.blogs.map(blog => (
            <li key={blog.id || blog._id}>
              {blog.title}
            </li>
          ))}
        </ul>
      ) : (
        <p>No blogs added yet.</p>
      )}
    </div>
  )
}

export default User

