import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressBarProps {
  current: number;
  max: number;
  className?: string;
  showLabels?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, max, className, showLabels = true }) => {
  const percentage = Math.min(100, Math.max(0, (current / (max || 1)) * 100));

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {showLabels && (
        <div className="flex justify-between items-center text-xs font-semibold">
          <span className="text-forest-700">{current} / {max} XP</span>
          <span className="text-text-muted">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-surface-border/80 rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-gradient-to-r from-forest-500 via-forest-400 to-forest-200 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
