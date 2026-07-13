import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Heart, Activity, Zap, AlertTriangle, Brain, Eye, Package } from 'lucide-react';
import { PULL_SCALE, getPullLevel, SCAR_STATES, CONDITIONS, CONDITION_CATEGORIES, HIDDEN_CLOCKS, PROVINCE_SEQUENCE, getProvinceInfo } from '@/lib/pullRules';
import { isStageUnlocked } from '@/lib/pullSheetData';
import { LOCAL_CLOCK_META, getClockLabel } from '@/lib/pullClocks';

export default function PullStatusPanel({ campaign, onOpenCodex }) {
  const [showClocks, setShowClocks] = useState(false);

  if (!campaign) return null;

  const flags = campaign.world_state?.quest_flags || {};
  const clocks = flags.campaign_clocks || {};
  const localClocks = flags.local_clocks || {};
  const discoveredClocks = flags.discovered_clocks || ['thirst', 'heat_exposure', 'fatigue'];
  const allLocalClocks = { thirst: 75, heat_exposure: 65, fatigue: 55, ...localClocks };
  const visibleLocalClocks = Object.entries(allLocalClocks).filter(([key]) => discoveredClocks.includes(key));
  const conditions = flags.conditions || [];
  const pullLevel = getPullLevel(flags.pull_intensity ?? 1);
  const scar = SCAR_STATES[flags.scar_state || 'pulse'] || SCAR_STATES.pulse;
  const provinceInfo = getProvinceInfo(flags.current_province || 618);
  const equipment = campaign.world_state?.quest_flags?.equipment || [];

  // Get character from parent? No - we need to get it from the campaign characters
  // Actually, the parent passes campaign only. Let's read what we can from campaign state.
  const hpCurrent = flags.hp_current || 0;
  const hpMax = flags.hp_max || 0;

  const visibleClocks = HIDDEN_CLOCKS.filter(c => c.visible);
  const hiddenClocks = HIDDEN_CLOCKS.filter(c => !c.visible);

  return (
    <div className="space-y-3">
      {/* Province header */}
      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-3">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">CURRENT PROVINCE</h3>
        </div>
        <p className="font-heading text-sm text-primary/90">{provinceInfo.name}</p>
        <p className="text-[10px] text-muted-foreground font-body mt-0.5">Chapter {provinceInfo.chapter} · {flags.phase || 'Lost Survivor'}</p>
      </div>

      {/* Pull & Scar */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-3 space-y-2.5">
        <PullMeter label="PULL INTENSITY" value={flags.pull_intensity ?? 1} max={6} levels={PULL_SCALE} colorClass="text-primary" />
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-heading tracking-wide text-muted-foreground">SCAR</span>
          <span className={`font-heading ${scar.color}`}>{scar.label}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-heading tracking-wide text-muted-foreground">SHARD</span>
          <span className="font-heading text-amber-400">{isStageUnlocked('province_998', flags) ? `${flags.shard_resonance ?? 0}/100` : 'Warm'}</span>
        </div>
        {flags.shard_focus_unlocked && (
          <div className="text-[10px] text-amber-400/80 font-heading tracking-wide flex items-center gap-1 pt-1 border-t border-border/30">
            <Zap className="w-3 h-3" /> SHARD FOCUS UNLOCKED
          </div>
        )}
      </div>

      {/* Conditions */}
      {conditions.length > 0 && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">CONDITIONS</h3>
          </div>
          <div className="space-y-1">
            {conditions.map((c, i) => {
              const key = (c.type || c.label || '').toLowerCase().replace(/\s/g, '_');
              const cat = CONDITION_CATEGORIES[CONDITIONS.find(co => co.key === key)?.category || 'injury'] || CONDITION_CATEGORIES.injury;
              const label = c.label || (c.type || '').replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase());
              return (
                <div key={i} className={`text-[10px] px-2 py-1 rounded border ${cat.bg}`}>
                  <span className={`font-heading ${cat.color}`}>{label}</span>
                  {c.severity && c.severity !== 'active' && (
                    <span className={`ml-1.5 ${cat.color} opacity-60`}>· {c.severity}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visible hidden clocks */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-3">
        <button
          onClick={() => setShowClocks(v => !v)}
          className="flex items-center gap-2 w-full mb-2"
        >
          <Brain className="w-3.5 h-3.5 text-indigo-400" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">INNER STATE</h3>
        </button>
        <div className="space-y-1.5">
          {visibleClocks.map(clock => {
            const val = clocks[clock.key] || 0;
            return (
              <div key={clock.key} className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground font-body">{clock.label}</span>
                <span className={`font-heading tabular-nums ${clock.highIsBad ? (val > 50 ? 'text-red-400' : val > 25 ? 'text-amber-400' : 'text-emerald-400') : (val > 50 ? 'text-emerald-400' : val > 25 ? 'text-amber-400' : 'text-red-400')}`}>
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local clocks — only show discovered ones */}
      {visibleLocalClocks.length > 0 && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">LOCAL CLOCKS</h3>
          </div>
          <div className="space-y-1.5">
            {visibleLocalClocks.map(([key, val]) => {
              const meta = LOCAL_CLOCK_META[key] || { highIsBad: true };
              const qualLabel = getClockLabel(key, val);
              const colorClass = meta.highIsBad
                ? (val > 75 ? 'text-red-400' : val > 50 ? 'text-amber-400' : val > 25 ? 'text-yellow-300' : 'text-emerald-400')
                : (val > 65 ? 'text-emerald-400' : val > 35 ? 'text-amber-400' : 'text-red-400');
              return (
                <div key={key} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground font-body capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className={`font-heading tabular-nums ${colorClass}`}>{val} <span className="opacity-50 text-[9px] font-body">{qualLabel}</span></span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Codex button */}
      <button
        onClick={onOpenCodex}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary/40 bg-primary/10 text-primary text-xs font-heading tracking-[0.15em] hover:bg-primary/20 transition-colors"
      >
        <Package className="w-3.5 h-3.5" /> OPEN CODEX
      </button>
    </div>
  );
}

function PullMeter({ label, value, max, levels, colorClass }) {
  const level = levels[Math.max(0, Math.min(max, Math.round(value)))] || levels[0];
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="font-heading tracking-wide text-muted-foreground">{label}</span>
        <span className={`font-heading ${colorClass}`}>{level.label}</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: max + 1 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-sm transition-colors ${
              i <= value
                ? value >= 4 ? 'bg-red-500' : value >= 2 ? 'bg-amber-500' : 'bg-primary'
                : 'bg-border/50'
            }`}
          />
        ))}
      </div>
      <p className="text-[9px] text-muted-foreground/60 font-body italic mt-1">{level.desc}</p>
      <p className="text-[9px] text-primary/70 font-body mt-1.5 leading-relaxed">
        Follow the Pull → it fades. Resist or linger → it intensifies.
      </p>
    </div>
  );
}