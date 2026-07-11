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
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [impact, setting]);

  if (!impact || setting === 'off') return null;

  const impacts = (impact.impacts || []).slice(0, setting === 'minimal' ? 2 : 4);

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="border border-border/60 rounded-lg bg-card/95 backdrop-blur-sm panel-glow overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-primary/5">
          <span className="font-heading text-[10px] tracking-[0.15em] text-primary">DECISION IMPACT</span>
          <button onClick={() => { setVisible(false); setTimeout(onDismiss, 200); }} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
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
                    <span className="text-xs font-heading text-foreground truncate">{imp.label}</span>
                    <span className={`text-xs font-heading tabular-nums shrink-0 ${isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-amber-400'}`}>
                      {imp.change > 0 ? '+' : ''}{imp.change}
                    </span>
                  </div>
                  {imp.change_label && (
                    <p className="text-[10px] text-muted-foreground font-body">{imp.change_label}</p>
                  )}
                  {setting === 'detailed' && imp.reason && (
                    <p className="text-[10px] text-muted-foreground/70 font-body italic mt-0.5 leading-snug">{imp.reason}</p>
                  )}
                </div>
              </div>
            );
          })}
          {setting === 'detailed' && impact.future_consequence && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-[10px] text-primary/70 font-body italic">{impact.future_consequence}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}