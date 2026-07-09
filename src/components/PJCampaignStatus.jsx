import { useState } from 'react';
import { Rocket, Gauge, FileSearch, Clock } from 'lucide-react';
import { EPISODES, EVIDENCE_PIECES, SHIP_STATS, CAMPAIGN_CLOCKS, evidenceStrengthTier } from '@/lib/pjRules';

export default function PJCampaignStatus({ campaign }) {
  const [showEvidence, setShowEvidence] = useState(false);

  const flags = campaign?.world_state?.quest_flags || {};
  const clocks = flags.campaign_clocks || {};
  const shipStats = flags.ship_stats || {};
  const evidence = flags.evidence || [];
  const crewLoyalty = flags.crew_loyalty || '—';
  const sanctuaryTrust = flags.sanctuary_trust ?? 20;
  const resistanceSpark = flags.resistance_spark ?? 0;

  const episode = EPISODES.find(e => e.num === campaign?.current_chapter) || EPISODES[0];

  // Sync default clock values if not set by DM yet
  const getClock = (key) => {
    const val = clocks[key];
    if (val !== undefined && val !== null) return val;
    const def = CAMPAIGN_CLOCKS.find(c => c.key === key);
    return def ? def.default : 0;
  };

  function statBarColor(val, max = 100, reverse = false) {
    const pct = (val / max) * 100;
    if (reverse) {
      if (pct > 70) return 'bg-red-500';
      if (pct > 40) return 'bg-yellow-500';
      return 'bg-emerald-500';
    }
    if (pct > 60) return 'bg-emerald-500';
    if (pct > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  function clockColor(key, val) {
    if (key === 'confluence_claim') return val <= 3 ? 'text-red-400' : val <= 7 ? 'text-yellow-400' : 'text-emerald-400';
    if (key === 'confluence_heat') return val > 70 ? 'text-red-400' : val > 40 ? 'text-yellow-400' : 'text-emerald-400';
    if (key === 'chen_exposure') {
      const tier = evidenceStrengthTier(val);
      return tier === 'Undeniable' || tier === 'Damning' ? 'text-emerald-400' : tier === 'Strong' ? 'text-yellow-400' : 'text-muted-foreground';
    }
    if (key === 'sanctuary_trust') return val > 60 ? 'text-emerald-400' : val > 30 ? 'text-yellow-400' : 'text-red-400';
    if (key === 'resistance_spark') return val > 50 ? 'text-emerald-400' : val > 20 ? 'text-yellow-400' : 'text-muted-foreground';
    return 'text-foreground';
  }

  const loyaltyColor = {
    loyal: 'text-emerald-400', inspired: 'text-emerald-400',
    shaken: 'text-yellow-400', divided: 'text-yellow-400',
    terrified: 'text-red-400', mutinous: 'text-red-400'
  }[crewLoyalty] || 'text-muted-foreground';

  return (
    <div className="space-y-3">
      {/* Episode Tracker */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Rocket className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">CURRENT EPISODE</h3>
        </div>
        <p className="font-heading font-600 text-sm text-foreground">{episode.num}. {episode.title}</p>
        <p className="text-[10px] text-muted-foreground font-body mt-0.5 leading-relaxed">{episode.summary}</p>
      </div>

      {/* Ship Status */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SHIP STATUS</h3>
        </div>
        <div className="space-y-1.5">
          {SHIP_STATS.slice(0, 5).map((s) => {
            const val = shipStats[s.key] ?? 100;
            const isHeat = s.key === 'confluence_heat';
            return (
              <div key={s.key}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-muted-foreground font-heading tracking-wide">{s.name.toUpperCase()}</span>
                  <span className="text-foreground font-heading tabular-nums">{val}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full ${statBarColor(val, 100, isHeat)} transition-all`} style={{ width: `${val}%` }} />
                </div>
              </div>
            );
          })}
          <div className="flex justify-between items-center pt-1 border-t border-border/30">
            <span className="text-[10px] text-muted-foreground font-heading tracking-wide">CREW LOYALTY</span>
            <span className={`text-[10px] font-heading font-600 uppercase ${loyaltyColor}`}>{crewLoyalty}</span>
          </div>
        </div>
      </div>

      {/* Campaign Clocks */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-3">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">CAMPAIGN CLOCKS</h3>
        </div>
        <div className="space-y-1.5">
          {CAMPAIGN_CLOCKS.map((c) => {
            const val = getClock(c.key);
            const max = c.key === 'confluence_claim' ? 14 : c.key === 'chen_exposure' ? 13 : 100;
            const pct = (val / max) * 100;
            return (
              <div key={c.key}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-muted-foreground font-heading tracking-wide">{c.name.toUpperCase()}</span>
                  <span className={`font-heading font-600 tabular-nums ${clockColor(c.key, val)}`}>
                    {val}{c.key === 'confluence_claim' ? ' cycles' : ''}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full ${c.key === 'confluence_claim' ? 'bg-red-500' : clockColor(c.key, val).replace('text-', 'bg-').replace('-400', '-500')} transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence Locker */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-3">
        <button onClick={() => setShowEvidence(s => !s)} className="flex items-center gap-2 mb-2 w-full">
          <FileSearch className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">EVIDENCE LOCKER</h3>
          <span className="ml-auto text-[10px] font-heading font-600 text-primary">{evidence.length}/{EVIDENCE_PIECES.length}</span>
        </button>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-muted-foreground font-heading tracking-wide">STRENGTH</span>
          <span className={`text-[10px] font-heading font-600 uppercase ${
            evidenceStrengthTier(evidence.length) === 'Undeniable' || evidenceStrengthTier(evidence.length) === 'Damning' ? 'text-emerald-400' :
            evidenceStrengthTier(evidence.length) === 'Strong' ? 'text-yellow-400' : 'text-muted-foreground'
          }`}>{evidenceStrengthTier(evidence.length)}</span>
        </div>
        {showEvidence && (
          <div className="space-y-1 mt-2 pt-2 border-t border-border/30">
            {EVIDENCE_PIECES.map((piece) => {
              const found = evidence.some(e => e.toLowerCase().includes(piece.toLowerCase()) || piece.toLowerCase().includes(e.toLowerCase()));
              return (
                <div key={piece} className="flex items-center gap-1.5 text-[10px]">
                  <div className={`w-1.5 h-1.5 rounded-full ${found ? 'bg-emerald-500' : 'bg-muted-foreground/20'}`} />
                  <span className={found ? 'text-foreground font-body' : 'text-muted-foreground/40 font-body italic'}>{piece}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}