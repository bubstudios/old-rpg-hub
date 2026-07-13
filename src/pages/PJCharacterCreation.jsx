import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ChevronLeft, ChevronRight, Check, Loader2, Rocket, UserPlus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import ImportCharacterSheetForm from '@/components/ImportCharacterSheetForm';
import { PJ_ORIGINS, PJ_ROLES } from '@/lib/pjRules';

const STEPS = ['Background', 'Identity', 'Review'];

export default function PJCharacterCreation() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [appearance, setAppearance] = useState('');
  const [background, setBackground] = useState('');
  const [creating, setCreating] = useState(false);
  const [importMode, setImportMode] = useState(false);

  if (importMode) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => setImportMode(false)} className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" /> Back to Captain's File
        </button>
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-primary" strokeWidth={1.5} />
          <h1 className="font-heading font-700 text-lg text-foreground tracking-wide">IMPORT CAPTAIN'S FILE</h1>
        </div>
        <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 sm:p-8">
          <ImportCharacterSheetForm campaignId={campaignId} onCreated={() => navigate(`/campaign/${campaignId}`)} onCancel={() => setImportMode(false)} />
        </div>
      </div>
    );
  }

  const roleData = PJ_ROLES.find(r => r.name === role);
  const canProceed = [!!origin && !!role, !!name.trim(), true][step];

  async function handleCreate() {
    setCreating(true);
    try {
      await base44.functions.invoke('campaignData', {
        op: 'createCharacter',
        campaign_id: campaignId,
        game_system: 'pathfinder',
        name: name.trim(),
        race: origin,
        character_class: role,
        alignment: 'Neutral Good',
        level: 1,
        ability_scores: roleData ? { ...roleData.abilities } : {},
        equipment: [],
        gold: 0,
        skills: [],
        spells: [],
        spell_slots: {},
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
          <FileText className="w-3.5 h-3.5" /> Import a file instead
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Rocket className="w-5 h-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-heading font-700 text-lg text-foreground tracking-wide">CAPTAIN'S FILE</h1>
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
              <span className={`text-[9px] font-heading tracking-wide hidden sm:block ${i === step ? 'text-primary' : 'text-muted-foreground/60'}`}>{s.toUpperCase()}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-1.5 ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-6 sm:p-8 min-h-[320px]">
        {/* Step 1: Background */}
        {step === 0 && (
          <div className="animate-ink space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-4 h-4 text-primary" strokeWidth={1.5} />
                <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR ORIGIN</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {PJ_ORIGINS.map((o) => (
                  <button key={o.name} onClick={() => setOrigin(o.name)}
                    className={`text-left p-3.5 rounded-lg border transition-all ${origin === o.name ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'}`}>
                    <p className="font-heading font-600 text-sm text-foreground">{o.name}</p>
                    <p className="text-[11px] text-muted-foreground font-body mt-1 leading-relaxed">{o.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-4 h-4 text-primary" strokeWidth={1.5} />
                <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CHOOSE YOUR ROLE</h2>
              </div>
              <div className="grid gap-2.5">
                {PJ_ROLES.map((r) => (
                  <button key={r.name} onClick={() => setRole(r.name)}
                    className={`text-left p-3.5 rounded-lg border transition-all ${role === r.name ? 'border-primary bg-primary/10' : 'border-border/40 hover:border-primary/40 bg-card/30'}`}>
                    <p className="font-heading font-600 text-sm text-foreground">{r.name}</p>
                    <p className="text-[11px] text-muted-foreground font-body mt-1 leading-relaxed">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Identity */}
        {step === 1 && (
          <div className="animate-ink space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CAPTAIN'S FILE</h2>
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">CAPTAIN NAME</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Captain Bub Stellar" className="mt-1 bg-background/60 font-heading" maxLength={40} />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">APPEARANCE</label>
              <textarea value={appearance} onChange={(e) => setAppearance(e.target.value)} placeholder="A weathered officer with silver at the temples..." className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-ring" maxLength={300} />
            </div>
            <div>
              <label className="text-[11px] font-heading tracking-wide text-muted-foreground">SERVICE RECORD</label>
              <textarea value={background} onChange={(e) => setBackground(e.target.value)} placeholder="A former Earth Command officer who saw the truth..." className="mt-1 w-full bg-background/60 font-body text-sm rounded-md border border-input px-3 py-2 min-h-[80px] resize-none focus:outline-none focus:ring-1 focus:ring-ring" maxLength={500} />
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 2 && (
          <div className="animate-ink">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-4 h-4 text-primary" strokeWidth={1.5} />
              <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">REVIEW &amp; CONFIRM</h2>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">CAPTAIN</p>
                  <p className="font-heading font-600 text-foreground mt-0.5">{name}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground">ORIGIN / ROLE</p>
                  <p className="font-heading font-600 text-foreground mt-0.5">{origin} · {role}</p>
                </div>
              </div>
              {appearance && (
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-1">APPEARANCE</p>
                  <p className="text-sm text-foreground/80 font-body italic leading-relaxed">{appearance}</p>
                </div>
              )}
              {background && (
                <div className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                  <p className="text-[10px] font-heading tracking-wide text-muted-foreground mb-1">SERVICE RECORD</p>
                  <p className="text-sm text-foreground/80 font-body italic leading-relaxed">{background}</p>
                </div>
              )}
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
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Rocket className="w-4 h-4 mr-1.5" /> Board the Pathfinder</>}
          </Button>
        )}
      </div>
    </div>
  );
}