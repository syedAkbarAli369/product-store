import { useState } from "react";
import { SendIcon, Trash2Icon, MessageSquareIcon, LogInIcon } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import { useCreateComment, useDeleteComment } from "../hooks/useComment";
import { Link } from "react-router";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  imageUrl: string | null;
}

interface Comment {
  id: string;
  content: string;
  userId: number;
  productId: string;
  createdAt: string;
  user?: User;
}

interface CommentsSectionProps {
  productId: string;
  comments?: Comment[];
  currentUserId: number | null;
}

const getUserInitial = (user?: User) => {
  if (!user?.name) return "?";
  return user.name.charAt(0).toUpperCase();
};

const CommentsSection = ({ productId, comments = [], currentUserId }: CommentsSectionProps) => {
  const { isAuthenticated } = useAuthContext();
  const [content, setContent] = useState("");
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment(productId);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment.mutate(
      { productId, content },
      {
        onSuccess: () => setContent(""),
        onError: (err) => console.error("Create comment error: ", err),
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (!deletingCommentId) return;
    deleteComment.mutate(deletingCommentId, {
      onSuccess: () => {
        toast.success("Comment deleted successfully");
        setDeletingCommentId(null);
      },
      onError: (err) => {
        toast.error("Failed to delete comment");
        console.error(err);
        setDeletingCommentId(null);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="size-5 text-primary" />
        <h3 className="font-bold">Comments</h3>
        <span className="badge badge-neutral badge-sm">{comments.length}</span>
      </div>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="input input-bordered input-sm flex-1 bg-base-200"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={createComment.isPending}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm btn-square"
            disabled={createComment.isPending || !content.trim()}
          >
            {createComment.isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <SendIcon className="size-4" />
            )}
          </button>
        </form>
      ) : (
        <div className="flex items-center justify-between bg-base-200 rounded-lg p-3">
          <span className="text-sm text-base-content/60">
            Sign in to join the conversation
          </span>
          <Link to="/register" className="btn btn-primary btn-sm gap-1">
            <LogInIcon className="size-4" />
            Sign In
          </Link>
        </div>
      )}

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-base-content/50">
            <MessageSquareIcon className="size-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No comments yet. Be first!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="chat chat-start">
              <div className="chat-image avatar">
                {comment.user?.imageUrl ? (
                  <div className="w-9 rounded-full">
                    <img
                      src={comment.user.imageUrl}
                      alt={comment.user.name || "User"}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-9 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-bold">
                    {getUserInitial(comment.user)}
                  </div>
                )}
              </div>

              <div className="chat-header text-xs opacity-70 mb-2">
                {comment.user?.name}
                <time className="ml-2 text-xs opacity-50">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </div>

              <div className="w-full flex items-center gap-1">
                <div className="chat-bubble chat-bubble-neutral text-sm">
                  {comment.content}
                </div>

                {currentUserId === comment.userId && (
                  <div className="chat-footer">
                    <button
                      onClick={() => setDeletingCommentId(comment.id)}
                      className="btn btn-ghost btn-xs text-error"
                      disabled={deleteComment.isPending && deletingCommentId === comment.id}
                    >
                      {deleteComment.isPending && deletingCommentId === comment.id ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <Trash2Icon className="size-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation modal - outside the comment loop */}
      {deletingCommentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="card bg-base-200 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-error">Confirm Deletion</h2>
              <p>Are you sure you want to delete this comment? This action cannot be undone.</p>
              <div className="card-actions justify-end mt-4">
                <button
                  className="btn btn-ghost"
                  onClick={() => setDeletingCommentId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-error"
                  onClick={handleDeleteConfirm}
                  disabled={deleteComment.isPending}
                >
                  {deleteComment.isPending ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;