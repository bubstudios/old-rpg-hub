import { Clock } from 'lucide-react';

export default function PendingEventsPanel({ events }) {
  if (!events || events.length === 0) return null;

  const pending = events.filter(e => e && e.status === 'pending');
  if (!pending.length) return null;

  function getTimeLabel(event) {
    const t = event.trigger || {};
    if (t.mode === 'real_time' && t.fire_at) return 'soon';
    if (t.mode === 'clock_threshold') return `when ${t.clock || 'clock'} hits ${t.value || 100}`;
    if (t.mode === 'condition') return 'pending conditions';
    const turns = t.turns_remaining;
    if (turns == null) return 'pending';
    if (turns === 0) return 'now';
    return `${turns} action${turns > 1 ? 's' : ''}`;
  }

  return (
    <div className="border border-border/30 rounded-lg p-3 bg-card/20">
      <div className="flex items-center gap-1.5 mb-2">
        <Clock className="w-3 h-3 text-muted-foreground/60" strokeWidth={1.5} />
        <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground/70">PENDING</p>
      </div>
      <div className="space-y-1.5">
        {pending.map((event, i) => (
          <div key={event.id || i} className="flex items-center justify-between gap-2">
            <span className="text-xs text-foreground/70 font-body truncate">{event.title}</span>
            <span className="text-[9px] text-muted-foreground/50 font-body shrink-0">{getTimeLabel(event)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}