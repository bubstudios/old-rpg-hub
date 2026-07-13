import { useState } from 'react';
import { MapPin, Users, Target, AlertTriangle, Compass } from 'lucide-react';
import { getProvinceInfo } from '@/lib/pullRules';
import { getCurrentObjective } from '@/lib/pullSheetData';
import PullWorldStateDossier from '@/components/pull/PullWorldStateDossier';

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
  const [selection, setSelection] = useState(null);
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
  const allLocalClocks = { thirst: 75, heat_exposure: 65, fatigue: 55, ...(flags.local_clocks || {}) };
  const visibleClocks = discoveredClocks.map(k => ({ key: k, value: allLocalClocks[k] ?? 0 }));

  // Known threats: from explicit threat registry + codex unlocks + hostile NPCs
  // The mechanical bird and other non-human entities live here, NOT in npc_relationships
  const codexUnlocks = flags.codex_unlocks || [];
  const knownThreats = [...(flags.known_threats || [])].map(t => {
    // Enrich existing saved records missing the new metadata fields
    if (t.id === 'threat_618_mechanical_watcher' && !t.type) {
      return {
        ...t,
        type: 'surveillance_threat',
        aliases: t.aliases || ['mechanical bird', 'metal bird', 'red-eyed bird', 'winged machine', 'scanning drone', 'Watcher'],
        description: t.description || 'A red-eyed mechanical bird scanned Bullet\'s scar and vanished into the heat haze.',
        discovered: true,
        lastSeen: t.lastSeen || 'Province 618',
        status: t.status || 'Observed',
        threatLevel: t.threatLevel || 'Unknown'
      };
    }
    return t;
  });
  // Fallback for existing campaigns where the bird scan happened before known_threats
  // was added — detect via codex_unlocks or unlock_flags
  if ((codexUnlocks.includes('mechanical_bird') || codexUnlocks.includes('watcher') || (flags.unlock_flags || {}).mechanical_bird_scanned)
      && !knownThreats.some(t => t.id === 'threat_618_mechanical_watcher')) {
    knownThreats.push({
      id: 'threat_618_mechanical_watcher',
      type: 'surveillance_threat',
      displayName: 'Mechanical Watcher',
      aliases: ['mechanical bird', 'metal bird', 'red-eyed bird', 'winged machine', 'scanning drone', 'Watcher'],
      description: 'A red-eyed mechanical bird scanned Bullet\'s scar and vanished into the heat haze.',
      discovered: true,
      lastSeen: 'Province 618',
      status: 'Observed',
      threatLevel: 'Unknown'
    });
  }
  if (codexUnlocks.includes('seeker') && !knownThreats.some(t => t.id === 'seeker')) {
    knownThreats.push({ id: 'seeker', displayName: 'The Seeker' });
  }
  if (codexUnlocks.includes('dreadwraith') && !knownThreats.some(t => t.id === 'dreadwraith')) {
    knownThreats.push({ id: 'dreadwraith', displayName: 'The Dreadwraith' });
  }
  npcsMet.forEach(([_, n]) => {
    if ((n.disposition || '').toLowerCase() === 'hostile' && !knownThreats.some(t => t.displayName === n.name)) {
      knownThreats.push({ id: `npc_${n.name}`, displayName: n.name });
    }
  });

  const THREAT_TYPE_LABELS = {
    surveillance_threat: 'Surveillance threat',
    combat_threat: 'Combat threat',
    environmental_threat: 'Environmental threat',
    predator: 'Predator',
    raider_threat: 'Human threat',
    unknown_entity: 'Unknown entity'
  };

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
              <button
                key={`${p}-${i}`}
                onClick={() => setSelection({ type: 'location', name: provinceDisplayName(p, flags), province: p })}
                className="text-foreground/80 flex items-center gap-1 hover:text-primary transition-colors text-left"
              >
                <MapPin className="w-2.5 h-2.5 text-primary/50" /> {provinceDisplayName(p, flags)}
              </button>
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
                <button
                  key={key}
                  onClick={() => setSelection({ type: 'npc', name: n.name, fallback: { name: n.name, disposition: n.disposition, notes: n.notes } })}
                  className="text-foreground/70 flex items-center gap-1 hover:text-primary transition-colors text-left"
                >
                  <Users className="w-2.5 h-2.5 text-muted-foreground/50" /> {n.name}
                  <span className={`text-[9px] ml-1 ${n.disposition === 'friendly' ? 'text-emerald-400/70' : n.disposition === 'hostile' ? 'text-red-400/70' : 'text-muted-foreground/50'}`}>· {n.disposition || 'neutral'}</span>
                </button>
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
            <div className="space-y-1.5">
              {knownThreats.map((t, i) => {
                const match = npcsMet.find(([_, n]) => n.name === t.displayName);
                const typeLabel = t.type ? (THREAT_TYPE_LABELS[t.type] || t.type) : (match ? 'Human threat' : null);
                const desc = t.description || (match ? (match[1].player_knowledge || match[1].notes) : '');
                return match ? (
                  <button
                    key={i}
                    onClick={() => setSelection({ type: 'npc', name: match[1].name, fallback: { name: match[1].name, disposition: match[1].disposition, notes: match[1].notes } })}
                    className="text-red-300/80 flex items-start gap-1 hover:text-red-300 transition-colors text-left"
                  >
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400/50 mt-0.5 shrink-0" />
                    <span>{t.displayName}{typeLabel ? <span className="text-muted-foreground/50 text-[9px]"> — {typeLabel}</span> : null}{desc ? <span className="text-muted-foreground/50"> {desc}</span> : null}</span>
                  </button>
                ) : (
                  <p key={i} className="text-red-300/80 flex items-start gap-1">
                    <AlertTriangle className="w-2.5 h-2.5 text-red-400/50 mt-0.5 shrink-0" />
                    <span>{t.displayName}{typeLabel ? <span className="text-muted-foreground/50 text-[9px]"> — {typeLabel}</span> : null}{desc ? <span className="text-muted-foreground/50"> {desc}</span> : null}</span>
                  </p>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground/40 italic">None discovered</p>
          )}
        </div>
      </div>
      <PullWorldStateDossier campaignId={campaign.id} selection={selection} onClose={() => setSelection(null)} />
    </div>
  );
}