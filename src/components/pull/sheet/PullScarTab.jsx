import { Compass, Zap } from 'lucide-react';
import { PULL_SCALE, SCAR_STATES } from '@/lib/pullRules';
import { getScarEffects, derivePullBehavior, deriveResistanceCost, isStageUnlocked } from '@/lib/pullSheetData';

export default function PullScarTab({ flags, isMichael }) {
  const pullIntensity = flags.pull_intensity ?? 1;
  const pullLevel = PULL_SCALE[Math.max(0, Math.min(6, Math.round(pullIntensity)))] || PULL_SCALE[1];
  const scar = SCAR_STATES[flags.scar_state || 'pulse'] || SCAR_STATES.pulse;
  const behavior = derivePullBehavior(pullIntensity);
  const resistanceCost = deriveResistanceCost(pullIntensity);
  const scarEffects = getScarEffects(flags);

  if (isMichael) {
    return (
      <div className="space-y-3">
        <div className="border border-emerald-700/40 rounded-lg bg-emerald-950/20 p-4 text-center">
          <Compass className="w-6 h-6 text-emerald-400/60 mx-auto mb-2" strokeWidth={1} />
          <p className="font-heading text-sm text-emerald-400">The Pull is Gone</p>
          <p className="text-xs text-muted-foreground font-body mt-1">Michael is restored. The mission pressure has lifted.</p>
        </div>
        <div className="border border-border/50 rounded-lg bg-card/40 p-4 text-center">
          <p className="font-heading text-sm text-muted-foreground">The Scar is Quiet</p>
          <p className="text-xs text-muted-foreground/60 font-body mt-1">No longer burning. No longer pulling. The wound has served its purpose.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* The Pull */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">THE PULL</h3>
        </div>
        <div className="flex gap-0.5 mb-2">
          {PULL_SCALE.map((level, i) => (
            <div
              key={i}
              className={`flex-1 h-3 rounded-sm transition-colors ${
                i <= pullIntensity
                  ? pullIntensity >= 5 ? 'bg-red-500' : pullIntensity >= 3 ? 'bg-amber-500' : 'bg-primary'
                  : 'bg-border/40'
              }`}
            />
          ))}
        </div>
        <p className="font-heading text-sm text-primary/90 mb-3">{pullLevel.label}</p>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">{pullLevel.desc}</p>
        <div className="space-y-1.5 text-xs">
          <DetailRow label="Direction" value={isStageUnlocked('province_0', flags) ? 'Toward Province 1' : 'Forward'} />
          <DetailRow label="Behavior" value={behavior} />
          <DetailRow label="Resistance Cost" value={resistanceCost} />
        </div>
      </div>

      {/* The Scar */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">THE SCAR</h3>
          <span className={`ml-auto font-heading text-sm ${scar.color}`}>{scar.label}</span>
        </div>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">{scar.desc}</p>
        <div className="space-y-1">
          {scarEffects.map(effect => (
            <div key={effect} className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-body">
              <span className="w-1 h-1 rounded-full bg-amber-500/50" />
              {effect}
            </div>
          ))}
          {scarEffects.length === 0 && (
            <p className="text-xs text-muted-foreground/40 font-body">No effects observed yet.</p>
          )}
        </div>
      </div>

      {/* Shard status / resonance */}
      {isStageUnlocked('province_998', flags) ? (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-heading tracking-wide text-muted-foreground">SHARD RESONANCE</span>
            <span className="font-heading text-amber-400 tabular-nums">{flags.shard_resonance ?? 0}/100</span>
          </div>
          <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
            <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${flags.shard_resonance ?? 0}%` }} />
          </div>
          {flags.shard_focus_unlocked && (
            <p className="text-xs text-amber-400/80 font-heading tracking-wide mt-2 flex items-center gap-1">
              <Zap className="w-3 h-3" /> SHARD FOCUS UNLOCKED
            </p>
          )}
        </div>
      ) : (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SHARD STATUS</h3>
          </div>
          <p className="font-heading text-sm text-amber-400/90 mb-2">Warm</p>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-body">
              <span className="w-1 h-1 rounded-full bg-amber-500/50" />
              Pulses faintly near the scar
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-body">
              <span className="w-1 h-1 rounded-full bg-amber-500/50" />
              Seems connected to the scar
            </div>
          </div>
          <p className="text-xs text-muted-foreground/50 font-body mt-2">Purpose unknown.</p>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground font-body">{label}</span>
      <span className="font-heading text-foreground/80 capitalize">{value}</span>
    </div>
  );
}