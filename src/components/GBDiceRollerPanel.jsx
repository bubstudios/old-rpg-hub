import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Dices, Ghost, Skull, X, Star } from 'lucide-react';
import { ABILITIES, ALL_SKILLS, SKILLS_BY_ATTR, TARGET_NUMBERS } from '@/lib/gbRules';
import { toast } from 'sonner';

const DICE = [4, 6, 8, 10, 12, 20, 100];

export default function GBDiceRollerPanel({ myCharacter, campaignId, chapter, onRolled, onClose }) {
  const [rollType, setRollType] = useState('trait');
  const [attr, setAttr] = useState('brain');
  const [skillName, setSkillName] = useState('');
  const [tn, setTn] = useState(10);
  const [bonusBP, setBonusBP] = useState(0);
  const [dmgCount, setDmgCount] = useState(2);
  const [qSides, setQSides] = useState(6);
  const [qCount, setQCount] = useState(1);
  const [qMod, setQMod] = useState(0);
  const [qLabel, setQLabel] = useState('');
  const [rolling, setRolling] = useState(false);

  async function roll(payload) {
    setRolling(true);
    try {
      const res = await base44.functions.invoke('rollDice', { ...payload, game_system: 'ghostbusters' });
      onRolled?.(res.data);
    } catch (e) {
      toast.error('Roll failed: ' + (e.response?.data?.error || e.message));
    } finally {
      setRolling(false);
    }
  }

  const base = { campaign_id: campaignId, character_id: myCharacter.id, chapter };
  const scores = myCharacter?.ability_scores || {};
  const attrDice = scores[attr] || 3;
  const skillObj = (myCharacter?.skills || []).find(s => s.name === skillName);
  const skillDice = skillObj ? Number(skillObj.level) || 0 : 0;
  const availableSkills = (myCharacter?.skills || []).map(s => s.name);

  const rollTrait = () => roll({ ...base, roll_type: 'trait', attribute: attr, skill: skillName || null, skill_dice: skillDice, bonus_dice: bonusBP, target_number: tn });
  const rollGhost = () => roll({ ...base, roll_type: 'ghost' });
  const rollDamage = () => roll({ ...base, roll_type: 'damage', count: dmgCount });
  const rollQuick = () => roll({ ...base, roll_type: 'freeform', sides: qSides, count: qCount, modifier: qMod, label: qLabel });

  return (
    <div className="mb-3 rounded-lg border border-border/50 bg-card/60 p-3 animate-ink">
      <div className="flex items-center gap-1 mb-3">
        <span className="px-2 py-1 rounded text-[11px] font-heading tracking-wide bg-primary/15 text-primary flex items-center gap-1">
          <Ghost className="w-3 h-3" /> Ghostbusters
        </span>
        <button onClick={onClose} className="ml-auto p-1 text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-1.5 mb-3">
        <RollTypeBtn active={rollType === 'trait'} onClick={() => setRollType('trait')} icon={Dices} label="Trait" />
        <RollTypeBtn active={rollType === 'ghost'} onClick={() => setRollType('ghost')} icon={Ghost} label="Ghost Die" />
        <RollTypeBtn active={rollType === 'damage'} onClick={() => setRollType('damage')} icon={Skull} label="Damage" />
        <RollTypeBtn active={rollType === 'freeform'} onClick={() => setRollType('freeform')} icon={Star} label="Quick" />
      </div>

      {rollType === 'trait' && (
        <div className="space-y-2">
          <div>
            <p className="text-[9px] font-heading tracking-wide text-muted-foreground/60 mb-1">ATTRIBUTE</p>
            <div className="grid grid-cols-4 gap-1.5">
              {ABILITIES.map((a) => (
                <DieBtn key={a.key} active={attr === a.key} onClick={() => setAttr(a.key)} label={`${a.short}`} />
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground/60 font-body mt-1">{attrDice}d6 from {ABILITIES.find(a => a.key === attr)?.name}</p>
          </div>
          <div>
            <p className="text-[9px] font-heading tracking-wide text-muted-foreground/60 mb-1">TAG SKILL (optional)</p>
            <select value={skillName} onChange={(e) => setSkillName(e.target.value)} className="w-full bg-input/60 border border-border/50 rounded px-2 py-1.5 text-sm text-foreground">
              <option value="">— None —</option>
              {availableSkills.map((s) => (
                <option key={s} value={s}>{s} (+{skillObj && skillObj.name === s ? skillObj.level : 0}d6)</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 items-end">
            <NumField label="BONUS BP DICE" value={bonusBP} onChange={setBonusBP} />
            <NumField label="TARGET NUMBER" value={tn} onChange={setTn} />
          </div>
          <Button onClick={rollTrait} disabled={rolling} size="sm" className="w-full bg-primary text-primary-foreground">
            <Dices className="w-3.5 h-3.5" /> Roll {attrDice + skillDice + bonusBP}d6 vs TN {tn}
          </Button>
          <p className="text-[10px] text-muted-foreground/60 font-body">Roll (attribute + skill + bonus) d6 — one die is the Ghost Die (6 = ghost, counts 0). Sum the dice and beat the Target Number. Easy 5 · Moderate 10 · Hard 15 · Very Hard 20.</p>
        </div>
      )}

      {rollType === 'ghost' && (
        <div className="space-y-2">
          <Button onClick={rollGhost} disabled={rolling} size="sm" className="w-full bg-primary text-primary-foreground">
            <Ghost className="w-3.5 h-3.5" /> Roll the Ghost Die
          </Button>
          <p className="text-[10px] text-muted-foreground/60 font-body">Roll 1d6 — on a 6, a Ghost appears (counts as 0 on the roll and summons a supernatural complication). Otherwise it's a normal die.</p>
        </div>
      )}

      {rollType === 'damage' && (
        <div className="space-y-2">
          <NumField label="NUMBER OF D6" value={dmgCount} onChange={setDmgCount} />
          <Button onClick={rollDamage} disabled={rolling} size="sm" className="w-full bg-primary text-primary-foreground">
            <Skull className="w-3.5 h-3.5" /> Roll {dmgCount}d6 Damage
          </Button>
          <p className="text-[10px] text-muted-foreground/60 font-body">Ghost attacks and slime deal damage in d6s. Subtract from the target's Brownie Points. At 0 BP, they're slimed and out of the scene.</p>
        </div>
      )}

      {rollType === 'freeform' && (
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

function RollTypeBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 py-2 rounded text-[10px] font-heading tracking-wide border transition-colors ${active ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}>
      <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
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