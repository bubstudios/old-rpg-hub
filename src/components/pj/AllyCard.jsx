import { ChevronDown, ChevronUp, Heart, AlertTriangle, Ship, Users, Lock } from 'lucide-react';
import { getAllyState, getAllyNeed, getAllyLastAction, SANCTUARY_SHIPS, SANCTUARY_INTERNAL_FACTIONS } from '@/lib/pjAllies';

function relColor(rel) {
  if (rel >= 50) return 'bg-emerald-600';
  if (rel >= 20) return 'bg-green-600';
  if (rel >= 0) return 'bg-amber-600';
  if (rel >= -20) return 'bg-orange-600';
  return 'bg-red-700';
}

export default function AllyCard({ ally, campaign, expanded, onToggle, onSuggestAction }) {
  const state = getAllyState(campaign, ally.key);
  const need = getAllyNeed(campaign, ally.key);
  const lastAction = getAllyLastAction(campaign, ally.key);
  const isFleet = ally.key === 'sanctuary_refugee_fleet';

  return (
    <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
      <button onClick={onToggle} className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          {ally.locked && <Lock className="w-3 h-3 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />}
          <span className="font-heading text-sm text-foreground truncate">{ally.label}</span>
          {state && (
            <span className={`text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded ${state.stateInfo.bar} text-white/90 shrink-0`}>
              {state.stateInfo.label.toUpperCase()}
            </span>
          )}
        </div>
        {expanded
          ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />}
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2.5">
          {state && (
            <div>
              <div className="flex items-center justify-between text-[10px] mb-0.5">
                <span className="text-muted-foreground font-body">Relationship</span>
                <span className="font-heading tabular-nums text-foreground">{state.relationship > 0 ? '+' : ''}{state.relationship}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${relColor(state.relationship)}`} style={{ width: `${Math.max(2, Math.min(100, ((state.relationship + 100) / 2)))}%` }} />
              </div>
              <p className="text-[9px] text-muted-foreground/60 font-body italic mt-0.5">{state.stateInfo.desc}</p>
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