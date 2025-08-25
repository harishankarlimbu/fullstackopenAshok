import { useState, useEffect } from 'react'
import Filter from './Filter'
import Person from './Person'
import Detail from './Detail'
import personService from './services/person'
import Notification from './Notification'
import "./index.css"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const showNotification = (text, type = "success") => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 3000)
  }

  useEffect(() => {
    personService.getAll().then(data => setPersons(data))
  }, [])

  const filteredPersons = persons.filter(person =>
    (person.name || "").toLowerCase().includes(filter.toLowerCase())
  )

  const handleAdd = (e) => {
    e.preventDefault()

   


    if (!newName.trim() || !newPhone.trim()) {
      alert('Name or number cannot be empty')
      return
    }

     if (newName.trim().length < 3) {
      showNotification("Name must be at least 3 characters long", "error");
      return;
    }
    if (!/^\d{2,3}-\d+$/.test(newPhone)) {
      showNotification("Phone number must be in format XX-XXXX... or XXX-XXXX... and at least 8 characters long", "error");
      return;
    }

    if (newPhone.length < 8) {
      showNotification("Phone number must be at least 8 characters long", "error");
      return;
    }

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added, replace the number?`)) {
        const updatedPerson = { ...existingPerson, number: newPhone };

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id === existingPerson.id ? returnedPerson : p));
            setNewName('');
            setNewPhone('');
            showNotification(`Updated ${newName}'s number`);
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              showNotification(
                `Information of ${newName} has already been removed from server`,
                "error"
              );
              setPersons(persons.filter(p => p.id !== existingPerson.id));
            } else {

              showNotification(`Failed to update ${newName}'s number`, "error");
            }
          });
      }
    } else {
      const newPerson = { name: newName, number: newPhone };

      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewPhone('');
          showNotification(`Added ${newName}`);
        })
        .catch(() => showNotification("Failed to add person", "error"));
    }

  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (!person) return
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(id)
        .then(() => setPersons(persons.filter(p => p.id !== id)))
        .catch(() => showNotification(`Failed to delete ${person.name}`, "error"))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />

      <Filter filter={filter} filterChange={(e) => setFilter(e.target.value)} />

      <h3>Add a new</h3>
      <Detail
        newName={newName}
        newPhone={newPhone}
        onNameChange={(e) => setNewName(e.target.value)}
        onPhoneChange={(e) => setNewPhone(e.target.value)}
        onSubmit={handleAdd}
      />

      <h3>Numbers</h3>
      <Person persons={filteredPersons} onDelete={handleDelete} />
    </div>
  )
}

export default App
