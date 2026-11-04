import React from 'react';
import { Building2, ShieldCheck, Users } from 'lucide-react';
import { User, Company } from '../types';

interface SuggestionsSidebarProps {
  currentUser: User;
  currentCompany: Company;
  colleagues: User[];
  onOpenProfile: () => void;
  openWorkspaceModal: () => void;
  onOpenDirectory: () => void;
}

export const SuggestionsSidebar: React.FC<SuggestionsSidebarProps> = ({
  currentUser,
  currentCompany,
  colleagues,
  onOpenProfile,
  openWorkspaceModal,
  onOpenDirectory,
}) => {
  return (
    <aside className="hidden lg:block w-80 pl-8 pt-2">
      {/* Current User Card */}
      <div className="flex items-center justify-between mb-4 bg-white p-3.5 rounded-2xl border border-rose-100 shadow-sm">
        <div 
          onClick={onOpenProfile}
          className="flex items-center gap-3 cursor-pointer group min-w-0"
        >
          <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 overflow-hidden flex-shrink-0 shadow-xs">
            <div className="w-full h-full rounded-full p-[1.5px] bg-white">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-200"
              />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span 
                className="font-bold text-xs text-neutral-900 truncate hover:underline"
                style={{ fontFamily: '"Times New Roman", Times, serif' }}
              >
                {currentUser.fullName}
              </span>
              {currentUser.role === 'admin' && (
                <ShieldCheck size={13} className="text-rose-600 flex-shrink-0" />
              )}
            </div>
            <span className="text-[11px] text-neutral-400 truncate">
              {currentUser.department} • {currentUser.role === 'admin' ? 'Admin' : 'Staff'}
            </span>
          </div>
        </div>

        <button 
          onClick={openWorkspaceModal}
          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 transition flex-shrink-0 ml-2"
        >
          Switch
        </button>
      </div>

      {/* Workspace Context Chip */}
      <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-50/80 via-pink-50/60 to-red-50/80 border border-rose-200/80 text-xs shadow-2xs">
        <div className="flex items-center justify-between text-rose-700 font-bold text-[11px]">
          <span 
            className="flex items-center gap-1.5"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            <Building2 size={13} className="text-rose-600" /> {currentCompany.name}
          </span>
          <span className="text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full font-mono font-bold">PRIVATE</span>
        </div>
        <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
          All posts, comments, and member activities remain strictly inside this company.
        </p>
      </div>

      {/* Workspace Colleagues Header */}
      <div className="flex items-center justify-between mb-3">
        <span 
          className="text-xs font-bold text-neutral-700 flex items-center gap-1.5"
          style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >
          <Users size={14} className="text-rose-500" /> Team Members ({colleagues.length})
        </span>
        <button 
          onClick={onOpenDirectory}
          className="text-[11px] font-bold text-rose-600 hover:underline"
        >
          View All
        </button>
      </div>

      {/* Colleagues List */}
      <div className="flex flex-col gap-2.5 mb-6">
        {colleagues.slice(0, 5).map((user) => (
          <div key={user.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-rose-50/60 transition bg-white border border-rose-50">
            <div className="flex items-center gap-2.5 cursor-pointer min-w-0">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-rose-200"
              />
              <div className="flex flex-col min-w-0">
                <span 
                  className="font-bold text-xs text-neutral-800 hover:underline truncate"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                >
                  {user.fullName}
                </span>
                <span className="text-[10px] text-neutral-400 truncate">
                  {user.designation}
                </span>
              </div>
            </div>

            <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full flex-shrink-0">
              {user.department}
            </span>
          </div>
        ))}
      </div>

      {/* Infynux Footer */}
      <footer 
        className="text-[11px] text-neutral-400 leading-relaxed border-t border-rose-100 pt-4"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        <div className="font-bold text-xs text-rose-600 mb-0.5">
          Company Connect Platform
        </div>
        <p className="text-[10px] text-neutral-500 mb-2 italic">
          Connect. Share. Collaborate. An internal social space exclusively for verified enterprise teams.
        </p>
        <p className="uppercase text-[9px] tracking-wider text-rose-400 font-bold">
          INFYNUX SOLUTIONS • 2026
        </p>
      </footer>
    </aside>
  );
};
