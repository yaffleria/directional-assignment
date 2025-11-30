import { useState, useCallback, useEffect } from "react";
import { api } from "../api/client";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { Category, SortField, SortOrder } from "../api/data-contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "../components/LoadingSpinner/LoadingSpinner";
import { useDeletePost } from "../hooks/useDeletePost";
import { Search, Plus, LogOut } from "lucide-react";
import { useModal } from "../hooks/useModal";
import { PageHeader } from "../components/layout/PageHeader/PageHeader";
import { PostsTable } from "../components/PostsTable/PostsTable";
import { DeletePostModal } from "../components/DeletePostModal/DeletePostModal";

export default function PostsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [sort, setSort] = useState<SortField>("createdAt" as SortField);
  const [order, setOrder] = useState<SortOrder>("desc" as SortOrder);
  const deleteModal = useModal<string>();

  // Infinite query for posts with cursor-based pagination
  // The API supports bidirectional pagination (prevCursor/nextCursor)
  // For infinite scroll (loading more posts as you scroll down), we only use nextCursor
  // prevCursor would be used if we wanted to load older posts by scrolling up
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", search, category, sort, order],
    queryFn: async ({ pageParam }) => {
      const response = await api.posts.postsList({
        limit: 20,
        search: search || undefined,
        category: category || undefined,
        sort,
        order,
        // pageParam contains the nextCursor from the previous page
        // First page: pageParam is undefined, so we get the initial posts
        // Subsequent pages: pageParam contains the nextCursor to fetch next posts
        nextCursor: pageParam,
      });
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    // Extract nextCursor from last page for fetching the next page
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60,
  });

  // Flatten all pages into a single posts array
  const posts = data?.pages.flatMap((page) => page.items) || [];

  // Infinite scroll trigger
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  const { handleDelete, isPending: isDeleting } = useDeletePost();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      refetch();
    },
    [refetch]
  );

  const resetPagination = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <h1 className="text-2xl font-bold text-foreground">Posts</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/posts/new")}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            New Post
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Dashboard
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut size={16} />
          </Button>
        </div>
      </PageHeader>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
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
                setCategory(e.target.value as Category | "");
                resetPagination();
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
                setSort(e.target.value as SortField);
                resetPagination();
              }}
              className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>

            <select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value as SortOrder);
                resetPagination();
              }}
              className="h-9 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No posts found. Create your first post!
            </p>
          </div>
        ) : (
          <>
            <PostsTable
              posts={posts}
              onDelete={deleteModal.open}
              isDeleting={isDeleting}
            />

            {/* Infinite Scroll Trigger */}
            {hasNextPage && (
              <div ref={ref} className="mt-8 flex justify-center py-4">
                {isFetchingNextPage && <LoadingSpinner />}
              </div>
            )}

            {/* End of list indicator */}
            {!hasNextPage && posts.length > 0 && (
              <div className="mt-8 text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No more posts to load
                </p>
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
            handleDelete(deleteModal.data);
            deleteModal.close();
          }
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
}
