import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  ChevronLeft, Heart, Shield, Zap, DollarSign, Package, Activity,
  Loader2, BookOpen, Download, Sparkles
} from 'lucide-react';
import { ABILITIES, computeDefense, getInitiativeMod, getEgo } from '@/lib/lodRules';
import { exportCharacterSheet } from '@/lib/exportCharacterSheet';
import { toast } from 'sonner';

export default function LODCharacterSheet({ character: initialCharacter, campaignId }) {
  const navigate = useNavigate();
  const { charId } = useParams();
  const [character, setCharacter] = useState(initialCharacter);
  const [resting, setResting] = useState(false);

  async function handleRest() {
    if (!character) return;
    setResting(true);
    try {
      await base44.entities.Character.update(character.id, { hp_current: character.hp_max });
      toast.success(`${character.name} recovers to full Vitality.`);
      setCharacter({ ...character, hp_current: character.hp_max });
    } catch (e) {
      toast.error('Could not recover');
    } finally {
      setResting(false);
    }
  }

  function handleExport() {
    try {
      exportCharacterSheet(character);
      toast.success('Character sheet exported.');
    } catch (e) {
      toast.error('Could not export sheet');
    }
  }

  if (!character) {
    return <div className="text-center py-20 text-muted-foreground">Character not found.</div>;
  }

  const scores = character.ability_scores || {};
  const powers = character.skills || [];
  const equipment = character.equipment || [];
  const hpPct = character.hp_max > 0 ? (character.hp_current / character.hp_max) * 100 : 0;
  const defense = computeDefense(scores);
  const initMod = getInitiativeMod(scores);
  const ego = getEgo(scores);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(`/campaign/${campaignId}`)}
        className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
      </button>

      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-700 text-2xl text-foreground tracking-wide">{character.name}</h1>
            <p className="text-sm text-muted-foreground font-body mt-0.5">{character.race}</p>
            {character.background && (
              <p className="text-sm text-foreground/80 font-body italic mt-2 max-w-xl leading-relaxed">{character.background}</p>
            )}
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <button onClick={handleExport} className="flex items-center gap-1.5 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-primary transition-colors">
              <Download className="w-3 h-3" /> Export PDF
            </button>
            <span className={`text-[10px] font-heading tracking-[0.15em] px-2 py-1 rounded ${
              character.status === 'active' ? 'bg-purple-900/30 text-purple-400' :
              character.status === 'dead' ? 'bg-red-950/50 text-red-400' : 'bg-secondary text-muted-foreground'
            }`}>
              {character.status === 'dead' ? 'DEFEATED' : character.status.toUpperCase()}
            </span>
            {character.status === 'active' && character.hp_current < character.hp_max && (
              <button onClick={handleRest} disabled={resting} className="block mt-2 text-[10px] font-heading tracking-wide text-primary hover:text-primary/80 transition-colors">
                {resting ? <Loader2 className="w-3 h-3 animate-spin inline" /> : '⟳ Recover to Full Vitality'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatBox icon={Heart} label="VITALITY" value={`${character.hp_current}/${character.hp_max}`} sub="Toughness" accent="red" />
        <StatBox icon={Shield} label="DEFENSE" value={defense} sub="10 + TGH mod" />
        <StatBox icon={Sparkles} label="EGO" value={ego} sub="Will" accent="purple" />
        <StatBox icon={Zap} label="INIT" value={`${initMod >= 0 ? '+' : ''}${initMod}`} sub="AGI mod" />
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground">VITALITY</span>
          <span className="text-[10px] font-heading text-muted-foreground tabular-nums">{character.hp_current} / {character.hp_max}</span>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden border border-border/40">
          <div className={`h-full rounded-full transition-all duration-500 ${hpPct > 60 ? 'bg-emerald-700' : hpPct > 30 ? 'bg-amber-700' : 'bg-red-800'}`} style={{ width: `${Math.max(0, hpPct)}%` }} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">ATTRIBUTES</h3>
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

        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SUPER-POWERS</h3>
          </div>
          {powers.length ? (
            <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-thin pr-1">
              {powers.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 rounded border border-purple-900/30 bg-purple-950/5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-heading tracking-wide px-1 py-0.5 rounded bg-purple-900/30 text-purple-400">PWR</span>
                    <span className="text-[11px] font-heading font-600 text-foreground">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-heading">Rank {p.level}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic font-body">No powers recorded.</p>
          )}
        </div>

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
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/30">
            <DollarSign className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <span className="text-xs font-heading text-foreground">${character.gold || 0}</span>
          </div>
        </div>

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
      <Icon className={`w-4 h-4 mx-auto mb-1.5 ${accent === 'red' ? 'text-red-500' : accent === 'purple' ? 'text-purple-400' : 'text-primary'}`} strokeWidth={1.5} />
      <p className="font-heading font-700 text-xl text-foreground tabular-nums">{value}</p>
      <p className="text-[9px] font-heading tracking-wide text-muted-foreground mt-0.5">{label}</p>
      <p className="text-[9px] text-muted-foreground/50">{sub}</p>
    </div>
  );
}