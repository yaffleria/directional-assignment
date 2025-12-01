import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { API } from '@repo/api'

interface UseDeletePostOptions {
  api: API
  onSuccess?: () => void
}

export function useDeletePost(options: UseDeletePostOptions) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => options.api.posts.postsDelete2(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      options?.onSuccess?.()
    }
  })

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  return {
    handleDelete,
    isPending: deleteMutation.isPending,
    isError: deleteMutation.isError,
    error: deleteMutation.error
  }
}
