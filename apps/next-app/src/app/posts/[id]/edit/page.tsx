import { getServerApi } from '../../../../api/client'
import PostForm from '../../../../components/PostForm'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const api = await getServerApi()
  const response = await api.posts.postsDetail(id)
  const post = response.data

  return (
    <PostForm
      initialData={post}
      id={id}
    />
  )
}
