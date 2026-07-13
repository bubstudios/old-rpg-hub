import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, Crosshair, Heart, FileSearch, AlertTriangle, Lock, CircleDot } from 'lucide-react';
import { ECHO_TYPES, CERTAINTY_LEVELS, CREW_NAMES } from '@/lib/pjFutureEchoes';

const ICONS = { Crosshair, Heart, FileSearch, AlertTriangle };

export default function FutureEchoLog({ open, onOpenChange, campaignId, campaign }) {
  const [echoes, setEchoes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    loadEchoes();
  }, [open, campaignId]);

  async function loadEchoes() {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('campaignData', {
        op: 'load',
        campaign_id: campaignId
      });
      const flags = res.data?.campaign?.world_state?.quest_flags || {};
      setEchoes(flags.future_echoes || []);
    } catch (e) {
      // Fallback to local campaign state
      const flags = campaign?.world_state?.quest_flags || {};
      setEchoes(flags.future_echoes || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-wide flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 animate-flicker" strokeWidth={1.5} />
            FUTURE ECHO LOG
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-1.5 mb-3 px-1">
          <Lock className="w-3 h-3 text-purple-400/60" />
          <p className="text-[11px] font-body italic text-purple-300/60">
            Crew secrets — these memories cannot be proven to outsiders.
          </p>
        </div>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">Loading echoes...</div>
        ) : echoes.length === 0 ? (
          <div className="py-8 text-center">
            <Sparkles className="w-8 h-8 text-purple-400/30 mx-auto mb-2" strokeWidth={1} />
            <p className="text-sm font-body italic text-muted-foreground">No future echoes yet.</p>
            <p className="text-[11px] font-body text-muted-foreground/60 mt-1">Memories will surface during major decisions.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {[...echoes].reverse().map((echo, i) => {
              const echoType = ECHO_TYPES[echo.echo_type] || ECHO_TYPES.warning;
              const Icon = ICONS[echoType.icon] || Sparkles;
              const certainty = CERTAINTY_LEVELS[echo.certainty] || CERTAINTY_LEVELS.low;
              const crewName = CREW_NAMES[echo.crew_member] || echo.crew_member;
              return (
                <div key={i} className={`border ${echoType.border} ${echoType.bg} rounded-lg p-3`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`w-4 h-4 ${echoType.color}`} strokeWidth={1.5} />
                    <span className="text-sm font-heading text-foreground">{crewName}</span>
                    <span className={`text-[9px] font-heading tracking-wide ${echoType.color} ml-1`}>{echoType.label.toUpperCase()}</span>
                    <span className={`text-[9px] font-heading tracking-wide ${certainty.color} ml-auto`}>{certainty.label.toUpperCase()}</span>
                  </div>
                  <p className="text-sm font-body italic text-foreground/90 leading-relaxed mb-2">{echo.memory_fragment}</p>
                  {echo.practical_hint && (
                    <p className="text-xs font-body text-foreground/70 leading-relaxed mb-1">
                      <span className="text-muted-foreground/60">Meaning:</span> {echo.practical_hint}
                    </p>
                  )}
                  {echo.trigger && (
                    <p className="text-[10px] font-body text-muted-foreground/50">
                      <span className="text-muted-foreground/40">Trigger:</span> {echo.trigger}
                    </p>
                  )}
                  {echo.acted_on !== undefined && (
                    <div className="mt-1.5 flex items-center gap-1">
                      <CircleDot className={`w-3 h-3 ${echo.acted_on ? 'text-emerald-400' : 'text-muted-foreground/40'}`} />
                      <span className={`text-[10px] font-heading ${echo.acted_on ? 'text-emerald-400' : 'text-muted-foreground/50'}`}>
                        {echo.acted_on ? 'ACTED ON' : 'UNRESOLVED'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}