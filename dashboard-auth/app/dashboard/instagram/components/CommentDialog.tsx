"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { postComment, getComments, postReply, getReplies } from "@/services/instagramService";
import { toast } from "sonner";

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

export default function CommentDialog({ post }: { post: Post }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [loadingReplies, setLoadingReplies] = useState<Set<string>>(new Set());
  const [replyingToReply, setReplyingToReply] = useState<string | null>(null);
  const [nestedReplyInput, setNestedReplyInput] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getComments(post.id);
      setComments(data || []);
    } catch (error) {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (commentId: string) => {
    setLoadingReplies(prev => new Set([...prev, commentId]));
    try {
      const replies = await getReplies(commentId);
      setComments(prev => prev.map(comment => 
        comment._id === commentId 
          ? { ...comment, replies: replies || [] }
          : comment
      ));
      setExpandedReplies(prev => new Set([...prev, commentId]));
    } catch (error) {
      toast.error("Failed to load replies");
    } finally {
      setLoadingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleAddComment = async () => {
    const text = input.trim();
    if (!text || isPosting) return;

    setIsPosting(true);
    try {
      await postComment(post.id, text);
      setInput("");
      toast.success("Comment posted!");
      await fetchComments();
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setIsPosting(false);
    }
  };

  const handleAddReply = async (commentId: string, isNested = false) => {
    const text = isNested ? nestedReplyInput.trim() : replyInput.trim();
    if (!text || isReplying) return;

    setIsReplying(true);
    try {
      await postReply(commentId, text);
      if (isNested) {
        setNestedReplyInput("");
        setReplyingToReply(null);
      } else {
        setReplyInput("");
        setReplyingTo(null);
      }
      toast.success("Reply posted!");
      
      // Find the parent comment ID for nested replies
      const parentCommentId = isNested ? 
        comments.find(c => c.replies?.some(r => r._id === commentId))?._id || commentId :
        commentId;
      
      await fetchReplies(parentCommentId);
    } catch (error) {
      toast.error("Failed to post reply");
    } finally {
      setIsReplying(false);
    }
  };

  const toggleReplies = (commentId: string) => {
    if (expandedReplies.has(commentId)) {
      setExpandedReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    } else {
      fetchReplies(commentId);
    }
  };

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          fetchComments();
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="transition-transform hover:scale-110">
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden">
        <div className="bg-[#0f1724] text-white p-4 flex flex-col min-h-[60vh]">
          <DialogTitle className="text-base">Comments</DialogTitle>
          <DialogDescription className="text-sm text-gray-400 mb-3">
            Comment on @{post.username}'s post
          </DialogDescription>

          <div className="flex-1 overflow-auto space-y-3 pr-2">
            {/* caption as first comment-like item */}
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-sm">
                {post.avatar}
              </div>
              <div>
                <div className="text-sm">
                  <span className="font-semibold mr-2">{post.username}</span>
                  <span className="text-gray-200">{post.caption}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">{post.time}</div>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-gray-400">
                Loading comments...
              </div>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="space-y-2">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                      {c.userId.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-semibold mr-2">
                          {c.userId.username}
                        </span>
                        <span className="text-gray-200">{c.comment}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() =>
                            setReplyingTo(replyingTo === c._id ? null : c._id)
                          }
                          className="hover:text-gray-300"
                        >
                          Reply
                        </button>
                        {c.replies && c.replies.length > 0 && (
                          <button
                            onClick={() => toggleReplies(c._id)}
                            className="flex items-center gap-1 hover:text-gray-300"
                          >
                            {expandedReplies.has(c._id) ? (
                              <><ChevronUp className="w-3 h-3" /> Hide replies</>
                            ) : (
                              <><ChevronDown className="w-3 h-3" /> View {c.replies.length} replies</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {expandedReplies.has(c._id) && c.replies && (
                    <div className="ml-11 space-y-2">
                      {loadingReplies.has(c._id) ? (
                        <div className="text-xs text-gray-400">Loading replies...</div>
                      ) : (
                        c.replies.map((reply) => (
                          <div key={reply._id} className="space-y-2">
                            <div className="flex gap-2 items-start">
                              <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                                {reply.userId.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm">
                                  <span className="font-semibold mr-2 text-xs">
                                    {reply.userId.username}
                                  </span>
                                  <span className="text-gray-200 text-xs">{reply.comment}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                  <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                  <button
                                    onClick={() => setReplyingToReply(replyingToReply === reply._id ? null : reply._id)}
                                    className="hover:text-gray-300"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Nested Reply Input */}
                            {replyingToReply === reply._id && (
                              <div className="ml-8 flex items-center gap-2">
                                <input
                                  value={nestedReplyInput}
                                  onChange={(e) => setNestedReplyInput(e.target.value)}
                                  placeholder={`Reply to ${reply.userId.username}...`}
                                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-xs text-white placeholder:text-gray-500 outline-none"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleAddReply(reply._id, true);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => handleAddReply(reply._id, true)}
                                  disabled={isReplying || !nestedReplyInput.trim()}
                                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {isReplying ? "Sending..." : "Send"}
                                </button>
                              </div>
                            )}
                            
                            {/* Nested Replies */}
                            {reply.replies && reply.replies.length > 0 && (
                              <div className="ml-8 space-y-1">
                                {reply.replies.map((nestedReply) => (
                                  <div key={nestedReply._id} className="flex gap-2 items-start">
                                    <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center text-xs">
                                      {nestedReply.userId.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-xs">
                                        <span className="font-semibold mr-1">
                                          {nestedReply.userId.username}
                                        </span>
                                        <span className="text-gray-200">{nestedReply.comment}</span>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {new Date(nestedReply.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === c._id && (
                    <div className="ml-11 flex items-center gap-2">
                      <input
                        value={replyInput}
                        onChange={(e) => setReplyInput(e.target.value)}
                        placeholder={`Reply to ${c.userId.username}...`}
                        className="flex-1 bg-gray-800 rounded px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddReply(c._id, false);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleAddReply(c._id, false)}
                        disabled={isReplying || !replyInput.trim()}
                        className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isReplying ? "Sending..." : "Send"}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-gray-500"
              />
              <button
                onClick={() => handleAddComment()}
                disabled={isPosting || !input.trim()}
                className="text-sm font-semibold text-blue-400 disabled:opacity-50"
              >
                {isPosting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>

          <DialogClose asChild>
            <button className="sr-only">Close</button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
