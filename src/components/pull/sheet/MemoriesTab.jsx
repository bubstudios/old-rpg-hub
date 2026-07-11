import { BookOpen, AlertTriangle, Eye } from 'lucide-react';
import { OBSERVED_FACTS, MEMORY_FRAGMENTS, MEMORY_LABELS, isStageUnlocked } from '@/lib/pullSheetData';

export default function MemoriesTab({ flags, isMichael }) {
  const earnedMemories = (flags.memories || []);
  const unlockedFragments = MEMORY_FRAGMENTS.filter(f => isStageUnlocked(f.condition, flags));
  const totalMemories = unlockedFragments.length + earnedMemories.length;

  const status = isMichael ? 'Restored' :
    totalMemories === 0 ? 'None' :
    totalMemories <= 2 ? 'Fragments' :
    totalMemories <= 5 ? 'Recovering' : 'Partial';

  return (
    <div className="space-y-3">
      {/* Memory status */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">MEMORY STATUS</h3>
          <span className={`ml-auto font-heading text-sm ${isMichael ? 'text-emerald-400' : totalMemories === 0 ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>{status}</span>
        </div>
      </div>

      {/* Known facts (physical observations, not memories) */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-3.5 h-3.5 text-sky-400" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">KNOWN FACTS</h3>
        </div>
        <div className="space-y-1.5">
          {OBSERVED_FACTS.map((fact, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-1 h-1 rounded-full bg-sky-400/50" />
              <span className="text-muted-foreground font-body">{fact}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recovered memory fragments */}
      {unlockedFragments.length > 0 && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground mb-3">RECOVERED FRAGMENTS</h3>
          <div className="space-y-2">
            {unlockedFragments.map((frag, i) => {
              const label = MEMORY_LABELS[frag.type] || MEMORY_LABELS.unverified;
              return (
                <div key={i} className={`rounded-lg p-2.5 border ${label.badge}`}>
                  <p className={`text-[9px] font-heading tracking-wide ${label.color} mb-1`}>{label.label}</p>
                  <p className="text-sm text-foreground/80 font-body leading-relaxed">{frag.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Memories from GM (flags.memories) */}
      {earnedMemories.length > 0 && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground mb-3">EARNED MEMORIES</h3>
          <div className="space-y-2">
            {earnedMemories.map((mem, i) => {
              const content = typeof mem === 'string' ? mem : (mem.content || mem.text || JSON.stringify(mem));
              const type = typeof mem === 'object' ? (mem.type || mem.label || 'unverified') : 'unverified';
              const label = MEMORY_LABELS[type] || MEMORY_LABELS.unverified;
              return (
                <div key={i} className={`rounded-lg p-2.5 border ${label.badge}`}>
                  <p className={`text-[9px] font-heading tracking-wide ${label.color} mb-1`}>{label.label}</p>
                  <p className="text-sm text-foreground/80 font-body leading-relaxed">{content}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="border border-red-800/30 rounded-lg bg-red-950/10 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-300 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-sm text-red-200 font-body leading-relaxed">
            Do not assume every vision is true. Memories may be verified, unverified, false guilt echoes, Province-planted visions, myth fragments, or shard memories.
          </p>
        </div>
      </div>
    </div>
  );
}