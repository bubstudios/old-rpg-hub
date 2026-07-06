import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dices, Swords, Activity, Zap, X, Atom, Heart } from 'lucide-react';
import { toast } from 'sonner';

const DICE = [4, 6, 8, 10, 12, 20, 100];
const GW_ABILITIES = [
  { key: 'ps', label: 'PS' }, { key: 'ms', label: 'MS' }, { key: 'dx', label: 'DX' }, { key: 'cn', label: 'CN' },
  { key: 'in', label: 'IN' }, { key: 'ch', label: 'CH' }, { key: 'sn', label: 'SN' }
];

export default function GWDiceRollerPanel({ myCharacter, campaignId, chapter, onRolled, onClose }) {
  const [rollType, setRollType] = useState('attack');
  const [ranged, setRanged] = useState(true);
  const [ability, setAbility] = useState('dx');
  const [dmgDie, setDmgDie] = useState(6);
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
      const res = await base44.functions.invoke('rollDice', { ...payload, game_system: 'gammaworld' });
      onRolled?.(res.data);
    } catch (e) {
      toast.error('Roll failed: ' + (e.response?.data?.error || e.message));
    } finally {
      setRolling(false);
    }
  }

  const base = { campaign_id: campaignId, character_id: myCharacter.id, chapter };
  const rollAttack = () => roll({ ...base, roll_type: 'attack', ranged });
  const rollAbility = (ab) => roll({ ...base, roll_type: 'ability', ability: ab });
  const rollInitiative = () => roll({ ...base, roll_type: 'initiative' });
  const rollMorale = () => roll({ ...base, roll_type: 'morale' });
  const rollDamage = () => roll({ ...base, roll_type: 'damage', die: dmgDie, count: dmgCount, bonus: dmgBonus });
  const rollQuick = () => roll({ ...base, roll_type: 'freeform', sides: qSides, count: qCount, modifier: qMod, label: qLabel });

  return (
    <div className="mb-3 rounded-lg border border-border/50 bg-card/60 p-3 animate-ink">
      <div className="flex items-center gap-1 mb-3">
        <span className="px-2 py-1 rounded text-[11px] font-heading tracking-wide bg-primary/15 text-primary flex items-center gap-1">
          <Atom className="w-3 h-3" /> Gamma World
        </span>
        <button onClick={onClose} className="ml-auto p-1 text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1.5 mb-3">
        <RollTypeBtn active={rollType === 'attack'} onClick={() => setRollType('attack')} icon={Swords} label="Attack" />
        <RollTypeBtn active={rollType === 'ability'} onClick={() => setRollType('ability')} icon={Activity} label="Check" />
        <RollTypeBtn active={rollType === 'initiative'} onClick={() => setRollType('initiative')} icon={Zap} label="Init" />
        <RollTypeBtn active={rollType === 'morale'} onClick={() => setRollType('morale')} icon={Heart} label="Morale" />
        <RollTypeBtn active={rollType === 'damage'} onClick={() => setRollType('damage')} icon={Dices} label="Damage" />
      </div>

      {rollType === 'attack' && (
        <div className="space-y-2">
          <div className="flex gap-1.5">
            <ToggleBtn active={ranged} onClick={() => setRanged(true)} label="Ranged (DX)" />
            <ToggleBtn active={!ranged} onClick={() => setRanged(false)} label="Melee (PS)" />
          </div>
          <Button onClick={rollAttack} disabled={rolling} size="sm" className="w-full bg-primary text-primary-foreground">
            <Dices className="w-3.5 h-3.5" /> Roll Attack (d20)
          </Button>
          <p className="text-[10px] text-muted-foreground/60 font-body">Roll d20 + ability modifier. The GM determines the target AC to beat (lower AC is harder).</p>
        </div>
      )}

      {rollType === 'ability' && (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-1.5">
            {GW_ABILITIES.map((a) => (
              <DieBtn key={a.key} active={ability === a.key} onClick={() => setAbility(a.key)} label={a.label} />
            ))}
          </div>
          <Button onClick={() => rollAbility(ability)} disabled={rolling} size="sm" className="w-full bg-primary text-primary-foreground">
            <Dices className="w-3.5 h-3.5" /> Roll {GW_ABILITIES.find(a => a.key === ability)?.label} (d20)
          </Button>
          <p className="text-[10px] text-muted-foreground/60 font-body">Roll d20 — success if you roll equal to or under your ability score.</p>
        </div>
      )}

      {rollType === 'initiative' && (
        <div className="space-y-2">
          <Button onClick={rollInitiative} disabled={rolling} size="sm" className="w-full bg-primary text-primary-foreground">
            <Dices className="w-3.5 h-3.5" /> Roll Initiative (d10)
          </Button>
          <p className="text-[10px] text-muted-foreground/60 font-body">Initiative = d10 + DX modifier. Higher acts first.</p>
        </div>
      )}

      {rollType === 'morale' && (
        <div className="space-y-2">
          <Button onClick={rollMorale} disabled={rolling} size="sm" className="w-full bg-primary text-primary-foreground">
            <Dices className="w-3.5 h-3.5" /> Roll Morale (d10)
          </Button>
          <p className="text-[10px] text-muted-foreground/60 font-body">Morale = d10 + CH modifier. NPCs check when first bloodied or leader falls.</p>
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

      {/* Quick roll */}
      <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
        <p className="text-[9px] font-heading tracking-wide text-muted-foreground/60">QUICK ROLL</p>
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
    </div>
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