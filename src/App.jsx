import AnecdoteForm from './components/AnecdoteForm'
import { useQuery } from '@tanstack/react-query'
import Notification from './components/Notification'
import { getAll } from './services/backendRouter'

const App = () => {
  // Fetch anecdotes with React Query
  const { data: anecdotes, isLoading, isError, error } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1,
  })

  // Show loading state
  if (isLoading) {
    return <div>Loading anecdotes...</div>
  }

  // Show error state
  if (isError) {
    return <div>Error: {error.message}</div>
  }

  const handleVote = (anecdote) => {
    console.log('vote', anecdote)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}{' '}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
