import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Compass, 
  Film, 
  Send, 
  Heart, 
  PlusSquare, 
  Menu, 
  Moon, 
  Sun, 
  ShieldCheck,
  Building2,
  Users2,
  UserCheck,
  LogOut
} from 'lucide-react';
import { ActiveTab, User, Company } from '../types';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCreateModal: () => void;
  openWorkspaceModal: () => void;
  currentUser: User;
  currentCompany: Company;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  allUsers: User[];
  onSwitchUser: (user: User) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openCreateModal,
  openWorkspaceModal,
  currentUser,
  currentCompany,
  isDark,
  setIsDark,
  unreadMessagesCount,
  unreadNotificationsCount,
  allUsers,
  onSwitchUser,
  onLogout,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  const navItems = [
    { id: 'home', label: 'Company Feed', icon: Home },
    ...(currentUser.role === 'admin' ? [{ id: 'admin-dashboard', label: 'Admin Portal', icon: ShieldCheck, highlight: true }] : []),
    { id: 'employees-directory', label: 'Directory', icon: Users2 },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'explore', label: 'Explore Work', icon: Compass },
    { id: 'reels', label: 'Work Clips', icon: Film },
    { 
      id: 'messages', 
      label: 'Comms', 
      icon: Send, 
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined 
    },
    { 
      id: 'notifications', 
      label: 'Activity', 
      icon: Heart, 
      hasDot: unreadNotificationsCount > 0 
    },
    { 
      id: 'create', 
      label: 'Share Update', 
      icon: PlusSquare, 
      action: openCreateModal 
    },
    { 
      id: 'profile', 
      label: 'My Profile', 
      isProfile: true 
    },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-18 xl:w-64 border-r border-rose-100 bg-white px-3 py-5 z-40 transition-all duration-300 justify-between shadow-xs">
      {/* Top Branding & Workspace Selector */}
      <div className="flex flex-col gap-4">
        <div className="px-2 xl:px-4 py-1" onClick={() => setActiveTab('home')}>
          <div className="hidden xl:block">
            <BrandLogo size="md" companyName={currentCompany.name} />
          </div>
          <div className="block xl:hidden">
            <BrandLogo collapsed size="md" />
          </div>
        </div>

        {/* Workspace Pill Button in Rose & Pink */}
        <button
          onClick={openWorkspaceModal}
          className="mx-1 p-2 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/80 hover:border-rose-300 transition flex items-center justify-between text-left group shadow-xs"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Building2 size={15} />
            </div>
            <div className="hidden xl:block truncate">
              <div 
                className="text-[9px] uppercase font-bold text-rose-600 tracking-wider"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                Workspace
              </div>
              <div 
                className="text-xs font-bold text-neutral-800 truncate"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {currentCompany.name}
              </div>
            </div>
          </div>
          <span className="hidden xl:inline text-[10px] text-rose-500 group-hover:text-rose-700 font-semibold">Switch ▾</span>
        </button>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.id as ActiveTab);
                  }
                }}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group relative text-left w-full ${
                  isActive 
                    ? 'font-bold text-rose-600 bg-rose-50 border border-rose-100 shadow-2xs' 
                    : 'font-medium text-neutral-600 hover:text-rose-600 hover:bg-rose-50/50'
                } ${item.highlight ? 'text-rose-600 font-bold' : ''}`}
              >
                {item.isProfile ? (
                  <div className={`w-7 h-7 rounded-full p-[1.5px] transition-transform group-hover:scale-105 ${
                    isActive ? 'ring-2 ring-rose-500' : 'ring-1 ring-rose-200'
                  }`}>
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative flex items-center justify-center">
                    {Icon && (
                      <Icon
                        size={22}
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'stroke-[2.5px] text-rose-600' : 'stroke-[1.8px]'
                        } ${item.highlight ? 'text-rose-600' : ''}`}
                      />
                    )}
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-red-600 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                        {item.badge}
                      </span>
                    )}
                    {item.hasDot && (
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-red-600 to-pink-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>
                )}

                <span 
                  className="hidden xl:inline text-xs tracking-tight"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {item.label}
                </span>

                {isActive && (
                  <span className="hidden xl:block ml-auto w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-600 to-pink-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Switch Role & More Menu */}
      <div className="relative flex flex-col gap-2">
        {/* Quick Role / User Switcher Drawer */}
        {showUserSwitcher && (
          <div className="absolute bottom-16 left-2 w-64 bg-white rounded-2xl shadow-2xl border border-rose-100 p-2.5 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div 
              className="text-[10px] font-bold uppercase tracking-wider text-rose-500 px-2 py-1"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Switch Account ({currentCompany.name})
            </div>
            {allUsers
              .filter((u) => u.companyId === currentCompany.id)
              .map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    onSwitchUser(user);
                    setShowUserSwitcher(false);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition ${
                    user.id === currentUser.id
                      ? 'bg-rose-50 border border-rose-200'
                      : 'hover:bg-rose-50/50'
                  }`}
                >
                  <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full object-cover ring-1 ring-rose-200" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-800 truncate">
                        {user.fullName}
                      </span>
                      {user.role === 'admin' ? (
                        <span className="text-[8px] bg-rose-600 text-white font-extrabold px-1 rounded">ADMIN</span>
                      ) : (
                        <span className="text-[8px] bg-pink-100 text-pink-700 font-bold px-1 rounded">EMP</span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-400 block truncate">{user.designation}</span>
                  </div>
                </button>
              ))}
          </div>
        )}

        {/* More Menu */}
        {showMoreMenu && (
          <div className="absolute bottom-16 left-2 w-56 bg-white rounded-2xl shadow-2xl border border-rose-100 p-2 flex flex-col gap-1 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <button
              onClick={() => {
                setShowUserSwitcher(!showUserSwitcher);
                setShowMoreMenu(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-xs font-semibold text-neutral-800 w-full transition"
            >
              <UserCheck size={16} className="text-rose-500" />
              <span>Switch Demo Account</span>
            </button>
            <button
              onClick={() => {
                setIsDark(!isDark);
                setShowMoreMenu(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-xs font-semibold text-neutral-800 w-full transition"
            >
              {isDark ? <Sun size={16} className="text-rose-500" /> : <Moon size={16} className="text-pink-600" />}
              <span>{isDark ? 'Light Theme (White)' : 'Dark Theme'}</span>
            </button>
            <button
              onClick={() => {
                openWorkspaceModal();
                setShowMoreMenu(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-xs font-semibold text-neutral-800 w-full transition"
            >
              <Building2 size={16} className="text-rose-500" />
              <span>Company Workspaces</span>
            </button>
            <button
              onClick={() => {
                onLogout();
                setShowMoreMenu(false);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-xs font-semibold text-red-600 w-full transition"
            >
              <LogOut size={16} />
              <span>Log Out to Login Screen</span>
            </button>
            <div className="h-[1px] bg-rose-100 my-1" />
            <div 
              className="px-3 py-1 text-[10px] text-rose-500 font-semibold"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              Company Connect • Infynux
            </div>
          </div>
        )}

        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className="flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-rose-50 text-neutral-700 hover:text-rose-600 w-full text-left"
        >
          <Menu size={22} className="stroke-[1.8px]" />
          <span 
            className="hidden xl:inline text-xs font-medium"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            More Options
          </span>
        </button>
      </div>
    </aside>
  );
};
