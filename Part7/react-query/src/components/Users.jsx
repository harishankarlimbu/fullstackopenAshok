import React from 'react'
import { Link } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'

const Users = () => {
  const { data: users = [], isLoading } = useUsers()

  if (isLoading) {
    return <div>Loading users...</div>
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id || user._id}>
              <td>
                <Link to={`/users/${user.id || user._id}`}>
                  {user.name || user.username}
                </Link>
              </td>
              <td>{user.blogs ? user.blogs.length : 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users

