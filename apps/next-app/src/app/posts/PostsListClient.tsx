'use client'

import { useState, useCallback } from 'react'
import { api, setAuthToken } from '../../api/client'
import { useInView } from 'react-intersection-observer'
import { useRouter } from 'next/navigation'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { Category, SortField, SortOrder } from '../../api/data-contracts'
import { Button, Input, LoadingSpinner } from '@repo/components'
import { useDeletePost } from '../../hooks/useDeletePost'
import { Search, Plus, LogOut } from 'lucide-react'
import { useModal } from '../../hooks/useModal'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { PostsTable } from '../../components/PostsTable/PostsTable'
import { DeletePostModal } from '../../components/DeletePostModal/DeletePostModal'

export default function PostsListClient() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [sort, setSort] = useState<SortField>('createdAt' as SortField)
  const [order, setOrder] = useState<SortOrder>('desc' as SortOrder)
  const deleteModal = useModal<string>()

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['posts', search, category, sort, order],
    queryFn: async ({ pageParam }) => {
      const response = await api.posts.postsList({
        limit: 20,
        search: search || undefined,
        category: category || undefined,
        sort,
        order,
        nextCursor: pageParam as string | undefined
      })
      return response.data
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60 * 1000
  })

  const posts = data?.pages.flatMap((page) => page.items ?? []) || []

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }
  })

  const { handleDelete, isPending: isDeleting } = useDeletePost()

  const handleLogout = () => {
    setAuthToken(null)
    router.push('/')
  }

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      refetch()
    },
    [refetch]
  )

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <h1 className="text-2xl font-bold text-foreground">Posts</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push('/posts/new')}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Post
          </Button>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
          >
            Dashboard
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </PageHeader>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex gap-2"
          >
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search posts by title or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex gap-4 flex-wrap">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as Category | '')
              }}
              className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Categories</option>
              <option value="NOTICE">Notice</option>
              <option value="QNA">Q&A</option>
              <option value="FREE">Free</option>
            </select>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortField)
              }}
              className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>

            <select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value as SortOrder)
              }}
              className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found. Create your first post!</p>
          </div>
        ) : (
          <>
            <PostsTable
              posts={posts}
              onDelete={deleteModal.open}
              isDeleting={isDeleting}
            />

            {hasNextPage && (
              <div
                ref={ref}
                className="mt-8 flex justify-center py-4"
              >
                {isFetchingNextPage && <LoadingSpinner />}
              </div>
            )}

            {!hasNextPage && posts.length > 0 && (
              <div className="mt-8 text-center py-4">
                <p className="text-sm text-muted-foreground">No more posts to load</p>
              </div>
            )}
          </>
        )}
      </div>

      <DeletePostModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={() => {
          if (deleteModal.data) {
            handleDelete(deleteModal.data)
            deleteModal.close()
          }
        }}
        isDeleting={isDeleting}
      />
    </div>
  )
}
