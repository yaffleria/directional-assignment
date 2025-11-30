import { useNavigate } from "react-router-dom";
import type { Post } from "../../api/data-contracts";
import { Button } from "../ui/Button";
import { CategoryBadge } from "../ui/CategoryBadge";
import { Tag } from "../ui/Tag";
import { formatDate } from "../../lib/date";

interface PostCardProps {
  post: Post;
  onDeleteClick: (id: string) => void;
  isDeleting?: boolean;
}

export function PostCard({ post, onDeleteClick, isDeleting }: PostCardProps) {
  const navigate = useNavigate();

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
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
          <p className="text-muted-foreground line-clamp-2 mb-3">{post.body}</p>
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
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
            onClick={() => onDeleteClick(post.id)}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
