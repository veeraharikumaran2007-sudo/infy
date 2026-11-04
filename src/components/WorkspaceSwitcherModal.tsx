import React, { useState } from 'react';
import { X, Building2, Plus, Check } from 'lucide-react';
import { Company } from '../types';

interface WorkspaceSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: Company[];
  currentCompany: Company;
  onSelectCompany: (company: Company) => void;
  onRegisterCompany: (newCompany: Company) => void;
}

export const WorkspaceSwitcherModal: React.FC<WorkspaceSwitcherModalProps> = ({
  isOpen,
  onClose,
  companies,
  currentCompany,
  onSelectCompany,
  onRegisterCompany,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName) return;

    const company: Company = {
      id: 'c_' + Date.now(),
      name: newCompanyName.trim(),
      slug: newCompanyName.toLowerCase().replace(/\s+/g, '-'),
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80',
      industry: newIndustry || 'Technology & Innovation',
      employeeCount: 1,
    };

    onRegisterCompany(company);
    setIsRegistering(false);
    setNewCompanyName('');
    setNewIndustry('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-150"
      >
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-rose-600" />
            <h2 
              className="font-bold text-sm text-neutral-900"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {isRegistering ? 'Register New Company Workspace' : 'Company Private Workspaces'}
            </h2>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700">
            <X size={18} />
          </button>
        </div>

        {/* Data Separation Visual Banner (Matching Problem Statement Diagram!) */}
        <div className="bg-rose-50 border-b border-rose-200 p-3 text-[11px] text-rose-800 flex items-center justify-between font-mono">
          <span className="font-bold">{currentCompany.name}</span>
          <span className="font-extrabold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">✕ NO ACCESS ✕</span>
          <span className="font-bold">Other Workspaces</span>
        </div>

        {isRegistering ? (
          <form onSubmit={handleRegister} className="p-5 space-y-4 bg-white">
            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1">Company Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Technologies"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-100 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-600 block mb-1">Industry</label>
              <input
                type="text"
                placeholder="e.g. AI & Robotics"
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                className="w-full bg-rose-50/50 border border-rose-100 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="flex-1 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-xs font-bold transition shadow"
              >
                Register Workspace
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 space-y-3 bg-white">
            <p className="text-xs text-neutral-500">
              Each company has its own private workspace. Select a workspace to switch contexts and verify complete data isolation:
            </p>

            <div className="space-y-2">
              {companies.map((comp) => {
                const isSelected = comp.id === currentCompany.id;

                return (
                  <div
                    key={comp.id}
                    onClick={() => {
                      onSelectCompany(comp);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'border-rose-400 bg-rose-50/60 shadow-xs'
                        : 'border-rose-100 hover:bg-rose-50/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-rose-200"
                      />
                      <div>
                        <div 
                          className="font-bold text-xs text-neutral-900 flex items-center gap-1.5"
                          style={{ fontFamily: '"Times New Roman", Times, serif' }}
                        >
                          {comp.name}
                          {isSelected && <Check size={14} className="text-rose-600 stroke-[3px]" />}
                        </div>
                        <span className="text-[11px] text-neutral-400">
                          {comp.industry} • {comp.employeeCount} Members
                        </span>
                      </div>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      isSelected ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-xs' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {isSelected ? 'Active' : 'Switch'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsRegistering(true)}
              className="w-full mt-4 py-2.5 border border-dashed border-rose-300 hover:border-rose-500 rounded-2xl text-xs font-bold text-rose-600 flex items-center justify-center gap-2 transition hover:bg-rose-50/50"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              <Plus size={16} />
              Register a New Company Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
