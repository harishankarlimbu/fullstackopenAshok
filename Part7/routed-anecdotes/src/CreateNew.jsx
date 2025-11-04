import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Notification from './Notification'
import { useField } from './hooks'

const CreateNew = (props) => {
    const navigate = useNavigate()
    const content = useField('text')
    const author = useField('text')
    const info = useField('text')
    const [notification, setNotification] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!content.value || content.value.length < 5) {
            setNotification('Anecdote must be at least 5 characters long!')
            setTimeout(() => setNotification(''), 5000)
            return
        }
        props.addNew({
            content: content.value,
            author: author.value,
            info: info.value,
            votes: 0
        })
        setNotification(`A new anecdote "${content.value}" created!`)
        setTimeout(() => {
            setNotification('')
            navigate('/')
        }, 3000)
    }

    return (
        <div>
            <Notification message={notification} />
            <h2>create a new anecdote</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    content
                    <input {...content} />
                </div>
                <div>
                    author
                    <input {...author} />
                </div>
                <div>
                    url for more info
                    <input {...info} />
                </div>
                <button>create</button>
                <button type="button" onClick={() => {
                    content.reset()
                    author.reset()
                    info.reset()
                }}>reset</button>
            </form>
        </div>
    )
}

export default CreateNew
