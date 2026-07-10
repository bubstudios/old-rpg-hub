import { Sparkles, Check, HelpCircle } from 'lucide-react';
import { SHARD_POWERS, isStageUnlocked } from '@/lib/pullSheetData';

export default function ShardPowersTab({ flags }) {
  const discovered = SHARD_POWERS.filter(p => isStageUnlocked(p.condition, flags));
  const undiscoveredCount = SHARD_POWERS.length - discovered.length;

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
              <p className="text-[10px] font-body leading-relaxed text-muted-foreground">{power.desc}</p>
            </div>
          ))}
          {undiscoveredCount > 0 && Array.from({ length: undiscoveredCount }).map((_, i) => (
            <div key={`locked-${i}`} className="rounded-lg p-3 border border-border/20 bg-secondary/5">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/30" strokeWidth={1.5} />
                <p className="font-heading text-sm text-muted-foreground/30">Undiscovered</p>
              </div>
              <p className="text-[10px] font-body italic text-muted-foreground/20 mt-1">??? </p>
            </div>
          ))}
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