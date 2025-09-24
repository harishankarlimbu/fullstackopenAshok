import { useNotification } from './NotificationContext.jsx'

const Notification = () => {
  const { state } = useNotification()

  if (!state) return null

  return (
    <div style={{ border: '1px solid black', background :"lightgrey", padding: 8, marginBottom:8 }}>
      {state}
    </div>
  )
}

export default Notification
