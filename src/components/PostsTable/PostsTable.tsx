import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "../../api/data-contracts";
import { CategoryBadge } from "../CategoryBadge/CategoryBadge";
import { formatDate } from "../../lib/date";
import { Button } from "../Button/Button";
import { Edit, Trash2, Settings, Eye, EyeOff } from "lucide-react";

interface PostsTableProps {
  posts: Post[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

type ColumnId =
  | "id"
  | "title"
  | "category"
  | "createdAt"
  | "userId"
  | "actions";

interface ColumnDef {
  id: ColumnId;
  label: string;
  minWidth: number;
}

const COLUMNS: ColumnDef[] = [
  { id: "id", label: "ID", minWidth: 80 },
  { id: "title", label: "Title", minWidth: 200 },
  { id: "category", label: "Category", minWidth: 100 },
  { id: "userId", label: "Author", minWidth: 100 },
  { id: "createdAt", label: "Date", minWidth: 150 },
  { id: "actions", label: "Actions", minWidth: 100 },
];

export function PostsTable({ posts, onDelete, isDeleting }: PostsTableProps) {
  const navigate = useNavigate();
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    id: 100,
    title: 400,
    category: 120,
    userId: 150,
    createdAt: 180,
    actions: 120,
  });
  const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>([
    "title",
    "category",
    "userId",
    "createdAt",
    "actions",
  ]);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const resizingRef = useRef<{
    columnId: string;
    startX: number;
    startWidth: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    resizingRef.current = {
      columnId,
      startX: e.clientX,
      startWidth: columnWidths[columnId],
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!resizingRef.current) return;
    const { columnId, startX, startWidth } = resizingRef.current;
    const diff = e.clientX - startX;
    const newWidth = Math.max(50, startWidth + diff);
    setColumnWidths((prev) => ({ ...prev, [columnId]: newWidth }));
  };

  const handleMouseUp = () => {
    resizingRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const toggleColumn = (columnId: ColumnId) => {
    if (columnId === "actions") return; // Actions always visible
    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowColumnSelector(!showColumnSelector)}
          className="flex items-center gap-2"
        >
          <Settings size={16} />
          Columns
        </Button>
        {showColumnSelector && (
          <div className="absolute right-0 top-10 z-10 w-48 rounded-md border bg-popover p-2 shadow-md bg-white">
            <div className="space-y-1">
              {COLUMNS.filter((col) => col.id !== "actions").map((col) => (
                <div
                  key={col.id}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-accent cursor-pointer"
                  onClick={() => toggleColumn(col.id)}
                >
                  {visibleColumns.includes(col.id) ? (
                    <Eye size={16} className="text-primary" />
                  ) : (
                    <EyeOff size={16} className="text-muted-foreground" />
                  )}
                  <span className="text-sm">{col.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground font-medium">
            <tr>
              {COLUMNS.filter((col) => visibleColumns.includes(col.id)).map(
                (col) => (
                  <th
                    key={col.id}
                    className="relative px-4 py-3 select-none"
                    style={{ width: columnWidths[col.id] }}
                  >
                    <div className="flex items-center justify-between">
                      {col.label}
                      {col.id !== "actions" && (
                        <div
                          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50"
                          onMouseDown={(e) => handleMouseDown(e, col.id)}
                        />
                      )}
                    </div>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-muted/50 transition-colors">
                {visibleColumns.includes("id") && (
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[100px]">
                    {post.id}
                  </td>
                )}
                {visibleColumns.includes("title") && (
                  <td className="px-4 py-3">
                    <span
                      className="font-medium cursor-pointer hover:underline"
                      onClick={() => navigate(`/posts/${post.id}`)}
                    >
                      {post.title}
                    </span>
                  </td>
                )}
                {visibleColumns.includes("category") && (
                  <td className="px-4 py-3">
                    <CategoryBadge category={post.category} />
                  </td>
                )}
                {visibleColumns.includes("userId") && (
                  <td className="px-4 py-3 text-muted-foreground">
                    {post.userId}
                  </td>
                )}
                {visibleColumns.includes("createdAt") && (
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(post.createdAt)}
                  </td>
                )}
                {visibleColumns.includes("actions") && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/posts/${post.id}`)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(post.id)}
                        disabled={isDeleting}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
