import { useEffect, useState } from 'react';
import { ScrollText, X, TrendingUp, TrendingDown, AlertTriangle, Eye, ChevronRight } from 'lucide-react';

const TONE_STYLES = {
  positive: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: TrendingUp },
  negative: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: TrendingDown },
  neutral: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle },
  hidden: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Eye }
};

export default function DecisionImpactPopup({ impact, onDismiss, onOpenLog, setting }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!impact) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 400);
    }, 5000);
    return () => clearTimeout(timer);
  }, [impact, onDismiss]);

  if (!impact || !impact.is_meaningful || setting === 'off') return null;

  let impacts = impact.impacts || [];
  if (setting === 'minimal') {
    impacts = impacts.filter(i => Math.abs(i.change || 0) >= 6 || i.tone === 'hidden');
    if (!impacts.length) return null;
  }

  const characterNote = setting !== 'minimal'
    ? impacts.find(i => i.character_note)?.character_note
    : null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="border border-primary/40 bg-card/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden panel-glow">
        <div className="flex items-center justify-between px-3 py-2 bg-primary/10 border-b border-primary/20">
          <span className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-primary">
            <ScrollText className="w-3.5 h-3.5" strokeWidth={1.5} /> DECISION IMPACT
          </span>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>
        <div className="p-2.5 space-y-1.5">
          {impacts.map((imp, i) => {
            const tone = TONE_STYLES[imp.tone] || TONE_STYLES.neutral;
            const Icon = tone.icon;
            const sign = (imp.change || 0) > 0 ? '+' : '';
            const showLabel = setting === 'detailed' || (imp.change || 0) === 0;
            return (
              <div key={i} className={`flex items-start gap-2 px-2 py-1.5 rounded ${tone.bg} border ${tone.border}`}>
                <Icon className={`w-3 h-3 mt-0.5 shrink-0 ${tone.color}`} strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-heading text-foreground truncate">{imp.label}</span>
                    {(imp.change || 0) !== 0 && (
                      <span className={`text-xs font-heading font-600 tabular-nums shrink-0 ${tone.color}`}>{sign}{imp.change}</span>
                    )}
                  </div>
                  {showLabel && imp.change_label && (
                    <span className={`text-[9px] font-heading tracking-wide ${tone.color}`}>{imp.change_label}</span>
                  )}
                  {setting === 'detailed' && imp.reason && (
                    <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5">{imp.reason}</p>
                  )}
                </div>
              </div>
            );
          })}
          {characterNote && (
            <div className="px-2 py-1.5 border-t border-border/30 mt-1">
              <p className="text-[10px] font-body italic text-foreground/70 leading-relaxed">{characterNote}</p>
            </div>
          )}
          {setting === 'detailed' && impact.future_consequence && (
            <div className="px-2 py-1.5 border-t border-border/30">
              <p className="text-[9px] font-heading tracking-wide text-purple-400/70 mb-0.5">POSSIBLE CONSEQUENCE</p>
              <p className="text-[10px] font-body italic text-muted-foreground leading-relaxed">{impact.future_consequence}</p>
            </div>
          )}
        </div>
        <button onClick={onOpenLog} className="w-full flex items-center justify-center gap-1 px-3 py-1.5 border-t border-border/30 text-[9px] font-heading tracking-wide text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors">
          VIEW DECISION LOG <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}