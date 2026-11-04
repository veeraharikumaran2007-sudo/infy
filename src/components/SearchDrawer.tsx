import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { User } from '../types';

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onSelectUser: (user: User) => void;
}

export const SearchDrawer: React.FC<SearchDrawerProps> = ({
  isOpen,
  onClose,
  users,
  onSelectUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-y-0 left-0 md:left-18 xl:left-64 w-80 md:w-96 bg-white border-r border-rose-100 z-50 shadow-2xl p-5 flex flex-col animate-in slide-in-from-left duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 
          className="text-xl font-bold text-neutral-900"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          Search Personnel
        </h2>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-rose-600 p-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* Input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search creators, tags, colleagues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-2.5 pl-10 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          autoFocus
        />
        <Search size={16} className="absolute left-3.5 top-3 text-rose-400" />
      </div>

      {/* Results / Recent */}
      <div className="flex-1 overflow-y-auto">
        <div 
          className="flex items-center justify-between text-xs font-bold text-rose-500 mb-3"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <span>{searchTerm ? 'Search Results' : 'Suggested Colleagues'}</span>
        </div>

        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                onSelectUser(user);
                onClose();
              }}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50/60 cursor-pointer transition border border-transparent hover:border-rose-100"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-11 h-11 rounded-full object-cover ring-1 ring-rose-200"
              />
              <div className="flex flex-col min-w-0">
                <div 
                  className="font-bold text-xs text-neutral-900 truncate"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {user.fullName}
                </div>
                <span className="text-[10px] text-neutral-400">@{user.username} • {user.department}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
