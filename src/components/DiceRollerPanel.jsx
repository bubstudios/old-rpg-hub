import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dices, Swords, Shield, Activity, Zap, X } from 'lucide-react';
import { toast } from 'sonner';

const DICE = [4, 6, 8, 10, 12, 20, 100];
const SAVES = [
  { key: 'poison_death', label: 'Poison / Death' },
  { key: 'wand', label: 'Rod / Staff / Wand' },
  { key: 'petrification', label: 'Petrify / Polymorph' },
  { key: 'breath', label: 'Breath Weapon' },
  { key: 'spell', label: 'Spell' }
];
const ABILITIES = [
  { key: 'str', label: 'STR' }, { key: 'int', label: 'INT' }, { key: 'wis', label: 'WIS' },
  { key: 'dex', label: 'DEX' }, { key: 'con', label: 'CON' }, { key: 'cha', label: 'CHA' }
];

export default function DiceRollerPanel({ myCharacter, campaignId, chapter, onRolled, onClose }) {
  const [mode, setMode] = useState('character');
  const [rollType, setRollType] = useState('attack');
  const [ranged, setRanged] = useState(false);
  const [targetAc, setTargetAc] = useState('');
  const [dmgDie, setDmgDie] = useState(8);
  const [dmgCount, setDmgCount] = useState(1);
  const [dmgBonus, setDmgBonus] = useState(0);
  const [qSides, setQSides] = useState(20);
  const [qCount, setQCount] = useState(1);
  const [qMod, setQMod] = useState(0);
  const [qLabel, setQLabel] = useState('');
  const [rolling, setRolling] = useState(false);

  async function roll(payload) {
    setRolling(true);
    try {
      const res = await base44.functions.invoke('rollDice', payload);
      onRolled?.(res.data);
    } catch (e) {
      toast.error('Roll failed: ' + (e.response?.data?.error || e.message));
    } finally {
      setRolling(false);
    }
  }

  const base = { campaign_id: campaignId, character_id: myCharacter.id, chapter };
  const rollAttack = () => roll({ ...base, roll_type: 'attack', ranged, target_ac: targetAc ? Number(targetAc) : null });
  const rollSave = (category) => roll({ ...base, roll_type: 'save', category });
  const rollAbility = (ability) => roll({ ...base, roll_type: 'ability', ability });
  const rollDamage = () => roll({ ...base, roll_type: 'damage', die: dmgDie, count: dmgCount, bonus: dmgBonus });
  const rollQuick = () => roll({ ...base, roll_type: 'freeform', sides: qSides, count: qCount, modifier: qMod, label: qLabel });

  return (
    <div className="mb-3 rounded-lg border border-border/50 bg-card/60 p-3 animate-ink">
      <div className="flex items-center gap-1 mb-3">
        <ModeTab active={mode === 'character'} onClick={() => setMode('character')} label="Character" />
        <ModeTab active={mode === 'quick'} onClick={() => setMode('quick')} label="Quick" />
        <button onClick={onClose} className="ml-auto p-1 text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {mode === 'character' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-1.5">
            <RollTypeBtn active={rollType === 'attack'} onClick={() => setRollType('attack')} icon={Swords} label="Attack" />
            <RollTypeBtn active={rollType === 'save'} onClick={() => setRollType('save')} icon={Shield} label="Save" />
            <RollTypeBtn active={rollType === 'ability'} onClick={() => setRollType('ability')} icon={Activity} label="Check" />
            <RollTypeBtn active={rollType === 'damage'} onClick={() => setRollType('damage')} icon={Zap} label="Damage" />
          </div>

          {rollType === 'attack' && (
            <div className="space-y-2">
              <div className="flex gap-1.5">
                <ToggleBtn active={!ranged} onClick={() => setRanged(false)} label="Melee" />
                <ToggleBtn active={ranged} onClick={() => setRanged(true)} label="Ranged" />
              </div>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <p className="text-[9px] font-heading tracking-wide text-muted-foreground/60 mb-0.5">TARGET AC</p>
                  <input type="number" value={targetAc} onChange={(e) => setTargetAc(e.target.value)} placeholder="optional" className="w-full bg-input/60 border border-border/50 rounded px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/40" />
                </div>
                <Button onClick={rollAttack} disabled={rolling} size="sm" className="bg-primary text-primary-foreground">
                  <Dices className="w-3.5 h-3.5" /> Roll
                </Button>
              </div>
            </div>
          )}

          {rollType === 'save' && (
            <div className="grid grid-cols-1 gap-1.5">
              {SAVES.map((s) => (
                <Button key={s.key} onClick={() => rollSave(s.key)} disabled={rolling} variant="outline" size="sm" className="justify-start border-border/50">
                  <Shield className="w-3 h-3 mr-1.5 text-primary/60" /> {s.label}
                </Button>
              ))}
            </div>
          )}

          {rollType === 'ability' && (
            <div className="grid grid-cols-3 gap-1.5">
              {ABILITIES.map((a) => (
                <Button key={a.key} onClick={() => rollAbility(a.key)} disabled={rolling} variant="outline" size="sm" className="border-border/50">
                  {a.label}
                </Button>
              ))}
            </div>
          )}

          {rollType === 'damage' && (
            <div className="space-y-2">
              <div className="flex gap-1.5 flex-wrap">
                {DICE.map((d) => (
                  <DieBtn key={d} active={dmgDie === d} onClick={() => setDmgDie(d)} label={`d${d}`} />
                ))}
              </div>
              <div className="flex gap-2 items-end">
                <NumField label="DICE" value={dmgCount} onChange={setDmgCount} />
                <NumField label="BONUS" value={dmgBonus} onChange={setDmgBonus} />
                <Button onClick={rollDamage} disabled={rolling} size="sm" className="bg-primary text-primary-foreground">
                  <Dices className="w-3.5 h-3.5" /> Roll
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-1.5 flex-wrap">
            {DICE.map((d) => (
              <DieBtn key={d} active={qSides === d} onClick={() => setQSides(d)} label={`d${d}`} />
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <NumField label="COUNT" value={qCount} onChange={setQCount} />
            <NumField label="MOD" value={qMod} onChange={setQMod} />
          </div>
          <input value={qLabel} onChange={(e) => setQLabel(e.target.value)} placeholder="Label (optional)" className="w-full bg-input/60 border border-border/50 rounded px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/40" />
          <Button onClick={rollQuick} disabled={rolling} size="sm" className="w-full bg-primary text-primary-foreground">
            <Dices className="w-3.5 h-3.5" /> Roll {qCount}d{qSides}{qMod ? (qMod > 0 ? `+${qMod}` : qMod) : ''}
          </Button>
        </div>
      )}
    </div>
  );
}

function ModeTab({ active, onClick, label }) {
  return (
    <button onClick={onClick} className={`px-3 py-1 rounded text-[11px] font-heading tracking-wide transition-colors ${active ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
      {label}
    </button>
  );
}
function RollTypeBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 py-2 rounded text-[10px] font-heading tracking-wide border transition-colors ${active ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}>
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
      {label}
    </button>
  );
}
function ToggleBtn({ active, onClick, label }) {
  return (
    <button onClick={onClick} className={`flex-1 py-1.5 rounded text-[11px] font-heading tracking-wide border transition-colors ${active ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}>
      {label}
    </button>
  );
}
function DieBtn({ active, onClick, label }) {
  return (
    <button onClick={onClick} className={`px-2.5 py-1 rounded text-[11px] font-heading border transition-colors ${active ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}>
      {label}
    </button>
  );
}
function NumField({ label, value, onChange }) {
  return (
    <div className="flex-1">
      <p className="text-[9px] font-heading tracking-wide text-muted-foreground/60 mb-0.5">{label}</p>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-input/60 border border-border/50 rounded px-2 py-1.5 text-sm text-foreground" />
    </div>
  );
}