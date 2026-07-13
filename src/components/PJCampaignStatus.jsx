import { useState } from 'react';
import { Rocket, Shield, Activity, AlertTriangle, Users, FileText, MapPin, ChevronDown, ChevronUp, Lock, Eye, Newspaper } from 'lucide-react';
import { PJ_SHIP_STATS } from '@/lib/pjRules';
import { codexKey } from '@/lib/pjCodex';
import { getVisibleMainClocks, findClock, getClockStatus, getClockTier } from '@/lib/pjClocks';
import { getNewTitanLabel, getEnemyLabel, getPublicNarrative } from '@/lib/pjReputation';

function clockColor(val, highIsBad) {
  const pct = Math.max(0, Math.min(100, val));
  if (highIsBad) {
    if (pct >= 75) return 'bg-red-700';
    if (pct >= 50) return 'bg-amber-700';
    return 'bg-emerald-700';
  }
  if (pct >= 75) return 'bg-emerald-700';
  if (pct >= 50) return 'bg-amber-700';
  return 'bg-red-800';
}

export default function PJCampaignStatus({ campaign, onOpenCodex }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const [showShip, setShowShip] = useState(false);
  const [showNarrative, setShowNarrative] = useState(false);

  const flags = campaign?.world_state?.quest_flags || {};
  const clocks = flags.campaign_clocks || {};
  const shipStats = flags.ship_stats || {};
  const evidence = flags.evidence || [];
  const allies = flags.allies || [];
  const enemies = flags.enemies || [];
  const currentLocation = flags.current_location || campaign?.current_scene || 'Unknown';

  const ntLabel = getNewTitanLabel(campaign);
  const enemyLabel = getEnemyLabel(campaign);
  const narrative = getPublicNarrative(campaign);

  return (
    <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-3 space-y-3">
      {/* Location */}
      <div className="flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={1.5} />
        <div className="min-w-0">
          <p className="text-[9px] font-heading tracking-[0.15em] text-muted-foreground">LOCATION</p>
          <p className="text-[11px] font-body text-foreground truncate">{currentLocation}</p>
        </div>
      </div>

      {/* Campaign Clocks — 4 most relevant for current scene */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Activity className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[10px] tracking-[0.15em] text-foreground">SANDBOX CLOCKS</h3>
        </div>
        <div className="space-y-1.5">
          {getVisibleMainClocks(campaign).map(key => {
            const clock = findClock(key);
            if (!clock) return null;
            const val = clocks[key] ?? clock.start;
            const tier = getClockTier(val);
            const status = getClockStatus(clock, val);
            return (
              <button key={key} onClick={() => onOpenCodex?.('clocks', key)} className="block w-full text-left group">
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="text-muted-foreground font-body truncate group-hover:text-foreground transition-colors" title={clock.whatItMeans}>{clock.label}</span>
                  <span className={`font-heading tabular-nums ${tier.text}`}>{val} <span className="text-[9px] opacity-70">— {status.label}</span></span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${tier.color}`} style={{ width: `${Math.max(0, Math.min(100, val))}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ship Status (collapsible) */}
      <div>
        <button onClick={() => setShowShip(!showShip)} className="flex items-center gap-1.5 w-full mb-1">
          <Shield className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[10px] tracking-[0.15em] text-foreground">SHIP STATUS</h3>
          {showShip ? <ChevronUp className="w-3 h-3 text-muted-foreground ml-auto" /> : <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto" />}
        </button>
        {showShip && (
          <div className="space-y-1">
            {PJ_SHIP_STATS.map(s => {
              const val = shipStats[s.key] ?? s.start;
              return (
                <div key={s.key}>
                  <div className="flex items-center justify-between text-[10px] mb-0.5">
                    <span className="text-muted-foreground font-body">{s.label}</span>
                    <span className="font-heading tabular-nums text-foreground">{val}</span>
                  </div>
                  <div className="h-1 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${val >= 60 ? 'bg-emerald-700' : val >= 30 ? 'bg-amber-700' : 'bg-red-800'}`} style={{ width: `${Math.max(0, Math.min(100, val))}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Evidence (collapsible) */}
      <div>
        <button onClick={() => setShowEvidence(!showEvidence)} className="flex items-center gap-1.5 w-full mb-1">
          <FileText className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[10px] tracking-[0.15em] text-foreground">EVIDENCE ({evidence.length})</h3>
          {showEvidence ? <ChevronUp className="w-3 h-3 text-muted-foreground ml-auto" /> : <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto" />}
        </button>
        {showEvidence && (
          <div className="space-y-0.5">
            {evidence.length ? evidence.map((e, i) => (
              <button key={i} onClick={() => onOpenCodex?.('evidence', codexKey(e))} className="block w-full text-left text-[10px] text-muted-foreground hover:text-foreground font-body leading-snug transition-colors">• {e}</button>
            )) : <p className="text-[10px] text-muted-foreground/50 italic">No evidence collected yet.</p>}
          </div>
        )}
      </div>

      {/* Reputation Labels */}
      <div className="pt-1 border-t border-border/30 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3 h-3 text-primary" strokeWidth={1.5} />
          <span className="text-[9px] font-heading tracking-wide text-muted-foreground">REPUTATION</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground font-body">New Titan sees:</span>
          <span className={`font-heading truncate ml-1 ${ntLabel.tone}`}>{ntLabel.label}</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground font-body">Enemies call you:</span>
          <span className={`font-heading truncate ml-1 ${enemyLabel.tone}`}>{enemyLabel.label}</span>
        </div>
      </div>

      {/* Public Narrative */}
      <div>
        <button onClick={() => setShowNarrative(!showNarrative)} className="flex items-center gap-1.5 w-full mb-1">
          <Newspaper className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[10px] tracking-[0.15em] text-foreground">PUBLIC NARRATIVE</h3>
          {showNarrative ? <ChevronUp className="w-3 h-3 text-muted-foreground ml-auto" /> : <ChevronDown className="w-3 h-3 text-muted-foreground ml-auto" />}
        </button>
        {showNarrative && (
          <div className="space-y-1">
            {narrative.map((n, i) => (
              <div key={i} className="text-[10px] leading-snug">
                <span className="text-muted-foreground/60 font-heading">{n.group}:</span>{' '}
                <span className="text-foreground/80 font-body italic">{n.belief}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Allies & Enemies */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/30">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Users className="w-3 h-3 text-emerald-400" strokeWidth={1.5} />
            <span className="text-[9px] font-heading tracking-wide text-emerald-400">ALLIES</span>
          </div>
          {allies.length ? allies.map((a, i) => <button key={i} onClick={() => onOpenCodex?.('allies', codexKey(a))} className="block w-full text-left text-[9px] text-muted-foreground hover:text-foreground font-body leading-snug transition-colors">• {a}</button>) : <p className="text-[9px] text-muted-foreground/50 italic">None</p>}
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="w-3 h-3 text-red-400" strokeWidth={1.5} />
            <span className="text-[9px] font-heading tracking-wide text-red-400">ENEMIES</span>
          </div>
          {enemies.length ? enemies.map((e, i) => <button key={i} onClick={() => onOpenCodex?.('enemies', codexKey(e))} className="block w-full text-left text-[9px] text-muted-foreground hover:text-foreground font-body leading-snug transition-colors">• {e}</button>) : <p className="text-[9px] text-muted-foreground/50 italic">None</p>}
        </div>
      </div>
    </div>
  );
}