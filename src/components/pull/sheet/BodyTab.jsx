import { Heart, Activity, Wind, Eye } from 'lucide-react';
import { BODY_ZONES, deriveBodyZones, deriveOverallState, derivePain, deriveBloodLoss, deriveFatigue, deriveMobility, deriveBreathing, deriveConsciousness } from '@/lib/pullSheetData';

export default function BodyTab({ character, flags }) {
  const conditions = flags.conditions || [];
  const clocks = flags.campaign_clocks || {};
  const zones = deriveBodyZones(conditions);
  const overall = deriveOverallState(character?.hp_current, character?.hp_max, conditions);
  const pain = derivePain(conditions);
  const bloodLoss = deriveBloodLoss(conditions);
  const fatigue = deriveFatigue(conditions);
  const mobility = deriveMobility(conditions);
  const breathing = deriveBreathing(conditions);
  const consciousness = deriveConsciousness(conditions, flags.pull_intensity ?? 1, clocks.soul_fracture);

  return (
    <div className="space-y-3">
      {/* Overall state */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-3.5 h-3.5 text-red-400" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">OVERALL STATE</h3>
          <span className={`ml-auto font-heading text-sm ${overall.color}`}>{overall.label}</span>
        </div>
        <div className="space-y-2.5">
          <GaugeBar label="Pain" value={pain} max={10} color="bg-red-500" />
          <GaugeBar label="Blood Loss" value={bloodLoss} max={10} color="bg-red-600" />
          <GaugeBar label="Fatigue" value={fatigue} max={10} color="bg-amber-500" />
        </div>
      </div>

      {/* Vital signs */}
      <div className="grid grid-cols-3 gap-2">
        <VitalCard icon={Activity} label="Mobility" value={mobility.label} color={mobility.color} />
        <VitalCard icon={Wind} label="Breathing" value={breathing.label} color={breathing.color} />
        <VitalCard icon={Eye} label="Consciousness" value={consciousness.label} color={consciousness.color} />
      </div>

      {/* Body zones */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground mb-3">BODY ZONES</h3>
        <div className="space-y-1.5">
          {BODY_ZONES.map(zone => {
            const state = zones[zone.key];
            const isDefault = state === zone.default;
            const isFeet = zone.key === 'feet';
            return (
              <div key={zone.key} className={`flex items-center justify-between text-xs p-2 rounded ${isFeet ? 'border border-amber-800/30 bg-amber-950/10' : ''}`}>
                <span className="text-muted-foreground font-body">{zone.label}</span>
                <span className={`font-heading capitalize ${isDefault ? 'text-muted-foreground/70' : 'text-amber-400'}`}>{state}</span>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-muted-foreground/50 font-body italic mt-2">
          Bullet walks the entire nightmare barefoot. His feet are part of the story.
        </p>
      </div>
    </div>
  );
}

function GaugeBar({ label, value, max, color }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="font-heading tracking-wide text-muted-foreground">{label}</span>
        <span className="font-heading tabular-nums text-foreground/80">{value}/{max}</span>
      </div>
      <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${Math.max(0, pct)}%` }} />
      </div>
    </div>
  );
}

function VitalCard({ icon: Icon, label, value, color }) {
  return (
    <div className="border border-border/50 rounded-lg bg-card/30 p-2.5 text-center">
      <Icon className={`w-3.5 h-3.5 mx-auto mb-1 ${color}`} strokeWidth={1.5} />
      <p className="text-[9px] font-heading tracking-wide text-muted-foreground/60">{label.toUpperCase()}</p>
      <p className={`font-heading text-xs mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}