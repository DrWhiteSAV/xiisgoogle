import { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  showBack?: boolean;
  className?: string;
}

export const Header = ({ 
  title, 
  subtitle, 
  leftElement, 
  rightElement, 
  showBack = false,
  className 
}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className={cn(
      "p-3 flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 glass-effect radial-round m-2 shadow-lg shrink-0",
      className
    )}>
      {showBack && (
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      {leftElement}
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold truncate text-sm sm:text-base">{title}</h2>
        {subtitle && <p className="text-[10px] text-tg-hint truncate uppercase tracking-wider">{subtitle}</p>}
      </div>
      {rightElement}
    </div>
  );
};
