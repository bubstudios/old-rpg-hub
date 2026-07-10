import { BookOpen, AlertTriangle } from 'lucide-react';
import { STARTING_FRAGMENTS, MEMORY_LABELS } from '@/lib/pullSheetData';

export default function MemoriesTab({ flags, isMichael }) {
  const memories = flags.memories || [];
  const memoryCount = memories.length;

  const status = isMichael ? 'Restored' :
    memoryCount === 0 ? 'None' :
    memoryCount <= 2 ? 'Fragments' :
    memoryCount <= 5 ? 'Recovering' : 'Partial';

  return (
    <div className="space-y-3">
      {/* Memory status */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">MEMORY STATUS</h3>
          <span className={`ml-auto font-heading text-sm ${isMichael ? 'text-emerald-400' : 'text-muted-foreground'}`}>{status}</span>
        </div>
      </div>

      {/* Starting fragments */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground mb-3">KNOWN FRAGMENTS</h3>
        <div className="space-y-1.5">
          {STARTING_FRAGMENTS.map((frag, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-1 h-1 rounded-full bg-indigo-400/50" />
              <span className="text-muted-foreground font-body italic">{frag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recovered memories */}
      {memoryCount > 0 && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground mb-3">RECOVERED MEMORIES</h3>
          <div className="space-y-2">
            {memories.map((mem, i) => {
              const content = typeof mem === 'string' ? mem : (mem.content || mem.text || JSON.stringify(mem));
              const type = typeof mem === 'object' ? (mem.type || mem.label || 'unverified') : 'unverified';
              const label = MEMORY_LABELS[type] || MEMORY_LABELS.unverified;
              return (
                <div key={i} className={`rounded-lg p-2.5 border ${label.badge}`}>
                  <p className={`text-[9px] font-heading tracking-wide ${label.color} mb-1`}>{label.label}</p>
                  <p className="text-xs text-muted-foreground font-body italic leading-relaxed">{content}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="border border-red-800/30 rounded-lg bg-red-950/10 p-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400/70 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
          <p className="text-[10px] text-red-400/70 font-body italic leading-relaxed">
            Do not assume every vision is true. Memories may be verified, unverified, false guilt echoes, Province-planted visions, myth fragments, or shard memories.
          </p>
        </div>
      </div>
    </div>
  );
}