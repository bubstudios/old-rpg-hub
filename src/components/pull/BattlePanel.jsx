import { useState } from 'react';
import { Swords, Loader2, Shield, Heart, AlertTriangle, Eye, Volume2, Package } from 'lucide-react';
import { getAvailableIntents, getBattleClocks, BATTLE_END_TYPES } from '@/lib/pullBattleSystem';

const CLOCK_ICONS = {
  bulletControl: Shield,
  enemyMorale: Swords,
  enemyInjury: Heart,
  bulletInjury: AlertTriangle,
  coreSecurity: Package,
  campExposureRisk: Eye,
  noise: Volume2,
};

function ClockBar({ clock }) {
  const Icon = CLOCK_ICONS[clock.key] || Shield;
  const val = clock.value;
  const colorClass = clock.highIsBad
    ? (val > 75 ? 'bg-red-500' : val > 50 ? 'bg-amber-500' : val > 25 ? 'bg-yellow-500' : 'bg-emerald-500')
    : (val > 50 ? 'bg-emerald-500' : val > 25 ? 'bg-amber-500' : 'bg-red-500');
  const textColorClass = clock.highIsBad
    ? (val > 75 ? 'text-red-400' : val > 50 ? 'text-amber-400' : 'text-emerald-400')
    : (val > 50 ? 'text-emerald-400' : val > 25 ? 'text-amber-400' : 'text-red-400');

  return (
    <div className="flex items-center gap-1.5">
      <Icon className={`w-2.5 h-2.5 ${textColorClass} shrink-0`} strokeWidth={1.5} />
      <span className="text-[9px] text-muted-foreground/70 font-body w-16 truncate">{clock.label}</span>
      <div className="flex-1 h-1.5 bg-border/40 rounded-sm overflow-hidden">
        <div className={`h-full ${colorClass} transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(100, val))}%` }} />
      </div>
      <span className={`text-[9px] font-heading tabular-nums ${textColorClass} w-5 text-right`}>{Math.round(val)}</span>
    </div>
  );
}

export default function BattlePanel({ campaign, onResolve, processing }) {
  const [hoveredIntent, setHoveredIntent] = useState(null);

  if (!campaign) return null;
  const combatState = campaign.world_state?.quest_flags?.combat_state;
  if (!combatState || !combatState.active) return null;

  const intents = getAvailableIntents(combatState);
  const clocks = getBattleClocks(combatState);
  const exchangeCount = combatState.exchangeCount || 0;
  const maxExchanges = combatState.maxExchanges || 4;

  return (
    <div className="border border-red-800/40 rounded-lg bg-card/60 panel-glow p-3 animate-ink">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <Swords className="w-4 h-4 text-red-400 animate-flicker" strokeWidth={1.5} />
        <h3 className="font-heading text-xs tracking-[0.15em] text-red-300">COMBAT</h3>
        <span className="ml-auto text-[10px] font-heading text-muted-foreground/60 tabular-nums">
          Exchange {exchangeCount} / {maxExchanges}
        </span>
      </div>

      {/* Enemy & Objective */}
      <div className="mb-2.5 space-y-0.5">
        <p className="text-[11px] font-heading text-red-300/80">{combatState.enemyName || 'Unknown Enemy'}</p>
        <p className="text-[10px] text-muted-foreground/60 font-body italic">{combatState.objective || 'Survive the fight'}</p>
      </div>

      {/* Battle Clocks */}
      <div className="space-y-1 mb-3 pt-2 border-t border-border/30">
        {clocks.map((c) => (
          <ClockBar key={c.key} clock={c} />
        ))}
      </div>

      {/* Intent Options */}
      <div className="pt-2 border-t border-border/30">
        <p className="text-[10px] font-heading tracking-wide text-muted-foreground/60 mb-1.5">CHOOSE YOUR ACTION</p>
        <div className="grid grid-cols-2 gap-1.5">
          {intents.map((intent) => (
            <button
              key={intent.key}
              onClick={() => onResolve(intent.key)}
              disabled={processing}
              onMouseEnter={() => setHoveredIntent(intent.key)}
              onMouseLeave={() => setHoveredIntent(null)}
              className={`flex flex-col items-start gap-0.5 px-2 py-1.5 rounded text-left border transition-all disabled:opacity-50 ${
                intent.lethal
                  ? 'border-red-700/40 bg-red-950/20 hover:bg-red-950/40 hover:border-red-600/50'
                  : 'border-border/50 bg-card/40 hover:bg-card/60 hover:border-primary/40'
              } ${hoveredIntent === intent.key ? 'scale-[1.02]' : ''}`}
            >
              <span className={`text-[10px] font-heading tracking-wide ${intent.lethal ? 'text-red-300' : 'text-foreground/80'}`}>
                {intent.short}
              </span>
              {hoveredIntent === intent.key && (
                <span className="text-[8px] text-muted-foreground/50 font-body leading-tight">
                  {intent.desc}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Processing indicator */}
      {processing && (
        <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-border/30">
          <Loader2 className="w-3.5 h-3.5 text-red-400 animate-spin" />
          <span className="text-[10px] font-body italic text-muted-foreground">Resolving exchange...</span>
        </div>
      )}
    </div>
  );
}