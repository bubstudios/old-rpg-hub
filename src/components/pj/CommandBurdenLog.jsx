import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Scale, AlertTriangle, Heart, MapPin, Eye, Cpu } from 'lucide-react';
import { COMMAND_BURDEN_TYPES } from '@/lib/pjArc3';

const BURDEN_ICONS = {
  Crosshair: AlertTriangle, Heart, MapPin, Eye: AlertTriangle, AlertTriangle, Cpu
};

export default function CommandBurdenLog({ open, onOpenChange, campaign }) {
  const worldState = campaign?.world_state || {};
  const flags = worldState.quest_flags || {};
  const clocks = flags.campaign_clocks || {};
  const captainBurden = clocks.captain_burden || 0;
  const burdens = Array.isArray(flags.command_burdens) ? flags.command_burdens : [];

  const burdenColor = captainBurden >= 80 ? 'text-red-400' : captainBurden >= 60 ? 'text-orange-400' : captainBurden >= 40 ? 'text-amber-400' : 'text-emerald-400';
  const burdenBg = captainBurden >= 80 ? 'bg-red-500' : captainBurden >= 60 ? 'bg-orange-500' : captainBurden >= 40 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40">
          <DialogTitle className="font-heading tracking-[0.15em] text-base flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" strokeWidth={1.5} />
            COMMAND BURDEN
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-body leading-relaxed mt-1">
            The accumulated moral weight on Captain Bub Stellar. Each decision is remembered. Never treat as clean victory.
          </p>
        </DialogHeader>

        <div className="overflow-y-auto p-5 space-y-4 max-h-[78vh] scrollbar-thin">
          {/* Burden meter */}
          <div className="border border-border/40 rounded-lg p-4 bg-card/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-heading tracking-[0.12em] text-muted-foreground/60">CAPTAIN BURDEN</p>
              <p className={`text-lg font-heading ${burdenColor}`}>{captainBurden}</p>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full ${burdenBg} transition-all duration-500`}
                style={{ width: `${Math.min(100, captainBurden)}%` }}
              />
            </div>
            <p className="text-[10px] font-body text-muted-foreground/60 mt-2 leading-relaxed">
              {captainBurden >= 80
                ? 'The weight is crushing. Every decision carries ghosts. The crew sees it in your eyes.'
                : captainBurden >= 60
                ? 'The burden is heavy. Some decisions keep you awake. The crew trusts you but worries.'
                : captainBurden >= 40
                ? 'The weight is growing. You have made hard choices. You carry them visibly.'
                : 'The burden is still manageable. Hard choices lie ahead.'}
            </p>
          </div>

          {/* Burden log */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-2">RECORDED BURDENS</p>
            {burdens.length === 0 ? (
              <div className="text-center py-8">
                <Scale className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" strokeWidth={1} />
                <p className="text-xs font-body text-muted-foreground italic">No burdens recorded yet.</p>
                <p className="text-[10px] font-body text-muted-foreground/60 mt-1">
                  Moral decisions will be recorded here as the campaign progresses.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {burdens.map((b, i) => {
                  const typeInfo = COMMAND_BURDEN_TYPES.find(t => t.key === b.type) || {};
                  const Icon = BURDEN_ICONS[typeInfo.icon] || AlertTriangle;
                  return (
                    <div key={i} className="border border-border/40 rounded-lg p-3 bg-card/20">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded bg-red-950/30 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-red-400/70" strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-heading text-foreground">{b.title}</p>
                          {b.reason && (
                            <p className="text-[10px] font-body text-muted-foreground/70 mt-0.5 leading-relaxed">{b.reason}</p>
                          )}
                          {Array.isArray(b.cost) && b.cost.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {b.cost.map((c, j) => (
                                <span key={j} className="text-[9px] font-body px-1.5 py-0.5 rounded bg-red-950/30 text-red-400/60">
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Burden types reference */}
          {burdens.length === 0 && (
            <div>
              <p className="text-[10px] font-heading tracking-[0.12em] text-primary/40 mb-1.5">BURDEN TYPES</p>
              <div className="grid grid-cols-2 gap-1">
                {COMMAND_BURDEN_TYPES.map(t => {
                  const Icon = BURDEN_ICONS[t.icon] || AlertTriangle;
                  return (
                    <div key={t.key} className="flex items-center gap-1.5 px-2 py-1 rounded border border-border/20">
                      <Icon className="w-2.5 h-2.5 text-muted-foreground/40" strokeWidth={1.5} />
                      <span className="text-[10px] font-body text-muted-foreground/60">{t.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}