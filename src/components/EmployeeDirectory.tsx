import React, { useState } from 'react';
import { Search, ShieldCheck, Award } from 'lucide-react';
import { User, Company } from '../types';

interface EmployeeDirectoryProps {
  currentCompany: Company;
  employees: User[];
  onSelectEmployee: (emp: User) => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  currentCompany,
  employees,
  onSelectEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 md:px-8 space-y-6 bg-white min-h-[85vh]">
      {/* Directory Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 
            className="text-xl font-bold text-neutral-900"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            {currentCompany.name} Personnel Directory
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Discover and connect with your colleagues across departments
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search colleagues, title, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-rose-50/50 border border-rose-200 rounded-xl px-4 py-2 pl-9 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
          <Search size={15} className="absolute left-3 top-2.5 text-rose-400" />
        </div>
      </div>

      {/* Department Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['All', 'Engineering', 'Design', 'Product', 'HR', 'Leadership'].map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedDept === dept
                ? 'bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 text-white shadow-xs'
                : 'bg-white border border-rose-200/80 text-neutral-600 hover:text-rose-600 hover:border-rose-300'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            onClick={() => onSelectEmployee(emp)}
            className="bg-white border border-rose-100 rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-lg hover:border-rose-300 transition cursor-pointer group shadow-xs"
          >
            <div className="relative w-18 h-18 rounded-full p-[2px] bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 mb-3 group-hover:scale-105 transition shadow-xs">
              <img
                src={emp.avatar}
                alt={emp.username}
                className="w-full h-full rounded-full object-cover ring-2 ring-white"
              />
            </div>

            <h3 
              className="font-bold text-sm text-neutral-900 flex items-center gap-1"
              style={{ fontFamily: '"Times New Roman", Times, serif' }}
            >
              {emp.fullName}
              {emp.role === 'admin' && (
                <ShieldCheck size={14} className="text-rose-600" />
              )}
            </h3>

            <span className="text-[11px] text-neutral-400 mt-0.5">@{emp.username}</span>

            <span className="text-xs text-neutral-700 font-medium mt-1">
              {emp.designation}
            </span>

            <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-0.5 rounded-full mt-2">
              {emp.department}
            </span>

            {/* Achievements Badges */}
            {emp.achievements && emp.achievements.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-1 mt-3">
                {emp.achievements.map((ach, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-md flex items-center gap-0.5"
                  >
                    <Award size={10} className="text-pink-500" /> {ach}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
