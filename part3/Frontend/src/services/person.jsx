import axios from "axios";
const Url='http://localhost:3001/api/persons'
const getAll=()=> axios.get(Url).then (response=> response.data)
const create =(newPerson)=>axios.put(Url,newPerson).then(response=>response.data);
const remove=(id)=>axios.delete(`${Url}/${id}`).then(response=>response.data)
const update=(id,updatePerson)=> axios.put(`${Url}/${id}`,updatePerson).then(response=>response.data)
export default{getAll,create,remove,update}