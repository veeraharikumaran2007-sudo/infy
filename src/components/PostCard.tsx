import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  Smile, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  Award,
  Megaphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post, User } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onLikeToggle: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenCommentsModal: (post: Post) => void;
  onDeletePost?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onLikeToggle,
  onSaveToggle,
  onAddComment,
  onOpenCommentsModal,
  onDeletePost,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger double-tap like heart animation
  const handleDoubleTap = () => {
    if (!post.isLiked) {
      onLikeToggle(post.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    setToastMessage('Work update link copied to clipboard! 📋');
    setTimeout(() => setToastMessage(null), 2200);
  };

  const canDelete = currentUser.role === 'admin' || currentUser.id === post.user.id;

  return (
    <article className="bg-white border border-rose-100 rounded-2xl mb-4 overflow-hidden max-w-[470px] mx-auto shadow-md shadow-rose-100/30">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4">
          {toastMessage}
        </div>
      )}

      {/* Official Announcement Header Pill */}
      {post.isOfficialAnnouncement && (
        <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 px-3.5 py-1.5 flex items-center justify-between text-[11px] font-bold text-white shadow-xs">
          <span 
            className="flex items-center gap-1.5"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <Megaphone size={14} /> Official Company Announcement
          </span>
          <span className="uppercase text-[9px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-xs font-mono">Pinned</span>
        </div>
      )}

      {/* Post Header with Department & Badge */}
      <div className="flex items-center justify-between p-3.5 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 cursor-pointer shadow-xs">
            <div className="w-full h-full rounded-full p-[1.5px] bg-white">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span 
                className="font-bold text-xs hover:underline cursor-pointer text-neutral-900"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {post.user.fullName}
              </span>
              <span className="text-[10px] text-neutral-400">@{post.user.username}</span>

              {/* Department Tag */}
              <span className="text-[9px] font-bold bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-200">
                {post.department}
              </span>

              {post.user.role === 'admin' && (
                <span className="text-[9px] font-extrabold bg-gradient-to-r from-red-600 to-pink-600 text-white px-1.5 py-0.2 rounded shadow-2xs">
                  ADMIN
                </span>
              )}
            </div>

            {/* Achievement Badge / Location */}
            <div className="flex items-center gap-2 mt-0.5">
              {post.badge && (
                <span className="text-[10px] font-bold text-rose-600 flex items-center gap-1">
                  <Award size={11} className="text-pink-500" /> {post.badge}
                </span>
              )}
              {post.location && (
                <span className="text-[10px] text-neutral-400 truncate max-w-[150px]">
                  • {post.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Options & Admin Delete */}
        <div className="flex items-center gap-1">
          {canDelete && onDeletePost && (
            <button
              onClick={() => onDeletePost(post.id)}
              className="text-neutral-400 hover:text-red-600 p-1.5 transition rounded-lg hover:bg-red-50"
              title={currentUser.role === 'admin' ? "Admin Delete Post" : "Delete Post"}
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            onClick={() => setShowOptionsModal(true)}
            className="text-neutral-400 hover:text-neutral-700 p-1"
          >
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Post Media (with double-tap detection) */}
      <div 
        className="relative aspect-square w-full bg-neutral-900 overflow-hidden cursor-pointer select-none"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={post.media[currentMediaIndex]}
          alt={post.caption}
          className="w-full h-full object-cover transition-transform duration-300"
          style={post.filter ? { filter: post.filter } : undefined}
        />

        {/* Double-tap burst heart animation in red & pink */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-2xl"
            >
              <Heart size={110} className="fill-rose-500 text-rose-500 drop-shadow-xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multiple images navigation arrows & dots */}
        {post.media.length > 1 && (
          <>
            {currentMediaIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex((prev) => prev - 1);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-neutral-800 shadow hover:scale-110 transition"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            {currentMediaIndex < post.media.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentMediaIndex((prev) => prev + 1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-neutral-800 shadow hover:scale-110 transition"
              >
                <ChevronRight size={18} />
              </button>
            )}

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-xs">
              {post.media.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentMediaIndex ? 'bg-rose-400 w-2.5 h-1.5' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="p-3.5 pb-1 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLikeToggle(post.id)}
              className="group transition-transform active:scale-125 focus:outline-none"
            >
              <Heart
                size={24}
                className={`transition-colors duration-200 ${
                  post.isLiked
                    ? 'fill-rose-600 text-rose-600 stroke-none animate-in zoom-in-75'
                    : 'text-neutral-700 hover:text-rose-500'
                }`}
              />
            </button>

            <button
              onClick={() => onOpenCommentsModal(post)}
              className="text-neutral-700 hover:text-rose-500 transition-transform active:scale-125"
            >
              <MessageCircle size={24} className="-rotate-90 stroke-[1.8px]" />
            </button>

            <button
              onClick={handleShare}
              className="text-neutral-700 hover:text-rose-500 transition-transform active:scale-125"
            >
              <Send size={22} className="stroke-[1.8px]" />
            </button>
          </div>

          <button
            onClick={() => onSaveToggle(post.id)}
            className="text-neutral-700 hover:text-rose-500 transition-transform active:scale-125"
          >
            <Bookmark
              size={22}
              className={`transition-colors duration-200 ${
                post.isSaved
                  ? 'fill-rose-600 text-rose-600'
                  : 'stroke-[1.8px]'
              }`}
            />
          </button>
        </div>

        {/* Likes Count in Red/Pink */}
        <div className="text-xs font-bold text-neutral-900 mb-1">
          <span className="text-rose-600">{post.likesCount.toLocaleString()}</span> colleagues reacted
        </div>

        {/* Caption */}
        <div className="text-xs text-neutral-800 leading-snug">
          <span 
            className="font-bold mr-1.5 cursor-pointer hover:underline text-neutral-900"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {post.user.fullName}
          </span>
          <span className={!isCaptionExpanded && post.caption.length > 90 ? 'line-clamp-2 inline' : 'inline'}>
            {post.caption}
          </span>
          {!isCaptionExpanded && post.caption.length > 90 && (
            <button
              onClick={() => setIsCaptionExpanded(true)}
              className="text-rose-500 hover:text-rose-700 text-xs ml-1 inline-block font-semibold"
            >
              more
            </button>
          )}
        </div>

        {/* View all comments button */}
        {post.comments.length > 0 && (
          <button
            onClick={() => onOpenCommentsModal(post)}
            className="text-rose-400 hover:text-rose-600 text-xs font-medium mt-1.5 hover:underline block"
          >
            View all {post.comments.length} comments
          </button>
        )}

        {/* Recent comments preview */}
        <div className="mt-1 flex flex-col gap-1">
          {post.comments.slice(-2).map((comment) => (
            <div key={comment.id} className="text-xs flex items-center justify-between group">
              <div>
                <span className="font-semibold mr-1.5 text-neutral-900">
                  {comment.user.fullName || comment.user.username}
                </span>
                <span className="text-neutral-700">{comment.text}</span>
              </div>
              <button className="text-neutral-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition p-1">
                <Heart size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Timestamp */}
        <div className="text-[10px] text-neutral-400 uppercase tracking-wide mt-2">
          {post.timestamp}
        </div>
      </div>

      {/* Inline Add Comment Input */}
      <form onSubmit={handleCommentSubmit} className="border-t border-rose-100 px-3.5 py-2.5 flex items-center gap-2 bg-rose-50/20">
        <button
          type="button"
          onClick={() => setCommentText((prev) => prev + ' 🚀')}
          className="text-rose-400 hover:text-rose-600 transition"
        >
          <Smile size={18} />
        </button>
        <input
          type="text"
          placeholder="Add colleague feedback or praise..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 bg-transparent text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none"
        />
        {commentText.trim() && (
          <button
            type="submit"
            className="text-rose-600 hover:text-rose-700 font-bold text-xs transition"
          >
            Post
          </button>
        )}
      </form>

      {/* Options Dialog */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden divide-y divide-rose-100 shadow-2xl animate-in zoom-in-95 duration-150">
            {canDelete && onDeletePost && (
              <button
                onClick={() => {
                  onDeletePost(post.id);
                  setShowOptionsModal(false);
                }}
                className="w-full py-3.5 text-center text-xs font-bold text-red-600 hover:bg-rose-50 transition"
              >
                Delete This Post
              </button>
            )}
            <button
              onClick={() => {
                handleShare();
                setShowOptionsModal(false);
              }}
              className="w-full py-3.5 text-center text-xs text-neutral-700 hover:bg-rose-50 transition"
            >
              Copy link to clipboard
            </button>
            <button
              onClick={() => setShowOptionsModal(false)}
              className="w-full py-3.5 text-center text-xs text-neutral-700 hover:bg-rose-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
