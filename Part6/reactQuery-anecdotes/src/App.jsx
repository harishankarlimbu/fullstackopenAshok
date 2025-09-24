import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAnecdotes } from './services/backendRouter'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  // Fetch anecdotes
  const { data: anecdotes, isLoading, isError } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
  })

  if (isLoading) return <div>Loading anecdotes...</div>
  if (isError) return <div>Anecdote service not available due to server error</div>

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList anecdotes={anecdotes} />
    </div>
  )
}

export default App
