import { useParams } from 'react-router-dom'

const Anecdote = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => a.id === Number(id))

  if (!anecdote) {
    return <p>Anecdote not found.</p>
  }

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>by {anecdote.author}</div>
      <div>has {anecdote.votes} votes</div>
      <div>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>
      </div>
    </div>
  )
}

export default Anecdote
