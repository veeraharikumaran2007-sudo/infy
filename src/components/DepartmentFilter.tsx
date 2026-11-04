import React from 'react';

interface DepartmentFilterProps {
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
}

const DEPARTMENTS = [
  { id: 'All', label: 'All Feed', icon: '🏢' },
  { id: 'Engineering', label: 'Engineering', icon: '💻' },
  { id: 'Design', label: 'Design', icon: '🎨' },
  { id: 'Product', label: 'Product', icon: '🚀' },
  { id: 'HR', label: 'People / HR', icon: '👥' },
  { id: 'Leadership', label: 'Leadership', icon: '👔' },
];

export const DepartmentFilter: React.FC<DepartmentFilterProps> = ({
  selectedDepartment,
  onSelectDepartment,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 no-scrollbar">
      {DEPARTMENTS.map((dept) => {
        const isSelected = selectedDepartment === dept.id;

        return (
          <button
            key={dept.id}
            onClick={() => onSelectDepartment(dept.id)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs ${
              isSelected
                ? 'bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 text-white shadow-md shadow-rose-400/30'
                : 'bg-white border border-rose-200/70 text-neutral-600 hover:text-rose-600 hover:border-rose-300'
            }`}
          >
            <span>{dept.icon}</span>
            <span>{dept.label}</span>
          </button>
        );
      })}
    </div>
  );
};
