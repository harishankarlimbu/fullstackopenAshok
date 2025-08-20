const Filter = ({ filter, filterChange }) => {
  return (
    <div>
      Filter shown with: <input  type='text' value={filter} onChange={filterChange} />
    </div>
  )
}

export default Filter
