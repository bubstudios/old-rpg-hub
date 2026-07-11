import { MapPin, Users, Target, AlertTriangle, Compass } from 'lucide-react';
import { getProvinceInfo } from '@/lib/pullRules';
import { getCurrentObjective } from '@/lib/pullSheetData';

function provinceDisplayName(provinceNum, flags) {
  const info = getProvinceInfo(provinceNum);
  // Before Bullet meets the camp, Province 618 shows as "Red Sand" (the desert),
  // not "Red Sand Camp" (the settlement he hasn't found yet).
  if (provinceNum === 618 && Object.keys(flags.npc_relationships || {}).length === 0) return 'Red Sand';
  return info.name.replace(/^Province \d+(?:\s+(?:Upper|Inner|Deep))?:\s*/, '');
}

function deriveReputation(npcsMet) {
  if (npcsMet.length === 0) return { label: 'Unknown', color: 'text-muted-foreground' };
  const dispositions = npcsMet.map(([_, n]) => (n.disposition || 'neutral').toLowerCase());
  const hasFriendly = dispositions.includes('friendly');
  const hasHostile = dispositions.includes('hostile');
  if (hasFriendly && hasHostile) return { label: 'Divisive Figure', color: 'text-amber-400' };
  if (hasFriendly) return { label: 'Camp Guest', color: 'text-emerald-400' };
  if (hasHostile) return { label: 'Suspicious Outsider', color: 'text-red-400' };
  return { label: 'Unknown Stranger', color: 'text-muted-foreground' };
}

export default function PullWorldState({ campaign }) {
  if (!campaign) return null;
  const flags = campaign.world_state?.quest_flags || {};

  // ─── Live values derived from campaign flags (re-renders when campaign prop updates) ───
  const history = flags.province_history || [];
  const currentProvince = flags.current_province || 618;
  const exploredProvinces = [...new Set([...history, currentProvince])];

  const npcRels = flags.npc_relationships || {};
  const npcsMet = Object.entries(npcRels);

  const objective = getCurrentObjective(flags);

  // Only discovered local clocks are visible — hidden clocks stay in GM state
  const discoveredClocks = flags.discovered_clocks || ['thirst', 'heat_exposure', 'fatigue'];
  const localClocks = flags.local_clocks || {};
  const visibleClocks = discoveredClocks.map(k => ({ key: k, value: localClocks[k] || 0 }));

  // Known threats: derived from codex unlocks + hostile NPCs
  const codexUnlocks = flags.codex_unlocks || [];
  const knownThreats = [];
  if (codexUnlocks.includes('seeker')) knownThreats.push('The Seeker');
  if (codexUnlocks.includes('dreadwraith')) knownThreats.push('The Dreadwraith');
  npcsMet.forEach(([_, n]) => {
    if ((n.disposition || '').toLowerCase() === 'hostile') knownThreats.push(n.name);
  });

  const rep = deriveReputation(npcsMet);

  return (
    <div className="border border-border/50 rounded-lg bg-card/40 p-3">
      <div className="flex items-center gap-2 mb-2.5">
        <Compass className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
        <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">WORLD STATE</h3>
      </div>
      <div className="space-y-2.5 text-[11px] font-body">
        {/* Explored */}
        <div>
          <p className="text-muted-foreground/60 text-[10px] font-heading tracking-wide mb-1">EXPLORED</p>
          <div className="space-y-0.5">
            {exploredProvinces.map((p, i) => (
              <p key={`${p}-${i}`} className="text-foreground/80 flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-primary/50" /> {provinceDisplayName(p, flags)}
              </p>
            ))}
          </div>
        </div>

        {/* NPCs Met */}
        <div className="pt-1.5 border-t border-border/30">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground/60 text-[10px] font-heading tracking-wide">NPCS MET</span>
            <span className="font-heading text-primary/80">{npcsMet.length}</span>
          </div>
          {npcsMet.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {npcsMet.map(([key, n]) => (
                <p key={key} className="text-foreground/70 flex items-center gap-1">
                  <Users className="w-2.5 h-2.5 text-muted-foreground/50" /> {n.name}
                  <span className={`text-[9px] ml-1 ${n.disposition === 'friendly' ? 'text-emerald-400/70' : n.disposition === 'hostile' ? 'text-red-400/70' : 'text-muted-foreground/50'}`}>· {n.disposition || 'neutral'}</span>
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Reputation */}
        <div className="flex items-center justify-between pt-1.5 border-t border-border/30">
          <span className="text-muted-foreground/60 text-[10px] font-heading tracking-wide">REPUTATION</span>
          <span className={`font-heading ${rep.color}`}>{rep.label}</span>
        </div>

        {/* Current Objective */}
        <div className="pt-1.5 border-t border-border/30">
          <p className="text-muted-foreground/60 text-[10px] font-heading tracking-wide mb-1">CURRENT OBJECTIVE</p>
          <p className="text-foreground/80 flex items-start gap-1">
            <Target className="w-2.5 h-2.5 text-primary/50 mt-0.5 shrink-0" /> {objective || '—'}
          </p>
        </div>

        {/* Visible Clocks (discovered only — hidden clocks stay hidden) */}
        <div className="pt-1.5 border-t border-border/30">
          <p className="text-muted-foreground/60 text-[10px] font-heading tracking-wide mb-1">VISIBLE CLOCKS</p>
          <div className="space-y-0.5">
            {visibleClocks.map(c => (
              <div key={c.key} className="flex items-center justify-between">
                <span className="text-foreground/70 capitalize">{c.key.replace(/_/g, ' ')}</span>
                <span className={`font-heading tabular-nums ${c.value > 50 ? 'text-red-400' : c.value > 25 ? 'text-amber-400' : 'text-emerald-400/70'}`}>{c.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Known Threats */}
        <div className="pt-1.5 border-t border-border/30">
          <p className="text-muted-foreground/60 text-[10px] font-heading tracking-wide mb-1">KNOWN THREATS</p>
          {knownThreats.length > 0 ? (
            <div className="space-y-0.5">
              {knownThreats.map((t, i) => (
                <p key={i} className="text-red-300/80 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5 text-red-400/50" /> {t}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground/40 italic">None discovered</p>
          )}
        </div>
      </div>
    </div>
  );
}