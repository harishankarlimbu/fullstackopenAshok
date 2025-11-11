import { createContext, useContext, useReducer, useRef } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return { message: '', type: '' }
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, { message: '', type: '' })
  const timeoutRef = useRef(null)

  const showNotification = (message, type = 'success', seconds = 3) => {
    dispatch({ type: 'SET_NOTIFICATION', payload: { message, type } })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_NOTIFICATION' })
      timeoutRef.current = null
    }, seconds * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationContextProvider')
  }
  return context
}

