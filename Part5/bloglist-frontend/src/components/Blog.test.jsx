import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, test, expect, beforeEach, vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Ashok',
    url: 'http://ashoklimbu.com',
    likes: 10,
    id: '12345'
  }

  const mockOnLike = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    mockOnLike.mockClear()
    mockOnDelete.mockClear()
  })

  // 5.13: Blog List Tests
  test('renders title and author but not URL or likes by default', () => {
    render(<Blog blog={blog} onLike={mockOnLike} onDelete={mockOnDelete} />)

    // Title should be visible
    expect(screen.getByText('Test Blog Title')).toBeInTheDocument()

    // URL and likes should NOT be visible initially
    expect(screen.queryByText(/http:\/\/ashoklimbu\.com/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Likes:/)).not.toBeInTheDocument()
    expect(screen.queryByText('10')).not.toBeInTheDocument()
    expect(screen.queryByText(/Author:/)).not.toBeInTheDocument()
  })

  // 5.14: Blog List Tests
  test('shows URL and likes when the view button is clicked', () => {
    render(<Blog blog={blog} onLike={mockOnLike} onDelete={mockOnDelete} />)

    // URL and likes should NOT be visible initially
    expect(screen.queryByText(/http:\/\/ashoklimbu\.com/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Likes:/)).not.toBeInTheDocument()

    // Click the view button
    const viewButton = screen.getByText('View')
    fireEvent.click(viewButton)

    // URL and likes should now be visible
    expect(screen.getByText(/http:\/\/ashoklimbu\.com/)).toBeInTheDocument()
    expect(screen.getByText(/Likes:/)).toBeInTheDocument()
    expect(screen.getByText(/Author:/)).toBeInTheDocument()

    // Title should still be visible
    expect(screen.getByText('Test Blog Title')).toBeInTheDocument()

    // Button text should change to 'Hide'
    expect(screen.getByText('Hide')).toBeInTheDocument()
  })

  // 5.15: Blog List Tests
  test('calls like event handler twice when like button is clicked twice', () => {
    render(<Blog blog={blog} onLike={mockOnLike} onDelete={mockOnDelete} />)

    // First, make the details visible by clicking view
    const viewButton = screen.getByText('View')
    fireEvent.click(viewButton)

    // Find and click the like button twice
    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    // The onLike handler should have been called twice
    expect(mockOnLike).toHaveBeenCalledTimes(2)
    expect(mockOnLike).toHaveBeenCalledWith(blog)
  })

  test('shows confirmation dialog when remove button is clicked', () => {
    // Mock window.confirm
    const originalConfirm = window.confirm
    window.confirm = vi.fn(() => true)

    render(<Blog blog={blog} onLike={mockOnLike} onDelete={mockOnDelete} />)

    // Make details visible
    const viewButton = screen.getByText('View')
    fireEvent.click(viewButton)

    // Click remove button
    const removeButton = screen.getByText('remove')
    fireEvent.click(removeButton)

    // Confirm should be called with the right message
    expect(window.confirm).toHaveBeenCalledWith('Remove blog "Test Blog Title" by Ashok?')
    expect(mockOnDelete).toHaveBeenCalledWith('12345')

    // Restore original confirm
    window.confirm = originalConfirm
  })

  test('does not call onDelete when confirmation is cancelled', () => {
    // Mock window.confirm to return false
    const originalConfirm = window.confirm
    window.confirm = vi.fn(() => false)

    render(<Blog blog={blog} onLike={mockOnLike} onDelete={mockOnDelete} />)

    // Make details visible
    const viewButton = screen.getByText('View')
    fireEvent.click(viewButton)

    // Click remove button
    const removeButton = screen.getByText('remove')
    fireEvent.click(removeButton)

    // Confirm should be called but onDelete should not
    expect(window.confirm).toHaveBeenCalledWith('Remove blog "Test Blog Title" by Ashok?')
    expect(mockOnDelete).not.toHaveBeenCalled()

    // Restore original confirm
    window.confirm = originalConfirm
  })

  test('shows author name after liking', () => {
    render(<Blog blog={blog} onLike={mockOnLike} onDelete={mockOnDelete} />)

    // Make details visible
    const viewButton = screen.getByText('View')
    fireEvent.click(viewButton)

    // Initially, author should appear once in "Author: Ashok"
    expect(screen.getByText(/Author:/)).toBeInTheDocument()

    // Click like button
    const likeButton = screen.getByText('like')
    fireEvent.click(likeButton)

    // After liking, there should be an additional "Ashok" text (from the liked state)
    const authorElements = screen.getAllByText((content, element) => {
      return element && element.textContent === 'Ashok'
    })
    expect(authorElements).toHaveLength(1) 
  })
})