import axios from 'axios'
import { API } from '@repo/api'

// Create axios instance with base configuration
const baseURL = import.meta.env.DEV ? '/api' : 'https://fe-hiring-rest-api.vercel.app'

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL
})

// Function to set auth token
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axiosInstance.defaults.headers.common['Authorization']
  }
}

// Initialize token from localStorage on startup
const storedToken = localStorage.getItem('token')
if (storedToken) {
  setAuthToken(storedToken)
}

export const api = new API(axiosInstance, baseURL)
