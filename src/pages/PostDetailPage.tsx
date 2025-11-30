import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { Button } from "../components/ui/Button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      if (!id) throw new Error("No post ID");
      const response = await api.posts.postsDetail(id);
      return response.data;
    },
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("No post ID");
      return api.posts.postsDelete2(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/posts");
    },
  });

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteMutation.mutateAsync();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Button onClick={() => navigate("/posts")}>Go back to posts</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/posts")}
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
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="bg-card rounded-lg border p-8 shadow-sm">
          {/* Category and Date */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                post.category === "NOTICE"
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : post.category === "QNA"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              }`}
            >
              {post.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-6 text-foreground">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 text-sm bg-muted rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.body}
            </div>
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
    </div>
  );
}
