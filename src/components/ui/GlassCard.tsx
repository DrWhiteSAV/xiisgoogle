import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export const GlassCard = ({ children, className, title }: GlassCardProps) => {
  return (
    <section className={cn("space-y-3", className)}>
      {title && (
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2 px-4 opacity-80" style={{ color: 'var(--theme-color)' }}>
          {title}
        </h3>
      )}
      <div className="glass-effect radial-round p-4 shadow-lg">
        {children}
      </div>
    </section>
  );
};
