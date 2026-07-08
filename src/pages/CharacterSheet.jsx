import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft, Heart, Shield, Swords, ScrollText, Coins, Package,
  Star, Sparkles, Loader2, BookOpen, Download
} from 'lucide-react';
import { toast } from 'sonner';
import SFCharacterSheet from '@/pages/SFCharacterSheet';
import GWCharacterSheet from '@/pages/GWCharacterSheet';
import BHCharacterSheet from '@/pages/BHCharacterSheet';
import IJCharacterSheet from '@/pages/IJCharacterSheet';
import TSCharacterSheet from '@/pages/TSCharacterSheet';
import HyCharacterSheet from '@/pages/HyCharacterSheet';
import GBCharacterSheet from '@/pages/GBCharacterSheet';
import GangCharacterSheet from '@/pages/GangCharacterSheet';
import LODCharacterSheet from '@/pages/LODCharacterSheet';
import { exportCharacterSheet } from '@/lib/exportCharacterSheet';

export default function CharacterSheet() {
  const { id: campaignId, charId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resting, setResting] = useState(false);

  useEffect(() => {
    load();
  }, [campaignId, charId]);

  // Real-time sync: when the DM updates this character (items, gold, spells, HP, etc.),
  // refresh the sheet automatically so changes appear live.
  useEffect(() => {
    const unsubscribe = base44.entities.Character.subscribe((event) => {
      const changedId = event.id || event.data?.id;
      if (changedId === charId) {
        refreshCharacter();
      }
    });
    return () => unsubscribe();
  }, [charId]);

  async function refreshCharacter() {
    try {
      const updated = await base44.entities.Character.get(charId);
      if (updated) setCharacter(updated);
    } catch (e) { /* ignore transient errors */ }
  }

  async function load() {
    try {
      setLoading(true);
      const res = await base44.functions.invoke('campaignData', { op: 'load', campaign_id: campaignId });
      setCampaign(res.data.campaign);
      setCharacter(res.data.characters.find(c => c.id === charId));
    } catch (e) {
      toast.error('Failed to load character');
    } finally {
      setLoading(false);
    }
  }

  async function handleRest() {
    if (!character) return;
    setResting(true);
    try {
      await base44.entities.Character.update(character.id, { hp_current: character.hp_max });
      toast.success(`${character.name} rests and recovers to full health.`);
      setCharacter({ ...character, hp_current: character.hp_max });
    } catch (e) {
      toast.error('Could not rest');
    } finally {
      setResting(false);
    }
  }

  function handleExport() {
    try {
      exportCharacterSheet(character, campaign);
      toast.success('Character sheet exported.');
    } catch (e) {
      toast.error('Could not export sheet');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
      </div>
    );
  }

  if (!character) {
    return <div className="text-center py-20 text-muted-foreground">Character not found.</div>;
  }

  if (campaign?.game_system === 'starfrontiers') {
    return <SFCharacterSheet character={character} campaignId={campaignId} />;
  }

  if (campaign?.game_system === 'gammaworld') {
    return <GWCharacterSheet character={character} campaignId={campaignId} />;
  }

  if (campaign?.game_system === 'boothill') {
    return <BHCharacterSheet character={character} campaignId={campaignId} />;
  }

  if (campaign?.game_system === 'indianajones') {
    return <IJCharacterSheet character={character} campaignId={campaignId} />;
  }

  if (campaign?.game_system === 'topsecret') {
    return <TSCharacterSheet character={character} campaignId={campaignId} />;
  }

  if (campaign?.game_system === 'conan' || campaign?.game_system === 'redsonja') {
    return <HyCharacterSheet character={character} campaignId={campaignId} />;
  }

  if (campaign?.game_system === 'ghostbusters') {
    return <GBCharacterSheet character={character} campaignId={campaignId} />;
  }

  if (campaign?.game_system === 'gangbusters') {
    return <GangCharacterSheet character={character} campaignId={campaignId} />;
  }

  if (campaign?.game_system === 'legionofdoom') {
    return <LODCharacterSheet character={character} campaignId={campaignId} />;
  }

  const scores = character.ability_scores || {};
  const saves = character.saving_throws || {};
  const hpPct = character.hp_max > 0 ? (character.hp_current / character.hp_max) * 100 : 0;

  // Only show the six D&D ability scores — other systems' attributes (AGI, GACC, MOV, etc.)
  // are stored on the same object but belong to different game systems and must not appear here.
  const DND_ABILITIES = ['str', 'int', 'wis', 'dex', 'con', 'cha'];
  const dndScores = DND_ABILITIES
    .filter(ab => scores[ab] !== undefined && scores[ab] !== null)
    .map(ab => [ab, scores[ab]]);

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
              {character.race} {character.character_class} · Level {character.level} · {character.alignment}
            </p>
            {character.background && (
              <p className="text-sm text-foreground/80 font-body italic mt-2 max-w-xl leading-relaxed">
                {character.background}
              </p>
            )}
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-primary transition-colors"
            >
              <Download className="w-3 h-3" /> Export PDF
            </button>
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
                {resting ? <Loader2 className="w-3 h-3 animate-spin inline" /> : '⟳ Rest to Full HP'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Core stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatBox icon={Heart} label="HP" value={`${character.hp_current}/${character.hp_max}`} sub={`${Math.round(hpPct)}%`} accent="red" />
        <StatBox icon={Shield} label="AC" value={character.ac} sub="Armor Class" />
        <StatBox icon={Swords} label="THAC0" value={character.thaco} sub="To Hit" />
        <StatBox icon={Star} label="XP" value={character.xp} sub={`Lvl ${character.level}`} />
      </div>

      {/* HP bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground">VITALITY</span>
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
            <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">ABILITY SCORES</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {dndScores.map(([ab, val]) => {
              const mod = Math.floor((val - 10) / 2);
              return (
                <div key={ab} className="text-center p-2 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-[9px] font-heading tracking-[0.1em] text-muted-foreground">{ab.toUpperCase()}</p>
                  <p className="font-heading font-700 text-xl text-foreground tabular-nums">{val}</p>
                  <p className="text-[9px] text-muted-foreground/70 font-heading">{mod >= 0 ? '+' : ''}{mod}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Saving Throws */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SAVING THROWS</h3>
          </div>
          <div className="space-y-1.5">
            {[
              ['Poison / Death', saves.poison_death],
              ['Rod / Staff / Wand', saves.wand],
              ['Petrification / Poly', saves.petrification],
              ['Breath Weapon', saves.breath],
              ['Spell', saves.spell]
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-body">{label}</span>
                <span className="font-heading font-600 text-foreground tabular-nums">{val}+</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">EQUIPMENT</h3>
          </div>
          {character.equipment && character.equipment.length ? (
            <div className="space-y-1.5">
              {character.equipment.map((e, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-body">
                    {e.qty > 1 ? `${e.qty}× ` : ''}{e.name}
                  </span>
                  {e.notes && <span className="text-[10px] text-muted-foreground/50">{e.notes}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic font-body">No equipment</p>
          )}
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border/30">
            <Coins className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <span className="text-xs font-heading text-foreground">{character.gold || 0} gp</span>
          </div>
        </div>

        {/* Spells */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ScrollText className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SPELLS</h3>
          </div>
          {character.spells && character.spells.length ? (
            <div className="flex gap-1.5 flex-wrap">
              {character.spells.map((s, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/40 text-muted-foreground font-body border border-border/30">
                  {s}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic font-body">
              {['Magic-User', 'Illusionist', 'Cleric', 'Druid'].includes(character.character_class)
                ? 'No spells known yet'
                : 'This class does not cast spells'}
            </p>
          )}
        </div>
      </div>

      {/* Appearance */}
      {character.appearance && (
        <div className="border border-border/50 rounded-lg bg-card/40 p-4 mt-5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">APPEARANCE</h3>
          </div>
          <p className="text-sm text-muted-foreground font-body italic leading-relaxed">{character.appearance}</p>
        </div>
      )}
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