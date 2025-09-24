import AnecdoteForm from './components/AnecdoteForm'
import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, updateAnecdote } from './services/backendRouter'
import Notification from './components/Notification'

function App(){
  const queryClient = useQueryClient()

  // Fetch anecdotes
  const { data: anecdotes, isLoading, isError, error } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1,
  })

  // mutation for updating votes
  const updateAnecdoteMutation = useMutation({
  mutationFn: (anecdote) => updateAnecdote(anecdote.id, anecdote),
  onSuccess: (updatedAnecdote) => {
    queryClient.setQueryData(['anecdotes'], (old) =>
      old.map((a) => a.id === updatedAnecdote.id ? updatedAnecdote : a)
    )
  }
})

  if (isLoading) {
    return <div>Loading anecdotes...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  const handleVote = (anecdote) => {
    const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
    updateAnecdoteMutation.mutate(updatedAnecdote)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm/>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>
            {typeof anecdote.content === 'string' 
              ? anecdote.content 
              : anecdote.content.content || JSON.stringify(anecdote.content)
            }
          </div>
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
