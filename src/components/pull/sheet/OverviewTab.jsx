import { MapPin, Compass, Heart, Package, BookOpen, Sparkles, Shield } from 'lucide-react';
import { deriveCurrentState } from '@/lib/pullSheetData';
import { getProvinceInfo } from '@/lib/pullRules';

export default function OverviewTab({ character, flags, provinceInfo, isMichael }) {
  const clocks = flags.campaign_clocks || {};
  const equipment = character?.equipment || [];
  const specialItems = equipment.map(e => e.name);

  const currentState = isMichael
    ? 'Restored / The Pull is Gone / Cleanup Active'
    : deriveCurrentState(character?.hp_current, character?.hp_max, flags.conditions, clocks);

  const primaryWeapon = equipment.find(e => e.name === 'Battered Metal Pipe') || null;

  const truth = isMichael
    ? 'You are Michael, sent by Father to end the Provinces\' torment. The scar was a self-inflicted bullet wound at Father\'s command. The etched shard was Father\'s own light. The amnesia was intentional sacrifice. Both identities remain true: Michael and Bullet.'
    : 'You woke in red sand with no memory, a scar over your heart, and a strange shard in your pocket. Something inside your chest is pulling you forward.';

  return (
    <div className="space-y-3">
      {/* Identity card */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <InfoRow label="Known Identity" value={isMichael ? 'Restored' : 'Unknown'} />
          <InfoRow label="Current Province" value={provinceInfo.name} />
          <InfoRow label="Current Objective" value={isMichael ? 'Clean up the Provinces' : 'Survive. Find water. Understand the Pull.'} />
          <InfoRow label="Current State" value={currentState} />
          <InfoRow label="Primary Weapon" value={primaryWeapon ? primaryWeapon.name : 'None yet'} />
          <InfoRow label="Special Items" value={specialItems.length ? specialItems.join(', ') : 'Etched Shard'} />
        </div>
      </div>

      {/* Michael reveal status */}
      {isMichael && (
        <div className="border border-amber-700/40 rounded-lg bg-amber-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-amber-400">THE REVEAL</h3>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">The Pull</span><span className="font-heading text-emerald-400">Gone</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">The Scar</span><span className="font-heading text-muted-foreground">Quiet</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">The Pipe</span><span className="font-heading text-amber-400">{flags.pipe_state === 'radiant_sword' ? 'Sword of White Fire' : 'Returned to Pipe'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Cleanup Mode</span><span className="font-heading text-primary">Unlocked</span></div>
          </div>
        </div>
      )}

      {/* Known truth */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">KNOWN TRUTH</h3>
        </div>
        <p className="text-sm font-body italic text-muted-foreground leading-relaxed">{truth}</p>
      </div>

      {/* Quick status strip */}
      <div className="grid grid-cols-3 gap-2">
        <QuickStat label="Pull" value={isMichael ? 'Gone' : flags.pull_intensity != null ? `${flags.pull_intensity}/6` : '1/6'} />
        <QuickStat label="Scar" value={isMichael ? 'Quiet' : (flags.scar_state || 'pulse')} />
        <QuickStat label="Shard" value={`${flags.shard_resonance ?? 0}/100`} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-heading tracking-wide text-muted-foreground/60 uppercase">{label}</p>
      <p className="font-body text-foreground/90 text-sm mt-0.5">{value}</p>
    </div>
  );
}

function QuickStat({ label, value }) {
  return (
    <div className="border border-border/50 rounded-lg bg-card/30 p-2.5 text-center">
      <p className="text-[9px] font-heading tracking-wide text-muted-foreground/60">{label.toUpperCase()}</p>
      <p className="font-heading text-sm text-primary/90 mt-0.5 capitalize">{value}</p>
    </div>
  );
}