import React from 'react';
import { Home, Compass, Film, PlusSquare, Heart, Send, ShieldCheck, Users2 } from 'lucide-react';
import { ActiveTab, User } from '../types';
import { BrandLogo } from './BrandLogo';

interface MobileNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCreateModal: () => void;
  currentUser: User;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  openCreateModal,
  currentUser,
  unreadMessagesCount,
  unreadNotificationsCount,
}) => {
  return (
    <>
      {/* Top Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-rose-100 px-3 flex items-center justify-between z-40">
        <BrandLogo size="md" />

        <div className="flex items-center gap-2">
          {/* Direct Employees Directory link on top header for all employees */}
          <button
            onClick={() => setActiveTab('employees-directory')}
            className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition shadow-xs ${
              activeTab === 'employees-directory'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <Users2 size={12} />
            <span>Employees</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition shadow-xs ${
                activeTab === 'admin-dashboard'
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              <ShieldCheck size={12} className="text-rose-600" />
              <span>Admin</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-1 text-neutral-800"
          >
            <Heart size={20} className={activeTab === 'notifications' ? 'stroke-[2.5px] text-rose-600' : 'stroke-[1.8px]'} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className="relative p-1 text-neutral-800"
          >
            <Send size={20} className={activeTab === 'messages' ? 'stroke-[2.5px] text-rose-600' : 'stroke-[1.8px]'} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-0.5 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                {unreadMessagesCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-rose-100 px-2 flex items-center justify-around z-40 shadow-lg shadow-rose-100/50">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 text-neutral-800"
          title="Company Feed"
        >
          <Home size={22} className={activeTab === 'home' ? 'stroke-[2.5px] text-rose-600' : 'stroke-[1.8px] text-neutral-600'} />
        </button>

        <button
          onClick={() => setActiveTab('employees-directory')}
          className="p-2 text-neutral-800"
          title="Employees Page"
        >
          <Users2 size={22} className={activeTab === 'employees-directory' ? 'stroke-[2.5px] text-rose-600' : 'stroke-[1.8px] text-neutral-600'} />
        </button>

        <button
          onClick={openCreateModal}
          className="p-2"
          title="Share Update"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-pink-600 text-white flex items-center justify-center shadow-sm">
            <PlusSquare size={18} />
          </div>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className="p-2 text-neutral-800"
          title="Work Clips"
        >
          <Film size={22} className={activeTab === 'reels' ? 'stroke-[2.5px] text-rose-600' : 'stroke-[1.8px] text-neutral-600'} />
        </button>

        {currentUser.role === 'admin' ? (
          <button
            onClick={() => setActiveTab('admin-dashboard')}
            className="p-2"
            title="Admin Portal"
          >
            <ShieldCheck size={22} className={activeTab === 'admin-dashboard' ? 'text-rose-600 stroke-[2.5px]' : 'text-neutral-600 stroke-[1.8px]'} />
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('explore')}
            className="p-2 text-neutral-800"
            title="Explore"
          >
            <Compass size={22} className={activeTab === 'explore' ? 'stroke-[2.5px] text-rose-600' : 'stroke-[1.8px] text-neutral-600'} />
          </button>
        )}

        <button
          onClick={() => setActiveTab('profile')}
          className="p-1"
          title="Profile"
        >
          <div className={`w-7 h-7 rounded-full p-[1px] ${
            activeTab === 'profile' ? 'ring-2 ring-rose-600' : 'ring-1 ring-rose-200'
          }`}>
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </button>
      </nav>
    </>
  );
};
