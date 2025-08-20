const Person = ({ persons ,onDelete}) => (

  <ul>
    {persons.map((p) => (
      <li key={p.id}>{p.name} {p.number}
      <button onClick={()=>onDelete(p.id)}> Delete</button>
       </li>
     
    ))}
  </ul>
)

export default Person;