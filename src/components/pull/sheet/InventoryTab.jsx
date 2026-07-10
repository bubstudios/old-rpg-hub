import { Package } from 'lucide-react';
import { INVENTORY_DETAILS } from '@/lib/pullSheetData';

export default function InventoryTab({ character, flags }) {
  const equipment = character?.equipment || [];
  const sparkShard = flags.spark_shard;

  // Build display list: equipment items + Spark's shard if flag is set but not in equipment
  const items = [...equipment];
  if (sparkShard && !items.some(e => e.name === "Spark's Unetched Shard")) {
    items.push({ name: "Spark's Unetched Shard", qty: 1, notes: 'Cool to the touch. A debt carried.' });
  }

  return (
    <div className="space-y-3">
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">INVENTORY</h3>
        </div>
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground/50 italic font-body">Bullet carries nothing but the clothes on his back and the shard in his pocket.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => {
              const detail = INVENTORY_DETAILS[item.name];
              return (
                <div key={i} className="border border-border/30 rounded-lg p-3 bg-secondary/10">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-heading text-sm text-foreground">{item.qty > 1 ? `${item.qty}× ` : ''}{item.name}</p>
                    {detail && <span className="text-[9px] font-heading tracking-wide text-primary/60 uppercase">{detail.type}</span>}
                  </div>
                  {item.notes && !detail && <p className="text-[10px] text-muted-foreground/60 font-body">{item.notes}</p>}
                  {detail && (
                    <div className="mt-1.5 space-y-1.5">
                      <p className="text-[10px] text-muted-foreground font-body">
                        <span className="text-muted-foreground/60">Condition:</span> <span className="text-amber-400/80 capitalize">{detail.condition}</span>
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {detail.uses.map(use => (
                          <span key={use} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary/40 text-muted-foreground font-body border border-border/30">
                            {use}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 font-body italic pt-1 border-t border-border/20">{detail.meaning}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}