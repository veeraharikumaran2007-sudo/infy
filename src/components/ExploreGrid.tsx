import React from 'react';
import { Heart, MessageCircle, Film } from 'lucide-react';
import { EXPLORE_ITEMS } from '../mockData';
import { Post } from '../types';

interface ExploreGridProps {
  onSelectPost: (post: Post) => void;
}

export const ExploreGrid: React.FC<ExploreGridProps> = ({ onSelectPost }) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-2 md:px-6 bg-white min-h-[85vh]">
      <div className="mb-4">
        <h2 
          className="text-base font-bold text-neutral-900"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Explore Company Work & Innovations
        </h2>
        <p className="text-xs text-neutral-500">
          Discover cross-department projects, technical blogs, and team highlights
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1 md:gap-4">
        {EXPLORE_ITEMS.map((item, idx) => {
          const mockPost: Post = {
            id: item.id,
            companyId: 'c1',
            user: {
              id: 'exp_u_' + idx,
              companyId: 'c1',
              username: 'team_contributor_' + (idx + 1),
              fullName: 'Infynux Contributor ' + (idx + 1),
              avatar: `https://images.unsplash.com/photo-${1534528741775 + idx}?auto=format&fit=crop&w=400&q=80`,
              role: 'employee',
              department: (item.dept as any) || 'Engineering',
              designation: 'Specialist',
              followersCount: 30,
              followingCount: 15,
              bio: 'Cross-functional creator @ Infynux Solutions',
            },
            media: [item.url],
            caption: `Cross-department showcase for ${item.dept}. Delivering high impact solutions together! 🚀 #Infynux #Collaborate`,
            department: item.dept,
            likesCount: item.likes,
            isLiked: false,
            isSaved: false,
            timestamp: '2 DAYS AGO',
            comments: [],
          };

          return (
            <div
              key={item.id}
              onClick={() => onSelectPost(mockPost)}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl bg-neutral-100 shadow-xs"
            >
              <img
                src={item.url}
                alt="Explore item"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute top-2 left-2 z-10 bg-white/90 text-rose-600 border border-rose-100 text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs">
                {item.dept}
              </div>

              {item.isReel && (
                <div className="absolute top-2 right-2 text-white drop-shadow">
                  <Film size={18} />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6 text-white font-bold text-xs">
                <div className="flex items-center gap-1.5">
                  <Heart size={16} className="fill-white" />
                  <span>{item.likes}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle size={16} className="fill-white -rotate-90" />
                  <span>{item.comments}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
