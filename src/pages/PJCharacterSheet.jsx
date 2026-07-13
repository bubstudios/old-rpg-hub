import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Flame, Shield, Eye, Zap, Radio, Star } from 'lucide-react';
import ExportCharacterButton from '@/components/ExportCharacterButton';

function clockLabel(val) {
  if (val >= 75) return 'CRITICAL';
  if (val >= 50) return 'DANGER';
  if (val >= 25) return 'WATCH';
  return 'LOW';
}

function clockColor(val, highIsBad) {
  if (highIsBad) {
    if (val >= 75) return 'text-red-400';
    if (val >= 50) return 'text-orange-400';
    if (val >= 25) return 'text-amber-400';
    return 'text-emerald-400';
  }
  if (val >= 50) return 'text-emerald-400';
  if (val >= 25) return 'text-amber-400';
  return 'text-red-400';
}

export default function PJCharacterSheet({ character, campaignId, campaign }) {
  const navigate = useNavigate();
  const { id: campId } = useParams();
  const cid = campaignId || campId;

  const clocks = campaign?.world_state?.quest_flags?.campaign_clocks || {};

  const commandTraits = [
    { label: 'Crew Morale', icon: Heart, value: clocks.crew_morale, highIsBad: false },
    { label: 'Confluence Heat', icon: Flame, value: clocks.confluence_heat, highIsBad: true },
    { label: 'New Titan Stability', icon: Shield, value: clocks.new_titan_stability, highIsBad: false },
    { label: 'Public Truth', icon: Eye, value: clocks.public_truth, highIsBad: false },
    { label: 'Resistance Spark', icon: Zap, value: clocks.resistance_spark, highIsBad: false },
    { label: 'Temporal Instability', icon: Radio, value: clocks.temporal_instability, highIsBad: true },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(`/campaign/${cid}`)} className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
      </button>

      {/* Captain's File Header */}
      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-[10px] font-heading tracking-[0.2em] text-primary/70 mb-1">CAPTAIN'S FILE</div>
            <h1 className="font-heading font-700 text-2xl text-foreground tracking-wide">{character.name}</h1>
            <p className="text-sm text-muted-foreground font-body mt-0.5">Captain, UES Pathfinder</p>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <ExportCharacterButton character={character} campaignId={cid} />
            <span className="text-[10px] font-heading tracking-[0.15em] px-2 py-1 rounded bg-emerald-900/30 text-emerald-400">
              ACTIVE COMMAND
            </span>
          </div>
        </div>
      </div>

      {/* Service Record */}
      {character.background && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4 mb-5">
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground mb-2">SERVICE RECORD</h3>
          <p className="text-sm text-foreground/80 font-body leading-relaxed">{character.background}</p>
        </div>
      )}

      {/* Command Status — Sandbox Clocks as story-state indicators */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">COMMAND STATUS</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {commandTraits.map(({ label, icon: Icon, value, highIsBad }) => {
            const val = typeof value === 'number' ? value : 0;
            return (
              <div key={label} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/20 border border-border/30">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                  <Icon className="w-3 h-3" strokeWidth={1.5} /> {label}
                </span>
                <span className={`font-heading font-600 text-xs ${clockColor(val, highIsBad)}`}>
                  {clockLabel(val)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ship & Mission */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">UES PATHFINDER</h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-body">Command Authority</span>
            <span className="font-heading font-600 text-foreground">UES Pathfinder</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-body">Allied Ships</span>
            <span className="font-heading font-600 text-foreground">37 attached / nearby</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-body">Primary Mission</span>
            <span className="font-heading font-600 text-foreground text-right max-w-[200px]">Protect New Titan. Expose the Confluence.</span>
          </div>
        </div>
      </div>
    </div>
  );
}