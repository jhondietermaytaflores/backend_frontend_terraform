import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:3001/api", // cambia al backend real
    timeout: 10000 ,
    headers: {
    'Content-Type': 'application/json'}
})
