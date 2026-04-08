import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const variants = {
    primary: "glass-effect hover:scale-[1.02] active:scale-95",
    secondary: "bg-gray-100 dark:bg-gray-800 text-tg-hint hover:bg-gray-200 dark:hover:bg-gray-700",
    ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-tg-text",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-4 text-base rounded-2xl font-bold",
  };

  return (
    <button
      className={cn(
        "transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
