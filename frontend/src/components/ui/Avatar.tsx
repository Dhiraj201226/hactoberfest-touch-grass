import React from 'react';
import { cn } from '../../lib/utils';
import { Award, Compass, Sparkles } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  level?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className, level }) => {
  const sizeMap = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
    xl: "w-20 h-20 text-xl font-bold",
  };

  const getInitials = (n: string) => {
    return n ? n.slice(0, 2).toUpperCase() : 'NQ';
  };

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          "rounded-full border-2 border-white shadow-soft-sm flex items-center justify-center font-bold overflow-hidden bg-forest-100 text-forest-800",
          sizeMap[size],
          className
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {level !== undefined && (
        <span className="absolute -bottom-1 -right-1 bg-forest-800 text-forest-200 border-2 border-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">
          L{level}
        </span>
      )}
    </div>
  );
};
