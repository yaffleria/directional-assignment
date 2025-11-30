import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

interface UseDeletePostOptions {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function useDeletePost(options?: UseDeletePostOptions) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.posts.postsDelete2(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (options?.redirectTo) {
        navigate(options.redirectTo);
      }
      options?.onSuccess?.();
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return {
    handleDelete,
    isPending: deleteMutation.isPending,
    isError: deleteMutation.isError,
    error: deleteMutation.error,
  };
}
