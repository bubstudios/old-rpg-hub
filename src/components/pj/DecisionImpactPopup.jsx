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
    // No auto-dismiss timer — stays until user closes it
  }, [impact]);

  if (!impact || !impact.is_meaningful || setting === 'off') return null;

  let impacts = (impact.impacts || []).slice(0, 6);
  if (setting === 'minimal') {
    impacts = impacts.filter(i => Math.abs(i.change || 0) >= 6 || i.tone === 'hidden');
    if (!impacts.length) return null;
  }

  const characterNote = setting !== 'minimal'
    ? impacts.find(i => i.character_note)?.character_note
    : null;

  // Group impacts by category for section headers
  const CATEGORY_LABELS = {
    clock: 'CLOCK UPDATED',
    ally: 'CREW REACTION',
    faction: 'FACTION SHIFT',
    evidence: 'EVIDENCE EFFECT',
    hidden: 'HIDDEN CONSEQUENCE'
  };
  const grouped = [];
  const seen = new Set();
  for (const imp of impacts) {
    const cat = imp.category || 'clock';
    if (!seen.has(cat)) {
      seen.add(cat);
      grouped.push({ category: cat, label: CATEGORY_LABELS[cat] || cat.toUpperCase(), items: [] });
    }
    grouped.find(g => g.category === cat).items.push(imp);
  }

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleDismiss} />

      {/* Popup card */}
      <div className={`relative w-full max-w-md border border-primary/40 bg-card/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden panel-glow transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-primary/10 border-b border-primary/20">
          <span className="flex items-center gap-2 text-sm font-heading tracking-[0.15em] text-primary">
            <ScrollText className="w-4 h-4" strokeWidth={1.5} /> DECISION IMPACT
          </span>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {grouped.map((group, gi) => (
            <div key={gi} className="space-y-1.5">
              <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground/80 px-1">{group.label}</p>
              {group.items.map((imp, i) => {
                const tone = TONE_STYLES[imp.tone] || TONE_STYLES.neutral;
                const Icon = tone.icon;
                const sign = (imp.change || 0) > 0 ? '+' : '';
                const showLabel = setting === 'detailed' || (imp.change || 0) === 0;
                return (
                  <div key={i} className={`flex items-start gap-2.5 px-2.5 py-2 rounded ${tone.bg} border ${tone.border}`}>
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${tone.color}`} strokeWidth={1.5} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-heading text-foreground truncate">{imp.label}</span>
                        {(imp.change || 0) !== 0 && (
                          <span className={`text-sm font-heading font-600 tabular-nums shrink-0 ${tone.color}`}>{sign}{imp.change}</span>
                        )}
                      </div>
                      {showLabel && imp.change_label && (
                        <span className={`text-xs font-heading tracking-wide ${tone.color}`}>{imp.change_label}</span>
                      )}
                      {imp.reason && (
                        <p className="text-sm text-foreground/80 leading-relaxed mt-1">{imp.reason}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {characterNote && (
            <div className="px-3 py-2.5 rounded border border-primary/20 bg-primary/5">
              <p className="text-[10px] font-heading tracking-wide text-primary/70 mb-1">CREW VOICE</p>
              <p className="text-sm font-body italic text-foreground/90 leading-relaxed">{characterNote}</p>
            </div>
          )}

          {setting === 'detailed' && impact.future_consequence && (
            <div className="px-3 py-2.5 rounded border border-purple-500/20 bg-purple-500/5">
              <p className="text-[10px] font-heading tracking-wide text-purple-400/70 mb-1">POSSIBLE CONSEQUENCE</p>
              <p className="text-sm font-body italic text-foreground/80 leading-relaxed">{impact.future_consequence}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border/30">
          <button onClick={() => { handleDismiss(); onOpenLog?.(); }} className="flex items-center gap-1 text-[11px] font-heading tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            VIEW DECISION LOG <ChevronRight className="w-3 h-3" />
          </button>
          <button onClick={handleDismiss} className="ml-auto px-4 py-1.5 rounded text-xs font-heading tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}