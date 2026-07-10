import { Sparkles, Lock, Check } from 'lucide-react';
import { SHARD_POWERS } from '@/lib/pullSheetData';
import { getProvinceInfo } from '@/lib/pullRules';

export default function ShardPowersTab({ flags }) {
  const currentProvince = flags.current_province || 618;
  const history = flags.province_history || [];
  const shardFocusUnlocked = !!flags.shard_focus_unlocked;

  function isUnlocked(power) {
    if (power.key === 'passive') return true;
    if (power.key === 'focus') return shardFocusUnlocked;
    return history.includes(power.province) || currentProvince === power.province || currentProvince === 1;
  }

  return (
    <div className="space-y-3">
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SHARD POWERS</h3>
        </div>
        <div className="space-y-2">
          {SHARD_POWERS.map(power => {
            const unlocked = isUnlocked(power);
            const provInfo = getProvinceInfo(power.province);
            return (
              <div
                key={power.key}
                className={`rounded-lg p-3 border transition-colors ${
                  unlocked ? 'border-amber-700/40 bg-amber-950/10' : 'border-border/30 bg-secondary/5 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {unlocked ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground/40" strokeWidth={1.5} />
                  )}
                  <p className={`font-heading text-sm ${unlocked ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                    {power.label}
                  </p>
                  {!unlocked && (
                    <span className="ml-auto text-[9px] font-heading tracking-wide text-muted-foreground/40">
                      {provInfo.name}
                    </span>
                  )}
                </div>
                {unlocked ? (
                  <p className="text-[10px] font-body leading-relaxed text-muted-foreground">{power.desc}</p>
                ) : (
                  <p className="text-[10px] font-body italic text-muted-foreground/30">Locked. Unknown.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border border-red-800/30 rounded-lg bg-red-950/10 p-3">
        <p className="text-[10px] text-red-400/70 font-body italic leading-relaxed">
          Every major shard use increases Shard Resonance Trail. The Seeker may track this.
        </p>
      </div>
    </div>
  );
}