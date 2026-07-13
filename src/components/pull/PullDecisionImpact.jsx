import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, Gavel, Settings2, Loader2, ScrollText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { IMPACT_DISPLAY_LEVELS } from '@/lib/pullRules';
import { toast } from 'sonner';

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

  const impacts = (impact.impacts || []).slice(0, setting === 'minimal' ? 2 : 4);

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="border border-border/60 rounded-lg bg-card/95 backdrop-blur-sm panel-glow overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-primary/5">
          <span className="font-heading text-sm tracking-[0.15em] text-primary">DECISION IMPACT</span>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 space-y-2">
          {impacts.map((imp, i) => {
            const isPositive = imp.tone === 'positive' || (imp.change > 0 && imp.tone !== 'negative');
            const isNegative = imp.tone === 'negative' || imp.change < 0;
            return (
              <div key={i} className="flex items-start gap-2">
                <div className={`shrink-0 w-1 h-full rounded-full ${isPositive ? 'bg-emerald-500' : isNegative ? 'bg-red-500' : 'bg-amber-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-heading text-foreground truncate">{imp.label}</span>
                    <span className={`text-sm font-heading tabular-nums shrink-0 ${isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-amber-400'}`}>
                      {imp.change > 0 ? '+' : ''}{imp.change}
                    </span>
                  </div>
                  {imp.change_label && (
                    <p className="text-xs text-foreground/70 font-body mt-0.5">{imp.change_label}</p>
                  )}
                  {setting === 'detailed' && imp.reason && (
                    <p className="text-sm text-foreground/90 font-body mt-1 leading-relaxed">{imp.reason}</p>
                  )}
                </div>
              </div>
            );
          })}
          {setting === 'detailed' && impact.future_consequence && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-sm text-foreground/90 font-body leading-relaxed">{impact.future_consequence}</p>
            </div>
          )}
          <div className="pt-2 border-t border-border/30 flex justify-end">
            <Button size="sm" variant="outline" onClick={handleDismiss} className="h-7 text-xs">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}