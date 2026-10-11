import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-text-main tracking-wider uppercase">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl border border-surface-border bg-white text-text-main text-sm placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all shadow-sm",
            error && "border-earth-error focus:ring-earth-error",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-earth-error font-medium">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
