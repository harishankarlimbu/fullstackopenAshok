import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updated = action.payload
      return state.map(blog => {
        const blogId = blog.id || blog._id
        const updatedId = updated.id || updated._id
        return blogId === updatedId ? updated : blog
      })
    },
    removeBlog(state, action) {
      const idToRemove = action.payload
      return state.filter(blog => {
        const blogId = blog.id || blog._id
        return blogId !== idToRemove
      })
    }
  }
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogSlice.actions

// Thunk: initialize blogs from backend
export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

// Thunk: create a new blog
export const createBlog = (newBlog, user) => {
  return async dispatch => {
    const createdBlog = await blogService.create(newBlog)
    
    // enrich user to current user (so remove button shows immediately)
    const enrichedBlog = {
      ...createdBlog,
      user: createdBlog.user && typeof createdBlog.user === 'string'
        ? user
        : createdBlog.user
    }
    
    dispatch(appendBlog(enrichedBlog))
    return enrichedBlog
  }
}

// Thunk: like a blog
export const likeBlog = (blogId) => {
  return async (dispatch, getState) => {
    const blogs = getState().blogs
    const blog = blogs.find(b => b.id === blogId || b._id === blogId)
    if (!blog) return

    const updatedData = { likes: (blog.likes || 0) + 1 }
    const returned = await blogService.update(blogId, updatedData)

    const enriched = {
      ...returned,
      user: typeof returned.user === 'string' ? blog.user : returned.user
    }

    dispatch(updateBlog(enriched))
    return enriched
  }
}

// Thunk: delete a blog
export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(removeBlog(id))
  }
}

// Thunk: add a comment to a blog
export const addComment = (blogId, comment) => {
  return async (dispatch, getState) => {
    const returned = await blogService.addComment(blogId, comment)
    
    const blogs = getState().blogs
    const blog = blogs.find(b => (b.id || b._id) === blogId)
    
    const enriched = {
      ...returned,
      user: typeof returned.user === 'string' 
        ? blog?.user
        : returned.user
    }
    
    dispatch(updateBlog(enriched))
    return enriched
  }
}

export default blogSlice.reducer

