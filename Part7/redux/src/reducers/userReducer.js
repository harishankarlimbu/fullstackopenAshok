import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    }
  }
})

export const { setUser, clearUser } = userSlice.actions

// Thunk: initialize user from localStorage
export const initializeUser = () => {
  return dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

// Thunk: login user
export const loginUser = (credentials) => {
  return async dispatch => {
    const loggedUser = await loginService.login(credentials)
    blogService.setToken(loggedUser.token)
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedUser))
    dispatch(setUser(loggedUser))
    return loggedUser
  }
}

// Thunk: logout user
export const logoutUser = () => {
  return dispatch => {
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch(clearUser())
  }
}

export default userSlice.reducer

