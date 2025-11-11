import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = ({ user, onLogout }) => {
  const padding = {
    padding: 5
  }

  return (
    <div style={{ background: '#f0f0f0', padding: 10, marginBottom: 10 }}>
      <Link to="/" style={padding}>
        blogs
      </Link>
      <Link to="/users" style={padding}>
        users
      </Link>
      <span style={padding}>
        {user.name} logged in
        <button onClick={onLogout} style={{ marginLeft: 5 }}>
          logout
        </button>
      </span>
    </div>
  )
}

export default Navigation

