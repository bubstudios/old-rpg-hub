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
import TSCharacterCreation from '@/pages/TSCharacterCreation';
import HyCharacterCreation from '@/pages/HyCharacterCreation';
import GBCharacterCreation from '@/pages/GBCharacterCreation';
import GangCharacterCreation from '@/pages/GangCharacterCreation';
import LODCharacterCreation from '@/pages/LODCharacterCreation';
import ImportCharacterSheetForm from '@/components/ImportCharacterSheetForm';
import RaceCard from '@/components/RaceCard';

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
  if (gameSystem === 'topsecret') return <TSCharacterCreation />;
  if (gameSystem === 'conan' || gameSystem === 'redsonja') return <HyCharacterCreation />;
  if (gameSystem === 'ghostbusters') return <GBCharacterCreation />;
  if (gameSystem === 'gangbusters') return <GangCharacterCreation />;
  if (gameSystem === 'legionofdoom') return <LODCharacterCreation />;
  if (!gameSystem) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
      </div>
    );
  }

  if (importMode) {
    return (
      <div className="min-h-screen relative">
        <div className="library-bg" />
        <div className="max-w-2xl mx-auto px-3 sm:px-4 py-8 relative">
          <button
            onClick={() => setImportMode(false)}
            className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-amber-900/50 hover:text-amber-900 mb-4 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Character Builder
          </button>
          <div className="parchment-ornate rounded-xl p-5 sm:p-7">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-amber-800/70" strokeWidth={1.5} />
              <h1 className="font-heading font-700 text-lg text-amber-950 tracking-wide">IMPORT CHARACTER SHEET</h1>
            </div>
            <ImportCharacterSheetForm campaignId={campaignId} onCreated={() => navigate(`/campaign/${campaignId}`)} onCancel={() => setImportMode(false)} />
          </div>
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
    <div className="min-h-screen relative">
      <div className="library-bg" />
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8 relative">
        {/* Back / Import */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/campaign/${campaignId}`)}
            className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-amber-900/50 hover:text-amber-900 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
          </button>
          <button
            onClick={() => setImportMode(true)}
            className="flex items-center gap-1 text-[11px] font-heading tracking-wide text-amber-800/60 hover:text-amber-800 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" /> Import a sheet instead
          </button>
        </div>

        {/* Parchment panel */}
        <div className="parchment-ornate rounded-xl p-4 sm:p-6">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-700/20">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-heading tracking-[0.15em] text-amber-800/50">CHARACTER NAME:</span>
              <span className="text-[11px] font-heading font-600 text-amber-950">{name || '—'}</span>
            </div>
            <div className="text-[9px] font-heading tracking-[0.15em] text-amber-800/50">STEP {step + 1} OF 6</div>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-5">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-heading font-700 border-2 transition-all ${
                    i < step ? 'bg-amber-700 border-amber-700 text-amber-50' :
                    i === step ? 'border-amber-500 text-amber-800 bg-amber-100 shadow-[0_0_15px_hsl(38_65%_48%_/_0.4)]' :
                    'border-amber-700/25 text-amber-800/30'
                  }`}>
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-[8px] font-heading tracking-wide hidden sm:block ${i === step ? 'text-amber-800/80' : 'text-amber-800/30'}`}>
                    {s.toUpperCase()}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-1 ${i < step ? 'bg-amber-700/50' : 'bg-amber-700/15'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="min-h-[280px]">
            {/* Step 0: Race */}
            {step === 0 && (
              <div className="animate-ink">
                <h2 className="font-heading font-700 text-center text-base sm:text-lg tracking-[0.15em] text-amber-950 mb-3">SELECT YOUR RACE</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {Object.entries(raceList).map(([r, data]) => (
                    <RaceCard key={r} race={r} data={data} selected={race === r} onClick={() => { setRace(r); setCharacterClass(''); }} />
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Class */}
            {step === 1 && (
              <div className="animate-ink">
                <h2 className="font-heading font-700 text-center text-base sm:text-lg tracking-[0.15em] text-amber-950 mb-2">SELECT YOUR CLASS</h2>
                <p className="text-[11px] text-amber-900/50 font-body text-center mb-3">
                  As a {race}, you may pursue: {raceList[race].classes.join(', ')}
                </p>
                <div className="grid gap-2 max-h-[340px] overflow-y-auto scrollbar-thin pr-1">
                  {classOptions.map((c) => {
                    const data = CLASSES[c];
                    const available = raceList[race]?.classes?.includes(c);
                    return (
                      <button
                        key={c}
                        disabled={!available}
                        onClick={() => setCharacterClass(c)}
                        className={`text-left p-3 rounded-lg border-2 transition-all ${
                          !available ? 'border-amber-700/10 opacity-30 cursor-not-allowed' :
                          characterClass === c ? 'border-amber-500 bg-amber-100/40 shadow-[0_0_12px_hsl(38_65%_48%_/_0.25)]' : 'border-amber-700/25 hover:border-amber-600/50 bg-amber-50/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-heading font-600 text-sm text-amber-950">{c}</p>
                          <span className="text-[9px] font-heading tracking-wide text-amber-800/60">d{data.hitDie} HP</span>
                        </div>
                        <p className="text-[11px] text-amber-900/50 font-body mt-1 leading-relaxed">{data.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Ability Scores */}
            {step === 2 && (
              <div className="animate-ink">
                <h2 className="font-heading font-700 text-center text-base sm:text-lg tracking-[0.15em] text-amber-950 mb-2">ROLL ABILITY SCORES</h2>
                <p className="text-[11px] text-amber-900/50 font-body text-center mb-4">
                  Per 1st Edition rules, roll 3d6 in order for each ability. Racial adjustments are applied automatically.
                </p>
                {!scoresRolled ? (
                  <button
                    onClick={handleRollScores}
                    className="w-full py-6 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-amber-50 font-heading font-700 tracking-[0.15em] text-sm hover:from-amber-500 hover:via-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Dices className="w-5 h-5 animate-flicker" strokeWidth={1.5} />
                    ROLL THE DICE
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {['str', 'int', 'wis', 'dex', 'con', 'cha'].map((ab) => {
                        const raw = rawScores[ab];
                        const adjusted = adjustedScores[ab];
                        const adj = race ? raceList[race].abilityAdjustments[ab] || 0 : 0;
                        const reqs = characterClass ? (requirementForClass(characterClass, ab)) : null;
                        const meets = reqs ? adjusted >= reqs : true;
                        return (
                          <div key={ab} className={`p-2.5 rounded-lg border-2 ${meets ? 'border-amber-700/25 bg-amber-50/20' : 'border-red-800/40 bg-red-950/10'}`}>
                            <p className="text-[10px] font-heading tracking-[0.15em] text-amber-800/50">{ab.toUpperCase()}</p>
                            <div className="flex items-baseline gap-1.5 mt-0.5">
                              <span className="font-heading font-700 text-xl text-amber-950 tabular-nums">{adjusted}</span>
                              {adj !== 0 && <span className="text-[10px] text-amber-800/40">({raw}{adj > 0 ? '+' : ''}{adj})</span>}
                              {reqs && <span className={`text-[9px] ml-auto ${meets ? 'text-amber-800/40' : 'text-red-600'}`}>need {reqs}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {!meetsReqs && (
                      <div className="p-2.5 rounded-lg bg-red-950/15 border border-red-800/30">
                        <p className="text-[11px] text-red-700 font-body">⚠ Your scores do not meet the minimum requirements for {characterClass}. You may reroll or choose another class.</p>
                      </div>
                    )}
                    <button onClick={handleRollScores} className="w-full py-2.5 rounded-lg border-2 border-amber-700/30 text-amber-800 font-heading text-xs tracking-wide hover:bg-amber-700/10 transition-all flex items-center justify-center gap-1.5">
                      <Dices className="w-4 h-4" /> Reroll All Scores
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Alignment */}
            {step === 3 && (
              <div className="animate-ink">
                <h2 className="font-heading font-700 text-center text-base sm:text-lg tracking-[0.15em] text-amber-950 mb-2">SELECT YOUR ALIGNMENT</h2>
                {characterClass && CLASSES[characterClass] && (
                  <p className="text-[11px] text-amber-900/50 font-body text-center mb-3">
                    {ALIGNMENTS.filter(a => !validAlignmentForClass(characterClass, a)).length > 0
                      ? `${characterClass}s are restricted to certain alignments.`
                      : 'Any alignment is permitted.'}
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALIGNMENTS.map((a) => {
                    const allowed = validAlignmentForClass(characterClass, a);
                    return (
                      <button
                        key={a}
                        disabled={!allowed}
                        onClick={() => setAlignment(a)}
                        className={`p-2 rounded-lg border-2 text-center transition-all ${
                          !allowed ? 'border-amber-700/10 opacity-25 cursor-not-allowed' :
                          alignment === a ? 'border-amber-500 bg-amber-100/40 shadow-[0_0_12px_hsl(38_65%_48%_/_0.25)]' : 'border-amber-700/25 hover:border-amber-600/50 bg-amber-50/20'
                        }`}
                      >
                        <p className="text-[11px] font-heading font-600 text-amber-950 leading-tight">{a}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Identity */}
            {step === 4 && (
              <div className="animate-ink space-y-3.5">
                <h2 className="font-heading font-700 text-center text-base sm:text-lg tracking-[0.15em] text-amber-950 mb-1">IDENTITY &amp; EXPERIENCE</h2>
                <div>
                  <label className="text-[11px] font-heading tracking-wide text-amber-800/60">STARTING LEVEL</label>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <div className="flex items-center border-2 border-amber-700/25 rounded-md bg-amber-50/20">
                      <button type="button" onClick={() => setLevel(Math.max(1, level - 1))} className="px-3 py-1.5 text-amber-800/60 hover:text-amber-800 text-sm">−</button>
                      <input type="number" min={1} max={20} value={level} onChange={(e) => setLevel(Math.min(20, Math.max(1, Number(e.target.value) || 1)))} className="w-12 text-center bg-transparent font-heading font-700 text-amber-950 focus:outline-none" />
                      <button type="button" onClick={() => setLevel(Math.min(20, level + 1))} className="px-3 py-1.5 text-amber-800/60 hover:text-amber-800 text-sm">+</button>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 3, 5, 10].map((lv) => (
                        <button key={lv} type="button" onClick={() => setLevel(lv)} className={`px-2.5 py-1 rounded text-[11px] font-heading border transition-colors ${level === lv ? 'border-amber-500/50 text-amber-800 bg-amber-100/40' : 'border-amber-700/25 text-amber-800/50 hover:text-amber-800'}`}>L{lv}</button>
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-800/40 font-body mt-1.5">Begin at level 1 for a classic crawl, or start higher for seasoned heroes.</p>
                </div>
                <div>
                  <label className="text-[11px] font-heading tracking-wide text-amber-800/60">CHARACTER NAME</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aldric the Bold" className="mt-1 bg-amber-50/30 border-amber-700/25 text-amber-950 placeholder:text-amber-700/25 font-heading" maxLength={40} />
                </div>
                <div>
                  <label className="text-[11px] font-heading tracking-wide text-amber-800/60">APPEARANCE</label>
                  <textarea value={appearance} onChange={(e) => setAppearance(e.target.value)} placeholder="Tall and weathered, with a scar across his left eye..." className="mt-1 w-full bg-amber-50/30 border-amber-700/25 text-amber-950 placeholder:text-amber-700/25 font-body text-sm rounded-md border-2 px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/30" maxLength={300} />
                </div>
                <div>
                  <label className="text-[11px] font-heading tracking-wide text-amber-800/60">BACKGROUND</label>
                  <textarea value={background} onChange={(e) => setBackground(e.target.value)} placeholder="A former soldier turned mercenary, seeking redemption..." className="mt-1 w-full bg-amber-50/30 border-amber-700/25 text-amber-950 placeholder:text-amber-700/25 font-body text-sm rounded-md border-2 px-3 py-2 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/30" maxLength={500} />
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="animate-ink">
                <h2 className="font-heading font-700 text-center text-base sm:text-lg tracking-[0.15em] text-amber-950 mb-3">REVIEW &amp; CONFIRM</h2>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 rounded-lg bg-amber-50/20 border border-amber-700/20">
                      <p className="text-[10px] font-heading tracking-wide text-amber-800/50">NAME</p>
                      <p className="font-heading font-600 text-amber-950 mt-0.5">{name}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50/20 border border-amber-700/20">
                      <p className="text-[10px] font-heading tracking-wide text-amber-800/50">RACE / CLASS</p>
                      <p className="font-heading font-600 text-amber-950 mt-0.5">{race} {characterClass}</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/20 border border-amber-700/20">
                    <p className="text-[10px] font-heading tracking-wide text-amber-800/50 mb-1.5">ABILITY SCORES</p>
                    <div className="flex gap-3 flex-wrap">
                      {Object.entries(adjustedScores).map(([ab, val]) => (
                        <span key={ab} className="text-xs font-heading text-amber-950"><span className="text-amber-800/50">{ab.toUpperCase()}</span> {val}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-lg bg-amber-50/20 border border-amber-700/20 text-center">
                      <p className="text-[10px] font-heading tracking-wide text-amber-800/50">HP</p>
                      <p className="font-heading font-700 text-lg text-amber-950">{previewHP}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50/20 border border-amber-700/20 text-center">
                      <p className="text-[10px] font-heading tracking-wide text-amber-800/50">AC</p>
                      <p className="font-heading font-700 text-lg text-amber-950">{computeAC(STARTING_EQUIPMENT[characterClass] || [])}</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50/20 border border-amber-700/20 text-center">
                      <p className="text-[10px] font-heading tracking-wide text-amber-800/50">THAC0</p>
                      <p className="font-heading font-700 text-lg text-amber-950">{getTHAC0(characterClass, level)}</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/20 border border-amber-700/20">
                    <p className="text-[10px] font-heading tracking-wide text-amber-800/50 mb-1.5">STARTING EQUIPMENT</p>
                    <div className="flex gap-1.5 flex-wrap">
                      {(STARTING_EQUIPMENT[characterClass] || []).map((e, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-amber-700/10 text-amber-800/60 font-body">{e.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/20 border border-amber-700/20">
                    <p className="text-[10px] font-heading tracking-wide text-amber-800/50">ALIGNMENT</p>
                    <p className="font-heading font-600 text-amber-950 mt-0.5">{alignment}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between mt-4">
          <Button
            onClick={() => step > 0 ? setStep(step - 1) : navigate(`/campaign/${campaignId}`)}
            variant="ghost"
            className="text-amber-800/50 hover:text-amber-800"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => canProceed && setStep(step + 1)}
              disabled={!canProceed}
              className="bg-amber-700/80 text-amber-50 hover:bg-amber-700"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="bg-gradient-to-r from-amber-600 to-amber-500 text-amber-50 hover:from-amber-500 hover:to-amber-400"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Swords className="w-4 h-4 mr-1.5" /> Enter the Realm</>}
            </Button>
          )}
        </div>
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