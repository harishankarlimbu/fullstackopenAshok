import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import BlogForm from './BlogForm'
import '@testing-library/jest-dom' 
describe('<BlogForm />', () => {
  test('calls onCreate with correct details when a new blog is created', () => {
    const createBlog = vi.fn()
    // render and capture container for direct DOM queries
    const { container } = render(<BlogForm onCreate={createBlog} />)

    // open the form
    fireEvent.click(screen.getByText('Create new blog'))

    // find the inputs by their IDs 
    const titleInput = container.querySelector('#title')
    const authorInput = container.querySelector('#author')
    const urlInput = container.querySelector('#url')

    // fill fields
    fireEvent.change(titleInput, { target: { value: 'Learning React' } })
    fireEvent.change(authorInput, { target: { value: 'Ashok Limbu' } })
    fireEvent.change(urlInput, { target: { value: 'http://ashoklimbu.com' } })

    // submit form
    fireEvent.click(screen.getByText('Create'))

    // assertions
    expect(createBlog).toHaveBeenCalledTimes(1)
    // ensure the handler got called with the expected object
    expect(createBlog).toHaveBeenCalledWith({
      title: 'Learning React',
      author: 'Ashok Limbu',
      url: 'http://ashoklimbu.com',
    })
  })
})
