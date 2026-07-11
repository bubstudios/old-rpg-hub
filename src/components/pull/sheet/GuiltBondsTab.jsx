import { Brain, Users } from 'lucide-react';
import { GUILT_ENTRIES, isGuiltVisible } from '@/lib/pullSheetData';

const BOND_COLORS = {
  'Unresolved': 'text-amber-400',
  'Debt carried': 'text-sky-400',
  'Abandonment': 'text-red-400',
  'Witness Guilt': 'text-purple-400',
  'Rescue': 'text-emerald-400',
  'Regret': 'text-red-300',
  'Trust': 'text-emerald-400',
  'Uncertain Fate': 'text-muted-foreground'
};

export default function GuiltBondsTab({ flags, isMichael }) {
  const visible = GUILT_ENTRIES.filter(e => isGuiltVisible(e, flags));
  const npcRels = flags.npc_relationships || {};
  const clocks = flags.campaign_clocks || {};
  const guiltLevel = Math.min(5, Math.round((clocks.guilt_burden || 0) / 20));

  return (
    <div className="space-y-3">
      {/* Guilt burden summary */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-3.5 h-3.5 text-purple-400" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">GUILT BURDEN</h3>
        </div>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-2">
          {isMichael
            ? 'Michael remembers being Bullet. The guilt, bonds, and scars remain. They are not wiped clean.'
            : 'People Bullet failed to save. People he left behind. People who helped him. People he killed. Horrors he witnessed but did not stop.'}
        </p>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-sm ${i < guiltLevel ? 'bg-purple-500' : 'bg-border/30'}`} />
          ))}
        </div>
      </div>

      {/* Visible guilt entries */}
      {visible.length > 0 && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground mb-3">BONDS & GUILT</h3>
          <div className="space-y-2">
            {visible.map(entry => (
              <div key={entry.name} className="border border-border/30 rounded-lg p-2.5 bg-secondary/10">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="font-heading text-sm text-foreground">{entry.name}</p>
                  <span className={`text-[9px] font-heading tracking-wide ${BOND_COLORS[entry.bond] || 'text-muted-foreground'}`}>{entry.bond}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/70 font-body italic">{entry.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NPC relationships */}
      {Object.keys(npcRels).length > 0 && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">RELATIONSHIPS</h3>
          </div>
          <div className="space-y-1.5">
            {Object.entries(npcRels).map(([key, rel]) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-body capitalize">{key.replace(/_/g, ' ')}</span>
                <span className={`font-heading ${rel.state === 'TRUSTED' || rel.state === 'LOYAL' ? 'text-emerald-400' : rel.state === 'HOSTILE' ? 'text-red-400' : 'text-amber-400'}`}>
                  {rel.state || 'NEUTRAL'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}