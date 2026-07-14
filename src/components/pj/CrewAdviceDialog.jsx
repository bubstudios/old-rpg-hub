import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, ChevronRight, Lightbulb, AlertTriangle } from 'lucide-react';
import { getAllAdvice } from '@/lib/pjCrewAdvice';

const ICON_MAP = {
  User: Users,
  BookMarked: Users,
  FlaskConical: Users,
  Eye: Users,
  Shield: Users,
  Megaphone: Users,
  Navigation: Users,
  Wrench: Users,
  Atom: Users,
  Radio: Users,
  Stethoscope: Users
};

export default function CrewAdviceDialog({ open, onOpenChange, campaign, onCrewAdvice }) {
  const [advice, setAdvice] = useState([]);

  useEffect(() => {
    if (open && campaign) {
      setAdvice(getAllAdvice(campaign));
    }
  }, [open, campaign]);

  function handleAsk(advisor) {
    onCrewAdvice?.(advisor);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-[0.15em] text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" strokeWidth={1.5} />
            CREW ADVICE
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
          The bridge crew offers their read on the current situation. Each officer advises from their area of expertise — listen to the people who know things you don't.
        </p>

        <div className="space-y-2.5">
          {advice.map((a) => {
            const Icon = ICON_MAP[a.icon] || Users;
            return (
              <div
                key={a.key}
                className={`rounded-lg border overflow-hidden ${a.available ? 'border-border/40 bg-card/40' : 'border-border/20 bg-card/20 opacity-50'}`}
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30 bg-secondary/20">
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-heading text-foreground truncate">{a.name}</p>
                    <p className="text-[10px] font-body text-muted-foreground">{a.role}</p>
                  </div>
                  {a.expertise.length > 0 && (
                    <p className="text-[9px] font-body text-muted-foreground/70 text-right max-w-[140px] leading-tight">
                      {a.expertise.slice(0, 3).join(' · ')}
                    </p>
                  )}
                </div>
                <div className="px-3 py-2.5">
                  {a.available ? (
                    <>
                      <p className="text-sm font-body italic text-foreground/85 leading-relaxed">
                        "{a.advice.quote}"
                      </p>

                      {a.advice.recommendedActions?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="text-[9px] font-heading tracking-wide text-muted-foreground">RECOMMENDED ACTIONS</p>
                          <ol className="text-xs font-body text-foreground/75 leading-relaxed list-decimal list-inside space-y-0.5">
                            {a.advice.recommendedActions.map((action, i) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {a.advice.riskWarning && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-500/90 font-body">
                          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{a.advice.riskWarning}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleAsk(a)}
                        className="mt-2.5 flex items-center gap-1 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Lightbulb className="w-3 h-3" /> ASK {a.name.toUpperCase()} <ChevronRight className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <p className="text-xs font-body italic text-muted-foreground leading-relaxed py-1">
                      {typeof a.advice === 'string' ? a.advice : 'Unavailable.'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}