import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema, type PostFormData } from '@repo/schema'
import { api } from '../api/client'
import { Button } from '@repo/components'
import { Input } from '@repo/components'
import { Label } from '@repo/components'
import { Textarea } from '@repo/components'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/components'
import { PageHeader } from '../components/layout/PageHeader/PageHeader'
import { ArrowLeft } from 'lucide-react'
import type { Category } from '@repo/api'

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditing = id !== 'new' && !!id

  const { data: post } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id || id === 'new') return null
      const response = await api.posts.postsDetail(id)
      return response.data
    },
    enabled: isEditing
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: post
      ? {
          title: post.title,
          body: post.body,
          category: post.category,
          tags: post.tags.join(', ')
        }
      : {
          title: '',
          body: '',
          category: 'FREE' as Category,
          tags: ''
        }
  })

  const createMutation = useMutation({
    mutationFn: (data: PostFormData) => {
      const tags = Array.from(
        new Set(
          data.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
        )
      ).slice(0, 5)

      return api.posts.postsCreate({
        title: data.title,
        body: data.body,
        category: data.category as Category,
        tags
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      navigate('/posts')
    }
  })

  const updateMutation = useMutation({
    mutationFn: (data: PostFormData) => {
      if (!id) throw new Error('No post ID')
      const tags = Array.from(
        new Set(
          data.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
        )
      ).slice(0, 5)

      return api.posts.postsPartialUpdate(id, {
        title: data.title,
        body: data.body,
        category: data.category as Category,
        tags
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', id] })
      navigate(`/posts/${id}`)
    }
  })

  const onSubmit = async (data: PostFormData) => {
    if (isEditing) {
      await updateMutation.mutateAsync(data)
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <Button
          variant="ghost"
          onClick={() => navigate(isEditing ? `/posts/${id}` : '/posts')}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </Button>
        <h1 className="text-xl font-bold">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
        <div className="w-20"></div> {/* Spacer for alignment */}
      </PageHeader>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card rounded-lg border p-8 shadow-sm space-y-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter post title (max 80 characters)"
              {...register('title')}
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOTICE">Notice</SelectItem>
                    <SelectItem value="QNA">Q&A</SelectItem>
                    <SelectItem value="FREE">Free</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated, max 5)</Label>
            <Input
              id="tags"
              type="text"
              placeholder="e.g., react, typescript, tutorial"
              {...register('tags')}
              className={errors.tags ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">Separate tags with commas. Maximum 5 tags.</p>
            {errors.tags && <p className="text-xs text-destructive">{errors.tags.message}</p>}
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">
              Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="body"
              rows={12}
              placeholder="Enter post content (max 2000 characters)"
              {...register('body')}
              className={`resize-y ${errors.body ? 'border-destructive' : ''}`}
            />
            {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : isEditing ? 'Update Post' : 'Create Post'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(isEditing ? `/posts/${id}` : '/posts')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
