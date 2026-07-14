import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScanLine, Users, AlertTriangle, Check, Shield, Send } from 'lucide-react';
import { KIMELON_SPECS, KIMELON_RESULTS, SHAPESHIFTER_SUSPECTS, VERIFIED_ALLIES } from '@/lib/pjArc3';

export default function KimelonScanner({ open, onOpenChange, campaign, onSuggestAction }) {
  const [scanTarget, setScanTarget] = useState('');

  const worldState = campaign?.world_state || {};
  const flags = worldState.quest_flags || {};
  const arc3 = flags.arc3 || {};
  const kimelonState = arc3.kimelon || { unlocked: false };
  const scanHistory = Array.isArray(arc3.kimelon_scans) ? arc3.kimelon_scans : [];

  function handleScan() {
    if (!scanTarget.trim()) return;
    onSuggestAction?.(`Use the kimelon scanner to scan ${scanTarget.trim()}. Record the result and assess what it means.`);
    onOpenChange(false);
    setScanTarget('');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40">
          <DialogTitle className="font-heading tracking-[0.15em] text-base flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-primary" strokeWidth={1.5} />
            KIMELON SCANNER
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-body leading-relaxed mt-1">
            Portable shapeshifter detection device. Detects Confluence biotech — not loyalty. A human scan proves biology, not trustworthiness.
          </p>
        </DialogHeader>

        <div className="overflow-y-auto p-5 space-y-4 max-h-[78vh] scrollbar-thin">
          {/* Scanner status */}
          <div className="border border-border/40 rounded-lg p-3 bg-card/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <Spec label="Detection Time" value={KIMELON_SPECS.detectionTime} />
              <Spec label="Range" value={KIMELON_SPECS.range} />
              <Spec label="Units" value={`${KIMELON_SPECS.units}`} />
              <Spec label="Secrecy" value={KIMELON_SPECS.secrecyLevel} />
            </div>
            <div className="mt-2 pt-2 border-t border-border/30">
              <p className="text-[10px] font-heading tracking-wide text-primary/50 mb-1">LIMITATIONS</p>
              <p className="text-[11px] font-body text-muted-foreground leading-relaxed">
                {KIMELON_SPECS.limitations.join(' · ')}
              </p>
            </div>
          </div>

          {/* Scan action */}
          <div className="flex gap-2">
            <input
              type="text"
              value={scanTarget}
              onChange={(e) => setScanTarget(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Enter NPC name to scan..."
              className="flex-1 px-3 py-2 rounded-md border border-input bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button onClick={handleScan} size="sm" disabled={!scanTarget.trim()}>
              <Send className="w-3.5 h-3.5 mr-1" /> Scan
            </Button>
          </div>

          {/* Scan results reference */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1.5">POSSIBLE RESULTS</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {KIMELON_RESULTS.map(r => (
                <div key={r.key} className="flex items-start gap-2 px-2.5 py-1.5 rounded border border-border/30">
                  <span className={`w-2 h-2 rounded-full ${r.dot} mt-1 shrink-0`} />
                  <div>
                    <p className={`text-[11px] font-heading ${r.color}`}>{r.label}</p>
                    <p className="text-[10px] font-body text-muted-foreground leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Known suspects */}
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-red-400/70 mb-1.5">
              <AlertTriangle className="w-3 h-3" strokeWidth={1.5} /> CONFIRMED SHAPESHIFTERS
            </p>
            <div className="space-y-1">
              {SHAPESHIFTER_SUSPECTS.map((s, i) => (
                <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded border border-border/30 bg-card/20">
                  <div className="min-w-0">
                    <p className="text-[11px] font-heading text-foreground truncate">{s.name}</p>
                    <p className="text-[9px] font-body text-muted-foreground/70 truncate">{s.notes}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded ${
                      s.outcome === 'EXECUTED' || s.outcome === 'ARRESTED' || s.outcome === 'EXPOSED' || s.outcome === 'neutralized'
                        ? 'bg-emerald-950/40 text-emerald-400/70'
                        : s.outcome === 'AT_LARGE' || s.outcome === 'ESCAPED'
                        ? 'bg-red-950/40 text-red-400/70'
                        : 'bg-amber-950/40 text-amber-400/70'
                    }`}>{s.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified allies */}
          <div>
            <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-emerald-400/70 mb-1.5">
              <Shield className="w-3 h-3" strokeWidth={1.5} /> VERIFIED HUMAN ALLIES
            </p>
            <div className="space-y-1">
              {VERIFIED_ALLIES.map((a, i) => (
                <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded border border-border/30 bg-card/20">
                  <div className="min-w-0">
                    <p className="text-[11px] font-heading text-foreground truncate">
                      {a.captain} <span className="text-muted-foreground/50">· {a.ship}</span>
                    </p>
                    <p className="text-[9px] font-body text-muted-foreground/70 truncate">{a.notes}</p>
                    {a.caution && (
                      <p className="text-[9px] font-body text-amber-400/70">⚠ {a.caution}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] font-body text-muted-foreground">Trust {a.trust}</span>
                    <span className="text-[9px] font-heading text-emerald-400/60 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> HUMAN
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Spec({ label, value }) {
  return (
    <div>
      <p className="text-[9px] font-heading tracking-wide text-muted-foreground/50 uppercase">{label}</p>
      <p className="text-[11px] font-body text-foreground/80">{value}</p>
    </div>
  );
}