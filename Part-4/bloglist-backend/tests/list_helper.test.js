const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// 4.3 Dummy test
test('dummy returns one', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

// 4.4 Total Likes tests
describe('total likes', () => {
  const listWithOneBlog = [
    { title: 'A', author: 'Micheal', likes: 5 }
  ]

  const listWithMultipleBlogs = [
    { title: '1', author: 'Jackie', likes: 7 },
    { title: '2', author: 'Ashok', likes: 5 },
    { title: '3', author: 'Damodar', likes: 12 }
  ]

  test('one blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('multiple blogs', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 24)
  })

  test('empty list', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

// 4.5 Favorite Blog tests
describe('favorite blog', () => {
  const listWithOneBlog = [
    { title: 'A', author: 'Micheal', likes: 5 }
  ]

  const listWithMultipleBlogs = [
    { title: '1', author: 'Jackie', likes: 7 },
    { title: '2', author: 'Ashok', likes: 5 },
    { title: '3', author: 'Damodar', likes: 12 }
  ]

  test('one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, { title: 'A', author: 'Micheal', likes: 5 })
  })

  test('multiple blogs', () => {
    const result = listHelper.favoriteBlog(listWithMultipleBlogs)
    assert.deepStrictEqual(result, { title: '3', author: 'Damodar', likes: 12 })
  })

  test('empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})
// 4.6 Most Blogs tests
describe('most blogs', () => {
  const listWithMultipleBlogs = [
    { title: '1', author: 'Jackie', likes: 7 },
    { title: '2', author: 'Ashok', likes: 5 },
    { title: '3', author: 'Damodar', likes: 12 },
    { title: '4', author: 'Ashok', likes: 100 },
    { title: '5', author: 'Jackie', likes: 3 },
    { title: 'AUTOMATION', author: 'Ashok', likes: 100 },

  ]

  test('author with most blogs', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    assert.deepStrictEqual(result, { author: 'Ashok', blogs:3})
  })

  test('empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })
})
// 4.7 Most Likes tests
describe('most likes', () => {
  const listWithMultipleBlogs = [
    { title: '1', author: 'Jackie', likes: 7 },
    { title: '2', author: 'Ashok', likes: 5 },
    { title: '3', author: 'Damodar', likes: 12 },
    { title: 'REACT', author: 'Ashok', likes: 100 },
    { title: '5', author: 'Jackie', likes: 3 }
  ]

  test('author with most likes', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    assert.deepStrictEqual(result, { author: 'Ashok', likes: 105 })
  })

  test('empty list', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })
})

