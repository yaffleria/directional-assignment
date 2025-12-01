'use client'

import { useRouter } from 'next/navigation'
import { api } from '../../../api/client'
import { Button, CategoryBadge, Tag, DeletePostModal } from '@repo/components'
import { useDeletePost, useModal } from '@repo/hooks'
import { formatDateTime } from '@repo/utils'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import type { Post } from '@repo/api'

interface PostDetailClientProps {
  post: Post
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const router = useRouter()
  const deleteModal = useModal()

  const { handleDelete, isPending: isDeleting } = useDeletePost({
    api,
    onSuccess: () => router.push('/posts')
  })

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <Button
          variant="ghost"
          onClick={() => router.push('/posts')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Posts
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/posts/${post.id}/edit`)}
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
          if (post.id) {
            handleDelete(post.id)
            deleteModal.close()
          }
        }}
        isDeleting={isDeleting}
      />
    </div>
  )
}
