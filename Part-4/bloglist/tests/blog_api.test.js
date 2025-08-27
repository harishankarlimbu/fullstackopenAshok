const supertest = require('supertest');
const { test, describe, beforeEach , after} = require('node:test')
const assert = require('node:assert');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const initialBlogs = [
    { title: 'First', author: 'Alice', url: 'http://first.com', likes: 5 },
    { title: 'Second', author: 'Bob', url: 'http://second.com', likes: 10 },
  ];

  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }
});

test('blogs are returned as JSON', async () => {
  const response = await api.get('/api/blogs');
  assert.strictEqual(response.status, 200);
  assert.match(response.headers['content-type'], /application\/json/);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  assert.strictEqual(response.body.length, 2);
});

after(async () => {
  await mongoose.connection.close();
});


// 4.8 Identifier Property
test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  
  response.body.forEach(blog => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

// 4.9 Adding a New Blog
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Charlie',
    url: 'http://newblog.com',
    likes: 15
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 3)

  const titles = response.body.map(blog => blog.title)
  assert.ok(titles.includes('New Blog'))
})

//4.10-4.12 
describe('blog post validation', () => {
  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Eve',
      url: 'http://notitle.com',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400) 
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'No URL Blog',
      author: 'Frank',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400) 
  })
})

//4.13 Deletion of All Blogs
test('deletion of all blogs', async () => {
  await api
    .delete('/api/blogs')
    .expect(204)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, 0)
})

// 4.14 Default Likes Value
test('a blog’s likes can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToUpdate = blogsAtStart.body[0]
  const updatedData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  const blogsAtEnd = await api.get('/api/blogs')
  const updatedBlog = blogsAtEnd.body.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
})

