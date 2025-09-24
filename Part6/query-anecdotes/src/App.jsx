import AnecdoteForm from './components/AnecdoteForm'
import { useQuery , useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, updateAnecdote } from './services/backendRouter'
import Notification from './components/Notification'
import {useNotification} from './components/NotificationContext'

function App(){
  const queryClient = useQueryClient()
  const  {dispatch} = useNotification()

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
    dispatch({ type: 'SET', payload: ` You voted "${anecdote.content}"` })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <div>
      <Notification />
      <h3>Anecdote app</h3>
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
