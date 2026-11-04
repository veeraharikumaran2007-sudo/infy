import React from 'react';
import { X, Bell, Megaphone, UserPlus, FileText } from 'lucide-react';
import { Announcement, Post, User } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  announcements?: Announcement[];
  posts?: Post[];
  users?: User[];
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  announcements = [],
  posts = [],
  users = [],
}) => {
  if (!isOpen) return null;

  interface RealNotification {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    time: string;
    icon: React.ReactNode;
    avatar: string;
    thumbnail?: string;
  }

  // Build real activity notifications from real announcements, real posts, and real joined employees
  const realNotifications: RealNotification[] = [
    ...announcements.map((ann) => ({
      id: 'notif_ann_' + ann.id,
      type: 'announcement',
      title: ann.title,
      subtitle: `${ann.author} published a leadership broadcast`,
      time: ann.timestamp || 'Recent',
      icon: <Megaphone size={16} className="text-rose-600" />,
      avatar: '/admin-yogeshwaran-avatar.png',
    })),
    ...posts.slice(0, 5).map((post) => ({
      id: 'notif_post_' + post.id,
      type: 'post',
      title: `@${post.user.username} shared an update`,
      subtitle: post.caption ? `"${post.caption.slice(0, 45)}${post.caption.length > 45 ? '...' : ''}"` : 'Shared a new work update',
      time: post.timestamp || 'Recent',
      icon: <FileText size={16} className="text-pink-600" />,
      avatar: post.user.avatar,
      thumbnail: post.media?.[0],
    })),
    ...users.filter(u => u.role === 'employee').slice(-4).map((emp) => ({
      id: 'notif_emp_' + emp.id,
      type: 'join',
      title: `${emp.fullName} joined the team`,
      subtitle: `@${emp.username} • ${emp.department} (${emp.designation})`,
      time: 'New',
      icon: <UserPlus size={16} className="text-emerald-600" />,
      avatar: emp.avatar,
    })),
  ];

  return (
    <div className="fixed inset-y-0 left-0 md:left-18 xl:left-64 w-80 md:w-96 bg-white border-r border-rose-100 z-50 shadow-2xl p-5 flex flex-col animate-in slide-in-from-left duration-200">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-100">
        <h2 
          className="text-lg font-bold text-neutral-900 flex items-center gap-2"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <Bell size={18} className="text-rose-600" />
          Workspace Activity
        </h2>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-rose-600 p-1 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <div 
          className="text-[10px] font-bold text-rose-500 uppercase tracking-wider"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Realtime Workspace Updates ({realNotifications.length})
        </div>

        {realNotifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400">
            No recent activity yet. Updates will appear here as colleagues post updates!
          </div>
        ) : (
          realNotifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/40 hover:bg-rose-50 transition border border-rose-100/60">
              <img
                src={n.avatar}
                alt={n.title}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-200 flex-shrink-0 mt-0.5"
              />
              <div className="flex-1 min-w-0 text-xs">
                <div 
                  className="font-bold text-neutral-900 truncate"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {n.title}
                </div>
                <p className="text-[11px] text-neutral-600 mt-0.5 line-clamp-2">
                  {n.subtitle}
                </p>
                <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                  {n.time}
                </span>
              </div>
              {n.thumbnail && (
                <img
                  src={n.thumbnail}
                  alt="Post thumbnail"
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-rose-200 flex-shrink-0"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
