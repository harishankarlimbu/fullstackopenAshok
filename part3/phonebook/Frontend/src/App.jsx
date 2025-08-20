import { useState, useEffect } from 'react'
import axios from 'axios'
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
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  useEffect(() => {
    personService.getAll().then(data => {
      setPersons(data)
    })
  }, []);

  const filteredPersons = persons.filter(person =>
    (person.name || "").toLowerCase().includes(filter.toLowerCase())
  )

  const handleAdd = (e) => {
    e.preventDefault()

    if (newName.trim() === '') {
      alert('Empty name field')
      return
    }

    if (newPhone.trim() === '') {
      alert('Empty number field')
      return
    }

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newPhone }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(data => {
            setPersons(persons.map(p => p.id === existingPerson.id ? data : p))
            setNewName('')
            setNewPhone('')
            showNotification(`Updated ${newName}'s number`, "success")

          })
          .catch(error => {
            showNotification(`Information of ${newName} has already been removed from server`, "error")
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    }
    else {
      const newPerson = { name: newName, number: newPhone }

      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(returnedPerson)
          setNewName('')
          setNewPhone('')
          showNotification(`Added ${newName}`, "success")
        })
        .catch(error => {
          showNotification("Failed to add person", "error")

        })
    }
  }

  const handleDelete = (id) => {
    const name = persons.find(p => p.id === id).name
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }



  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />

      <Filter
        filter={filter}
        filterChange={(e) => setFilter(e.target.value)}
      />

      <h3>Add a new</h3>

      <Detail
        newName={newName}
        newPhone={newPhone}
        onNameChange={(e) => setNewName(e.target.value)}
        onPhoneChange={(e) => setNewPhone(e.target.value)}
        onSubmit={handleAdd}
      />

      <h3>Numbers</h3>

      <Person
        persons={filteredPersons}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default App
