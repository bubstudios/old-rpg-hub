import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ARCHETYPES, ABILITIES, ALL_SKILLS, SKILLS_BY_ATTR, startingBP } from '@/lib/gbRules';
import { Ghost, ChevronLeft, ChevronRight, Check, Loader2, Dices, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ImportCharacterSheetForm from '@/components/ImportCharacterSheetForm';

const STEPS = ['Archetype', 'Skills', 'Identity', 'Review'];

export default function GBCharacterCreation() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [archetype, setArchetype] = useState('');
  const [extraSkills, setExtraSkills] = useState([]);
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [bio, setBio] = useState('');
  const [creating, setCreating] = useState(false);
  const [importMode, setImportMode] = useState(false);

  if (importMode) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => setImportMode(false)} className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Buster Builder
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
  const bonusSlots = 3;
  const tagSkillObjects = ar ? ar.tagSkills.map(s => ({ name: s, level: 1 })) : [];
  const allSkills = [...tagSkillObjects, ...extraSkills];
  const canProceed = [!!archetype, extraSkills.length <= bonusSlots, !!name.trim(), true][step];

  function addSkill(skillName) {
    if (extraSkills.length >= bonusSlots) return;
    if (allSkills.some(s => s.name === skillName)) return;
    setExtraSkills(prev => [...prev, { name: skillName, level: 1 }]);
  }
  function removeExtraSkill(idx) {
    setExtraSkills(prev => prev.filter((_, i) => i !== idx));
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
        game_system: 'ghostbusters',
        ability_scores: ar?.attributes || { brain: 3, muscle: 3, moves: 3, cool: 3 },
        skills: allSkills,
        equipment: ar?.equipment || [],
        gold: ar?.bp || 20,
        appearance,
        background: bio
      });
      toast.success(`${name} joins the Ghostbusters!`);
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
        <Ghost className="w-5 h-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-heading font-700 text-lg text-foreground tracking-wide">CREATE BUSTER · GHOSTBUSTERS</h1>
      </div>

      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-heading font-700 border-2 transition-all ${
                i < step ? 'bg-primary border-primary text-primary-foreground' :
                i === step ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground/50'
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[9px] font-heading tracking-wide hidden sm:block ${i === step ? 'text-primary' : 'text-muted-foreground/60'}`}>{s.toUpperCase()}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-1.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 sm:p-8 min-h-[320px]">
        {step === 0 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Ghost className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR ARCHETYPE</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {Object.entries(ARCHETYPES).map(([a, data]) => (
                <button key={a} onClick={() => { setArchetype(a); setExtraSkills([]); }} className={`text-left p-3.5 rounded-lg border transition-all ${archetype === a ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'}`}>
                  <p className="font-heading font-600 text-sm text-foreground">{a}</p>
                  <p className="text-[11px] text-muted-foreground font-body mt-1 leading-relaxed">{data.description}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-400">B{data.attributes.brain} M{data.attributes.muscle} Mo{data.attributes.moves} C{data.attributes.cool}</span>
                    <span className="text-[9px] font-heading px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400">{data.bp} BP</span>
                  </div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {data.tagSkills.map(s => (
                      <span key={s} className="text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded bg-sky-900/30 text-sky-400">{s}</span>
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
              <Sparkles className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">TAG SKILLS</h2>
            </div>
            <p className="text-[11px] text-muted-foreground font-body mb-4">
              Your archetype grants tag skills. Pick {bonusSlots - extraSkills.length} more skill{bonusSlots - extraSkills.length === 1 ? '' : 's'} — each adds a bonus die when you roll that trait.
            </p>
            <div className="space-y-3">
              <div className="space-y-1.5">
                {tagSkillObjects.map((s, i) => (
                  <div key={`t${i}`} className="flex items-center justify-between p-2 rounded border border-sky-900/30 bg-sky-950/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded bg-sky-900/30 text-sky-400">TAG</span>
                      <span className="text-xs font-heading font-600 text-foreground">{s.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-heading">+{s.level}d6</span>
                  </div>
                ))}
                {extraSkills.map((s, i) => (
                  <div key={`e${i}`} className="flex items-center justify-between p-2 rounded border border-sky-900/30 bg-sky-950/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded bg-sky-900/30 text-sky-400">TAG</span>
                      <span className="text-xs font-heading font-600 text-foreground">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-heading">+{s.level}d6</span>
                      <button onClick={() => removeExtraSkill(i)} className="text-muted-foreground/50 hover:text-red-400 text-[10px]">✕</button>
                    </div>
                  </div>
                ))}
              </div>
              {extraSkills.length < bonusSlots && (
                <div>
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground/70 mb-2">PICK {bonusSlots - extraSkills.length} MORE</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_SKILLS.filter(s => !allSkills.some(a => a.name === s)).map((s) => (
                      <button key={s} onClick={() => addSkill(s)} className="px-2.5 py-1 rounded-full text-[11px] font-body border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-ink space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">IDENTITY</h2>
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">CHARACTER NAME</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Dr. Peter Venkman, Ray Stantz" className="mt-1 bg-background/60 font-heading" maxLength={40} />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">APPEARANCE</label>
              <textarea value={appearance} onChange={(e) => setAppearance(e.target.value)} placeholder="Wearing tan coveralls and a proton pack, always ready with a quip..." className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-ring" maxLength={300} />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">BACKGROUND</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Lost their tenure at the university and started a paranormal elimination business..." className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-ring" maxLength={500} />
            </div>
          </div>
        )}

        {step === 3 && (
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
                      <span className="text-muted-foreground">{a.short}</span> {ar?.attributes[a.key] || 3}d6
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">BROWNIE POINTS</p>
                  <p className="font-heading font-700 text-lg text-foreground">{ar?.bp || 20}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40 text-center">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">TAG SKILLS</p>
                  <p className="font-heading font-700 text-lg text-foreground">{allSkills.length}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">SKILLS</p>
                <div className="flex gap-1.5 flex-wrap">
                  {allSkills.map((s, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950/40 text-sky-400 font-body">{s.name} +{s.level}d6</span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-2">STARTING GEAR</p>
                <div className="flex gap-1.5 flex-wrap">
                  {(ar?.equipment || []).map((e, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-background/40 text-muted-foreground font-body">{e.qty > 1 ? `${e.qty}× ` : ''}{e.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Ghost className="w-4 h-4 mr-1.5" /> Suit Up</>}
          </Button>
        )}
      </div>
    </div>
  );
}