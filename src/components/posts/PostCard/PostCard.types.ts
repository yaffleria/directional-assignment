import type { Post } from "../../../api/data-contracts";

export interface PostCardProps {
  post: Post;
  onDeleteClick: (id: string) => void;
  isDeleting?: boolean;
}
