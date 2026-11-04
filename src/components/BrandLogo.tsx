import React from 'react';

interface BrandLogoProps {
  collapsed?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  companyName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  collapsed = false, 
  className = '', 
  size = 'md',
  companyName = 'Company Connect'
}) => {
  return (
    <div className={`flex items-center gap-3 select-none cursor-pointer group ${className}`}>
      {/* Official INFYNUX Golden Emblem with Red/Pink Ambient Ring */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <div className="w-10 h-10 rounded-xl p-[2px] bg-gradient-to-tr from-rose-500 via-pink-500 to-red-600 shadow-md transition-transform duration-300 group-hover:scale-105">
          <div className="w-full h-full bg-white dark:bg-black rounded-[9px] overflow-hidden flex items-center justify-center">
            <img 
              src="/infynux-logo.png" 
              alt="Infynux Emblem" 
              className="w-full h-full object-contain p-0.5"
            />
          </div>
        </div>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <span 
            className={`font-bold tracking-tight bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 bg-clip-text text-transparent ${
              size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-sm' : 'text-base'
            }`}
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Company Connect
          </span>
          <span 
            className="text-[10px] tracking-widest text-rose-600 font-semibold uppercase"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            INFYNUX SOLUTIONS
          </span>
        </div>
      )}
    </div>
  );
};
