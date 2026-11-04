import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreVertical, 
  Volume2, 
  VolumeX, 
  Music2, 
  Play, 
  Pause,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { INITIAL_REELS } from '../mockData';
import { Reel } from '../types';

export const ReelsViewer: React.FC = () => {
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showToast, setShowToast] = useState<string | null>(null);

  const currentReel = reels[currentIndex];
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          return {
            ...r,
            isLiked: !r.isLiked,
            likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1,
          };
        }
        return r;
      })
    );
  };

  const toggleSave = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === reelId ? { ...r, isSaved: !r.isSaved } : r))
    );
  };

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleShare = () => {
    setShowToast('Reel link copied! 🎥');
    setTimeout(() => setShowToast(null), 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-[85vh] py-4 relative">
      {showToast && (
        <div className="fixed top-20 z-50 bg-white dark:bg-neutral-800 text-black dark:text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl">
          {showToast}
        </div>
      )}

      {/* Vertical navigation buttons */}
      <div className="hidden md:flex flex-col gap-3 absolute right-12 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 transition"
        >
          <ChevronUp size={24} />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === reels.length - 1}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 transition"
        >
          <ChevronDown size={24} />
        </button>
      </div>

      {/* Reel Card Container */}
      <div className="flex items-end gap-4 max-w-[440px] w-full">
        {/* Main Video Frame */}
        <div 
          onClick={togglePlay}
          className="relative w-full aspect-[9/16] max-h-[780px] rounded-2xl overflow-hidden bg-black shadow-2xl cursor-pointer group select-none"
        >
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />

          {/* Top Audio Mute Toggle */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* Center Play/Pause indicator when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-black/50 text-white flex items-center justify-center">
                <Play size={32} className="ml-1" />
              </div>
            </div>
          )}

          {/* Bottom Overlay: Creator info, caption, audio */}
          <div className="absolute bottom-4 left-4 right-4 z-20 text-white space-y-3 pointer-events-none">
            {/* Creator Chip */}
            <div className="flex items-center gap-3 pointer-events-auto">
              <img
                src={currentReel.user.avatar}
                alt={currentReel.user.username}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white/60"
              />
              <span className="font-semibold text-sm drop-shadow">{currentReel.user.username}</span>
              <button className="text-xs font-semibold px-3 py-1 rounded-lg border border-white/60 text-white hover:bg-white hover:text-black transition">
                Follow
              </button>
            </div>

            {/* Caption */}
            <p className="text-xs drop-shadow leading-relaxed pointer-events-auto line-clamp-2">
              {currentReel.caption}
            </p>

            {/* Music track */}
            <div className="flex items-center gap-2 text-xs text-white/90 pointer-events-auto">
              <Music2 size={14} className="animate-pulse" />
              <span className="truncate max-w-[240px]">{currentReel.audioTitle}</span>
            </div>
          </div>
        </div>

        {/* Right Floating Actions (Instagram Reels column) */}
        <div className="flex flex-col items-center gap-5 pb-3">
          {/* Like */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggleLike(currentReel.id)}
              className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition active:scale-125"
            >
              <Heart
                size={26}
                className={currentReel.isLiked ? 'fill-[#ed4956] text-[#ed4956]' : 'text-neutral-800 dark:text-neutral-200'}
              />
            </button>
            <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
              {(currentReel.likesCount / 1000).toFixed(1)}K
            </span>
          </div>

          {/* Comment */}
          <div className="flex flex-col items-center gap-1">
            <button className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition active:scale-125">
              <MessageCircle size={26} className="-rotate-90 text-neutral-800 dark:text-neutral-200" />
            </button>
            <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
              {currentReel.commentsCount}
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition active:scale-125"
            >
              <Send size={24} className="text-neutral-800 dark:text-neutral-200" />
            </button>
            <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
              {(currentReel.sharesCount / 1000).toFixed(1)}K
            </span>
          </div>

          {/* Save */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => toggleSave(currentReel.id)}
              className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition active:scale-125"
            >
              <Bookmark
                size={24}
                className={currentReel.isSaved ? 'fill-black dark:fill-white text-black dark:text-white' : 'text-neutral-800 dark:text-neutral-200'}
              />
            </button>
          </div>

          {/* More options */}
          <button className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
            <MoreVertical size={20} className="text-neutral-800 dark:text-neutral-200" />
          </button>

          {/* Spinning Audio Disc */}
          <div className="w-8 h-8 rounded-full border-2 border-neutral-700 overflow-hidden animate-spin-slow">
            <img
              src={currentReel.user.avatar}
              alt="audio disc"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
