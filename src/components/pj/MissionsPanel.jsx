import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Target, Activity, Users, AlertTriangle, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import {
  CODEX_LOCATIONS, getLocationState, isLocationVisible,
  LOCATION_STATES, STATE_TONE_CLASSES, RISK_TONE_CLASSES
} from '@/lib/pjLocations';
import { findClock, getClockValue, getClockTier, getClockStatus } from '@/lib/pjClocks';
import { CODEX_ALLIES, codexKey } from '@/lib/pjCodex';
import { getAllyState, getAllyRelationshipBand } from '@/lib/pjAllies';

const STATE_ORDER = { ACTIVE: 0, DANGEROUS: 1, UNLOCKED: 2, RUMORED: 3, VISITED: 4, LOCKED: 5, UNKNOWN: 6 };

// Match NPC names from relatedNpcs to ally entries in CODEX_ALLIES.
function findMissionAllies(relatedNpcs) {
  const allies = [];
  const others = [];
  for (const npc of relatedNpcs || []) {
    const key = codexKey(npc);
    const ally = CODEX_ALLIES.find(
      (a) => codexKey(a.label) === key || (a.aliases || []).some((al) => codexKey(al) === key)
    );
    if (ally) allies.push(ally);
    else others.push(npc);
  }
  return { allies, others };
}

export default function MissionsPanel({ open, onOpenChange, campaign, onSuggestAction }) {
  const missions = CODEX_LOCATIONS
    .filter((loc) => isLocationVisible(campaign, loc))
    .map((loc) => ({ loc, state: getLocationState(campaign, loc.key) }))
    .filter(({ state }) => state !== 'COMPLETED' && state !== 'LOST')
    .sort((a, b) => (STATE_ORDER[a.state] ?? 9) - (STATE_ORDER[b.state] ?? 9));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40">
          <DialogTitle className="font-heading tracking-[0.15em] text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" strokeWidth={1.5} />
            MISSIONS
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto p-4 sm:p-5 space-y-2.5 max-h-[68vh]">
          {missions.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-8">No active missions.</p>
          )}
          {missions.map(({ loc, state }) => (
            <MissionCard
              key={loc.key}
              loc={loc}
              state={state}
              campaign={campaign}
              onSuggestAction={onSuggestAction}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MissionCard({ loc, state, campaign, onSuggestAction }) {
  const [expanded, setExpanded] = useState(state === 'ACTIVE' || state === 'DANGEROUS');
  const stateInfo = LOCATION_STATES[state] || LOCATION_STATES.UNKNOWN;
  const stateTone = STATE_TONE_CLASSES[stateInfo.tone] || STATE_TONE_CLASSES.muted;
  const riskTone = RISK_TONE_CLASSES[loc.risk] || RISK_TONE_CLASSES.Unknown;
  const { allies, others } = findMissionAllies(loc.relatedNpcs);
  const clocks = (loc.relatedClocks || []).map((k) => findClock(k)).filter(Boolean);
  const isUrgent = state === 'ACTIVE' || state === 'DANGEROUS';

  return (
    <div className={`border rounded-lg overflow-hidden bg-card/30 ${isUrgent ? 'border-red-500/30' : 'border-border/40'}`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded border ${stateTone} shrink-0`}>
            {loc.stateLabel || stateInfo.label}
          </span>
          <span className="font-heading text-sm text-foreground truncate">{loc.label}</span>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className={`text-[10px] font-heading tracking-wide ${riskTone}`}>{loc.risk} RISK</span>
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Purpose */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-0.5">OBJECTIVE</p>
            <p className="text-sm font-body text-foreground/80 leading-relaxed">{loc.mainPurpose}</p>
          </div>

          {/* Associated clocks */}
          {clocks.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1.5">
                <Activity className="w-3 h-3" strokeWidth={1.5} /> ASSOCIATED CLOCKS
              </p>
              <div className="space-y-1.5">
                {clocks.map((clock) => {
                  const val = getClockValue(campaign, clock.key);
                  const tier = getClockTier(val);
                  const status = getClockStatus(clock, val);
                  return (
                    <div key={clock.key} className="flex items-center gap-2">
                      <span className="text-[10px] font-body text-muted-foreground w-28 shrink-0 truncate" title={clock.label}>{clock.label}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${tier.color}`} style={{ width: `${Math.max(0, Math.min(100, val))}%` }} />
                      </div>
                      <span className={`text-[10px] font-heading tabular-nums w-16 text-right ${tier.text}`}>{val} — {status.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Involved allies */}
          {allies.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1.5">
                <Users className="w-3 h-3" strokeWidth={1.5} /> INVOLVED ALLIES
              </p>
              <div className="space-y-1">
                {allies.map((ally) => {
                  const allyState = getAllyState(campaign, ally.key);
                  const band = allyState ? getAllyRelationshipBand(allyState.relationship) : null;
                  return (
                    <div key={ally.key} className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-body text-foreground/80">{ally.label}</span>
                      {band ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-heading tracking-wide ${band.tone}`}>{band.tier}</span>
                          <span className={`text-[10px] font-heading tabular-nums ${band.tone}`}>
                            {allyState.relationship > 0 ? '+' : ''}{allyState.relationship}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-heading tracking-wide text-muted-foreground/60">UNTRACKED</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other contacts */}
          {others.length > 0 && (
            <div>
              <p className="text-[10px] font-heading tracking-[0.12em] text-muted-foreground/60 mb-0.5">OTHER CONTACTS</p>
              <p className="text-[11px] font-body text-muted-foreground/80 leading-relaxed">{others.join(', ')}</p>
            </div>
          )}

          {/* Risk if mission fails */}
          {loc.ifIgnored && (
            <div className="border border-red-500/20 rounded p-2 bg-red-950/20">
              <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-red-400/70 mb-0.5">
                <AlertTriangle className="w-3 h-3" strokeWidth={1.5} /> RISK IF MISSION FAILS
              </p>
              <p className="text-[11px] font-body text-foreground/70 leading-relaxed">{loc.ifIgnored}</p>
            </div>
          )}

          {/* Suggest action */}
          {onSuggestAction && (
            <button
              onClick={() => onSuggestAction(`Review the mission to ${loc.label} with the senior crew. What are our options?`)}
              className="text-[9px] px-2 py-1 rounded border border-primary/30 bg-primary/5 text-primary/80 hover:bg-primary/15 transition-colors font-body"
            >
              Plan Mission
            </button>
          )}
        </div>
      )}
    </div>
  );
}