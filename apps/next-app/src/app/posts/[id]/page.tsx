import { getServerApi } from '../../../api/client'
import PostDetailClient from './PostDetailClient'

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const api = await getServerApi()
  const response = await api.posts.postsDetail(id)
  const post = response.data

  return <PostDetailClient post={post} />
}
