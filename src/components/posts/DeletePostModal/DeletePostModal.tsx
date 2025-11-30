import { Modal } from "../../ui/Modal/Modal";
import { Button } from "../../ui/Button/Button";

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeletePostModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeletePostModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Post"
      description="Are you sure you want to delete this post? This action cannot be undone."
      footer={
        <>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </>
      }
    />
  );
}
