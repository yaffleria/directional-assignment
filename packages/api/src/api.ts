import type { AxiosInstance } from 'axios'
import { Auth } from './Auth'
import { Posts } from './Posts'
import { Mock } from './Mock'
import { Health } from './Health'

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
