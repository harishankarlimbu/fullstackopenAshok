import React from 'react'

const Notification = ({ message, type }) => {
  if (!message) return null

  const style = {
    padding: 10,
    border: '2px solid',
    borderRadius: 5,
    marginBottom: 10,
    color: type === 'success' ? 'green' : 'red',
    backgroundColor: '#f4f4f4',
  }

  return <div style={style}>{message}</div>
}

export default Notification

