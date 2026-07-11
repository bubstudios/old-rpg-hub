import { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Package, Users, MapPin, Eye, AlertCircle, Zap, X, ChevronRight } from 'lucide-react';

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

const DISPLAY_MS = 7000;

export default function PullUnlockNotifications({ notifications, onDismiss }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Reset queue when new notifications arrive
  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    setIndex(0);
    setVisible(true);
  }, [notifications]);

  // Auto-advance after 7 seconds
  useEffect(() => {
    if (!visible || !notifications?.length) return;
    const timer = setTimeout(() => setVisible(false), DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [visible, index, notifications]);

  // When hidden, advance to next or dismiss
  useEffect(() => {
    if (visible || !notifications?.length) return;
    const timer = setTimeout(() => {
      if (index < notifications.length - 1) {
        setIndex(i => i + 1);
        setVisible(true);
      } else {
        onDismiss();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [visible, index, notifications]);

  if (!notifications || notifications.length === 0) return null;

  const n = notifications[index];
  if (!n) return null;

  const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.codex;
  const Icon = config.icon;
  const hasMore = index < notifications.length - 1;

  return (
    <div className="fixed top-4 right-4 z-50 w-72 max-w-[calc(100vw-2rem)]">
      <div
        className={`border ${config.bg} rounded-lg backdrop-blur-sm p-3 transition-all duration-300 ${
          visible ? 'opacity-100 translate-x-0 animate-ink' : 'opacity-0 translate-x-4'
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
            onClick={() => setVisible(false)}
            className="text-muted-foreground/40 hover:text-foreground transition-colors shrink-0"
          >
            {hasMore ? <ChevronRight className="w-3.5 h-3.5" /> : <X className="w-3 h-3" />}
          </button>
        </div>
        {notifications.length > 1 && (
          <div className="flex gap-0.5 mt-2">
            {notifications.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-0.5 rounded-full ${
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