import axios from "axios";

const baseUrl = "http://localhost:5000/anecdotes";

export const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
   
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch anecdotes");
  }
};

export const createNew = async (anecdoteData) => {
  try {
    const cleanedData = {
      content:
        typeof anecdoteData.content === "string"
          ? anecdoteData.content
          : anecdoteData.content.content ||
            JSON.stringify(anecdoteData.content),
      votes: anecdoteData.votes || 0,
    };
    const response = await axios.post(baseUrl, cleanedData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create anecdote");
  }
};

export const updateAnecdote = async (id, updatedData) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedData);  
    return response.data;
  } catch (error) {
    throw new Error("Failed to update anecdote");
  } 
};
