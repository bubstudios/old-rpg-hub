import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft, Heart, Rocket, Coins, Package, Sparkles, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import ExportCharacterButton from '@/components/ExportCharacterButton';
import { ABILITIES } from '@/lib/pjRules';

export default function PJCharacterSheet({ character, campaignId }) {
  const navigate = useNavigate();
  const [resting, setResting] = useState(false);

  const scores = character.ability_scores || {};
  const hpPct = character.hp_max > 0 ? (character.hp_current / character.hp_max) * 100 : 0;
  const skills = character.skills || [];
  const equipment = character.equipment || [];

  async function handleRest() {
    setResting(true);
    try {
      await base44.entities.Character.update(character.id, { hp_current: character.hp_max });
      toast.success(`${character.name} recovers to full vitality.`);
      character.hp_current = character.hp_max;
    } catch (e) {
      toast.error('Could not rest');
    } finally {
      setResting(false);
    }
  }

  function hpBarColor(pct) {
    if (pct > 60) return 'bg-emerald-500';
    if (pct > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => navigate(`/campaign/${campaignId}`)} className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
        </button>
        <ExportCharacterButton character={character} campaignId={campaignId} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        {character.portrait_url ? (
          <img src={character.portrait_url} alt={character.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/30" />
        ) : (
          <div className="w-14 h-14 rounded-full wax-seal flex items-center justify-center">
            <Rocket className="w-6 h-6 text-primary-foreground" strokeWidth={1.2} />
          </div>
        )}
        <div>
          <h1 className="font-heading font-700 text-xl text-foreground tracking-wide">{character.name}</h1>
          <p className="text-xs text-muted-foreground font-body">{character.race} · {character.character_class} · Level {character.level}</p>
        </div>
      </div>

      {/* Vitality */}
      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" strokeWidth={1.5} />
            <span className="text-[11px] font-heading tracking-[0.15em] text-muted-foreground">VITALITY</span>
          </div>
          <span className="font-heading font-700 text-sm text-foreground">{character.hp_current} / {character.hp_max}</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
          <div className={`h-full ${hpBarColor(hpPct)} transition-all`} style={{ width: `${hpPct}%` }} />
        </div>
        <Button onClick={handleRest} disabled={resting} variant="outline" size="sm" className="w-full mt-3 border-border/50 text-muted-foreground hover:text-foreground h-8">
          {resting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Rest / Recover'}
        </Button>
      </div>

      {/* Ability Scores */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">ABILITY SCORES</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ABILITIES.map((a) => (
            <div key={a.key} className="p-2.5 rounded-lg bg-secondary/20 border border-border/30">
              <p className="text-[9px] font-heading tracking-[0.1em] text-muted-foreground">{a.name.toUpperCase()}</p>
              <p className="font-heading font-700 text-lg text-foreground tabular-nums">{scores[a.key] || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Credits & Skills */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">CREDITS</h3>
          </div>
          <p className="font-heading font-700 text-lg text-foreground">{character.gold || 0} Cr</p>
        </div>
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SKILLS</h3>
          </div>
          {skills.length > 0 ? (
            <div className="space-y-1">
              {skills.map((s, i) => (
                <div key={i} className="flex justify-between text-[11px] font-body">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="text-foreground font-heading">Lv {s.level}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground/50 font-body italic">No skills recorded.</p>
          )}
        </div>
      </div>

      {/* Equipment */}
      <div className="border border-border/50 rounded-lg bg-card/40 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">EQUIPMENT</h3>
        </div>
        {equipment.length > 0 ? (
          <div className="flex gap-1.5 flex-wrap">
            {equipment.map((e, i) => (
              <span key={i} className="text-[10px] px-2 py-1 rounded bg-secondary/30 text-muted-foreground font-body border border-border/30">
                {e.qty > 1 ? `${e.qty}× ` : ''}{e.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground/50 font-body italic">No equipment.</p>
        )}
      </div>

      {/* Background */}
      {(character.appearance || character.background) && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4 mb-4">
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground mb-2">DOSSIER</h3>
          {character.appearance && (
            <p className="text-sm text-foreground/80 font-body leading-relaxed mb-2">{character.appearance}</p>
          )}
          {character.background && (
            <p className="text-sm text-foreground/80 font-body leading-relaxed">{character.background}</p>
          )}
        </div>
      )}
    </div>
  );
}