import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons'

const getAll = () => axios.get(baseUrl).then(res => res.data)
const create = person => axios.post(baseUrl, person).then(res => res.data)
const remove = id => axios.delete(`${baseUrl}/${id}`)

export default { getAll, create, remove }
