import axios from 'axios'
const baseUrl = 'http://localhost:5000/anecdotes'

export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

export const updateVote= async(content)=>{
  const updatedVote={...content,votes:content.votes+1}
  const response=await axios.put(`${baseUrl}/${content.id}`,updatedVote)
  return response.data
}