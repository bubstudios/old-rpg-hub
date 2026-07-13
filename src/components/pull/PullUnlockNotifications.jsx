import { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Package, Users, MapPin, Eye, AlertCircle, Zap, X, ChevronRight, Droplet, Activity } from 'lucide-react';

const TYPE_CONFIG = {
  province: { icon: MapPin, color: 'text-emerald-400', bg: 'border-emerald-800/40 bg-emerald-950/20' },
  shard_power: { icon: Zap, color: 'text-amber-400', bg: 'border-amber-800/40 bg-amber-950/20' },
  item: { icon: Package, color: 'text-sky-400', bg: 'border-sky-800/40 bg-sky-950/20' },
  codex: { icon: BookOpen, color: 'text-primary', bg: 'border-primary/30 bg-primary/5' },
  bond: { icon: Users, color: 'text-violet-400', bg: 'border-violet-800/40 bg-violet-950/20' },
  condition: { icon: AlertCircle, color: 'text-red-400', bg: 'border-red-800/40 bg-red-950/20' },
  hidden: { icon: Eye, color: 'text-muted-foreground', bg: 'border-border/40 bg-secondary/20' },
  memory: { icon: Sparkles, color: 'text-indigo-400', bg: 'border-indigo-800/40 bg-indigo-950/20' },
  water: { icon: Droplet, color: 'text-sky-400', bg: 'border-sky-800/40 bg-sky-950/20' },
  clock: { icon: Activity, color: 'text-primary', bg: 'border-primary/30 bg-primary/5' }
};

export default function PullUnlockNotifications({ notifications, onDismiss }) {
  const [index, setIndex] = useState(0);

  // Reset to first notification when a new batch arrives
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    setIndex(0);
  }, [notifications]);

  if (!notifications || notifications.length === 0) return null;

  const n = notifications[index];
  if (!n) return null;

  const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.codex;
  const Icon = config.icon;
  const hasMore = index < notifications.length - 1;

  function handleAdvance() {
    if (index < notifications.length - 1) {
      setIndex(i => i + 1);
    } else {
      onDismiss();
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <div
        className={`border ${config.bg} rounded-lg backdrop-blur-sm p-4 animate-ink`}
      >
        <div className="flex items-start gap-2.5">
          <Icon className={`w-5 h-5 ${config.color} shrink-0 mt-0.5`} strokeWidth={1.5} />
          <div className="min-w-0 flex-1">
            <p className={`text-xs font-heading tracking-[0.15em] ${config.color}`}>{n.title}</p>
            <p className="text-sm font-heading text-foreground mt-1 capitalize break-words whitespace-pre-line">{n.message}</p>
            {n.detail && (
              <p className="text-sm text-muted-foreground font-body mt-1 leading-relaxed">{n.detail}</p>
            )}
          </div>
          <button
            onClick={handleAdvance}
            className="text-muted-foreground/60 hover:text-foreground transition-colors shrink-0 p-1"
            aria-label={hasMore ? 'Next notification' : 'Close'}
          >
            {hasMore ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </button>
        </div>
        {notifications.length > 1 && (
          <div className="flex gap-1 mt-3">
            {notifications.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full ${
                  i === index ? 'bg-primary' : i < index ? 'bg-primary/40' : 'bg-border/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}