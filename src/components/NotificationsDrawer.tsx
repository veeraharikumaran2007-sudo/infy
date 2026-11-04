import React from 'react';
import { X } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: string;
  user: {
    username: string;
    avatar: string;
  };
  text: string;
  time: string;
  isFollowingBack?: boolean;
  postMedia?: string;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'follow',
    user: {
      username: 'ananya_design',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    text: 'connected with your profile in Engineering.',
    time: '2h',
    isFollowingBack: false,
  },
  {
    id: 'n2',
    type: 'like',
    user: {
      username: 'rajesh_admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
    text: 'reacted ❤️ to your "Shipped to Prod" milestone.',
    time: '4h',
    postMedia: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'n3',
    type: 'comment',
    user: {
      username: 'vikram_pm',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    text: 'commented: "Outstanding technical execution!"',
    time: '1d',
    postMedia: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
  },
];

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [items, setItems] = React.useState<NotificationItem[]>(NOTIFICATIONS);

  if (!isOpen) return null;

  const toggleFollowBack = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFollowingBack: !item.isFollowingBack } : item
      )
    );
  };

  return (
    <div className="fixed inset-y-0 left-0 md:left-18 xl:left-64 w-80 md:w-96 bg-white border-r border-rose-100 z-50 shadow-2xl p-5 flex flex-col animate-in slide-in-from-left duration-200">
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-xl font-bold text-neutral-900"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Activity Notifications
        </h2>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-rose-600 p-1"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        <div 
          className="text-[10px] font-bold text-rose-500 uppercase tracking-wider"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Recent Activity
        </div>

        {items.map((n) => (
          <div key={n.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-rose-50/50 transition">
            <div className="flex items-center gap-3">
              <img
                src={n.user.avatar}
                alt={n.user.username}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-rose-200"
              />
              <div className="text-xs leading-snug">
                <span 
                  className="font-bold text-neutral-900 mr-1"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {n.user.username}
                </span>
                <span className="text-neutral-600">{n.text}</span>
                <span className="text-neutral-400 text-[10px] ml-1.5">{n.time}</span>
              </div>
            </div>

            {n.type === 'follow' && (
              <button
                onClick={() => toggleFollowBack(n.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
                  n.isFollowingBack
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-2xs'
                }`}
              >
                {n.isFollowingBack ? 'Connected' : 'Connect'}
              </button>
            )}

            {n.postMedia && (
              <img
                src={n.postMedia}
                alt="Post thumbnail"
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 ring-1 ring-rose-200"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
