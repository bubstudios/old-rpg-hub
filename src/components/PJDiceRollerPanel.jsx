import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, Dices, Crosshair, Zap, Activity, Swords } from 'lucide-react';
import { PJ_ABILITIES, PJ_DIFFICULTY, PJ_WEAPONS, PJ_ABILITY_LABELS } from '@/lib/pjRules';

export default function PJDiceRollerPanel({ myCharacter, campaignId, chapter, onRolled, onClose }) {
  const [rollType, setRollType] = useState('ability');
  const [ability, setAbility] = useState('cmd');
  const [difficulty, setDifficulty] = useState(0);
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [weapon, setWeapon] = useState('Laser Pistol');
  const [dieSides, setDieSides] = useState(10);
  const [dieCount, setDieCount] = useState(1);
  const [bonus, setBonus] = useState(0);
  const [label, setLabel] = useState('');
  const [rolling, setRolling] = useState(false);

  const scores = myCharacter.ability_scores || {};

  async function handleRoll() {
    setRolling(true);
    try {
      const payload = {
        campaign_id: campaignId,
        character_id: myCharacter.id,
        game_system: 'pathfinder',
        roll_type: rollType,
        chapter: chapter || 1
      };
      if (rollType === 'ability') {
        payload.ability = ability;
        payload.difficulty_mod = difficulty;
        if (advantage) payload.advantage = true;
        if (disadvantage) payload.disadvantage = true;
      } else if (rollType === 'damage') {
        payload.die = dieSides;
        payload.count = dieCount;
        payload.bonus = bonus;
        payload.label = label || `${dieCount}d${dieSides}`;
      } else if (rollType === 'freeform') {
        payload.sides = dieSides;
        payload.count = dieCount;
        payload.modifier = bonus;
        payload.label = label || `${dieCount}d${dieSides}`;
      }
      const res = await base44.functions.invoke('rollDice', payload);
      if (onRolled) onRolled(res.data);
    } catch (e) {
      console.error('Roll failed:', e);
    } finally {
      setRolling(false);
    }
  }

  const rollButtons = [
    { id: 'ability', label: 'Ability', icon: Activity },
    { id: 'attack', label: 'Attack', icon: Crosshair },
    { id: 'initiative', label: 'Initiative', icon: Zap },
    { id: 'damage', label: 'Damage', icon: Swords },
    { id: 'freeform', label: 'Custom', icon: Dices }
  ];

  return (
    <div className="border border-border/50 rounded-lg bg-card/40 p-3 mb-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Dices className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <span className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground">DICE ROLLER (d100)</span>
        </div>
        <button onClick={onClose} className="text-[10px] text-muted-foreground hover:text-foreground">✕</button>
      </div>

      {/* Roll type buttons */}
      <div className="flex flex-wrap gap-1.5">
        {rollButtons.map(rb => (
          <button key={rb.id} onClick={() => setRollType(rb.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-heading tracking-wide border transition-colors ${rollType === rb.id ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}>
            <rb.icon className="w-3 h-3" /> {rb.label}
          </button>
        ))}
      </div>

      {/* Ability check config */}
      {rollType === 'ability' && (
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-heading tracking-wide text-muted-foreground">ABILITY</label>
            <div className="grid grid-cols-4 gap-1 mt-1">
              {PJ_ABILITIES.map(ab => (
                <button key={ab.key} onClick={() => setAbility(ab.key)}
                  className={`px-1 py-1.5 rounded text-[10px] font-heading border transition-colors ${ability === ab.key ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}>
                  {ab.label.slice(0, 3).toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground/60 mt-1">Score: {scores[ability] || 50}</p>
          </div>
          <div>
            <label className="text-[10px] font-heading tracking-wide text-muted-foreground">DIFFICULTY</label>
            <select value={difficulty} onChange={e => setDifficulty(Number(e.target.value))} className="w-full mt-1 bg-background/60 border border-input rounded px-2 py-1 text-xs font-body text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              {PJ_DIFFICULTY.map(d => <option key={d.label} value={d.mod}>{d.label} ({d.mod > 0 ? '+' : ''}{d.mod})</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setAdvantage(!advantage); setDisadvantage(false); }}
              className={`flex-1 px-2 py-1 rounded text-[10px] font-heading border transition-colors ${advantage ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}>
              Advantage
            </button>
            <button onClick={() => { setDisadvantage(!disadvantage); setAdvantage(false); }}
              className={`flex-1 px-2 py-1 rounded text-[10px] font-heading border transition-colors ${disadvantage ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}>
              Disadvantage
            </button>
          </div>
        </div>
      )}

      {/* Damage config */}
      {(rollType === 'damage' || rollType === 'freeform') && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-heading tracking-wide text-muted-foreground">DICE</label>
              <input type="number" min={1} max={100} value={dieSides} onChange={e => setDieSides(Number(e.target.value) || 6)} className="w-full mt-1 bg-background/60 border border-input rounded px-2 py-1 text-xs font-body text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-[10px] font-heading tracking-wide text-muted-foreground">COUNT</label>
              <input type="number" min={1} max={20} value={dieCount} onChange={e => setDieCount(Number(e.target.value) || 1)} className="w-full mt-1 bg-background/60 border border-input rounded px-2 py-1 text-xs font-body text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-[10px] font-heading tracking-wide text-muted-foreground">{rollType === 'damage' ? 'BONUS' : 'MOD'}</label>
              <input type="number" value={bonus} onChange={e => setBonus(Number(e.target.value) || 0)} className="w-full mt-1 bg-background/60 border border-input rounded px-2 py-1 text-xs font-body text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          {rollType === 'damage' && (
            <div>
              <label className="text-[10px] font-heading tracking-wide text-muted-foreground">QUICK WEAPONS</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.keys(PJ_WEAPONS).map(w => {
                  const wd = PJ_WEAPONS[w];
                  return (
                    <button key={w} onClick={() => { setDieSides(wd.die); setDieCount(wd.count); setBonus(wd.bonus); setLabel(w); }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-body border transition-colors ${label === w ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}>
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (optional)" className="w-full bg-background/60 border border-input rounded px-2 py-1 text-xs font-body text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
      )}

      {rollType === 'attack' && (
        <p className="text-[10px] text-muted-foreground font-body">Attack roll: d100 vs Combat/2 + skill bonus. The DM will interpret the result.</p>
      )}
      {rollType === 'initiative' && (
        <p className="text-[10px] text-muted-foreground font-body">Initiative: ATH/10 + d10. Score: {scores.ath || 50} (mod +{Math.floor((scores.ath || 50) / 10)})</p>
      )}

      <Button onClick={handleRoll} disabled={rolling} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        {rolling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Dices className="w-4 h-4 mr-1.5" />} Roll
      </Button>
    </div>
  );
}