import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { ScrollText, TrendingUp, TrendingDown, AlertTriangle, Eye, Settings, Loader2 } from 'lucide-react';

const TONE_STYLES = {
  positive: { color: 'text-emerald-400', icon: TrendingUp },
  negative: { color: 'text-red-400', icon: TrendingDown },
  neutral: { color: 'text-amber-400', icon: AlertTriangle },
  hidden: { color: 'text-purple-400', icon: Eye }
};

const SETTINGS_OPTIONS = [
  { value: 'minimal', label: 'Minimal', desc: 'Only major changes' },
  { value: 'normal', label: 'Normal', desc: '1-4 important changes after command decisions' },
  { value: 'detailed', label: 'Detailed', desc: 'Full details + consequences + character notes' },
  { value: 'off', label: 'Off', desc: 'No popups (log still saved)' }
];

export default function DecisionLogPanel({ open, onOpenChange, campaignId, setting, onSettingChange }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && campaignId) loadLogs();
  }, [open, campaignId]);

  async function loadLogs() {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('campaignData', { op: 'listDecisionLogs', campaign_id: campaignId });
      setLogs(res.data.logs || []);
    } catch (e) { /* ignore */ }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40">
          <DialogTitle className="font-heading tracking-[0.15em] text-base flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-primary" strokeWidth={1.5} /> DECISION LOG
          </DialogTitle>
        </DialogHeader>

        <div className="px-5 py-3 border-b border-border/40">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-[10px] font-heading tracking-wide text-muted-foreground">POPUP FEEDBACK LEVEL</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {SETTINGS_OPTIONS.map(s => (
              <button key={s.value} onClick={() => onSettingChange(s.value)}
                className={`px-2 py-1.5 rounded text-[10px] font-heading tracking-wide border transition-colors ${setting === s.value ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30'}`}>
                {s.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-body italic text-muted-foreground/60 mt-1.5">
            {SETTINGS_OPTIONS.find(s => s.value === setting)?.desc}
          </p>
        </div>

        <div className="overflow-y-auto scrollbar-thin p-4 space-y-3 max-h-[55vh]">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-10">
              <ScrollText className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" strokeWidth={1} />
              <p className="text-sm font-body italic text-muted-foreground">No decisions logged yet.</p>
              <p className="text-xs font-body text-muted-foreground/60 mt-1">Make meaningful command decisions to see their impact here.</p>
            </div>
          ) : (
            logs.map(log => <DecisionLogEntry key={log.id} log={log} />)
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DecisionLogEntry({ log }) {
  const [expanded, setExpanded] = useState(false);
  const impacts = Array.isArray(log.impacts) ? log.impacts : [];
  const date = log.created_date ? new Date(log.created_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="border border-border/40 rounded-lg bg-card/30 overflow-hidden">
      <button onClick={() => setExpanded(v => !v)} className="w-full text-left p-3 hover:bg-secondary/30 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-body text-foreground/90 leading-relaxed line-clamp-2">{log.decision}</p>
          <span className="text-[9px] text-muted-foreground/60 shrink-0 mt-0.5">{date}</span>
        </div>
        {!expanded && impacts.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {impacts.slice(0, 4).map((imp, i) => {
              const tone = TONE_STYLES[imp.tone] || TONE_STYLES.neutral;
              const sign = (imp.change || 0) > 0 ? '+' : '';
              return (
                <span key={i} className={`text-[10px] font-heading px-1.5 py-0.5 rounded ${tone.color} bg-secondary/40`}>
                  {imp.label} {(imp.change || 0) !== 0 ? `${sign}${imp.change}` : ''}
                </span>
              );
            })}
          </div>
        )}
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-border/30 pt-2">
          {impacts.map((imp, i) => {
            const tone = TONE_STYLES[imp.tone] || TONE_STYLES.neutral;
            const Icon = tone.icon;
            const sign = (imp.change || 0) > 0 ? '+' : '';
            return (
              <div key={i} className="flex items-start gap-2">
                <Icon className={`w-3 h-3 mt-0.5 shrink-0 ${tone.color}`} strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-heading text-foreground">{imp.label}</span>
                    {(imp.change || 0) !== 0 && (
                      <span className={`text-xs font-heading font-600 tabular-nums ${tone.color}`}>{sign}{imp.change}</span>
                    )}
                  </div>
                  {imp.change_label && (
                    <span className={`text-[9px] font-heading tracking-wide ${tone.color}`}>{imp.change_label}</span>
                  )}
                  {imp.reason && (
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{imp.reason}</p>
                  )}
                  {imp.character_note && (
                    <p className="text-[10px] font-body italic text-foreground/60 leading-relaxed mt-1">{imp.character_note}</p>
                  )}
                </div>
              </div>
            );
          })}
          {log.future_consequence && (
            <div className="pt-1.5 border-t border-border/30">
              <p className="text-[9px] font-heading tracking-wide text-purple-400/70 mb-0.5">POSSIBLE FUTURE CONSEQUENCE</p>
              <p className="text-[10px] font-body italic text-muted-foreground leading-relaxed">{log.future_consequence}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}