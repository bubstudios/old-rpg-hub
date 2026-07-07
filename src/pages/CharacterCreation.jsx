import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  RACES, CLASSES, ALIGNMENTS, STARTING_EQUIPMENT, STARTING_GOLD,
  rollAbilityScores, applyRacialAdjustments, classAvailableToRace,
  meetsClassRequirements, validAlignmentForClass, computeAC, getTHAC0
} from '@/lib/dndRules';
import { SJ_RACES } from '@/lib/sjRules';
import { DS_RACES } from '@/lib/dsRules';
import { Dices, ChevronLeft, ChevronRight, Check, Loader2, Swords, Sparkles, Diamond, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import SFCharacterCreation from '@/pages/SFCharacterCreation';
import GWCharacterCreation from '@/pages/GWCharacterCreation';
import BHCharacterCreation from '@/pages/BHCharacterCreation';
import IJCharacterCreation from '@/pages/IJCharacterCreation';
import ImportCharacterSheetForm from '@/components/ImportCharacterSheetForm';

const STEPS = ['Race', 'Class', 'Ability Scores', 'Alignment', 'Identity', 'Review'];

export default function CharacterCreation() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const [gameSystem, setGameSystem] = useState(null);

  useEffect(() => {
    base44.functions.invoke('campaignData', { op: 'load', campaign_id: campaignId })
      .then(res => setGameSystem(res.data.campaign.game_system || 'add1e'))
      .catch(() => setGameSystem('add1e'));
  }, [campaignId]);

  const [step, setStep] = useState(0);
  const [race, setRace] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [rawScores, setRawScores] = useState(null);
  const [scoresRolled, setScoresRolled] = useState(false);
  const [alignment, setAlignment] = useState('');
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [background, setBackground] = useState('');
  const [creating, setCreating] = useState(false);
  const [level, setLevel] = useState(1);
  const [importMode, setImportMode] = useState(false);

  if (gameSystem === 'starfrontiers') return <SFCharacterCreation />;
  if (gameSystem === 'gammaworld') return <GWCharacterCreation />;
  if (gameSystem === 'boothill') return <BHCharacterCreation />;
  if (gameSystem === 'indianajones') return <IJCharacterCreation />;
  if (!gameSystem) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
      </div>
    );
  }

  if (importMode) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => setImportMode(false)}
          className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Character Builder
        </button>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-primary" strokeWidth={1.5} />
          <h1 className="font-heading font-700 text-lg text-foreground tracking-wide">IMPORT CHARACTER SHEET</h1>
        </div>
        <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 sm:p-8">
          <ImportCharacterSheetForm campaignId={campaignId} onCreated={() => navigate(`/campaign/${campaignId}`)} onCancel={() => setImportMode(false)} />
        </div>
      </div>
    );
  }

  const raceList = gameSystem === 'spelljammer' ? { ...RACES, ...SJ_RACES } : gameSystem === 'darksun' ? { ...RACES, ...DS_RACES } : RACES;
  const adjustedScores = rawScores && race ? (() => {
    const adj = raceList[race]?.abilityAdjustments || {};
    const r = { ...rawScores };
    Object.entries(adj).forEach(([k, v]) => { r[k] = (r[k] || 0) + v; });
    return r;
  })() : rawScores;
  const previewHP = (() => {
    if (!adjustedScores || !characterClass) return 0;
    const conMod = Math.floor((adjustedScores.con - 10) / 2);
    const hitDie = CLASSES[characterClass]?.hitDie || 6;
    const avg = Math.floor(hitDie / 2) + 1;
    let hp = Math.max(1, hitDie + conMod);
    for (let l = 2; l <= level; l++) hp += Math.max(1, avg + conMod);
    return hp;
  })();

  function handleRollScores() {
    setRawScores(rollAbilityScores());
    setScoresRolled(true);
  }

  const classOptions = race ? raceList[race].classes : Object.keys(CLASSES);
  const meetsReqs = characterClass && adjustedScores ? meetsClassRequirements(characterClass, adjustedScores) : true;
  const validAlignment = characterClass && alignment ? validAlignmentForClass(characterClass, alignment) : true;
  const allowedAlignments = characterClass ? (ALIGNMENTS.filter(a => validAlignmentForClass(characterClass, a))) : ALIGNMENTS;

  const canProceed = [
    !!race,
    !!characterClass && raceList[race]?.classes?.includes(characterClass) && meetsReqs,
    !!adjustedScores,
    !!alignment && validAlignment,
    !!name.trim(),
    true
  ][step];

  async function handleCreate() {
    setCreating(true);
    try {
      const equipment = STARTING_EQUIPMENT[characterClass] || [];
      const gold = STARTING_GOLD[characterClass] || 0;
      const res = await base44.functions.invoke('campaignData', {
        op: 'createCharacter',
        campaign_id: campaignId,
        game_system: gameSystem,
        name: name.trim(),
        race,
        character_class: characterClass,
        alignment,
        level,
        ability_scores: adjustedScores,
        equipment,
        gold,
        spells: [],
        spell_slots: {},
        appearance,
        background
      });
      toast.success(`${name} enters the realm!`);
      navigate(`/campaign/${campaignId}`);
    } catch (e) {
      toast.error('Failed to create character: ' + (e.response?.data?.error || e.message));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/campaign/${campaignId}`)}
          className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
        </button>
        <button
          onClick={() => setImportMode(true)}
          className="flex items-center gap-1 text-[11px] font-heading tracking-wide text-primary/70 hover:text-primary transition-colors"
        >
          <FileText className="w-3.5 h-3.5" /> Import a sheet instead
        </button>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-heading font-700 border-2 transition-all ${
                i < step ? 'bg-primary border-primary text-primary-foreground' :
                i === step ? 'border-primary text-primary bg-primary/10' :
                'border-border text-muted-foreground/50'
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[9px] font-heading tracking-wide hidden sm:block ${i === step ? 'text-primary' : 'text-muted-foreground/60'}`}>
                {s.toUpperCase()}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 sm:p-8 min-h-[320px]">
        {/* Step 1: Race */}
        {step === 0 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Dices className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR RACE</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {Object.entries(raceList).map(([r, data]) => (
                <button
                  key={r}
                  onClick={() => { setRace(r); setCharacterClass(''); }}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    race === r ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'
                  }`}
                >
                  <p className="font-heading font-600 text-sm text-foreground">{r}</p>
                  <p className="text-[11px] text-muted-foreground font-body mt-1 leading-relaxed">{data.description}</p>
                  {Object.keys(data.abilityAdjustments).length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {Object.entries(data.abilityAdjustments).map(([ab, mod]) => (
                        <span key={ab} className={`text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded ${mod > 0 ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-950/40 text-red-400'}`}>
                          {ab.toUpperCase()} {mod > 0 ? '+' : ''}{mod}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Class */}
        {step === 1 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Swords className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR CLASS</h2>
            </div>
            <p className="text-[11px] text-muted-foreground font-body mb-3">
              As a {race}, you may pursue: {raceList[race].classes.join(', ')}
            </p>
            <div className="grid gap-2.5 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
              {classOptions.map((c) => {
                const data = CLASSES[c];
                const available = raceList[race]?.classes?.includes(c);
                return (
                  <button
                    key={c}
                    disabled={!available}
                    onClick={() => setCharacterClass(c)}
                    className={`text-left p-3.5 rounded-lg border transition-all ${
                      !available ? 'border-border/20 opacity-40 cursor-not-allowed' :
                      characterClass === c ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-heading font-600 text-sm text-foreground">{c}</p>
                      <span className="text-[9px] font-heading tracking-wide text-primary/70">d{data.hitDie} HP</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-body mt-1 leading-relaxed">{data.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Ability Scores */}
        {step === 2 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Diamond className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">ROLL ABILITY SCORES</h2>
            </div>
            <p className="text-[11px] text-muted-foreground font-body mb-4">
              Per 1st Edition rules, roll 3d6 in order for each ability. Racial adjustments are applied automatically.
            </p>
            {!scoresRolled ? (
              <button
                onClick={handleRollScores}
                className="w-full py-8 rounded-lg border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-2"
              >
                <Dices className="w-8 h-8 text-primary animate-flicker" strokeWidth={1.2} />
                <span className="font-heading text-sm tracking-wide text-primary">ROLL THE DICE</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['str', 'int', 'wis', 'dex', 'con', 'cha'].map((ab) => {
                    const raw = rawScores[ab];
                    const adjusted = adjustedScores[ab];
                    const adj = race ? raceList[race].abilityAdjustments[ab] || 0 : 0;
                    const reqs = characterClass ? (requirementForClass(characterClass, ab)) : null;
                    const meets = reqs ? adjusted >= reqs : true;
                    return (
                      <div key={ab} className={`p-3 rounded-lg border ${meets ? 'border-border/40 bg-card/40' : 'border-red-800/40 bg-red-950/10'}`}>
                        <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground">{ab.toUpperCase()}</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="font-heading font-700 text-2xl text-foreground tabular-nums">{adjusted}</span>
                          {adj !== 0 && (
                            <span className="text-[10px] text-muted-foreground">({raw}{adj > 0 ? '+' : ''}{adj})</span>
                          )}
                          {reqs && (
                            <span className={`text-[9px] ml-auto ${meets ? 'text-muted-foreground/60' : 'text-red-400'}`}>
                              need {reqs}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!meetsReqs && (
                  <div className="p-3 rounded-lg bg-red-950/20 border border-red-800/40">
                    <p className="text-[11px] text-red-300 font-body">
                      ⚠ Your scores do not meet the minimum requirements for {characterClass}. You may reroll or choose another class.
                    </p>
                  </div>
                )}
                <Button onClick={handleRollScores} variant="outline" className="w-full border-primary/40 text-primary">
                  <Dices className="w-4 h-4 mr-1.5" /> Reroll All Scores
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Alignment */}
        {step === 3 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR ALIGNMENT</h2>
            </div>
            {characterClass && CLASSES[characterClass] && (
              <p className="text-[11px] text-muted-foreground font-body mb-3">
                {ALIGNMENTS.filter(a => !validAlignmentForClass(characterClass, a)).length > 0
                  ? `${characterClass}s are restricted to certain alignments.`
                  : 'Any alignment is permitted.'}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ALIGNMENTS.map((a) => {
                const allowed = validAlignmentForClass(characterClass, a);
                return (
                  <button
                    key={a}
                    disabled={!allowed}
                    onClick={() => setAlignment(a)}
                    className={`p-2.5 rounded-lg border text-center transition-all ${
                      !allowed ? 'border-border/20 opacity-30 cursor-not-allowed' :
                      alignment === a ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'
                    }`}
                  >
                    <p className="text-[11px] font-heading font-600 text-foreground leading-tight">{a}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Identity */}
        {step === 4 && (
          <div className="animate-ink space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">IDENTITY &amp; EXPERIENCE</h2>
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">STARTING LEVEL</label>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <div className="flex items-center border border-input rounded-md bg-background/60">
                  <button type="button" onClick={() => setLevel(Math.max(1, level - 1))} className="px-3 py-1.5 text-muted-foreground hover:text-primary text-sm">−</button>
                  <input type="number" min={1} max={20} value={level} onChange={(e) => setLevel(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} className="w-12 text-center bg-transparent font-heading font-700 text-foreground focus:outline-none" />
                  <button type="button" onClick={() => setLevel(Math.min(20, level + 1))} className="px-3 py-1.5 text-muted-foreground hover:text-primary text-sm">+</button>
                </div>
                <div className="flex gap-1.5">
                  {[1, 3, 5, 10].map((lv) => (
                    <button key={lv} type="button" onClick={() => setLevel(lv)} className={`px-2.5 py-1 rounded text-[11px] font-heading border transition-colors ${level === lv ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}>L{lv}</button>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/60 font-body mt-1.5">Begin at level 1 for a classic crawl, or start higher for seasoned heroes. Hit points, THAC0, and saves scale to your chosen level.</p>
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">CHARACTER NAME</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aldric the Bold"
                className="mt-1 bg-background/60 font-heading"
                maxLength={40}
              />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">APPEARANCE</label>
              <textarea
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                placeholder="Tall and weathered, with a scar across his left eye..."
                className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                maxLength={300}
              />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">BACKGROUND</label>
              <textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="A former soldier turned mercenary, seeking redemption..."
                className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                maxLength={500}
              />
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {step === 5 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">REVIEW &amp; CONFIRM</h2>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">NAME</p>
                  <p className="font-heading font-600 text-foreground mt-0.5">{name}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">RACE / CLASS</p>
                  <p className="font-heading font-600 text-foreground mt-0.5">{race} {characterClass}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">ABILITY SCORES</p>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(adjustedScores).map(([ab, val]) => (
                    <span key={ab} className="text-xs font-heading text-foreground">
                      <span className="text-muted-foreground">{ab.toUpperCase()}</span> {val}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">HP</p>
                  <p className="font-heading font-700 text-lg text-foreground">{previewHP}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">AC</p>
                  <p className="font-heading font-700 text-lg text-foreground">{computeAC(STARTING_EQUIPMENT[characterClass] || [])}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">THAC0</p>
                  <p className="font-heading font-700 text-lg text-foreground">{getTHAC0(characterClass, level)}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">STARTING EQUIPMENT</p>
                <div className="flex gap-1.5 flex-wrap">
                  {(STARTING_EQUIPMENT[characterClass] || []).map((e, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-background/40 text-muted-foreground font-body">{e.name}</span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground">ALIGNMENT</p>
                <p className="font-heading font-600 text-foreground mt-0.5">{alignment}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between mt-5">
        <Button
          onClick={() => step > 0 ? setStep(step - 1) : navigate(`/campaign/${campaignId}`)}
          variant="ghost"
          className="text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => canProceed && setStep(step + 1)}
            disabled={!canProceed}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleCreate}
            disabled={creating}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Swords className="w-4 h-4 mr-1.5" /> Enter the Realm</>}
          </Button>
        )}
      </div>
    </div>
  );
}

function requirementForClass(className, ability) {
  const reqs = {
    Paladin: { str: 12, wis: 13, cha: 17 },
    Ranger: { str: 13, int: 13, wis: 14, con: 14 },
    Cleric: { wis: 9 },
    Druid: { wis: 12, cha: 15 },
    "Magic-User": { int: 9 },
    Illusionist: { int: 9, dex: 16 },
    Thief: { dex: 9 },
    Assassin: { str: 12, int: 11, dex: 12 },
    Monk: { str: 15, wis: 15, dex: 15, con: 11 },
    Fighter: {}
  };
  return (reqs[className] || {})[ability] || null;
}