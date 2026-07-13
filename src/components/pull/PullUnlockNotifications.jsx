import { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Package, Users, MapPin, Eye, AlertCircle, Zap, X, ChevronRight, Droplet, Activity } from 'lucide-react';

const TYPE_CONFIG = {
  province: { icon: MapPin, color: 'text-emerald-400', bg: 'border-emerald-500/30 bg-emerald-500/10' },
  shard_power: { icon: Zap, color: 'text-amber-400', bg: 'border-amber-500/30 bg-amber-500/10' },
  item: { icon: Package, color: 'text-sky-400', bg: 'border-sky-500/30 bg-sky-500/10' },
  codex: { icon: BookOpen, color: 'text-primary', bg: 'border-primary/30 bg-primary/5' },
  bond: { icon: Users, color: 'text-violet-400', bg: 'border-violet-500/30 bg-violet-500/10' },
  condition: { icon: AlertCircle, color: 'text-red-400', bg: 'border-red-500/30 bg-red-500/10' },
  hidden: { icon: Eye, color: 'text-muted-foreground', bg: 'border-border/40 bg-secondary/20' },
  memory: { icon: Sparkles, color: 'text-indigo-400', bg: 'border-indigo-500/30 bg-indigo-500/10' },
  water: { icon: Droplet, color: 'text-sky-400', bg: 'border-sky-500/30 bg-sky-500/10' },
  clock: { icon: Activity, color: 'text-primary', bg: 'border-primary/30 bg-primary/5' }
};

export default function PullUnlockNotifications({ notifications, onDismiss }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notifications || notifications.length === 0) return;
    setIndex(0);
    setVisible(true);
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
      setVisible(false);
      setTimeout(onDismiss, 200);
    }
  }

  function handleClose() {
    setVisible(false);
    setTimeout(onDismiss, 200);
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className={`relative w-full max-w-md border ${config.bg} rounded-lg bg-card/95 backdrop-blur-sm panel-glow shadow-2xl overflow-hidden transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <span className="text-sm font-heading tracking-[0.15em] text-foreground">DISCOVERY</span>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className="flex items-start gap-3">
            <div className={`shrink-0 w-10 h-10 rounded-full ${config.bg} border ${config.border} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.color}`} strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <p className={`text-sm font-heading tracking-[0.15em] ${config.color}`}>{n.title}</p>
              <p className="text-base font-heading text-foreground mt-1.5 capitalize break-words whitespace-pre-line">{n.message}</p>
              {n.detail && (
                <p className="text-sm text-foreground/80 font-body mt-2 leading-relaxed">{n.detail}</p>
              )}
            </div>
          </div>

          {notifications.length > 1 && (
            <div className="flex gap-1 pt-2 border-t border-border/30">
              {notifications.map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded-full ${
                    i === index ? 'bg-primary' : i < index ? 'bg-primary/40' : 'bg-border/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/30">
          {notifications.length > 1 && (
            <span className="text-xs text-muted-foreground font-body">
              {index + 1} of {notifications.length}
            </span>
          )}
          <button
            onClick={handleAdvance}
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-heading tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {hasMore ? 'NEXT' : 'DONE'}
            {hasMore && <ChevronRight className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </div>
  );
}