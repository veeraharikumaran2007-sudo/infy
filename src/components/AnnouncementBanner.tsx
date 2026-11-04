import React from 'react';
import { Megaphone } from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementBannerProps {
  announcements: Announcement[];
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ announcements }) => {
  if (announcements.length === 0) return null;

  const latest = announcements[0];

  return (
    <div className="bg-gradient-to-r from-rose-50 via-pink-50/80 to-red-50 border border-rose-200 rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md shadow-rose-300/40">
          <Megaphone size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span 
              className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-200/60 px-2 py-0.5 rounded-full"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Official Announcement
            </span>
            <span className="text-[10px] text-neutral-400">• {latest.timestamp}</span>
          </div>
          <h4 
            className="text-xs font-bold text-neutral-900 mt-1"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {latest.title}
          </h4>
          <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
            {latest.content}
          </p>
          <div className="text-[10px] text-neutral-500 mt-1">
            Broadcasted by <strong className="text-rose-600">{latest.author}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
