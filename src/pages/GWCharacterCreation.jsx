import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  GENOTYPES, ABILITIES, STARTING_KITS,
  rollAbilityScores, rollMutations, applyMutationModifiers,
  computeHP, computeAC, getInitiativeMod
} from '@/lib/gwRules';
import { Dices, ChevronLeft, ChevronRight, Check, Loader2, Atom, Sparkles, FileText, AlertTriangle, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ImportCharacterSheetForm from '@/components/ImportCharacterSheetForm';

const STEPS = ['Genotype', 'Abilities', 'Mutations', 'Identity', 'Review'];

export default function GWCharacterCreation() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [genotype, setGenotype] = useState('');
  const [rawScores, setRawScores] = useState(null);
  const [scoresRolled, setScoresRolled] = useState(false);
  const [mutations, setMutations] = useState([]);
  const [mutationsRolled, setMutationsRolled] = useState(false);
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [background, setBackground] = useState('');
  const [creating, setCreating] = useState(false);
  const [importMode, setImportMode] = useState(false);

  if (importMode) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => setImportMode(false)}
          className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Mutant Builder
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

  const hasMutations = genotype && GENOTYPES[genotype] && (GENOTYPES[genotype].physicalMutations + GENOTYPES[genotype].mentalMutations) > 0;
  const finalScores = rawScores && mutations.length
    ? applyMutationModifiers(rawScores, mutations)
    : rawScores;
  const hp = finalScores ? computeHP(finalScores) : 0;
  const ac = finalScores ? computeAC(mutations, STARTING_KITS[genotype]?.equipment || []) : 10;
  const initMod = finalScores ? getInitiativeMod(finalScores) : 0;
  const kit = STARTING_KITS[genotype];

  const canProceed = [
    !!genotype,
    !!finalScores,
    !hasMutations || mutationsRolled,
    !!name.trim(),
    true
  ][step];

  function handleRollScores() {
    setRawScores(rollAbilityScores());
    setScoresRolled(true);
  }

  function handleRollMutations() {
    setMutations(rollMutations(genotype));
    setMutationsRolled(true);
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await base44.functions.invoke('campaignData', {
        op: 'createCharacter',
        campaign_id: campaignId,
        name: name.trim(),
        race: genotype,
        character_class: genotype,
        game_system: 'gammaworld',
        ability_scores: finalScores,
        ac,
        mutations,
        equipment: kit?.equipment || [],
        gold: kit?.domars || 0,
        appearance,
        background
      });
      toast.success(`${name} emerges from the wasteland!`);
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

      <div className="flex items-center gap-2 mb-6">
        <Atom className="w-5 h-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-heading font-700 text-lg text-foreground tracking-wide">CREATE MUTANT · GAMMA WORLD</h1>
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
        {/* Step 1: Genotype */}
        {step === 0 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Dna className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR GENOTYPE</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {Object.entries(GENOTYPES).map(([g, data]) => (
                <button
                  key={g}
                  onClick={() => { setGenotype(g); setMutations([]); setMutationsRolled(false); }}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    genotype === g ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'
                  }`}
                >
                  <p className="font-heading font-600 text-sm text-foreground">{g}</p>
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
              Gamma World uses seven attributes (3-18). Roll 4d6 and drop the lowest for each. Some mutations will later modify these scores.
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ABILITIES.map((a) => (
                    <div key={a.key} className="p-3 rounded-lg border border-border/40 bg-card/40">
                      <p className="text-[10px] font-heading tracking-[0.1em] text-muted-foreground">{a.short}</p>
                      <p className="font-heading font-700 text-2xl text-foreground tabular-nums mt-1">{rawScores[a.key]}</p>
                    </div>
                  ))}
                </div>
                <Button onClick={handleRollScores} variant="outline" className="w-full border-primary/40 text-primary">
                  <Dices className="w-4 h-4 mr-1.5" /> Reroll All Scores
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Mutations */}
        {step === 2 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">ROLL MUTATIONS</h2>
            </div>
            {!hasMutations ? (
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/30">
                <p className="text-[11px] text-primary font-body">
                  ✦ As a Pure Strain Human, you possess no mutations — but you are resistant to radiation and skilled with ancient artifacts. Proceed to the next step.
                </p>
              </div>
            ) : !mutationsRolled ? (
              <button
                onClick={handleRollMutations}
                className="w-full py-8 rounded-lg border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center gap-2"
              >
                <Dna className="w-8 h-8 text-primary animate-flicker" strokeWidth={1.2} />
                <span className="font-heading text-sm tracking-wide text-primary">ROLL MUTATIONS</span>
                <span className="text-[10px] text-muted-foreground font-body">
                  {GENOTYPES[genotype].physicalMutations} physical + {GENOTYPES[genotype].mentalMutations} mental
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {mutations.map((m, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border ${m.defect ? 'border-red-900/40 bg-red-950/10' : 'border-emerald-900/40 bg-emerald-950/10'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded ${m.type === 'physical' ? 'bg-amber-900/30 text-amber-400' : 'bg-violet-900/30 text-violet-400'}`}>
                          {m.type === 'physical' ? 'PHYSICAL' : 'MENTAL'}
                        </span>
                        {m.defect && (
                          <span className="text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded bg-red-900/30 text-red-400 flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> DEFECT
                          </span>
                        )}
                      </div>
                      <p className={`font-heading font-600 text-sm ${m.defect ? 'text-red-300' : 'text-foreground'}`}>{m.name}</p>
                      <p className="text-[10px] text-muted-foreground font-body mt-0.5 leading-relaxed">{m.description}</p>
                    </div>
                  ))}
                </div>
                <Button onClick={handleRollMutations} variant="outline" className="w-full border-primary/40 text-primary">
                  <Dices className="w-4 h-4 mr-1.5" /> Reroll Mutations
                </Button>
              </div>
            )}
            {hasMutations && mutationsRolled && (
              <p className="text-[10px] text-muted-foreground/60 font-body mt-3">
                Some mutations modify ability scores (e.g. Heightened Strength, Will Force). These are applied automatically.
              </p>
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
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">CHARACTER NAME</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vex the Clawed"
                className="mt-1 bg-background/60 font-heading"
                maxLength={40}
              />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">APPEARANCE</label>
              <textarea
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                placeholder="Scaled green skin, three glowing eyes, a tattered jumpsuit from the Old World..."
                className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                maxLength={300}
              />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">BACKGROUND</label>
              <textarea
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="Born in the irradiated ruins of a fallen arcology, raised by scavengers who taught you to fear the blue glow..."
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
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">GENOTYPE</p>
                  <p className="font-heading font-600 text-foreground mt-0.5">{genotype}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">ABILITY SCORES</p>
                <div className="flex gap-3 flex-wrap">
                  {ABILITIES.map((a) => (
                    <span key={a.key} className="text-xs font-heading text-foreground">
                      <span className="text-muted-foreground">{a.short}</span> {finalScores[a.key]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">HP</p>
                  <p className="font-heading font-700 text-lg text-foreground">{hp}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">AC</p>
                  <p className="font-heading font-700 text-lg text-foreground">{ac}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">INIT MOD</p>
                  <p className="font-heading font-700 text-lg text-foreground">{initMod >= 0 ? '+' : ''}{initMod}</p>
                </div>
              </div>
              {mutations.length > 0 && (
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">MUTATIONS</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {mutations.map((m, i) => (
                      <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded font-body ${m.defect ? 'bg-red-950/40 text-red-400' : m.type === 'physical' ? 'bg-amber-950/40 text-amber-400' : 'bg-violet-950/40 text-violet-400'}`}>
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">STARTING GEAR</p>
                <div className="flex gap-1.5 flex-wrap">
                  {(kit?.equipment || []).map((e, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-background/40 text-muted-foreground font-body">{e.qty > 1 ? `${e.qty}× ` : ''}{e.name}</span>
                  ))}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-background/40 text-primary font-heading">{kit?.domars || 0} domars</span>
                </div>
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
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Atom className="w-4 h-4 mr-1.5" /> Emerge into the Wastes</>}
          </Button>
        )}
      </div>
    </div>
  );
}