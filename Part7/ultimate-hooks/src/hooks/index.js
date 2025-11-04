import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const getAll = async () => {
      try {
        const response = await axios.get(baseUrl)
        setResources(response.data)
      } catch (error) {
        console.error('Error fetching resources:', error)
      }
    }
    getAll()
  }, [baseUrl])

  const create = async (newObject) => {
    try {
      const response = await axios.post(baseUrl, newObject)
      setResources(prevResources => prevResources.concat(response.data))
      return response.data
    } catch (error) {
      console.error('Error creating resource:', error)
      throw error
    }
  }

  const service = {
    create
  }

  return [resources, service]
}

