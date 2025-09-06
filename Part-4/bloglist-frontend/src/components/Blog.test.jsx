import React from 'react'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Ashok',
    url: 'http://testurl.com',
    likes: 10,
    id: '12345'
  }

  test('renders title but not author, url or likes by default', () => {
  render(<Blog blog={blog} onLike={() => {}} onDelete={() => {}} />)

  // Title should be visible
  expect(screen.getByText('Test Blog Title')).toBeInTheDocument()

  // Author, URL and Likes should NOT be visible
  expect(screen.queryByText('Ashok')).not.toBeInTheDocument()
  expect(screen.queryByText('http://testurl.com')).not.toBeInTheDocument()
  expect(screen.queryByText('Likes: 10')).not.toBeInTheDocument()
})
})