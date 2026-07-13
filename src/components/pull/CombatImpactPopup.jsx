import { useEffect, useState } from 'react';
import { X, Swords, TrendingUp, TrendingDown } from 'lucide-react';

export default function CombatImpactPopup({ result, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 12000);
      return () => clearTimeout(timer);
    }
  }, [result, onDismiss]);

  if (!result) return null;

  const changes = result.clockChanges || {};
  const changeEntries = Object.entries(changes).filter(([, v]) => v !== 0);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="border border-red-700/50 rounded-lg bg-card/95 backdrop-blur-sm panel-glow p-4 max-w-xs shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Swords className="w-4 h-4 text-red-400" strokeWidth={1.5} />
          <h3 className="font-heading text-xs tracking-[0.15em] text-red-300">COMBAT IMPACT</h3>
          <button
            onClick={() => { setVisible(false); setTimeout(onDismiss, 200); }}
            className="ml-auto text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className={`text-[11px] font-heading tracking-wide mb-2 ${result.resultColor}`}>
          {result.resultLabel}
        </div>

        <p className="text-[11px] font-body text-foreground/80 mb-3 leading-relaxed italic">
          {result.narration}
        </p>

        {changeEntries.length > 0 && (
          <div className="space-y-1 pt-2 border-t border-border/30">
            {changeEntries.map(([key, delta]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
              const isPositive = delta > 0;
              const isGood = key === 'bulletControl' || key === 'coreSecurity' || key === 'enemyMorale' ? !isPositive : isPositive;
              return (
                <div key={key} className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground/70 font-body">{label}</span>
                  <span className={`font-heading tabular-nums flex items-center gap-0.5 ${
                    isGood ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    {isPositive ? '+' : ''}{delta}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {result.battleEnded && (
          <div className="mt-2 pt-2 border-t border-border/30">
            <p className="text-[10px] font-heading tracking-wide text-amber-400">
              ⚔ BATTLE ENDED
            </p>
          </div>
        )}

        {result.exchangeCount && (
          <div className="mt-2 text-[9px] text-muted-foreground/40 font-body">
            Exchange {result.exchangeCount} / {result.maxExchanges || 4}
          </div>
        )}
      </div>
    </div>
  );
}