import { createContext, useContext, useReducer, useEffect } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    case 'CLEAR_USER':
      return null
    default:
      return state
  }
}

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  // Initialize user from localStorage on mount
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({ type: 'SET_USER', payload: user })
    }
  }, [])

  const loginUser = async (credentials) => {
    const loggedUser = await loginService.login(credentials)
    blogService.setToken(loggedUser.token)
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedUser))
    dispatch({ type: 'SET_USER', payload: loggedUser })
    return loggedUser
  }

  const logoutUser = () => {
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    dispatch({ type: 'CLEAR_USER' })
  }

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserContextProvider')
  }
  return context
}

