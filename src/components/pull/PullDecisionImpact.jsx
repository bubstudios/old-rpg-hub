import { useState, useEffect } from 'react';
import { X, ChevronRight, Gavel, Settings2, Loader2, ScrollText } from 'lucide-react';
import { IMPACT_DISPLAY_LEVELS } from '@/lib/pullRules';
import { toast } from 'sonner';

const TONE_STYLES = {
  positive: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', dot: 'bg-emerald-500' },
  negative: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500' },
  neutral: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  hidden: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', dot: 'bg-purple-500' }
};

export default function PullDecisionImpact({ impact, onDismiss, setting }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (impact && setting !== 'off') {
      setVisible(true);
    }
  }, [impact, setting]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 200);
  };

  if (!impact || setting === 'off') return null;

  const impacts = (impact.impacts || []).slice(0, setting === 'minimal' ? 2 : 6);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleDismiss} />

      {/* Popup card */}
      <div className={`relative w-full max-w-md border border-border/60 rounded-lg bg-card/95 backdrop-blur-sm panel-glow overflow-hidden transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-primary/5">
          <span className="flex items-center gap-2 font-heading text-sm tracking-[0.15em] text-primary">
            <ScrollText className="w-4 h-4" strokeWidth={1.5} /> DECISION IMPACT
          </span>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {impacts.map((imp, i) => {
            const isPositive = imp.tone === 'positive' || (imp.change > 0 && imp.tone !== 'negative');
            const isNegative = imp.tone === 'negative' || imp.change < 0;
            const toneKey = imp.tone === 'positive' ? 'positive' : imp.tone === 'negative' ? 'negative' : imp.tone === 'hidden' ? 'hidden' : 'neutral';
            const tone = TONE_STYLES[toneKey] || TONE_STYLES.neutral;
            return (
              <div key={i} className={`flex items-start gap-2.5 px-2.5 py-2 rounded ${tone.bg} border ${tone.border}`}>
                <div className={`shrink-0 w-1 self-stretch rounded-full ${tone.dot}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-heading text-foreground truncate">{imp.label}</span>
                    <span className={`text-sm font-heading tabular-nums shrink-0 ${tone.color}`}>
                      {imp.change > 0 ? '+' : ''}{imp.change}
                    </span>
                  </div>
                  {imp.change_label && (
                    <p className="text-xs text-foreground/70 font-body mt-0.5">{imp.change_label}</p>
                  )}
                  {setting === 'detailed' && imp.reason && (
                    <p className="text-sm text-foreground/80 font-body mt-1 leading-relaxed">{imp.reason}</p>
                  )}
                </div>
              </div>
            );
          })}

          {setting === 'detailed' && impact.future_consequence && (
            <div className="px-3 py-2.5 rounded border border-purple-500/20 bg-purple-500/5">
              <p className="text-[10px] font-heading tracking-wide text-purple-400/70 mb-1">POSSIBLE CONSEQUENCE</p>
              <p className="text-sm font-body italic text-foreground/80 leading-relaxed">{impact.future_consequence}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border/30">
          <button onClick={handleDismiss} className="ml-auto px-4 py-1.5 rounded text-xs font-heading tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}