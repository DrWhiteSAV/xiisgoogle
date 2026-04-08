import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-1 w-full">
        {label && (
          <label className="text-[10px] font-bold uppercase ml-1" style={{ color: 'var(--theme-color)' }}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "w-full p-3 rounded-xl outline-none border-2 border-transparent focus:border-tg-light-blue text-tg-text input-glass transition-all resize-none",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
