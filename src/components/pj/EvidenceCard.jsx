import { useState } from 'react';
import {
  ChevronDown, ChevronUp, Lightbulb, Crosshair, AlertTriangle, Target, ScrollText
} from 'lucide-react';
import {
  STATE_META, CREDIBILITY_META, EVIDENCE_USAGE_ACTIONS,
  getEvidenceStatus, getEvidenceCredibility, getEvidenceShownTo, getEvidenceStateObject
} from '@/lib/pjEvidence';

export default function EvidenceCard({
  evidence, campaign, discoveredEvidence, expanded, onToggle, onSuggestAction
}) {
  const [showActions, setShowActions] = useState(false);
  const [showCrossRef, setShowCrossRef] = useState(false);

  const status = getEvidenceStatus(campaign, evidence.key);
  const credibility = getEvidenceCredibility(campaign, evidence.key);
  const shownTo = getEvidenceShownTo(campaign, evidence.key);
  const stateObj = getEvidenceStateObject(campaign, evidence.key);
  const statusMeta = STATE_META[status] || STATE_META.DISCOVERED;
  const credMeta = CREDIBILITY_META[credibility] || CREDIBILITY_META.MEDIUM;

  const crossRefOptions = (discoveredEvidence || []).filter((e) => e.key !== evidence.key);

  function sendCommand(command) {
    onSuggestAction?.(command);
  }

  return (
    <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-1.5 h-9 rounded-full ${statusMeta.dot} shrink-0`} />
          <div className="min-w-0 text-left">
            <p className="font-heading text-sm text-foreground truncate">{evidence.label}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] font-heading ${statusMeta.color}`}>{statusMeta.label}</span>
              <span className="text-muted-foreground/40 text-[10px]">·</span>
              <span className={`text-[10px] font-heading ${credMeta.color}`}>Cred: {credMeta.label}</span>
            </div>
          </div>
        </div>
        {expanded
          ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Explanation */}
          <div>
            <p className="text-sm font-body text-foreground/80 leading-relaxed">{evidence.explanation}</p>
          </div>

          {/* Clock effects */}
          {evidence.clockEffects?.length > 0 && (
            <Section icon={Target} label="CLOCK EFFECTS">
              <ul className="space-y-0.5">
                {evidence.clockEffects.map((ce, i) => (
                  <li key={i} className="text-xs font-body text-foreground/70 leading-relaxed flex gap-1.5">
                    <span className="text-primary/50 shrink-0">▸</span>
                    <span>
                      <span className="text-foreground/80">{prettyClock(ce.clock)}</span>{' '}
                      <span className={ce.effect.startsWith('-') ? 'text-emerald-400/80' : 'text-amber-400/80'}>{ce.effect}</span>
                      {ce.condition && <span className="text-muted-foreground"> — {ce.condition}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Can persuade + mission unlocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {evidence.canPersuade?.length > 0 && (
              <Section icon={Crosshair} label="CAN PERSUADE">
                <ul className="space-y-0.5">
                  {evidence.canPersuade.map((p, i) => (
                    <li key={i} className="text-xs font-body text-foreground/70 flex gap-1.5">
                      <span className="text-primary/40 shrink-0">•</span>{p}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
            {evidence.missionUnlocks?.length > 0 && (
              <Section icon={Lightbulb} label="MISSION UNLOCKS">
                <ul className="space-y-0.5">
                  {evidence.missionUnlocks.map((m, i) => (
                    <li key={i} className="text-xs font-body text-foreground/70 flex gap-1.5">
                      <span className="text-primary/40 shrink-0">•</span>{m}
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Risks */}
          {evidence.risks && (
            <Section icon={AlertTriangle} label="RISKS OF REVEALING">
              <p className="text-xs font-body text-foreground/70 leading-relaxed">{evidence.risks}</p>
            </Section>
          )}

          {/* Evidence log (dynamic state) */}
          {(shownTo.length > 0 || stateObj?.used_in || stateObj?.notes) && (
            <div className="pt-2 border-t border-border/30 space-y-1.5">
              <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60">EVIDENCE LOG</p>
              {shownTo.length > 0 && (
                <LogLine label="Shown To" value={shownTo.join(', ')} />
              )}
              {stateObj?.used_in && (
                <LogLine label="Used In" value={stateObj.used_in} />
              )}
              {stateObj?.believed_by?.length > 0 && (
                <LogLine label="Believes It" value={stateObj.believed_by.join(', ')} />
              )}
              {stateObj?.disputed_by?.length > 0 && (
                <LogLine label="Disputes It" value={stateObj.disputed_by.join(', ')} />
              )}
              {stateObj?.enemies_aware?.length > 0 && (
                <LogLine label="Enemies Aware" value={stateObj.enemies_aware.join(', ')} />
              )}
              {stateObj?.notes && (
                <LogLine label="GM Notes" value={stateObj.notes} />
              )}
            </div>
          )}

          {/* Suggested use */}
          {evidence.suggestedUse && !stateObj?.notes && (
            <div className="pt-2 border-t border-border/30">
              <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1">
                <Lightbulb className="w-3 h-3" /> SUGGESTED USE
              </p>
              <p className="text-xs font-body text-foreground/70 leading-relaxed">{evidence.suggestedUse}</p>
            </div>
          )}

          {/* Usage actions */}
          <div className="pt-2 border-t border-border/30">
            <button
              onClick={() => setShowActions((v) => !v)}
              className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/70 hover:text-foreground transition-colors mb-2"
            >
              <ScrollText className="w-3 h-3" /> USE EVIDENCE
              {showActions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showActions && (
              <div className="grid grid-cols-2 gap-1.5">
                {EVIDENCE_USAGE_ACTIONS.map((act) => (
                  <button
                    key={act.key}
                    onClick={() => sendCommand(act.command(evidence))}
                    className="text-[10px] font-body text-muted-foreground hover:text-foreground px-2 py-1.5 rounded border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            )}

            {/* Cross-reference */}
            {crossRefOptions.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setShowCrossRef((v) => !v)}
                  className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/70 hover:text-foreground transition-colors"
                >
                  <Crosshair className="w-3 h-3" /> CROSS-REFERENCE
                  {showCrossRef ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showCrossRef && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {crossRefOptions.map((other) => (
                      <button
                        key={other.key}
                        onClick={() => sendCommand(`Cross-reference the ${evidence.label} with the ${other.label}. Look for combined proof or contradictions.`)}
                        className="text-[10px] font-body text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border/40 hover:border-primary/40 transition-colors"
                      >
                        {other.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ icon: Icon, label, children }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1">
        <Icon className="w-3 h-3" /> {label}
      </p>
      {children}
    </div>
  );
}

function LogLine({ label, value }) {
  return (
    <div className="flex gap-2 text-xs font-body">
      <span className="text-[10px] font-heading tracking-wide text-muted-foreground/70 shrink-0 w-24 pt-0.5">{label}:</span>
      <span className="text-foreground/70 leading-relaxed">{value}</span>
    </div>
  );
}

function prettyClock(key) {
  const map = {
    confluence_claim: 'Confluence Claim',
    confluence_heat: 'Confluence Heat',
    chen_countermeasures: 'Chen Countermeasures',
    new_titan_stability: 'New Titan Stability',
    resistance_spark: 'Resistance Spark',
    sanctuary_trust: 'Sanctuary Trust',
    crew_morale: 'Crew Morale',
    temporal_instability: 'Temporal Instability',
    public_truth: 'Public Truth'
  };
  return map[key] || key;
}