import { ChevronDown, ChevronUp, Lightbulb, TrendingUp, TrendingDown } from 'lucide-react';
import { getClockTier, getClockStatus } from '@/lib/pjClocks';

export default function ClockCard({ clock, value, changes, expanded, onToggle, onSuggestAction }) {
  const val = Math.max(0, Math.min(100, value));
  const tier = getClockTier(val);
  const status = getClockStatus(clock, val);

  return (
    <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-1.5 h-9 rounded-full ${tier.color} shrink-0`} />
          <div className="min-w-0 text-left">
            <p className="font-heading text-sm text-foreground truncate">{clock.label}</p>
            <p className="text-[10px] text-muted-foreground font-body">
              {val} / 100 <span className="opacity-40">—</span>{' '}
              <span className={tier.text}>{status.label}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {clock.crisisClock && (
            <span className="text-[9px] font-heading tracking-wider text-red-400/70 px-1.5 py-0.5 rounded border border-red-500/20 bg-red-500/5">
              CRISIS
            </span>
          )}
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Bar */}
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${tier.color}`}
              style={{ width: `${val}%` }}
            />
          </div>

          {/* What this means right now */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1">
              WHAT THIS MEANS RIGHT NOW
            </p>
            <p className="text-sm font-body text-foreground/80 leading-relaxed">
              {clock.whatItMeans}
            </p>
          </div>

          {/* Why it's at this level */}
          {clock.whyHigh?.length > 0 && (
            <div>
              <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1">
                WHY IT'S AT THIS LEVEL
              </p>
              <ul className="space-y-0.5">
                {clock.whyHigh.map((item, i) => (
                  <li key={i} className="text-xs font-body text-foreground/70 leading-relaxed flex gap-1.5">
                    <span className="text-primary/40 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How to lower */}
          {clock.howToLower?.length > 0 && (
            <div>
              <p className="flex items-center gap-1 text-[10px] font-heading tracking-[0.12em] text-emerald-500/70 mb-1">
                <TrendingDown className="w-3 h-3" /> HOW TO {clock.highIsBad ? 'LOWER' : 'REDUCE'}
              </p>
              <ul className="space-y-0.5">
                {clock.howToLower.map((item, i) => (
                  <li key={i} className="text-xs font-body text-foreground/70 leading-relaxed flex gap-1.5">
                    <span className="text-emerald-500/40 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* How it can rise */}
          {clock.howToRise?.length > 0 && (
            <div>
              <p className="flex items-center gap-1 text-[10px] font-heading tracking-[0.12em] text-red-500/70 mb-1">
                <TrendingUp className="w-3 h-3" /> HOW IT CAN {clock.highIsBad ? 'RISE' : 'INCREASE'}
              </p>
              <ul className="space-y-0.5">
                {clock.howToRise.map((item, i) => (
                  <li key={i} className="text-xs font-body text-foreground/70 leading-relaxed flex gap-1.5">
                    <span className="text-red-500/40 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What can I do? */}
          {clock.whatCanIDo?.length > 0 && (
            <div className="pt-2 border-t border-border/30">
              <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/70 mb-1.5">
                <Lightbulb className="w-3 h-3" /> WHAT CAN I DO?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {clock.whatCanIDo.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => onSuggestAction?.(action)}
                    className="text-[10px] font-body text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border/40 hover:border-primary/40 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent changes */}
          {changes?.length > 0 && (
            <div className="pt-2 border-t border-border/30">
              <p className="text-[10px] font-heading tracking-[0.12em] text-muted-foreground/60 mb-1.5">
                RECENT CHANGES
              </p>
              <div className="space-y-1.5">
                {changes.slice(0, 3).map((cc, i) => (
                  <div key={i} className="text-xs font-body text-foreground/60 leading-relaxed">
                    <span className={cc.change > 0 ? 'text-red-400 font-heading' : 'text-emerald-400 font-heading'}>
                      {cc.change > 0 ? '+' : ''}{cc.change}
                    </span>
                    {cc.reason && <span className="text-foreground/70"> — {cc.reason}</span>}
                    {cc.effect && (
                      <p className="text-muted-foreground/60 text-[11px] mt-0.5 pl-3">{cc.effect}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}