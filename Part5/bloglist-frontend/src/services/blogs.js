import axios from 'axios'
const baseUrl = 'http://localhost:5000/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

const create = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}
const update = async (id, blogObject) => {
  const config = { headers: { Authorization: token } }
  const res = await axios.put(`${baseUrl}/${id}`, blogObject, config)
  return res.data
}

const remove = async id => {
  const config = { headers: { Authorization: token } }
  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}

export default { getAll, setToken ,create, update, remove }