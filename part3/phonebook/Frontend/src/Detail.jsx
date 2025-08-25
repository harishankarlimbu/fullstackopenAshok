const Detail = ({ newName, newPhone, onNameChange, onPhoneChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input type ='text' value={newName} onChange={onNameChange} />
      </div>
      <div>
        phone: <input value={newPhone} onChange={onPhoneChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default Detail
