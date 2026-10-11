import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'easy' | 'medium' | 'hard' | 'status-approved' | 'status-rejected' | 'status-review' | 'status-pending' | 'category' | 'xp' | 'lime';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'category', children, ...props }) => {
  const variants = {
    easy: "bg-emerald-50 text-emerald-800 border-emerald-200",
    medium: "bg-amber-50 text-amber-800 border-amber-200",
    hard: "bg-rose-50 text-rose-800 border-rose-200",
    'status-approved': "bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold",
    'status-rejected': "bg-rose-100 text-rose-900 border-rose-300 font-semibold",
    'status-review': "bg-amber-100 text-amber-900 border-amber-300 font-semibold",
    'status-pending': "bg-sky-100 text-sky-900 border-sky-300 font-semibold",
    category: "bg-forest-50 text-forest-700 border-forest-100",
    xp: "bg-forest-200/50 text-forest-900 border-forest-300 font-bold",
    lime: "bg-forest-200 text-forest-950 border-forest-300 font-bold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
