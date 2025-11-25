"use client";

import { useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  postComment,
  getComments,
  postReply,
  getReplies,
} from "@/services/instagramService";
import { toast } from "sonner";
import {
  logActivityAsync,
  refreshActivity,
} from "@/store/slices/instagramSlice";
import { useAppDispatch } from "@/store/hooks";
import { ActivityLogRequest } from "@/types/instagram";
import { Button } from "@/components/ui/button";

interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: string;
  caption: string;
  time: string;
}

interface Comment {
  _id: string;
  userId: {
    username: string;
  };
  comment: string;
  createdAt: string;
  parentId?: string;
  replies?: Comment[];
}

// Memoized Avatar Component
const Avatar = memo(
  ({
    username,
    size = "default",
  }: {
    username: string;
    size?: "default" | "small" | "tiny";
  }) => {
    const sizeClasses = {
      default: "w-8 h-8 text-sm",
      small: "w-6 h-6 text-xs",
      tiny: "w-5 h-5 text-xs",
    };

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0`}
      >
        {username.charAt(0).toUpperCase()}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

// Memoized Reply Input Component
const ReplyInput = memo(
  ({
    value,
    onChange,
    onSubmit,
    placeholder,
    isSubmitting,
    buttonSize = "default",
  }: {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder: string;
    isSubmitting: boolean;
    buttonSize?: "default" | "small";
  }) => {
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onSubmit();
        }
      },
      [onSubmit]
    );

    const buttonClasses =
      buttonSize === "small" ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm";

    const inputClasses =
      buttonSize === "small" ? "text-xs py-1 px-2" : "text-sm py-2 px-3";

    return (
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-1 bg-gray-700 rounded ${inputClasses} text-white placeholder:text-gray-500 outline-none`}
          autoFocus
        />
        <button
          onClick={onSubmit}
          disabled={isSubmitting || !value.trim()}
          className={`${buttonClasses} bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors`}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </div>
    );
  }
);
ReplyInput.displayName = "ReplyInput";

// Memoized Nested Reply Component
const NestedReply = memo(({ reply }: { reply: Comment }) => (
  <div className="flex gap-2 items-start">
    <Avatar username={reply.userId.username} size="tiny" />
    <div className="flex-1 min-w-0">
      <div className="text-xs">
        <span className="font-semibold mr-1">{reply.userId.username}</span>
        <span className="text-gray-200">{reply.comment}</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {new Date(reply.createdAt).toLocaleDateString()}
      </div>
    </div>
  </div>
));
NestedReply.displayName = "NestedReply";

// Memoized Reply Component
const Reply = memo(
  ({
    reply,
    onReply,
    isReplying,
    replyInput,
    onReplyInputChange,
    onSubmitReply,
  }: {
    reply: Comment;
    onReply: (replyId: string) => void;
    isReplying: boolean;
    replyInput: string;
    onReplyInputChange: (value: string) => void;
    onSubmitReply: () => void;
  }) => (
    <div className="space-y-2">
      <div className="flex gap-2 items-start">
        <Avatar username={reply.userId.username} size="small" />
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span className="font-semibold mr-2 text-xs">
              {reply.userId.username}
            </span>
            <span className="text-gray-200 text-xs">{reply.comment}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
            <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
            <button
              onClick={() => onReply(reply._id)}
              className="hover:text-gray-300 transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-8">
          <ReplyInput
            value={replyInput}
            onChange={onReplyInputChange}
            onSubmit={onSubmitReply}
            placeholder={`Reply to ${reply.userId.username}...`}
            isSubmitting={false}
            buttonSize="small"
          />
        </div>
      )}

      {reply.replies && reply.replies.length > 0 && (
        <div className="ml-8 space-y-1">
          {reply.replies.map((nestedReply) => (
            <NestedReply key={nestedReply._id} reply={nestedReply} />
          ))}
        </div>
      )}
    </div>
  )
);
Reply.displayName = "Reply";

// Main Comment Component
const CommentItem = memo(
  ({
    comment,
    onToggleReplies,
    isExpanded,
    isLoadingReplies,
    onReplyToComment,
    onReplyToReply,
    isReplyingToComment,
    isReplyingToReply,
    replyInput,
    nestedReplyInput,
    onReplyInputChange,
    onNestedReplyInputChange,
    onSubmitReply,
    onSubmitNestedReply,
  }: {
    comment: Comment;
    onToggleReplies: () => void;
    isExpanded: boolean;
    isLoadingReplies: boolean;
    onReplyToComment: () => void;
    onReplyToReply: (replyId: string) => void;
    isReplyingToComment: boolean;
    isReplyingToReply: string | null;
    replyInput: string;
    nestedReplyInput: string;
    onReplyInputChange: (value: string) => void;
    onNestedReplyInputChange: (value: string) => void;
    onSubmitReply: () => void;
    onSubmitNestedReply: (replyId: string) => void;
  }) => (
    <div className="space-y-2">
      <div className="flex gap-3 items-start">
        <Avatar username={comment.userId.username} />
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <span className="font-semibold mr-2">
              {comment.userId.username}
            </span>
            <span className="text-gray-200">{comment.comment}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 flex-wrap">
            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
            <button
              onClick={onReplyToComment}
              className="hover:text-gray-300 transition-colors"
            >
              Reply
            </button>
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={onToggleReplies}
                className="flex items-center gap-1 hover:text-gray-300 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" /> Hide replies
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" /> View{" "}
                    {comment.replies.length} replies
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {isExpanded && comment.replies && (
        <div className="ml-11 space-y-2">
          {isLoadingReplies ? (
            <div className="text-xs text-gray-400">Loading replies...</div>
          ) : (
            comment.replies.map((reply) => (
              <Reply
                key={reply._id}
                reply={reply}
                onReply={onReplyToReply}
                isReplying={isReplyingToReply === reply._id}
                replyInput={nestedReplyInput}
                onReplyInputChange={onNestedReplyInputChange}
                onSubmitReply={() => onSubmitNestedReply(reply._id)}
              />
            ))
          )}
        </div>
      )}

      {isReplyingToComment && (
        <div className="ml-11">
          <ReplyInput
            value={replyInput}
            onChange={onReplyInputChange}
            onSubmit={onSubmitReply}
            placeholder={`Reply to ${comment.userId.username}...`}
            isSubmitting={false}
          />
        </div>
      )}
    </div>
  )
);
CommentItem.displayName = "CommentItem";

export default function CommentDialog({ post }: { post: Post }) {
  const dispatch = useAppDispatch();
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(
    new Set()
  );
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const [replyingToReply, setReplyingToReply] = useState<string | null>(null);
  const [nestedReplyInput, setNestedReplyInput] = useState("");

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getComments(post.id);
      setComments(data || []);
    } catch (error) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [post.id]);

  const fetchReplies = useCallback(async (commentId: string) => {
    setLoadingReplies((prev) => new Set([...prev, commentId]));
    try {
      const replies = await getReplies(commentId);
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId
            ? { ...comment, replies: replies || [] }
            : comment
        )
      );
      setExpandedReplies((prev) => new Set([...prev, commentId]));
    } catch (error) {
      toast.error("Failed to load replies");
    } finally {
      setLoadingReplies((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  }, []);

  const logActivity = useCallback(
    (activityData: ActivityLogRequest) => {
      dispatch(logActivityAsync(activityData));
    },
    [dispatch]
  );

  const handleAddComment = useCallback(async () => {
    const text = input.trim();
    if (!text || isPosting) return;

    setIsPosting(true);
    try {
      await postComment(post.id, text);
      logActivity({
        type: "POST_COMMENT",
        post: post.id.toString(),
        metadata: {
          comment: text,
          postUsername: post.username,
        },
      });
      setInput("");
      toast.success("Comment posted!");
      await fetchComments();
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  }, [input, isPosting, post.id, post.username, logActivity, fetchComments]);

  const handleAddReply = useCallback(
    async (commentId: string, isNested = false) => {
      const text = isNested ? nestedReplyInput.trim() : replyInput.trim();
      if (!text || isReplying) return;

      setIsReplying(true);
      try {
        await postReply(commentId, text);
        logActivity({
          type: "POST_COMMENT",
          post: post.id.toString(),
          metadata: {
            reply: text,
            commentId: commentId,
            postUsername: post.username,
            isNested,
          },
        });

        if (isNested) {
          setNestedReplyInput("");
          setReplyingToReply(null);
        } else {
          setReplyInput("");
          setReplyingTo(null);
        }
        toast.success("Reply posted!");

        const parentCommentId = isNested
          ? comments.find((c) => c.replies?.some((r) => r._id === commentId))
              ?._id || commentId
          : commentId;

        await fetchReplies(parentCommentId);
      } catch (error) {
        toast.error("Failed to post reply");
      } finally {
        setIsReplying(false);
      }
    },
    [
      replyInput,
      nestedReplyInput,
      isReplying,
      post.id,
      post.username,
      comments,
      logActivity,
      fetchReplies,
    ]
  );

  const toggleReplies = useCallback(
    (commentId: string) => {
      if (expandedReplies.has(commentId)) {
        setExpandedReplies((prev) => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
      } else {
        fetchReplies(commentId);
      }
    },
    [expandedReplies, fetchReplies]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        fetchComments();
      } else {
        dispatch(refreshActivity());
      }
    },
    [fetchComments, dispatch]
  );

  const handleKeyDownComment = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAddComment();
      }
    },
    [handleAddComment]
  );

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="transition-transform hover:scale-110"
          aria-label="View comments"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden">
        <div className="bg-[#0f1724] text-white p-4 flex flex-col min-h-[60vh] max-h-[80vh]">
          <DialogTitle className="text-base">Comments</DialogTitle>
          <DialogDescription className="text-sm text-gray-400 mb-3">
            Comment on @{post.username}'s post
          </DialogDescription>

          <div className="flex-1 overflow-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {/* Caption */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm flex-shrink-0">
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm">
                  <span className="font-semibold mr-2">{post.username}</span>
                  <span className="text-gray-200">{post.caption}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{post.time}</div>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-gray-400 py-8">
                Loading comments...
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  onToggleReplies={() => toggleReplies(comment._id)}
                  isExpanded={expandedReplies.has(comment._id)}
                  isLoadingReplies={loadingReplies.has(comment._id)}
                  onReplyToComment={() =>
                    setReplyingTo(
                      replyingTo === comment._id ? null : comment._id
                    )
                  }
                  onReplyToReply={setReplyingToReply}
                  isReplyingToComment={replyingTo === comment._id}
                  isReplyingToReply={replyingToReply}
                  replyInput={replyInput}
                  nestedReplyInput={nestedReplyInput}
                  onReplyInputChange={setReplyInput}
                  onNestedReplyInputChange={setNestedReplyInput}
                  onSubmitReply={() => handleAddReply(comment._id, false)}
                  onSubmitNestedReply={(replyId) =>
                    handleAddReply(replyId, true)
                  }
                />
              ))
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDownComment}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
              />
              <button
                onClick={handleAddComment}
                disabled={isPosting || !input.trim()}
                className="text-sm font-semibold text-blue-400 disabled:opacity-50 hover:text-blue-300 transition-colors"
              >
                {isPosting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
