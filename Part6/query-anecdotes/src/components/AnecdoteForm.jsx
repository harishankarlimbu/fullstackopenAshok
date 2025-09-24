import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNew } from '../services/backendRouter'
import { useNotification } from './NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

// Mutation for creating a new anecdote
  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']) || []
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      // Dispatch success notification
      dispatch({ type: 'SET', payload: `New Anecdote'${newAnecdote.content}' created!` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)  
    },
    onError: (error) => {
      // Dispatch error notification
      dispatch({ type: 'SET', payload: `Error: ${error.message}` })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }
      , 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    if (content.length < 5) {
      alert('Anecdote must be at least 5 characters long!')
      return
    }
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">
          {newAnecdoteMutation.isPending ? 'Creating...' : 'create'}
        </button>
      </form>
      {newAnecdoteMutation.isError && (
        <div>Error: {newAnecdoteMutation.error?.message}</div>
      )}
    </div>
  )
}

export default AnecdoteForm