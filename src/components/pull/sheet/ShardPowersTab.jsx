import { Sparkles, Check } from 'lucide-react';
import { SHARD_POWERS, isStageUnlocked } from '@/lib/pullSheetData';

export default function ShardPowersTab({ flags }) {
  const discovered = SHARD_POWERS.filter(p => isStageUnlocked(p.condition, flags));
  const codexUnlocks = flags.codex_unlocks || [];
  const seekerEncountered = codexUnlocks.includes('seeker');

  return (
    <div className="space-y-3">
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SHARD REACTIONS</h3>
        </div>
        <div className="space-y-2">
          {discovered.map(power => (
            <div key={power.key} className="rounded-lg p-3 border border-amber-700/40 bg-amber-950/10">
              <div className="flex items-center gap-2 mb-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
                <p className="font-heading text-sm text-foreground">{power.label}</p>
              </div>
              <p className="text-xs font-body leading-relaxed text-muted-foreground">{power.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {seekerEncountered && (
        <div className="border border-red-800/30 rounded-lg bg-red-950/10 p-3">
          <p className="text-xs text-red-300 font-body leading-relaxed">
            Every major shard use increases Shard Resonance Trail. The Seeker may track this.
          </p>
        </div>
      )}
    </div>
  );
}