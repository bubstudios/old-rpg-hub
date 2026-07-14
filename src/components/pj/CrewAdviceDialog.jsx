import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, AlertTriangle, MessageCircle, X, ArrowLeft, RefreshCw } from 'lucide-react';
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

const FOLLOW_UP_QUESTIONS = [
  'What part worries you most?',
  'Which option is safest?',
  'What would you do in my position?'
];

function getFirstName(name) {
  return name.replace(/^(Cmdr|Lt|Ens|Prof|Dr|Chief|Lt\.)\s+/, '').split(' ')[0];
}

export default function CrewAdviceDialog({ open, onOpenChange, campaign, onCrewAction, onDiscuss }) {
  const [advice, setAdvice] = useState([]);
  const [dismissed, setDismissed] = useState({});
  const [discussing, setDiscussing] = useState(null);

  const refreshAdvice = useCallback(() => {
    if (campaign) {
      setAdvice(getAllAdvice(campaign));
      setDismissed({});
      setDiscussing(null);
    }
  }, [campaign]);

  useEffect(() => {
    if (open && campaign) {
      refreshAdvice();
    }
  }, [open, campaign, refreshAdvice]);

  function handleAction(advisor, actionText) {
    onCrewAction?.(advisor, actionText);
    onOpenChange(false);
  }

  function handleFollowUp(advisor, question) {
    const firstName = getFirstName(advisor.name);
    const questionText = `${firstName}, ${question.toLowerCase()}`;
    onDiscuss?.(advisor, questionText);
    onOpenChange(false);
  }

  function handleDismiss(key) {
    setDismissed(prev => ({ ...prev, [key]: true }));
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

        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-xs text-muted-foreground font-body leading-relaxed flex-1">
            Advice is based on the current mission state. Refresh after major decisions.
          </p>
          <Button variant="ghost" size="sm" onClick={refreshAdvice} className="text-muted-foreground hover:text-foreground h-7 px-2 shrink-0">
            <RefreshCw className="w-3 h-3 mr-1" /> Refresh
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground/70 font-body leading-relaxed mb-2">
          These are recommendations, not automatic orders. Click an action to issue the command.
          Multiple crew members may recommend different approaches — you do not have to follow all advice.
        </p>

        <div className="space-y-2.5">
          {advice.filter(a => !dismissed[a.key]).map((a) => {
            const Icon = ICON_MAP[a.icon] || Users;
            const isDiscussing = discussing === a.key;
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

                      {a.advice.riskWarning && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-500/90 font-body">
                          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{a.advice.riskWarning}</span>
                        </div>
                      )}

                      {isDiscussing ? (
                        <div className="mt-2.5 space-y-1.5">
                          <p className="text-[9px] font-heading tracking-wide text-muted-foreground">FOLLOW-UP QUESTIONS</p>
                          {FOLLOW_UP_QUESTIONS.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => handleFollowUp(a, q)}
                              className="block w-full text-left text-xs font-body text-foreground/75 hover:text-primary transition-colors py-1 px-2 rounded hover:bg-primary/5"
                            >
                              "{q}"
                            </button>
                          ))}
                          <button
                            onClick={() => setDiscussing(null)}
                            className="flex items-center gap-1 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-foreground transition-colors mt-1.5"
                          >
                            <ArrowLeft className="w-3 h-3" /> Back to actions
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2.5 space-y-1.5">
                          <p className="text-[9px] font-heading tracking-wide text-muted-foreground">RECOMMENDED ACTIONS</p>
                          {a.advice.recommendedActions?.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => handleAction(a, action)}
                              className="block w-full text-left text-xs font-body text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors px-2.5 py-2 rounded border border-border/30 hover:border-primary/30"
                            >
                              {action}
                            </button>
                          ))}

                          <div className="flex gap-3 mt-2">
                            <button
                              onClick={() => setDiscussing(a.key)}
                              className="flex items-center gap-1 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-primary transition-colors"
                            >
                              <MessageCircle className="w-3 h-3" /> DISCUSS
                            </button>
                            <button
                              onClick={() => handleDismiss(a.key)}
                              className="flex items-center gap-1 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <X className="w-3 h-3" /> DISMISS
                            </button>
                          </div>
                        </div>
                      )}
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