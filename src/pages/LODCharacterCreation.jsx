import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import {
  ARCHETYPES, ABILITIES, POWERS,
  rollAbilityScores, computeHP, computeDefense, getInitiativeMod, getEgo, powerCountFor
} from '@/lib/lodRules';
import { Dices, ChevronLeft, ChevronRight, Check, Loader2, Zap, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ImportCharacterSheetForm from '@/components/ImportCharacterSheetForm';

const STEPS = ['Archetype', 'Attributes', 'Powers', 'Identity', 'Review'];

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }

export default function LODCharacterCreation() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [archetype, setArchetype] = useState('');
  const [rawScores, setRawScores] = useState(null);
  const [scoresRolled, setScoresRolled] = useState(false);
  const [extraPowers, setExtraPowers] = useState([]);
  const [basePowers, setBasePowers] = useState([]);
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [bio, setBio] = useState('');
  const [creating, setCreating] = useState(false);
  const [importMode, setImportMode] = useState(false);

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

  const ar = archetype ? ARCHETYPES[archetype] : null;
  const bonusSlots = rawScores ? powerCountFor(rawScores) : 2;
  const allPowers = [...basePowers, ...extraPowers];

  const canProceed = [
    !!archetype,
    !!rawScores,
    extraPowers.length <= bonusSlots,
    !!name.trim(),
    true
  ][step];

  function handleRollScores() {
    setRawScores(rollAbilityScores());
    setScoresRolled(true);
  }

  function addPower(powerName) {
    if (extraPowers.length >= bonusSlots) return;
    if (allPowers.some(p => p.name === powerName)) return;
    setExtraPowers(prev => [...prev, { name: powerName, level: 1 }]);
  }

  function removeExtraPower(idx) {
    setExtraPowers(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await base44.functions.invoke('campaignData', {
        op: 'createCharacter',
        campaign_id: campaignId,
        name: name.trim(),
        race: archetype,
        character_class: archetype,
        game_system: 'legionofdoom',
        ability_scores: rawScores,
        skills: allPowers,
        equipment: ar?.equipment || [],
        gold: ar?.resources || 0,
        appearance,
        background: bio
      });
      toast.success(`${name} joins the Legion of Doom!`);
      navigate(`/campaign/${campaignId}`);
    } catch (e) {
      toast.error('Failed to create villain: ' + (e.response?.data?.error || e.message));
    } finally {
      setCreating(false);
    }
  }

  const hp = rawScores ? computeHP(rawScores) : 0;
  const defense = rawScores ? computeDefense(rawScores) : 10;
  const initMod = rawScores ? getInitiativeMod(rawScores) : 0;
  const ego = rawScores ? getEgo(rawScores) : 0;

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
        <Zap className="w-5 h-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-heading font-700 text-lg text-foreground tracking-wide">CREATE VILLAIN · LEGION OF DOOM</h1>
      </div>

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
        {step === 0 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR ARCHETYPE</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {Object.entries(ARCHETYPES).map(([a, data]) => (
                <button
                  key={a}
                  onClick={() => {
                    setArchetype(a);
                    setBasePowers(data.powers.map(p => ({ name: p, level: 1 })));
                    setExtraPowers([]);
                  }}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    archetype === a ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'
                  }`}
                >
                  <p className="font-heading font-600 text-sm text-foreground">{a}</p>
                  <p className="text-[11px] text-muted-foreground font-body mt-1 leading-relaxed">{data.description}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {data.powers.map(p => (
                      <span key={p} className="text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-400">{p}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Dices className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">ROLL ATTRIBUTES</h2>
            </div>
            <p className="text-[11px] text-muted-foreground font-body mb-4">
              Six attributes (3-18), rolled 4d6 drop lowest. Your Toughness is your Vitality and your armor; your Will is your Ego pool.
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
                  {ABILITIES.map((a) => (
                    <div key={a.key} className="p-3 rounded-lg border border-border/40 bg-card/40">
                      <p className="text-[10px] font-heading tracking-[0.1em] text-muted-foreground">{a.short}</p>
                      <p className="font-heading font-700 text-2xl text-foreground tabular-nums mt-1">{rawScores[a.key]}</p>
                    </div>
                  ))}
                </div>
                <Button onClick={handleRollScores} variant="outline" className="w-full border-primary/40 text-primary">
                  <Dices className="w-4 h-4 mr-1.5" /> Reroll All Attributes
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">SUPER-POWERS</h2>
            </div>
            <p className="text-[11px] text-muted-foreground font-body mb-4">
              Your archetype grants starting powers. Your attribute total grants {bonusSlots} additional power{bonusSlots === 1 ? '' : 's'} from the list below.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                {basePowers.map((p, i) => (
                  <div key={`b${i}`} className="flex items-center justify-between p-2 rounded border border-purple-900/30 bg-purple-950/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-400">POWER</span>
                      <span className="text-xs font-heading font-600 text-foreground">{p.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-heading">Rank {p.level}</span>
                  </div>
                ))}
                {extraPowers.map((p, i) => (
                  <div key={`e${i}`} className="flex items-center justify-between p-2 rounded border border-purple-900/30 bg-purple-950/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded bg-purple-900/30 text-purple-400">POWER</span>
                      <span className="text-xs font-heading font-600 text-foreground">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-heading">Rank {p.level}</span>
                      <button onClick={() => removeExtraPower(i)} className="text-muted-foreground/50 hover:text-red-400 text-[10px]">✕</button>
                    </div>
                  </div>
                ))}
              </div>
              {extraPowers.length < bonusSlots && (
                <div>
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground/70 mb-2">
                    PICK {bonusSlots - extraPowers.length} MORE POWER{bonusSlots - extraPowers.length === 1 ? '' : 'S'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto scrollbar-thin pr-1">
                    {POWERS.filter(p => !allPowers.some(a => a.name === p)).map((p) => (
                      <button
                        key={p}
                        onClick={() => addPower(p)}
                        className="px-2.5 py-1 rounded-full text-[11px] font-body border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {extraPowers.length >= bonusSlots && bonusSlots > 0 && (
                <p className="text-[10px] text-primary/70 font-body italic">All bonus powers chosen.</p>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-ink space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">VILLAIN IDENTITY</h2>
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">VILLAIN NAME</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Doctor Oblivion"
                className="mt-1 bg-background/60 font-heading"
                maxLength={40}
              />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">APPEARANCE</label>
              <textarea
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                placeholder="Tall and gaunt, with a skull-like mask and a tattered black cloak..."
                className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                maxLength={300}
              />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">ORIGIN STORY</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Once a respected scientist, driven mad by betrayal, now bent on revenge against the world that spurned him..."
                className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                maxLength={500}
              />
            </div>
          </div>
        )}

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
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">ARCHETYPE</p>
                  <p className="font-heading font-600 text-foreground mt-0.5">{archetype}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">ATTRIBUTES</p>
                <div className="flex gap-3 flex-wrap">
                  {ABILITIES.map((a) => (
                    <span key={a.key} className="text-xs font-heading text-foreground">
                      <span className="text-muted-foreground">{a.short}</span> {rawScores[a.key]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">VITALITY</p>
                  <p className="font-heading font-700 text-lg text-foreground">{hp}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">DEFENSE</p>
                  <p className="font-heading font-700 text-lg text-foreground">{defense}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">EGO</p>
                  <p className="font-heading font-700 text-lg text-foreground">{ego}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">INIT</p>
                  <p className="font-heading font-700 text-lg text-foreground">{initMod >= 0 ? '+' : ''}{initMod}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">POWERS</p>
                <div className="flex gap-1.5 flex-wrap">
                  {allPowers.map((p, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-400 font-body">
                      {p.name} R{p.level}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">STARTING GEAR</p>
                <div className="flex gap-1.5 flex-wrap">
                  {(ar?.equipment || []).map((e, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-background/40 text-muted-foreground font-body">{e.qty > 1 ? `${e.qty}× ` : ''}{e.name}</span>
                  ))}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-background/40 text-primary font-heading">${ar?.resources || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4 mr-1.5" /> Join the Legion</>}
          </Button>
        )}
      </div>
    </div>
  );
}