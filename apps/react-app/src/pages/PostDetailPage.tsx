import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { Button, LoadingPage, CategoryBadge, Tag } from '@repo/components'
import { useDeletePost } from '../hooks/useDeletePost'
import { formatDateTime } from '../lib/date'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { useModal } from '../hooks/useModal'
import { PageHeader } from '../components/layout/PageHeader/PageHeader'
import { DeletePostModal } from '../components/DeletePostModal/DeletePostModal'

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const deleteModal = useModal()

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) throw new Error('No post ID')
      const response = await api.posts.postsDetail(id)
      return response.data
    },
    enabled: !!id
  })

  const { handleDelete, isPending: isDeleting } = useDeletePost({
    redirectTo: '/posts'
  })

  if (isLoading) {
    return <LoadingPage />
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Button onClick={() => navigate('/posts')}>Go back to posts</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <Button
          variant="ghost"
          onClick={() => navigate('/posts')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Posts
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/posts/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteModal.open()}
            disabled={isDeleting}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </PageHeader>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-card rounded-lg border p-8 shadow-sm">
          {/* Category and Date */}
          <div className="flex items-center gap-3 mb-4">
            <CategoryBadge category={post.category} />
            <span className="text-sm text-muted-foreground">{formatDateTime(post.createdAt)}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-6 text-foreground">{post.title}</h1>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {post.tags.map((tag) => (
                <Tag
                  key={tag}
                  className="rounded-full px-3 py-1 text-sm"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">{post.body}</div>
          </div>

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Post ID: {post.id}</p>
              <p>User ID: {post.userId}</p>
            </div>
          </div>
        </article>
      </div>

      <DeletePostModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={() => {
          if (id) {
            handleDelete(id)
            deleteModal.close()
          }
        }}
        isDeleting={isDeleting}
      />
    </div>
  )
}
