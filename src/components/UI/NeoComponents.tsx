import React from 'react';
import { cn } from '@/src/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'yellow' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-neo-blue text-white',
      accent: 'bg-neo-green text-black',
      yellow: 'bg-neo-yellow text-black',
      outline: 'bg-white text-black',
      dark: 'neo-button-dark',
    };

    const sizes = {
      sm: 'px-3 py-2.5 text-sm min-h-[44px]',
      md: 'px-6 py-3.5 text-base min-h-[48px]',
      lg: 'px-8 py-4.5 text-lg min-h-[56px]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'neo-button flex items-center justify-center gap-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export const Panel: React.FC<PanelProps> = ({ title, children, className, ...props }) => {
  return (
    <div className={cn('neo-box flex flex-col w-full', className)} {...props}>
      {title && (
        <div className="border-b-4 border-black bg-neo-black p-3 flex items-center justify-between">
          <h3 className="text-neo-white text-xs sm:text-sm font-mono font-black uppercase tracking-widest">
            {title}
          </h3>
        </div>
      )}
      <div className="flex-1 p-3 sm:p-4 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = 'bg-neo-yellow' }) => (
  <span className={cn('inline-block border-2 border-black px-2 py-0.5 text-xs font-bold uppercase tracking-tighter transition-colors duration-300', color)}>
    {children}
  </span>
);
