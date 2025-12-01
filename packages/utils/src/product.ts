import type { Post } from '@repo/api'

export interface Product extends Post {
  price: number
  image: string
}

export const generateProductData = (post: Post): Product => {
  const hash = post.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
  const price = (hash % 100) * 1000 + 10000
  const image = `https://picsum.photos/seed/${post.id}/300/300`
  return { ...post, price, image }
}
