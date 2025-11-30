import { useState, useCallback } from "react";
import { api } from "../api/client";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { Category, SortField, SortOrder } from "../api/data-contracts";
import { Button } from "../components/ui/Button/Button";
import { Input } from "../components/ui/Input/Input";
import { Select } from "../components/ui/Select/Select";
import { LoadingSpinner } from "../components/ui/LoadingSpinner/LoadingSpinner";
import { useDeletePost } from "../hooks/useDeletePost";
import { Search, Plus, LogOut } from "lucide-react";
import { useModal } from "../hooks/useModal";
import { PageHeader } from "../components/layout/PageHeader/PageHeader";
import { PostCard } from "../components/posts/PostCard/PostCard";
import { DeletePostModal } from "../components/posts/DeletePostModal/DeletePostModal";

export default function PostsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [sort, setSort] = useState<SortField>("createdAt" as SortField);
  const [order, setOrder] = useState<SortOrder>("desc" as SortOrder);
  const [cursors, setCursors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const deleteModal = useModal<string>();

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
                <PostCard
                  key={post.id}
                  post={post}
                  onDeleteClick={deleteModal.open}
                  isDeleting={isDeleting}
                />
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
