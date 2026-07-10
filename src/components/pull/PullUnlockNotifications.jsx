import { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Package, Users, MapPin, Eye, AlertCircle, Zap, X } from 'lucide-react';

const TYPE_CONFIG = {
  province: { icon: MapPin, color: 'text-emerald-400', bg: 'border-emerald-800/40 bg-emerald-950/20' },
  shard_power: { icon: Zap, color: 'text-amber-400', bg: 'border-amber-800/40 bg-amber-950/20' },
  item: { icon: Package, color: 'text-sky-400', bg: 'border-sky-800/40 bg-sky-950/20' },
  codex: { icon: BookOpen, color: 'text-primary', bg: 'border-primary/30 bg-primary/5' },
  bond: { icon: Users, color: 'text-violet-400', bg: 'border-violet-800/40 bg-violet-950/20' },
  condition: { icon: AlertCircle, color: 'text-red-400', bg: 'border-red-800/40 bg-red-950/20' },
  hidden: { icon: Eye, color: 'text-muted-foreground', bg: 'border-border/40 bg-secondary/20' },
  memory: { icon: Sparkles, color: 'text-indigo-400', bg: 'border-indigo-800/40 bg-indigo-950/20' }
};

export default function PullUnlockNotifications({ notifications, onDismiss }) {
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    if (!notifications || notifications.length === 0) return;

    setDismissed(new Set());

    // Stagger dismiss: each notification dismisses 5s after it appears
    const timers = notifications.map((_, i) =>
      setTimeout(() => {
        setDismissed(prev => new Set(prev).add(i));
      }, 5000 + i * 800)
    );

    // Final cleanup after all have faded
    const finalTimer = setTimeout(() => {
      onDismiss();
    }, 5000 + notifications.length * 800 + 400);

    return () => { timers.forEach(clearTimeout); clearTimeout(finalTimer); };
  }, [notifications]);

  if (!notifications || notifications.length === 0) return null;

  // Show max 4 at a time
  const visible = notifications.slice(0, 4);

  return (
    <div className="fixed top-4 right-4 z-50 w-72 max-w-[calc(100vw-2rem)] space-y-2">
      {visible.map((n, i) => {
        const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.codex;
        const Icon = config.icon;
        const isDismissed = dismissed.has(i);
        return (
          <div
            key={i}
            className={`border ${config.bg} rounded-lg backdrop-blur-sm p-3 transition-all duration-300 ${
              isDismissed ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0 animate-ink'
            }`}
          >
            <div className="flex items-start gap-2">
              <Icon className={`w-3.5 h-3.5 ${config.color} shrink-0 mt-0.5`} strokeWidth={1.5} />
              <div className="min-w-0 flex-1">
                <p className={`text-[9px] font-heading tracking-[0.15em] ${config.color}`}>{n.title}</p>
                <p className="text-xs font-heading text-foreground mt-0.5 capitalize">{n.message}</p>
                {n.detail && (
                  <p className="text-[10px] text-muted-foreground font-body italic mt-0.5 leading-snug">{n.detail}</p>
                )}
              </div>
              <button
                onClick={() => setDismissed(prev => new Set(prev).add(i))}
                className="text-muted-foreground/40 hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}