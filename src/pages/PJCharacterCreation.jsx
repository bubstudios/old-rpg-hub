import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  ABILITIES, ORIGINS, ROLES,
  rollAbilityScores, applyOriginAdjustments, computeVitality, getInitiative
} from '@/lib/pjRules';
import { Dices, ChevronLeft, ChevronRight, Check, Loader2, Rocket, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ImportCharacterSheetForm from '@/components/ImportCharacterSheetForm';

const STEPS = ['Origin', 'Abilities', 'Role', 'Identity', 'Review'];

export default function PJCharacterCreation() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState('');
  const [rawScores, setRawScores] = useState(null);
  const [scoresRolled, setScoresRolled] = useState(false);
  const [chosenAbility, setChosenAbility] = useState('');
  const [role, setRole] = useState('');
  const [primarySkill, setPrimarySkill] = useState('');
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [background, setBackground] = useState('');
  const [creating, setCreating] = useState(false);
  const [importMode, setImportMode] = useState(false);

  if (importMode) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => setImportMode(false)} className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Crew Builder
        </button>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-primary" strokeWidth={1.5} />
          <h1 className="font-heading font-700 text-lg text-foreground tracking-wide">IMPORT CREW SHEET</h1>
        </div>
        <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 sm:p-8">
          <ImportCharacterSheetForm campaignId={campaignId} onCreated={() => navigate(`/campaign/${campaignId}`)} onCancel={() => setImportMode(false)} />
        </div>
      </div>
    );
  }

  const isHuman = origin === 'Human';
  const adjustedScores = rawScores && origin
    ? applyOriginAdjustments(rawScores, origin, isHuman ? chosenAbility : null)
    : rawScores;
  const vitality = adjustedScores ? computeVitality(adjustedScores) : 0;
  const initiative = adjustedScores ? getInitiative(adjustedScores.ath) : 0;
  const kit = ROLES[role]?.kit;

  const canProceed = [
    !!origin,
    !!adjustedScores && (!isHuman || !!chosenAbility),
    !!role && !!primarySkill,
    !!name.trim(),
    true
  ][step];

  function handleRollScores() {
    setRawScores(rollAbilityScores());
    setScoresRolled(true);
    if (isHuman) setChosenAbility('');
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await base44.functions.invoke('campaignData', {
        op: 'createCharacter',
        campaign_id: campaignId,
        name: name.trim(),
        race: origin,
        character_class: role,
        game_system: 'pathfinder',
        ability_scores: adjustedScores,
        hp_current: vitality,
        hp_max: vitality,
        ac: adjustedScores.cbt || 50,
        skills: [{ name: primarySkill, level: 1 }],
        equipment: kit?.equipment || [],
        gold: kit?.credits || 0,
        appearance,
        background
      });
      toast.success(`${name} boards the Pathfinder!`);
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
        <button onClick={() => navigate(`/campaign/${campaignId}`)} className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
        </button>
        <button onClick={() => setImportMode(true)} className="flex items-center gap-1 text-[11px] font-heading tracking-wide text-primary/70 hover:text-primary transition-colors">
          <FileText className="w-3.5 h-3.5" /> Import a sheet instead
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Rocket className="w-5 h-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-heading font-700 text-lg text-foreground tracking-wide">CREATE CREW · PATHFINDER JOURNEYS</h1>
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
        {/* Step 1: Origin */}
        {step === 0 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Rocket className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR ORIGIN</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {Object.entries(ORIGINS).map(([s, data]) => (
                <button
                  key={s}
                  onClick={() => { setOrigin(s); setChosenAbility(''); }}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    origin === s ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'
                  }`}
                >
                  <p className="font-heading font-600 text-sm text-foreground">{s}</p>
                  <p className="text-[11px] text-muted-foreground font-body mt-1 leading-relaxed">{data.description}</p>
                  <p className="text-[10px] text-primary/70 font-heading tracking-wide mt-2">{data.special}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Abilities */}
        {step === 1 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Dices className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">ROLL ABILITY SCORES</h2>
            </div>
            <p className="text-[11px] text-muted-foreground font-body mb-4">
              Pathfinder Journeys uses percentile abilities (1-100). Roll d100 for each of the eight abilities. Origin adjustments apply automatically.
            </p>
            {!scoresRolled ? (
              <button onClick={handleRollScores} className="w-full py-8 rounded-lg border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-2">
                <Dices className="w-8 h-8 text-primary animate-flicker" strokeWidth={1.2} />
                <span className="font-heading text-sm tracking-wide text-primary">ROLL THE DICE</span>
              </button>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ABILITIES.map((a) => {
                    const raw = rawScores[a.key];
                    const adjusted = adjustedScores[a.key];
                    const isChosen = isHuman && chosenAbility === a.key;
                    const adj = adjusted - raw;
                    return (
                      <button
                        key={a.key}
                        disabled={!isHuman}
                        onClick={() => isHuman && setChosenAbility(a.key)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          isChosen ? 'border-primary bg-primary/10' : isHuman ? 'border-border/40 hover:border-primary/40 bg-card/40' : 'border-border/40 bg-card/40'
                        }`}
                      >
                        <p className="text-[10px] font-heading tracking-[0.1em] text-muted-foreground">{a.name.toUpperCase()}</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="font-heading font-700 text-2xl text-foreground tabular-nums">{adjusted}</span>
                          {adj !== 0 && <span className="text-[10px] text-primary">({raw}{adj > 0 ? '+' : ''}{adj})</span>}
                          {isChosen && <span className="text-[9px] text-primary ml-auto">+10</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {isHuman && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/30">
                    <p className="text-[11px] text-primary font-body">✦ As a Human, tap an ability to apply your +10 adaptability bonus.</p>
                  </div>
                )}
                <Button onClick={handleRollScores} variant="outline" className="w-full border-primary/40 text-primary">
                  <Dices className="w-4 h-4 mr-1.5" /> Reroll All Scores
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Role */}
        {step === 2 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR ROLE</h2>
            </div>
            <div className="grid gap-2.5 mb-5">
              {Object.entries(ROLES).map(([r, data]) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setPrimarySkill(''); }}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    role === r ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'
                  }`}
                >
                  <p className="font-heading font-600 text-sm text-foreground">{r}</p>
                  <p className="text-[11px] text-muted-foreground font-body mt-1">{data.description}</p>
                </button>
              ))}
            </div>
            {role && (
              <>
                <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-2">PRIMARY SKILL (LEVEL 1)</p>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES[role].primarySkills.map((s) => (
                    <button
                      key={s}
                      onClick={() => setPrimarySkill(s)}
                      className={`text-left p-2.5 rounded-lg border text-[11px] font-heading transition-all ${
                        primarySkill === s ? 'border-primary bg-primary/10 text-primary' : 'border-border/40 text-foreground hover:border-primary/40 bg-card/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 4: Identity */}
        {step === 3 && (
          <div className="animate-ink space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">IDENTITY</h2>
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">CREW NAME</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Commander J. Hayes"
                className="mt-1 bg-background/60 font-heading"
                maxLength={40}
              />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">APPEARANCE</label>
              <textarea
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                placeholder="Worn flight jacket, scarred hands, eyes that have seen too many stars..."
                className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                maxLength={300}
              />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">BACKGROUND</label>
              <textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="A decorated officer who lost faith in Earth Command, now given one last ship and one last chance..."
                className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                maxLength={500}
              />
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
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
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">ORIGIN / ROLE</p>
                  <p className="font-heading font-600 text-foreground mt-0.5">{origin} · {role}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">ABILITY SCORES</p>
                <div className="flex gap-3 flex-wrap">
                  {ABILITIES.map((a) => (
                    <span key={a.key} className="text-xs font-heading text-foreground">
                      <span className="text-muted-foreground">{a.name.slice(0, 3).toUpperCase()}</span> {adjustedScores[a.key]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">VITALITY</p>
                  <p className="font-heading font-700 text-lg text-foreground">{vitality}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">INITIATIVE</p>
                  <p className="font-heading font-700 text-lg text-foreground">{initiative}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">CREDITS</p>
                  <p className="font-heading font-700 text-lg text-foreground">{kit?.credits || 0}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-1">PRIMARY SKILL</p>
                <p className="font-heading font-600 text-foreground">{primarySkill} (Level 1)</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">STARTING GEAR</p>
                <div className="flex gap-1.5 flex-wrap">
                  {(kit?.equipment || []).map((e, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-background/40 text-muted-foreground font-body">{e.qty > 1 ? `${e.qty}× ` : ''}{e.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between mt-5">
        <Button onClick={() => step > 0 ? setStep(step - 1) : navigate(`/campaign/${campaignId}`)} variant="ghost" className="text-muted-foreground">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => canProceed && setStep(step + 1)} disabled={!canProceed} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Continue <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleCreate} disabled={creating} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Rocket className="w-4 h-4 mr-1.5" /> Board the Pathfinder</>}
          </Button>
        )}
      </div>
    </div>
  );
}