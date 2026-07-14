import { Radio, ScanLine, FileText, AlertTriangle, Target, Zap, X } from 'lucide-react';
import { enforceReadableNarration } from '@/lib/pjNarrationFilter';

const TYPE_CONFIG = {
  incoming_comm: { label: 'INCOMING TRANSMISSION', icon: Radio, color: 'sky' },
  scan_result: { label: 'SCAN COMPLETE', icon: ScanLine, color: 'cyan' },
  crew_report: { label: 'CREW REPORT', icon: FileText, color: 'amber' },
  enemy_action: { label: 'ENEMY MOVE', icon: AlertTriangle, color: 'red' },
  mission_update: { label: 'MISSION UPDATE', icon: Target, color: 'violet' },
  future_echo: { label: 'FUTURE ECHO', icon: Zap, color: 'indigo' },
};

export default function PendingEventInterrupt({ event, onAction, onDismiss }) {
  if (!event) return null;
  const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.crew_report;
  const Icon = config.icon;

  return (
    <div className="animate-ink my-3">
      <div className="border border-primary/30 bg-card/60 rounded-lg overflow-hidden panel-glow">
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border-b border-primary/20">
          <Icon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
          <span className="text-[10px] font-heading tracking-[0.2em] text-primary/80">{config.label}</span>
          {event.priority === 'critical' && (
            <span className="ml-auto text-[9px] font-heading tracking-wider text-destructive animate-pulse">URGENT</span>
          )}
          {onDismiss && (
            <button onClick={() => onDismiss(event)} className="ml-auto text-muted-foreground/50 hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="px-4 py-3">
          {event.payload?.speaker && (
            <p className="text-[10px] font-heading tracking-wider text-muted-foreground mb-1">{event.payload.speaker}</p>
          )}
          <p className="text-sm text-foreground/90 font-body leading-relaxed whitespace-pre-wrap">
            {enforceReadableNarration(event.payload?.text || '')}
          </p>
          {event.payload?.actions?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {event.payload.actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => onAction?.(event, action)}
                  className="text-xs font-body text-foreground/80 hover:text-primary border border-border/40 hover:border-primary/40 rounded px-3 py-1.5 transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}