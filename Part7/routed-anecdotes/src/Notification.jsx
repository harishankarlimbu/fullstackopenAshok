const Notification = ({ message }) => {
  if (!message) return null;
  const style = {
    padding: 8,
    border: '3px solid #0f0404ff',
    background: '#16aa3bff',
    marginBottom: 10,
    borderRadius: 4,
  };
  return <div style={style}>{message}</div>;
};

export default Notification;
