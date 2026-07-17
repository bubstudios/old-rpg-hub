import { cn } from '@/lib/utils';

export default function ParchmentPanel({ children, className }) {
  return (
    <div className={cn('parchment-panel p-5 sm:p-7', className)}>
      {children}
    </div>
  );
}