import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Heart, Rocket, Coins, Package, Star, Sparkles, BookOpen, Download } from 'lucide-react';
import ExportCharacterButton from '@/components/ExportCharacterButton';
import { PJ_ABILITIES } from '@/lib/pjRules';

export default function PJCharacterSheet({ character, campaignId }) {
  const navigate = useNavigate();
  const { id: campId } = useParams();
  const cid = campaignId || campId;

  const scores = character.ability_scores || {};
  const hpPct = character.hp_max > 0 ? (character.hp_current / character.hp_max) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(`/campaign/${cid}`)} className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
      </button>

      {/* Header */}
      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-700 text-2xl text-foreground tracking-wide">{character.name}</h1>
            <p className="text-sm text-muted-foreground font-body mt-0.5">
              {character.race} · {character.character_class} · Level {character.level}
            </p>
            {character.background && (
              <p className="text-sm text-foreground/80 font-body italic mt-2 max-w-xl leading-relaxed">{character.background}</p>
            )}
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <ExportCharacterButton character={character} campaignId={cid} />
            <span className={`text-[10px] font-heading tracking-[0.15em] px-2 py-1 rounded ${
              character.status === 'active' ? 'bg-emerald-900/30 text-emerald-400' :
              character.status === 'dead' ? 'bg-red-950/50 text-red-400' : 'bg-secondary text-muted-foreground'
            }`}>{character.status?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Vitality bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground flex items-center gap-1">
            <Heart className="w-3 h-3" /> VITALITY
          </span>
          <span className="text-[10px] font-heading text-muted-foreground tabular-nums">{character.hp_current} / {character.hp_max}</span>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden border border-border/40">
          <div className={`h-full rounded-full transition-all duration-500 ${hpPct > 60 ? 'bg-emerald-700' : hpPct > 30 ? 'bg-amber-700' : 'bg-red-800'}`} style={{ width: `${Math.max(0, hpPct)}%` }} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {/* Ability Scores */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">ABILITIES (d100)</h3>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {PJ_ABILITIES.map(ab => {
              const val = scores[ab.key];
              if (val === undefined || val === null) return null;
              return (
                <div key={ab.key} className="text-center p-2 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-[9px] font-heading tracking-[0.1em] text-muted-foreground">{ab.label.slice(0, 3).toUpperCase()}</p>
                  <p className="font-heading font-700 text-lg text-foreground tabular-nums">{val}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Credits & Level */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">STATUS</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-body">Level</span>
              <span className="font-heading font-600 text-foreground">{character.level}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-body">XP</span>
              <span className="font-heading font-600 text-foreground tabular-nums">{character.xp || 0}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <span className="flex items-center gap-1 text-muted-foreground font-body"><Coins className="w-3 h-3" /> Credits</span>
              <span className="font-heading font-600 text-primary tabular-nums">{character.gold || 0}</span>
            </div>
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
                  <span className="text-muted-foreground font-body">{e.qty > 1 ? `${e.qty}× ` : ''}{e.name}</span>
                  {e.notes && <span className="text-[10px] text-muted-foreground/50">{e.notes}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic font-body">No equipment</p>
          )}
        </div>

        {/* Skills */}
        <div className="border border-border/50 rounded-lg bg-card/40 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Rocket className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
            <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">SKILLS</h3>
          </div>
          {character.skills && character.skills.length ? (
            <div className="flex gap-1.5 flex-wrap">
              {character.skills.map((s, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/40 text-muted-foreground font-body border border-border/30">
                  {s.name} {s.level > 0 ? `L${s.level}` : ''}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground/50 italic font-body">No skills</p>
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