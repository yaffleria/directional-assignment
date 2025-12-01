import axios from 'axios'
import Cookies from 'js-cookie'
import { API } from '@repo/api'

// Base configuration
const CLIENT_BASE_URL = process.env.NODE_ENV === 'development' ? '/api' : 'https://fe-hiring-rest-api.vercel.app'
const SERVER_BASE_URL = 'https://fe-hiring-rest-api.vercel.app'

// Client-side instance
const axiosInstance = axios.create({
  baseURL: CLIENT_BASE_URL
})

// Function to set auth token (Client side)
export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    Cookies.set('token', token, { expires: 7 })
  } else {
    delete axiosInstance.defaults.headers.common['Authorization']
    Cookies.remove('token')
  }
}

// Initialize token from cookie on client startup
if (typeof window !== 'undefined') {
  const storedToken = Cookies.get('token')
  if (storedToken) {
    setAuthToken(storedToken)
  }
}

// Client-side singleton
export const api = new API(axiosInstance, CLIENT_BASE_URL)

// Server-side helper
export async function getServerApi() {
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  const serverInstance = axios.create({
    baseURL: SERVER_BASE_URL
  })

  if (token) {
    serverInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  return new API(serverInstance, SERVER_BASE_URL)
}
