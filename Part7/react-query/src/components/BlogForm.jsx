import { useState } from 'react'

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [visible, setVisible] = useState(false)

  function visibility() {
    setVisible(!visible)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if(title==='' || author==='' || url===''){
      alert('One is Empty Fied')

    }

    if (!title || !author || !url) {
      return
    }
    onCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
    setVisible(false)
  }



  return (
    <div>
      {visible ? (
        <div>
          <h2>create new blog</h2>
          <form onSubmit={handleSubmit}>
            <div>
              title:
              <input
                data-testid="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              author:
              <input
                data-testid="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div>
              url:
              <input
                data-testid="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button type="submit">Create</button>
          </form>
          <button type="button" onClick={visibility}>Cancel</button>
          <hr />

        </div>)
        :
        (
          <button onClick={visibility}>Create new blog</button>
        )
      }
    </div>

  )
}
export default BlogForm

