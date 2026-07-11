import { Swords } from 'lucide-react';
import { INSTINCTS, INSTINCT_LABELS, calcInstinctValue } from '@/lib/pullSheetData';

export default function InstinctsTab({ flags, isMichael }) {
  const clocks = flags.campaign_clocks || {};
  const showFearOfSelf = isMichael || (clocks.fear_of_self || 0) > 0 ||
    (flags.conditions || []).some(c => (c.type || c.label || '').toLowerCase().replace(/\s/g, '_') === 'fear_of_self');

  return (
    <div className="space-y-3">
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Swords className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">INSTINCTS</h3>
        </div>
        <div className="space-y-4">
          {INSTINCTS.map(instinct => {
            if (instinct.key === 'fear_of_self' && !showFearOfSelf) return null;
            const value = calcInstinctValue(instinct.key, flags, isMichael);
            const labels = INSTINCT_LABELS[instinct.key];
            const label = labels[Math.min(value, instinct.max)] || labels[0];
            return (
              <div key={instinct.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-heading text-xs text-foreground">{instinct.label}</span>
                  <span className={`font-heading text-xs ${
                    value >= 4 ? 'text-red-400' : value >= 3 ? 'text-amber-400' : value >= 1 ? 'text-sky-400' : 'text-muted-foreground/50'
                  }`}>{label}</span>
                </div>
                <div className="flex gap-0.5 mb-1.5">
                  {Array.from({ length: instinct.max }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-sm transition-colors ${i < value ? instinct.color : 'bg-border/30'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 font-body leading-relaxed">{instinct.desc}</p>
                {instinct.risk && (
                  <p className="text-sm text-red-200 font-body mt-0.5">Risk: {instinct.risk}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}