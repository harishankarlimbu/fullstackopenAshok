import React from 'react'

const AnecdoteList = ({ anecdotes }) => {
  return (
    <div>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button>vote</button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default AnecdoteList
