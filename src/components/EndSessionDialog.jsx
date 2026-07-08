import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Flag, Coins, Sparkles, Users, Compass, HelpCircle, BookOpen, ScrollText } from 'lucide-react';
import { toast } from 'sonner';

export default function EndSessionDialog({ open, onOpenChange, campaignId }) {
  const [step, setStep] = useState('confirm');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function reset() {
    setStep('confirm');
    setResult(null);
    setError(null);
  }

  async function handleEnd() {
    setStep('generating');
    setError(null);
    try {
      const res = await base44.functions.invoke('endSession', { campaign_id: campaignId });
      setResult(res.data.session);
      setStep('done');
    } catch (e) {
      setError(e.response?.data?.error || e.message);
      setStep('confirm');
      toast.error('Failed to compile session chronicle');
    }
  }

  function handleClose(open) {
    onOpenChange(open);
    if (!open) setTimeout(reset, 200);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading tracking-wide flex items-center gap-2">
                <Flag className="w-4 h-4 text-primary" /> End Session
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              Wrap up this play session? The Dungeon Master will compile a full chronicle — a recap, rewards and XP earned, treasure found, NPC developments, unresolved clues, your current location, and a hook for next time.
            </p>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <DialogFooter>
              <Button variant="ghost" onClick={() => handleClose(false)}>Cancel</Button>
              <Button onClick={handleEnd} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Flag className="w-4 h-4 mr-1" /> Compile Session Chronicle
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 'generating' && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <p className="font-tome italic text-sm text-muted-foreground">
              The Dungeon Master compiles the session chronicle...
            </p>
          </div>
        )}

        {step === 'done' && result && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading tracking-wide">{result.title || 'Session Ended'}</DialogTitle>
              {result.xp_awarded != null && (
                <p className="text-xs text-muted-foreground font-heading tracking-wide">
                  {result.session_number ? `SESSION ${result.session_number} · ` : ''}{result.xp_awarded} XP EARNED
                </p>
              )}
            </DialogHeader>
            <div className="space-y-4 mt-2 text-sm font-body">
              <Section icon={ScrollText} label="Recap">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{result.recap || '—'}</p>
              </Section>
              <Section icon={Sparkles} label="Rewards & XP">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{result.rewards_summary || 'None.'}</p>
              </Section>
              <Section icon={Coins} label="Treasure Gained">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{result.treasure_summary || 'None.'}</p>
              </Section>
              <Section icon={Users} label="NPC Changes">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{result.npc_changes || 'None.'}</p>
              </Section>
              <Section icon={HelpCircle} label="Unresolved Clues">
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{result.unresolved_clues || 'None.'}</p>
              </Section>
              <Section icon={Compass} label="Current Location">
                <p className="text-foreground/80 leading-relaxed">{result.current_location || 'Unknown.'}</p>
              </Section>
              <Section icon={BookOpen} label="Next Session Hook">
                <p className="text-foreground/80 leading-relaxed italic">{result.next_session_hook || '—'}</p>
              </Section>
            </div>
            <DialogFooter>
              <Button onClick={() => handleClose(false)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Section({ icon: Icon, label, children }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1">
        <Icon className="w-3 h-3" strokeWidth={1.5} /> {label.toUpperCase()}
      </p>
      {children}
    </div>
  );
}