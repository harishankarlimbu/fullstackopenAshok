import { createSlice } from '@reduxjs/toolkit'

let timeoutId = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', type: '' },
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return { message: '', type: '' }
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

// Thunk action creator: shows notification and clears it after specified seconds
export const showNotification = (message, type = 'success', seconds = 3) => {
  return dispatch => {
    dispatch(setNotification({ message, type }))

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
      timeoutId = null
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer

