import React, { useState } from 'react';
import { X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from 'lucide-react';
import { Post, User } from '../types';

interface PostDetailModalProps {
  post: Post | null;
  currentUser: User;
  onClose: () => void;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  currentUser,
  onClose,
  onLikeToggle,
  onSaveToggle,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');

  if (!post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 md:p-6">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-neutral-300 p-2 z-50 transition"
      >
        <X size={28} />
      </button>

      {/* Main Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl overflow-hidden max-w-5xl w-full h-[90vh] max-h-[750px] flex flex-col md:flex-row shadow-2xl border border-rose-100"
      >
        {/* Left: Media */}
        <div className="w-full md:w-3/5 bg-neutral-900 flex items-center justify-center relative overflow-hidden">
          <img
            src={post.media[0]}
            alt={post.caption}
            className="w-full h-full object-contain md:object-cover"
            style={post.filter ? { filter: post.filter } : undefined}
          />
        </div>

        {/* Right: Comments & Details */}
        <div className="w-full md:w-2/5 flex flex-col justify-between bg-white h-full border-l border-rose-100">
          {/* Header */}
          <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/30">
            <div className="flex items-center gap-3">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-rose-200"
              />
              <div className="flex flex-col">
                <span 
                  className="font-bold text-xs hover:underline cursor-pointer text-neutral-900"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {post.user.fullName}
                </span>
                <span className="text-[10px] text-rose-600 font-medium">
                  {post.department} • {post.badge || 'Milestone'}
                </span>
              </div>
            </div>
            <button className="text-neutral-400 hover:text-neutral-700">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Scrollable Comments Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-white">
            {/* Caption as first comment */}
            <div className="flex items-start gap-3">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-rose-200"
              />
              <div className="flex-1 text-xs leading-relaxed">
                <span 
                  className="font-bold mr-1.5 text-neutral-900"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {post.user.fullName}
                </span>
                <span className="text-neutral-700">{post.caption}</span>
                <div className="text-[10px] text-neutral-400 mt-1">{post.timestamp}</div>
              </div>
            </div>

            {/* Other comments */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start justify-between gap-3 group">
                <div className="flex items-start gap-3">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.username}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-rose-100"
                  />
                  <div className="text-xs leading-relaxed">
                    <span 
                      className="font-bold mr-1.5 text-neutral-900"
                      style={{ fontFamily: '"Times New Roman", Times, serif' }}
                    >
                      {comment.user.fullName || comment.user.username}
                    </span>
                    <span className="text-neutral-700">{comment.text}</span>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1">
                      <span>{comment.timestamp}</span>
                      <span>{comment.likesCount} likes</span>
                      <button className="font-semibold text-rose-500 hover:underline">Reply</button>
                    </div>
                  </div>
                </div>

                <button className="text-neutral-300 hover:text-rose-500 pt-1">
                  <Heart size={13} className={comment.isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                </button>
              </div>
            ))}
          </div>

          {/* Action Bar & Add Comment Form */}
          <div className="border-t border-rose-100 p-4 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button onClick={() => onLikeToggle(post.id)}>
                  <Heart
                    size={24}
                    className={post.isLiked ? 'fill-rose-600 text-rose-600' : 'text-neutral-700 hover:text-rose-600'}
                  />
                </button>
                <button>
                  <MessageCircle size={24} className="-rotate-90 text-neutral-700 hover:text-rose-600" />
                </button>
                <button>
                  <Send size={22} className="text-neutral-700 hover:text-rose-600" />
                </button>
              </div>
              <button onClick={() => onSaveToggle(post.id)}>
                <Bookmark
                  size={22}
                  className={post.isSaved ? 'fill-rose-600 text-rose-600' : 'text-neutral-700 hover:text-rose-600'}
                />
              </button>
            </div>

            <div className="text-xs font-bold text-neutral-900 mb-0.5">
              <span className="text-rose-600">{post.likesCount.toLocaleString()}</span> colleagues reacted
            </div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wide mb-3">
              {post.timestamp}
            </div>

            {/* Input field */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2 border-t border-rose-100">
              <button
                type="button"
                onClick={() => setCommentText((prev) => prev + ' 👏')}
                className="text-rose-400 hover:text-rose-600"
              >
                <Smile size={18} />
              </button>
              <input
                type="text"
                placeholder="Add feedback or appreciation..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-transparent text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none"
              />
              {commentText.trim() && (
                <button
                  type="submit"
                  className="text-rose-600 font-bold text-xs hover:text-rose-700"
                >
                  Post
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
