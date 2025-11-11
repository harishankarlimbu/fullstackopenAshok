import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from '../reducers/usersReducer'

const User = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const users = useSelector(state => state.users)

  useEffect(() => {
    // If users list is empty, fetch users
    if (!users || users.length === 0) {
      dispatch(initializeUsers())
    }
  }, [id, users, dispatch])

  const user = users?.find(u => (u.id || u._id) === id)

  if (!users || users.length === 0) {
    return <div className="loading">Loading user...</div>
  }

  if (!user) {
    return <div className="loading">User not found</div>
  }

  return (
    <div className="user-view">
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

