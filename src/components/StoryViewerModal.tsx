import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { UserStory } from '../types';

interface StoryViewerModalProps {
  stories: UserStory[];
  initialUserIndex: number;
  onClose: () => void;
  onStorySeen: (storyId: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialUserIndex,
  onClose,
  onStorySeen,
}) => {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sentToast, setSentToast] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const currentStory = stories[currentUserIndex];
  const currentItem = currentStory?.items[currentItemIndex];

  // Mark current story as seen
  useEffect(() => {
    if (currentStory) {
      onStorySeen(currentStory.id);
    }
  }, [currentStory, onStorySeen]);

  // Timer loop for story progress
  useEffect(() => {
    if (isPaused || !currentItem) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextItem();
          return 0;
        }
        return prev + 2; // ~5 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused, currentItem, currentItemIndex, currentUserIndex]);

  const handleNextItem = () => {
    if (currentItemIndex < currentStory.items.length - 1) {
      setCurrentItemIndex((prev) => prev + 1);
      setProgress(0);
    } else if (currentUserIndex < stories.length - 1) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentItemIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex((prev) => prev - 1);
      setProgress(0);
    } else if (currentUserIndex > 0) {
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentItemIndex(stories[currentUserIndex - 1].items.length - 1);
      setProgress(0);
    }
  };

  const handleQuickReaction = (emoji: string) => {
    setSentToast(true);
    setTimeout(() => setSentToast(false), 2000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplyText('');
    setSentToast(true);
    setTimeout(() => setSentToast(false), 2000);
  };

  if (!currentStory || !currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md">
      {/* Top Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white transition rounded-full hover:bg-white/10"
      >
        <X size={28} />
      </button>

      {/* Prev / Next Story Arrows */}
      {(currentUserIndex > 0 || currentItemIndex > 0) && (
        <button
          onClick={handlePrevItem}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm z-50"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      <button
        onClick={handleNextItem}
        className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm z-50"
      >
        <ChevronRight size={28} />
      </button>

      {/* Main Story Container (Phone Aspect Ratio) */}
      <div 
        className="relative w-full max-w-[420px] h-[92vh] max-h-[820px] rounded-2xl overflow-hidden shadow-2xl bg-neutral-900 select-none flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Image / Media */}
        <img
          src={currentItem.mediaUrl}
          alt="Story content"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Top Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

        {/* Top Navigation & Progress Bars */}
        <div className="relative z-20 p-3 pt-4 flex flex-col gap-2">
          {/* Progress indicators for each item in the story */}
          <div className="flex items-center gap-1.5 w-full">
            {currentStory.items.map((item, idx) => {
              let fillPercent = 0;
              if (idx < currentItemIndex) fillPercent = 100;
              else if (idx === currentItemIndex) fillPercent = progress;

              return (
                <div key={item.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* User info header */}
          <div className="flex items-center justify-between text-white mt-1">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.user.avatar}
                alt={currentStory.user.username}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/50"
              />
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm drop-shadow">{currentStory.user.username}</span>
                <span className="text-white/60 text-xs">{currentItem.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused(!isPaused);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full transition"
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="p-1.5 hover:bg-white/10 rounded-full transition"
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Tap Zones (Left 40% prev, Right 60% next) */}
        <div className="absolute inset-0 z-10 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrevItem} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNextItem} />
        </div>

        {/* Bottom Reply Bar */}
        <div className="relative z-20 p-4 pb-6 flex flex-col gap-3">
          {sentToast && (
            <div className="self-center bg-white/90 text-black text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg animate-in fade-in zoom-in duration-200">
              Reaction sent to {currentStory.user.username}! ✨
            </div>
          )}

          {/* Quick Emoji Reactions */}
          <div className="flex items-center justify-around px-2 text-2xl drop-shadow">
            {['❤️', '🔥', '👏', '😂', '😍', '🙌'].map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickReaction(emoji);
                }}
                className="transform transition hover:scale-125 active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendReply} className="flex items-center gap-3">
            <input
              type="text"
              placeholder={`Reply to ${currentStory.user.username}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-black/40 border border-white/30 rounded-full px-4 py-2.5 text-white placeholder-white/60 text-sm focus:outline-none focus:border-white transition backdrop-blur-md"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 disabled:opacity-40 transition"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
