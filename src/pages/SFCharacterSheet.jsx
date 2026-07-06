import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  ChevronLeft, Heart, Rocket, Coins, Package, Activity,
  Loader2, BookOpen, Sparkles
} from 'lucide-react';
import { ABILITIES, getInitiative } from '@/lib/sfRules';
import { toast } from 'sonner';

export default function SFCharacterSheet({ character: initialCharacter, campaignId }) {
  const navigate = useNavigate();
  const { charId } = useParams();
  const [character, setCharacter] = useState(initialCharacter);
  const [resting, setResting] = useState(false);

  async function handleRest() {
    if (!character) return;
    setResting(true);
    try {
      await base44.entities.Character.update(character.id, { hp_current: character.hp_max });
      toast.success(`${character.name} recovers to full stamina.`);
      setCharacter({ ...character, hp_current: character.hp_max });
    } catch (e) {
      toast.error('Could not rest');
    } finally {
      setResting(false);
    }
  }

  if (!character) {
    return <div className="text-center py-20 text-muted-foreground">Operative not found.</div>;
  }

  const scores = character.ability_scores || {};
  const skills = character.skills || [];
  const equipment = character.equipment || [];
  const hpPct = character.hp_max > 0 ? (character.hp_current / character.hp_max) * 100 : 0;
  const initiative = getInitiative(scores.rs);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(`/campaign/${campaignId}`)}
        className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
      </button>

      {/* Header card */}
      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-700 text-2xl text-foreground tracking-wide">{character.name}</h1>
            <p className="text-sm text-muted-foreground font-body mt-0.5">
              {character.race} · {character.character_class} Operative
            </p>
            {character.background && (
              <p className="text-xs text-muted-foreground/70 font-body italic mt-2 max-w-md leading-relaxed">
                {character.background}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className={`text-[10px] font-heading tracking-[0.15em] px-2 py-1 rounded ${
              character.status === 'active' ? 'bg-emerald-900/30 text-emerald-400' :
              character.status === 'dead' ? 'bg-red-950/50 text-red-400' : 'bg-secondary text-muted-foreground'
            }`}>
              {character.status.toUpperCase()}
            </span>
            {character.status === 'active' && character.hp_current < character.hp_max && (
              <button
                onClick={handleRest}
                disabled={resting}
                className="block mt-2 text-[10px] font-heading tracking-wide text-primary hover:text-primary/80 transition-colors"
              >
                {resting ? <Loader2 className="w-3 h-3 animate-spin inline" /> : '⟳ Rest to Full STA'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Core stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatBox icon={Heart} label="STA" value={`${character.hp_current}/${character.hp_max}`} sub="Stamina" accent="red" />
        <StatBox icon={Activity} label="INIT" value={initiative} sub="RS ÷ 10" />
        <StatBox icon={Sparkles} label="SKILLS" value={skills.length} sub="Known" />
        <StatBox icon={Coins} label="CREDITS" value={character.gold || 0} sub="Cr" />
      </div>

      {/* Stamina bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground">VITALITY (STAMINA)</span>
          <span className="text-[10px] font-heading text-muted-foreground tabular-nums">{character.hp_current} / {character.hp_max}</span>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden border border-border/40">
          <div
            className={`h-full rounded-full transition-all duration-500 ${hpPct > 60 ? 'bg-emerald-700' : hpPct > 30 ? 'bg-amber-700' : 'bg-red-800'}`}
            style={{ width: `${Math.max(0, hpPct)}%` }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Ability Scores */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">ABILITY SCORES</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ABILITIES.map((a) => (
              <div key={a.key} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/30">
                <div>
                  <p className="text-[9px] font-heading tracking-[0.1em] text-muted-foreground">{a.name.toUpperCase()}</p>
                  <p className="font-heading font-700 text-lg text-foreground tabular-nums">{scores[a.key] ?? '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SKILLS</h3>
          </div>
          {skills.length ? (
            <div className="space-y-1.5">
              {skills.map((s, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-body">{s.name}</span>
                  <span className="font-heading font-600 text-foreground">Level {s.level}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic font-body">No skills recorded</p>
          )}
        </div>

        {/* Equipment */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">EQUIPMENT</h3>
          </div>
          {equipment.length ? (
            <div className="space-y-1.5">
              {equipment.map((e, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-body">{e.qty > 1 ? `${e.qty}× ` : ''}{e.name}</span>
                  {e.notes && <span className="text-[10px] text-muted-foreground/50">{e.notes}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic font-body">No equipment</p>
          )}
        </div>

        {/* Appearance */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">APPEARANCE</h3>
          </div>
          {character.appearance ? (
            <p className="text-sm text-muted-foreground font-body italic leading-relaxed">{character.appearance}</p>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic font-body">No description recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, sub, accent }) {
  return (
    <div className="border border-border/50 rounded-lg bg-card/40 p-3.5 text-center">
      <Icon className={`w-4 h-4 mx-auto mb-1.5 ${accent === 'red' ? 'text-red-500' : 'text-primary'}`} strokeWidth={1.5} />
      <p className="font-heading font-700 text-xl text-foreground tabular-nums">{value}</p>
      <p className="text-[9px] font-heading tracking-wide text-muted-foreground mt-0.5">{label}</p>
      <p className="text-[9px] text-muted-foreground/50">{sub}</p>
    </div>
  );
}