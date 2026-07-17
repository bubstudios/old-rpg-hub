import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const VARIANT_CLASS = {
  primary: 'rpg-button-primary',
  secondary: '',
  danger: 'rpg-button-danger',
};

const SIZE_CLASS = {
  default: 'h-10 px-5 py-2 text-sm',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-12 px-8 text-base',
  icon: 'h-10 w-10',
};

const GoldButton = forwardRef(({ variant = 'primary', size = 'default', className, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        'rpg-button inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        VARIANT_CLASS[variant] || '',
        SIZE_CLASS[size] || SIZE_CLASS.default,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

GoldButton.displayName = 'GoldButton';
export default GoldButton;