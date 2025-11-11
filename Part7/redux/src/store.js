import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from './reducers/notificationReducer.js'
import blogReducer from './reducers/blogReducer.js'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer
  }
})

export default store

