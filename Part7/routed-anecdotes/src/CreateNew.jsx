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

    // Extract reset from each field to avoid passing it to input elements
    const { reset: resetContent, ...contentProps } = content
    const { reset: resetAuthor, ...authorProps } = author
    const { reset: resetInfo, ...infoProps } = info

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
                    <input {...contentProps} />
                </div>
                <div>
                    author
                    <input {...authorProps} />
                </div>
                <div>
                    url for more info
                    <input {...infoProps} />
                </div>
                <button>create</button>
                <button type="button" onClick={() => {
                    resetContent()
                    resetAuthor()
                    resetInfo()
                }}>reset</button>
            </form>
        </div>
    )
}

export default CreateNew
