import { useState } from 'react';
import {
  ChevronDown, ChevronUp, Lock, Flag, Eye, EyeOff, MessageCircle, LifeBuoy,
  FileSignature, AlertOctagon, Search, Zap, UserPlus, Crown,
  ShieldAlert, Target, Sparkles, ClipboardList, Heart, Scale,
  Users, Activity, SkipForward, Crosshair
} from 'lucide-react';
import {
  FACTION_STATUSES, STATUS_TONE_CLASSES, RELATIONSHIP_TONE_CLASSES,
  FACTION_INTERACTIONS, getRelationshipBand,
  getFactionStatus, getFactionRelationship, getFactionAgenda, getFactionLastAction
} from '@/lib/pjFactions';

const ACTION_ICONS = {
  Eye, EyeOff, MessageCircle, LifeBuoy, FileSignature, AlertOctagon,
  Search, Zap, UserPlus, Crown
};

function StatusBadge({ status }) {
  const cfg = FACTION_STATUSES[status] || FACTION_STATUSES.UNKNOWN;
  const cls = STATUS_TONE_CLASSES[cfg.tone] || STATUS_TONE_CLASSES.muted;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-heading tracking-[0.12em] uppercase ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

function RelationshipMeter({ score }) {
  const band = getRelationshipBand(score);
  const toneClass = RELATIONSHIP_TONE_CLASSES[band.tone] || 'text-muted-foreground';
  const percentage = ((score + 100) / 200) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-heading tracking-wide mb-1">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Scale className="w-3 h-3" strokeWidth={1.5} /> RELATIONSHIP
        </span>
        <span className={toneClass}>{score > 0 ? '+' : ''}{score} · {band.label}</span>
      </div>
      <div className="relative h-2 rounded-full bg-gradient-to-r from-red-500/30 via-muted/50 to-emerald-500/30 overflow-hidden border border-border/30">
        <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/70 shadow-sm" style={{ left: `${percentage}%` }} />
      </div>
    </div>
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

export default function FactionCard({ faction, campaign, expanded, onToggle, onSuggestAction }) {
  const [showInteractions, setShowInteractions] = useState(false);
  const status = getFactionStatus(campaign, faction.key);
  const relationship = getFactionRelationship(campaign, faction.key);
  const agenda = getFactionAgenda(campaign, faction.key);
  const lastAction = getFactionLastAction(campaign, faction.key);
  const isUnknown = status === 'UNKNOWN';

  return (
    <div className={`border rounded-lg overflow-hidden bg-card/30 transition-colors ${isUnknown ? 'border-muted-foreground/30 opacity-60' : 'border-border/40'}`}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2 pr-2 min-w-0">
          <Flag className="w-3.5 h-3.5 text-primary/70 shrink-0" strokeWidth={1.5} />
          <span className="font-heading text-sm text-foreground truncate">{faction.label}</span>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {faction.locked && <Lock className="w-3 h-3 text-violet-400/60" strokeWidth={1.5} />}
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />}
        </div>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2.5">
          {!isUnknown && (
            <div className="space-y-2">
              <RelationshipMeter score={relationship} />
              {agenda && (
                <div className="flex items-start gap-1.5 text-[10px]">
                  <Crosshair className="w-3 h-3 text-primary/60 shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <span className="font-heading tracking-wide text-primary/60">CURRENT AGENDA: </span>
                    <span className="font-body text-foreground/75">{agenda}</span>
                  </div>
                </div>
              )}
              {lastAction && (
                <div className="flex items-start gap-1.5 text-[10px]">
                  <SkipForward className="w-3 h-3 text-primary/60 shrink-0 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <span className="font-heading tracking-wide text-primary/60">LAST ACTION: </span>
                    <span className="font-body text-foreground/75">{lastAction}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <Field label="Nature" icon={Flag}>{faction.nature}</Field>
          <Field label="Public Face" icon={Eye}>{faction.publicFace}</Field>
          {!isUnknown && <Field label="True Nature" icon={ShieldAlert}>{faction.trueNature}</Field>}
          {!isUnknown && <Field label="Core Belief" icon={Heart}>{faction.coreBelief}</Field>}

          {faction.goals?.length > 0 && (
            <Field label="Goals" icon={Target}>{faction.goals}</Field>
          )}
          {faction.methods?.length > 0 && (
            <Field label="Methods" icon={ClipboardList}>{faction.methods}</Field>
          )}
          {faction.resources?.length > 0 && (
            <Field label="Resources" icon={Sparkles}>{faction.resources}</Field>
          )}
          {faction.keyFigures?.length > 0 && (
            <Field label="Key Figures" icon={Users}>{faction.keyFigures}</Field>
          )}

          {!isUnknown && (
            <>
              <Field label="Relationship to Player" icon={Scale}>{faction.relationshipToPlayer}</Field>
              <Field label="Current Attitude" icon={Crosshair}>{faction.currentAttitude}</Field>
              <Field label="What They Want From Bub" icon={Target}>{faction.whatTheyWantFromBub}</Field>
              <Field label="What Bub Can Gain" icon={Sparkles}>{faction.whatBubCanGain}</Field>
              <Field label="Makes Them More Hostile" icon={AlertOctagon}>{faction.whatMakesHostile}</Field>
              <Field label="Makes Them More Friendly" icon={Heart}>{faction.whatMakesFriendly}</Field>
            </>
          )}

          {faction.missionHooks?.length > 0 && (
            <Field label="Mission Hooks" icon={ClipboardList}>{faction.missionHooks}</Field>
          )}

          <div className="space-y-1.5 pt-1.5 border-t border-border/30">
            {faction.relatedClocks?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-heading tracking-[0.12em] text-primary/60">CLOCKS:</span>
                {faction.relatedClocks.map((c) => <Tag key={c}>{c}</Tag>)}
              </div>
            )}
            {faction.relatedEvidence?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-heading tracking-[0.12em] text-primary/60">EVIDENCE:</span>
                {faction.relatedEvidence.map((e) => <Tag key={e}>{e}</Tag>)}
              </div>
            )}
            {faction.relatedLocations?.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-heading tracking-[0.12em] text-primary/60">LOCATIONS:</span>
                {faction.relatedLocations.map((l) => <Tag key={l}>{l}</Tag>)}
              </div>
            )}
          </div>

          {!isUnknown && faction.factionActions?.length > 0 && (
            <div className="pt-1.5 border-t border-border/30">
              <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1">
                <Activity className="w-3 h-3 shrink-0" strokeWidth={1.5} /> DOWNTIME MOVES
              </p>
              <p className="text-[10px] font-body text-muted-foreground/70 italic mb-1">This faction may do any of the following between sessions:</p>
              <div className="flex flex-wrap gap-1">
                {faction.factionActions.map((a, i) => <Tag key={i}>{a}</Tag>)}
              </div>
            </div>
          )}

          <div className="pt-1.5 border-t border-border/30">
            <p className="flex items-center gap-1.5 text-[10px] font-body text-muted-foreground/60 italic">
              <Lock className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {faction.spoilerStatus}
            </p>
          </div>

          {!isUnknown && onSuggestAction && (
            <div className="!pt-1.5 border-t border-border/30">
              <button
                onClick={() => setShowInteractions((v) => !v)}
                className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/80 hover:text-primary transition-colors"
              >
                <Crosshair className="w-3 h-3" strokeWidth={1.5} />
                {showInteractions ? 'HIDE INTERACTIONS' : 'FACTION INTERACTIONS'}
                {showInteractions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showInteractions && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                  {FACTION_INTERACTIONS.map((act) => {
                    const Icon = ACTION_ICONS[act.icon] || Eye;
                    return (
                      <button
                        key={act.key}
                        onClick={() => onSuggestAction(act.command(faction))}
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

          {faction.locked && isUnknown && (
            <p className="flex items-center gap-1.5 text-[10px] text-violet-300/70 italic pt-1.5 border-t border-border/30">
              <Lock className="w-3 h-3 shrink-0" strokeWidth={1.5} /> This faction has not yet entered the campaign. It will emerge through play.
            </p>
          )}
        </div>
      )}
    </div>
  );
}