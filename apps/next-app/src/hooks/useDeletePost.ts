import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { api } from '../api/client'

interface UseDeletePostOptions {
  onSuccess?: () => void
  redirectTo?: string
}

export function useDeletePost(options?: UseDeletePostOptions) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.posts.postsDelete2(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      if (options?.redirectTo) {
        router.push(options.redirectTo)
      }
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
