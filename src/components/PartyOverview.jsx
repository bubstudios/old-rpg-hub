import { Link } from 'react-router-dom';
import { Heart, Shield } from 'lucide-react';

function hpColor(current, max) {
  const pct = max > 0 ? current / max : 0;
  if (pct > 0.6) return 'bg-emerald-700';
  if (pct > 0.3) return 'bg-amber-700';
  return 'bg-red-800';
}

export default function PartyOverview({ characters, campaignId, gameSystem }) {
  if (!characters || !characters.length) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm font-body italic">
        The tavern stands empty...
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {characters.map((c) => {
        const hpPct = c.hp_max > 0 ? Math.max(0, Math.min(100, (c.hp_current / c.hp_max) * 100)) : 0;
        const isDead = c.status === 'dead';
        return (
          <Link
            key={c.id}
            to={`/campaign/${campaignId}/character/${c.id}`}
            className={`block p-3 rounded-lg border transition-all hover:border-primary/40 hover:bg-secondary/30 ${
              isDead ? 'border-red-900/30 bg-red-950/10 opacity-60' : 'border-border/40 bg-card/40'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-heading text-sm font-600 text-foreground truncate">
                  {c.name}
                </p>
                <p className="text-[11px] text-muted-foreground font-body">
                  {gameSystem === 'starfrontiers'
                    ? `${c.race} · ${c.character_class}`
                    : gameSystem === 'gammaworld'
                    ? `${c.race}`
                    : `${c.race} ${c.character_class} · Lvl ${c.level}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {gameSystem !== 'starfrontiers' && gameSystem !== 'gammaworld' && (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Shield className="w-3 h-3" strokeWidth={1.5} />
                    <span className="font-heading font-600">{c.ac}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className={`w-3 h-3 shrink-0 ${isDead ? 'text-red-700' : 'text-red-500'}`} fill="currentColor" strokeWidth={0} />
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isDead ? 'bg-red-900' : hpColor(c.hp_current, c.hp_max)}`}
                  style={{ width: `${isDead ? 0 : hpPct}%` }}
                />
              </div>
              <span className="text-[10px] font-heading text-muted-foreground tabular-nums w-12 text-right">
                {c.hp_current}/{c.hp_max}
              </span>
            </div>
            {isDead && (
              <p className="text-[10px] text-red-400 font-heading tracking-wider mt-1.5">FALLEN</p>
            )}
          </Link>
        );
      })}
    </div>
  );
}