import { ChevronDown, ChevronUp, Heart, AlertTriangle, Ship, Users, Lock, Shield } from 'lucide-react';
import { getAllyState, getAllyNeed, getAllyLastAction, getAllyChanges, getAllyRelationshipBand, ALLY_BREAKING_POINTS, SANCTUARY_SHIPS, SANCTUARY_INTERNAL_FACTIONS } from '@/lib/pjAllies';

export default function AllyCard({ ally, campaign, expanded, onToggle, onSuggestAction }) {
  const state = getAllyState(campaign, ally.key);
  const need = getAllyNeed(campaign, ally.key);
  const lastAction = getAllyLastAction(campaign, ally.key);
  const changes = getAllyChanges(campaign, ally.key);
  const isFleet = ally.key === 'sanctuary_refugee_fleet';
  const band = state ? getAllyRelationshipBand(state.relationship) : null;
  const breakingPoints = ALLY_BREAKING_POINTS[ally.key];

  return (
    <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
      <button onClick={onToggle} className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          {ally.locked && <Lock className="w-3 h-3 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />}
          <span className="font-heading text-sm text-foreground truncate">{ally.label}</span>
          {band && (
            <span className={`text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded ${band.bar} text-white/90 shrink-0`}>
              {band.tier}
            </span>
          )}
        </div>
        {expanded
          ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />}
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2.5">
          {state && band && (
            <div>
              <div className="flex items-center justify-between text-[10px] mb-0.5">
                <span className={`font-body ${band.tone}`}>{band.label}</span>
                <span className="font-heading tabular-nums text-foreground">{state.relationship > 0 ? '+' : ''}{state.relationship}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${band.bar}`} style={{ width: `${Math.max(2, Math.min(100, ((state.relationship + 100) / 2)))}%` }} />
              </div>
              <p className="text-[9px] text-muted-foreground/60 font-body italic mt-0.5">{band.desc}</p>
            </div>
          )}
          {need && (
            <div className="flex items-start gap-1.5">
              <Heart className="w-3 h-3 text-primary/60 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <span className="text-[10px] font-heading tracking-[0.12em] text-primary/60">CURRENT NEED: </span>
                <span className="text-sm font-body text-foreground/80">{need}</span>
              </div>
            </div>
          )}
          {lastAction && (
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-400/60 mt-0.5 shrink-0" strokeWidth={1.5} />
              <div>
                <span className="text-[10px] font-heading tracking-[0.12em] text-amber-400/60">LAST ACTION: </span>
                <span className="text-sm font-body text-foreground/80">{lastAction}</span>
              </div>
            </div>
          )}
          {changes.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60">RECENT RELATIONSHIP CHANGES</p>
              {changes.slice(0, 3).map((c, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className={`text-[10px] font-heading tabular-nums shrink-0 mt-0.5 ${c.change > 0 ? 'text-emerald-400' : c.change < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {c.change > 0 ? '+' : ''}{c.change}
                  </span>
                  <span className="text-[10px] font-body text-foreground/70 leading-relaxed">
                    {c.reason ? `because ${c.reason}` : 'relationship shifted'}
                  </span>
                </div>
              ))}
            </div>
          )}
          {breakingPoints && (
            <div className="border border-border/30 rounded p-2 bg-secondary/10 space-y-1.5">
              <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/70">
                <Shield className="w-3 h-3" strokeWidth={1.5} /> BREAKING POINTS
              </p>
              <div>
                <p className="text-[9px] font-heading tracking-wide text-emerald-400/70 mb-0.5">STRENGTHENED BY</p>
                <ul className="space-y-0.5">
                  {breakingPoints.strengthenedBy.map((s, i) => (
                    <li key={i} className="text-[10px] font-body text-foreground/70 flex gap-1">
                      <span className="text-emerald-500/50 shrink-0">+</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[9px] font-heading tracking-wide text-red-400/70 mb-0.5">DAMAGED BY</p>
                <ul className="space-y-0.5">
                  {breakingPoints.damagedBy.map((d, i) => (
                    <li key={i} className="text-[10px] font-body text-foreground/70 flex gap-1">
                      <span className="text-red-500/50 shrink-0">−</span>{d}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[9px] text-muted-foreground/60 italic pt-0.5 border-t border-border/20">{breakingPoints.breakingPoint}</p>
            </div>
          )}
          {(ally.fields || []).map((f, i) => (
            <div key={i}>
              <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-0.5">{f.label.toUpperCase()}</p>
              <p className="text-sm font-body text-foreground/80 leading-relaxed">{f.value}</p>
            </div>
          ))}
          {isFleet && (
            <div className="space-y-1.5 pt-1.5 border-t border-border/30">
              <div className="flex items-center gap-1.5">
                <Ship className="w-3 h-3 text-primary" strokeWidth={1.5} />
                <span className="text-[10px] font-heading tracking-[0.12em] text-foreground">FLEET SHIPS</span>
              </div>
              {SANCTUARY_SHIPS.map((ship, i) => (
                <div key={i} className="border border-border/30 rounded p-1.5 bg-secondary/10">
                  <p className="text-[11px] font-heading text-foreground">{ship.name}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{ship.role}</p>
                  <p className="text-[10px] text-foreground/70 font-body">Commander: {ship.commander} — {ship.personality}</p>
                  <p className="text-[9px] text-muted-foreground/70 font-body italic">Use: {ship.use}</p>
                </div>
              ))}
            </div>
          )}
          {isFleet && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3 text-primary" strokeWidth={1.5} />
                <span className="text-[10px] font-heading tracking-[0.12em] text-foreground">INTERNAL FACTIONS</span>
              </div>
              {SANCTUARY_INTERNAL_FACTIONS.map((f, i) => (
                <div key={i} className="text-[10px] font-body text-foreground/70 leading-snug">
                  <span className="font-heading text-foreground/90">{f.name}: </span>{f.desc}
                </div>
              ))}
            </div>
          )}
          {ally.locked && ally.spoilerNote && (
            <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 italic pt-1.5 border-t border-border/30">
              <Lock className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {ally.spoilerNote}
            </p>
          )}
          {onSuggestAction && ally.actions && ally.actions.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1.5 border-t border-border/30">
              {ally.actions.map((a, i) => (
                <button key={i} onClick={() => onSuggestAction(a)} className="text-[9px] px-2 py-1 rounded border border-primary/30 bg-primary/5 text-primary/80 hover:bg-primary/15 transition-colors font-body">{a}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}