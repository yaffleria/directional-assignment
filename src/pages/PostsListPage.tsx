import { useState, useCallback } from "react";
import { api } from "../api/client";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Category, SortField, SortOrder } from "../api/data-contracts";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { CategoryBadge } from "../components/ui/CategoryBadge";
import { useDeletePost } from "../hooks/useDeletePost";
import { formatDate } from "../lib/date";
import { Search, Plus, LogOut } from "lucide-react";

export default function PostsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [sort, setSort] = useState<SortField>("createdAt" as SortField);
  const [order, setOrder] = useState<SortOrder>("desc" as SortOrder);
  const [cursors, setCursors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["posts", search, category, sort, order, currentPage],
    queryFn: async () => {
      const nextCursor = cursors[currentPage];
      const response = await api.posts.postsList({
        limit: 20,
        search: search || undefined,
        category: category || undefined,
        sort,
        order,
        nextCursor,
      });
      return response.data;
    },
    staleTime: 1000 * 60,
  });

  const posts = data?.items || [];
  const nextCursor = data?.nextCursor;

  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && nextCursor && !cursors.includes(nextCursor)) {
        setCursors((prev) => [...prev, nextCursor]);
        setCurrentPage((prev) => prev + 1);
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
      setCursors([]);
      setCurrentPage(0);
      refetch();
    },
    [refetch]
  );

  const resetPagination = () => {
    setCursors([]);
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
        </div>
      </header>

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
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as Category | "");
                resetPagination();
              }}
            >
              <option value="">All Categories</option>
              <option value="NOTICE">Notice</option>
              <option value="QNA">Q&A</option>
              <option value="FREE">Free</option>
            </Select>

            <Select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortField);
                resetPagination();
              }}
            >
              <option value="createdAt">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </Select>

            <Select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value as SortOrder);
                resetPagination();
              }}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </Select>
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
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CategoryBadge category={post.category} />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <h2
                        className="text-xl font-semibold mb-2 cursor-pointer hover:text-primary"
                        onClick={() => navigate(`/posts/${post.id}`)}
                      >
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground line-clamp-2 mb-3">
                        {post.body}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs bg-muted rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/posts/${post.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {nextCursor && (
              <div ref={ref} className="mt-8 flex justify-center py-4">
                <LoadingSpinner />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
