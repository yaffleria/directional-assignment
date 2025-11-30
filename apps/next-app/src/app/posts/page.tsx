import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import PostsListClient from './PostsListClient'
import { getServerApi } from '../../api/client'
import { SortField, SortOrder } from '../../api/data-contracts'

export default async function PostsPage() {
  const queryClient = new QueryClient()
  const api = await getServerApi()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['posts', '', '', 'createdAt', 'desc'],
    queryFn: async () => {
      const response = await api.posts.postsList({
        limit: 20,
        sort: SortField.CreatedAt,
        order: SortOrder.Desc
      })
      return response.data
    },
    initialPageParam: undefined
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsListClient />
    </HydrationBoundary>
  )
}
