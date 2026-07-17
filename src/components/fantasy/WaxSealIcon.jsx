import { cn } from '@/lib/utils';

const SIZE_MAP = {
  sm: { seal: 'w-7 h-7', icon: 'w-3.5 h-3.5' },
  md: { seal: 'w-9 h-9', icon: 'w-4 h-4' },
  lg: { seal: 'w-12 h-12', icon: 'w-5 h-5' },
};

export default function WaxSealIcon({ icon: Icon, size = 'md', className, flicker = false }) {
  const s = SIZE_MAP[size] || SIZE_MAP.md;
  return (
    <div
      className={cn(
        'rounded-full wax-seal flex items-center justify-center shrink-0',
        s.seal,
        flicker && 'animate-flicker',
        className
      )}
    >
      {Icon && <Icon className={cn('text-primary-foreground', s.icon)} strokeWidth={1.4} />}
    </div>
  );
}