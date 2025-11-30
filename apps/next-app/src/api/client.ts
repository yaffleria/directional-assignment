import axios, { AxiosInstance } from 'axios'
import Cookies from 'js-cookie'
import { Auth } from './Auth'
import { Posts } from './Posts'
import { Mock } from './Mock'
import { Health } from './Health'

// Base configuration
const CLIENT_BASE_URL = '/api'
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

export class API {
  public auth: Auth
  public posts: Posts
  public mock: Mock
  public health: Health
  public instance: AxiosInstance

  constructor(instance: AxiosInstance, baseURL: string) {
    this.instance = instance

    this.auth = new Auth({ baseURL })
    this.posts = new Posts({ baseURL })
    this.mock = new Mock({ baseURL })
    this.health = new Health({ baseURL })

    this.auth.instance = instance
    this.posts.instance = instance
    this.mock.instance = instance
    this.health.instance = instance
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
