import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = ({ user, onLogout }) => {
  return (
    <div className="nav">
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>
      <span>
        {user.name} logged in
        <button onClick={onLogout}>logout</button>
      </span>
    </div>
  )
}

export default Navigation

