import { useEffect, useState } from 'react';
import { X, Swords, TrendingUp, TrendingDown } from 'lucide-react';

export default function CombatImpactPopup({ result, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setVisible(true);
    }
  }, [result]);

  if (!result) return null;

  const changes = result.clockChanges || {};
  const changeEntries = Object.entries(changes).filter(([, v]) => v !== 0);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 200);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleDismiss} />

      <div className={`relative w-full max-w-sm border border-red-700/50 rounded-lg bg-card/95 backdrop-blur-sm panel-glow shadow-2xl overflow-hidden transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-red-900/30 bg-red-950/20">
          <Swords className="w-4 h-4 text-red-400" strokeWidth={1.5} />
          <h3 className="font-heading text-sm tracking-[0.15em] text-red-300">COMBAT IMPACT</h3>
          <button onClick={handleDismiss} className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className={`text-sm font-heading tracking-wide ${result.resultColor}`}>
            {result.resultLabel}
          </div>

          <p className="text-sm font-body text-foreground/90 leading-relaxed italic">
            {result.narration}
          </p>

          {changeEntries.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-border/30">
              {changeEntries.map(([key, delta]) => {
                const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
                const isPositive = delta > 0;
                const isGood = key === 'bulletControl' || key === 'coreSecurity' || key === 'enemyMorale' ? !isPositive : isPositive;
                return (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="text-foreground/80 font-body">{label}</span>
                    <span className={`font-heading tabular-nums flex items-center gap-0.5 ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{delta}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {result.battleEnded && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-sm font-heading tracking-wide text-amber-400">
                ⚔ BATTLE ENDED
              </p>
            </div>
          )}

          {result.exchangeCount && (
            <div className="text-xs text-muted-foreground/60 font-body">
              Exchange {result.exchangeCount} / {result.maxExchanges || 4}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-4 py-2.5 border-t border-border/30">
          <button onClick={handleDismiss} className="px-4 py-1.5 rounded text-xs font-heading tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}