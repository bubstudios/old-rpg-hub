import { useState } from 'react';
import {
  ChevronDown, ChevronUp, Lock, Compass, Users, AlertTriangle, FileText,
  Radar, Flag, ClipboardList, Clock, MapPin, ShieldAlert, Sparkles,
  Target, Eye, Anchor, SkipForward
} from 'lucide-react';
import {
  LOCATION_STATES, STATE_TONE_CLASSES, RISK_TONE_CLASSES, LOCATION_ACTIONS,
  getLocationState
} from '@/lib/pjCodex';

const ACTION_ICONS = {
  Compass, Users, AlertTriangle, FileText, Radar, Flag, ClipboardList, Clock
};

function StatusBadge({ state }) {
  const cfg = LOCATION_STATES[state] || LOCATION_STATES.UNKNOWN;
  const cls = STATE_TONE_CLASSES[cfg.tone] || STATE_TONE_CLASSES.muted;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-heading tracking-[0.12em] uppercase ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-secondary/40 border border-border/40 text-[9px] font-body text-foreground/70">
      {children}
    </span>
  );
}

function Field({ label, icon: Icon, children }) {
  if (!children) return null;
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-0.5">
        <Icon className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {label.toUpperCase()}
      </p>
      {Array.isArray(children) ? (
        <ul className="space-y-0.5 list-disc list-inside marker:text-primary/40">
          {children.map((c, i) => (
            <li key={i} className="text-xs font-body text-foreground/75 leading-relaxed">{c}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs font-body text-foreground/80 leading-relaxed">{children}</p>
      )}
    </div>
  );
}

export default function LocationCard({ location, campaign, expanded, onToggle, onSuggestAction }) {
  const [showActions, setShowActions] = useState(false);
  const state = getLocationState(campaign, location.key);
  const playable = state === 'UNLOCKED' || state === 'ACTIVE' || state === 'VISITED' || state === 'DANGEROUS';
  const isLost = state === 'LOST';
  const riskClass = RISK_TONE_CLASSES[location.risk] || 'text-muted-foreground/80';

  return (
    <div className={`border rounded-lg overflow-hidden bg-card/30 transition-colors ${isLost ? 'border-slate-600/40 opacity-70' : 'border-border/40'}`}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2 pr-2 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" strokeWidth={1.5} />
          <span className="font-heading text-sm text-foreground truncate">{location.label}</span>
          <StatusBadge state={state} />
          {location.stateLabel && (
            <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-muted/30 border border-border/30 text-[9px] font-heading tracking-wide text-muted-foreground">
              {location.stateLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {location.locked && <Lock className="w-3 h-3 text-violet-400/60" strokeWidth={1.5} />}
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2.5">
          {/* Risk + status row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 text-[10px] font-heading tracking-wide text-muted-foreground">
              <ShieldAlert className="w-3 h-3" strokeWidth={1.5} /> RISK
            </span>
            <span className={`text-xs font-heading ${riskClass}`}>{location.risk}</span>
            {location.primaryFaction && <Tag>{location.primaryFaction}</Tag>}
          </div>

          <Field label="Description" icon={MapPin}>{location.description}</Field>
          <Field label="Main Purpose" icon={Target}>{location.mainPurpose}</Field>
          <Field label="Travel Requirements" icon={Compass}>{location.travelRequirements}</Field>
          <Field label="Unlock Trigger" icon={Eye}>{location.unlockTrigger}</Field>

          {location.missionTriggers?.length > 0 && (
            <Field label="Mission Triggers" icon={ClipboardList}>{location.missionTriggers}</Field>
          )}
          {location.arrivalEvents?.length > 0 && (
            <Field label="Arrival Events" icon={Sparkles}>{location.arrivalEvents}</Field>
          )}
          <Field label="If Ignored" icon={SkipForward}>{location.ifIgnored}</Field>

          {location.possibleRewards?.length > 0 && (
            <Field label="Possible Rewards" icon={Sparkles}>{location.possibleRewards}</Field>
          )}
          {location.possibleConsequences?.length > 0 && (
            <Field label="Possible Consequences" icon={AlertTriangle}>{location.possibleConsequences}</Field>
          )}

          {/* Related references */}
          <div className="space-y-1.5 pt-1.5 border-t border-border/30">
            {location.relatedClocks?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-heading tracking-[0.12em] text-primary/60">CLOCKS:</span>
                {location.relatedClocks.map((c) => <Tag key={c}>{c}</Tag>)}
              </div>
            )}
            {location.relatedEvidence?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-heading tracking-[0.12em] text-primary/60">EVIDENCE:</span>
                {location.relatedEvidence.map((e) => <Tag key={e}>{e}</Tag>)}
              </div>
            )}
            {location.relatedNpcs?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-heading tracking-[0.12em] text-primary/60">NPCs:</span>
                {location.relatedNpcs.map((n) => <Tag key={n}>{n}</Tag>)}
              </div>
            )}
          </div>

          {/* Arrival scene */}
          {location.arrivalScene && location.arrivalScene !== 'Sealed until discovered through play.' && (
            <div className="pt-1.5 border-t border-border/30">
              <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-0.5">
                <Anchor className="w-3 h-3 shrink-0" strokeWidth={1.5} /> ARRIVAL SCENE
              </p>
              <p className="text-xs font-body text-foreground/75 leading-relaxed italic">{location.arrivalScene}</p>
            </div>
          )}

          {/* Action buttons for playable locations */}
          {playable && onSuggestAction && (
            <div className="pt-1.5 border-t border-border/30">
              <button
                onClick={() => setShowActions((v) => !v)}
                className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/80 hover:text-primary transition-colors"
              >
                <Compass className="w-3 h-3" strokeWidth={1.5} />
                {showActions ? 'HIDE ACTIONS' : 'PLAYER ACTIONS'}
                {showActions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showActions && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {LOCATION_ACTIONS.map((act) => {
                    const Icon = ACTION_ICONS[act.icon] || Compass;
                    return (
                      <button
                        key={act.key}
                        onClick={() => onSuggestAction(act.command(location))}
                        className="flex items-center gap-1 px-2 py-1.5 rounded border border-border/40 bg-secondary/20 hover:border-primary/40 hover:bg-primary/10 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                        <span className="truncate">{act.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {location.locked && (
            <p className="flex items-center gap-1.5 text-[10px] text-violet-300/70 italic pt-1.5 border-t border-border/30">
              <Lock className="w-3 h-3 shrink-0" strokeWidth={1.5} /> Sealed until discovered through play.
            </p>
          )}
        </div>
      )}
    </div>
  );
}