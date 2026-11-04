import React from 'react';
import { Plus } from 'lucide-react';
import { UserStory, User } from '../types';

interface StoriesTrayProps {
  stories: UserStory[];
  currentUser: User;
  onSelectStory: (index: number) => void;
  openCreateModal: () => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  stories,
  currentUser,
  onSelectStory,
  openCreateModal,
}) => {
  return (
    <div className="flex items-center gap-4 py-3.5 px-3 overflow-x-auto no-scrollbar scroll-smooth">
      {/* Current User Add Story */}
      <div 
        onClick={openCreateModal}
        className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
      >
        <div className="relative w-16 h-16 rounded-full p-[2px] transition-transform duration-200 group-hover:scale-105">
          <img
            src={currentUser.avatar}
            alt="Your story"
            className="w-full h-full rounded-full object-cover ring-2 ring-rose-200"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-pink-600 border-2 border-white flex items-center justify-center text-white shadow-xs">
            <Plus size={14} className="stroke-[3px]" />
          </div>
        </div>
        <span 
          className="text-[11px] text-neutral-600 font-medium truncate max-w-[70px]"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Daily Work
        </span>
      </div>

      {/* Colleague Stories */}
      {stories.map((story, index) => {
        return (
          <div
            key={story.id}
            onClick={() => onSelectStory(index)}
            className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 group"
          >
            <div
              className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                story.seen
                  ? 'ring-1.5 ring-rose-200'
                  : 'bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 shadow-md shadow-rose-200'
              }`}
            >
              <div className="w-full h-full rounded-full p-[2px] bg-white">
                <img
                  src={story.user.avatar}
                  alt={story.user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span 
              className="text-[11px] text-neutral-800 font-medium truncate max-w-[74px]"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {story.user.fullName.split(' ')[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
};
