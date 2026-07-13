import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package, Check, AlertTriangle } from 'lucide-react';
import {
  PJ_EVIDENCE, EVIDENCE_PACKAGE_PURPOSES, EVIDENCE_COMBOS, EVIDENCE_PACKAGE_TEMPLATES,
  isEvidenceDiscovered, getEvidenceCredibility, findCombosForKeys
} from '@/lib/pjEvidence';

const CRED_RANK = { LOW: 1, MEDIUM: 2, HIGH: 3, IRREFUTABLE: 4 };

export default function EvidencePackageDialog({ open, onOpenChange, campaign, onSuggestAction }) {
  const [selected, setSelected] = useState(new Set());
  const [purpose, setPurpose] = useState(null);
  const [audience, setAudience] = useState('');

  useEffect(() => {
    if (open) {
      setSelected(new Set());
      setPurpose(null);
      setAudience('');
    }
  }, [open]);

  const available = PJ_EVIDENCE.filter((e) => isEvidenceDiscovered(campaign, e.key));
  const selectedItems = available.filter((e) => selected.has(e.key));
  const selectedKeys = selectedItems.map((e) => e.key);
  const applicableCombos = findCombosForKeys(selectedKeys);
  const minCred = selectedItems.length
    ? selectedItems.reduce((min, e) => Math.min(min, CRED_RANK[getEvidenceCredibility(campaign, e.key)] || 2), 4)
    : 0;
  const isPackage = selected.size >= 3;

  function applyTemplate(tpl) {
    setSelected(new Set(tpl.items.filter(k => available.some(e => e.key === k))));
    setPurpose('persuade_new_titan');
    setAudience('');
  }

  function toggle(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < 5) next.add(key);
      return next;
    });
  }

  function buildPackage() {
    if (selected.size < 2 || !purpose) return;
    const purposeObj = EVIDENCE_PACKAGE_PURPOSES.find((p) => p.key === purpose);
    const itemNames = selectedItems.map((e) => e.label).join(', ');
    const aud = audience.trim() || purposeObj?.audience || '';
    const command = `BUILD EVIDENCE PACKAGE: ${itemNames} | Purpose: ${purposeObj?.label || purpose} | Audience: ${aud}${isPackage ? ' | Evidence Package (3+ verified items)' : ''}`;
    onSuggestAction?.(command);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-[0.15em] text-base flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" strokeWidth={1.5} />
            BUILD EVIDENCE PACKAGE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Quick-select package templates */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-2">
              QUICK-SELECT PACKAGE TEMPLATES
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {EVIDENCE_PACKAGE_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.key}
                  onClick={() => applyTemplate(tpl)}
                  className="text-left p-2 rounded border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  <p className="text-[11px] font-heading text-foreground truncate">{tpl.shortLabel}</p>
                  <p className="text-[9px] font-body text-muted-foreground leading-tight mt-0.5 line-clamp-2">{tpl.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 1: Select evidence */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-2">
              1. SELECT EVIDENCE ({selected.size}/5 — MIN 2)
            </p>
            <div className="space-y-1.5">
              {available.map((e) => {
                const isSel = selected.has(e.key);
                const cred = getEvidenceCredibility(campaign, e.key);
                return (
                  <button
                    key={e.key}
                    onClick={() => toggle(e.key)}
                    disabled={!isSel && selected.size >= 5}
                    className={`flex items-center gap-2.5 w-full p-2 rounded border text-left transition-colors ${
                      isSel
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-border/40 hover:border-primary/30 hover:bg-secondary/30'
                    } ${!isSel && selected.size >= 5 ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSel ? 'bg-primary border-primary' : 'border-border'}`}>
                      {isSel && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={2.5} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-heading text-foreground truncate">{e.label}</p>
                    </div>
                    <span className="text-[10px] font-heading text-muted-foreground shrink-0">{cred}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template effect preview */}
          {(() => {
            const matchedTpl = EVIDENCE_PACKAGE_TEMPLATES.find(t => t.items.every(k => selected.has(k)));
            if (!matchedTpl) return null;
            return (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5">
                <p className="text-[10px] font-heading tracking-[0.12em] text-primary/70 mb-1">{matchedTpl.label}</p>
                <p className="text-xs font-body text-foreground/70 mb-1.5 leading-relaxed">{matchedTpl.desc}</p>
                <div className="space-y-0.5">
                  {matchedTpl.effects.map((eff, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px]">
                      <span className={`font-heading ${eff.direction === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {eff.direction === 'up' ? '↑' : '↓'}
                      </span>
                      <span className="font-body text-foreground/80">{eff.clock.replace(/_/g, ' ')}</span>
                      <span className="text-muted-foreground/60 text-[10px]">— {eff.note}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] font-body italic text-muted-foreground/70 mt-1.5">{matchedTpl.bestFor}</p>
              </div>
            );
          })()}

          {/* Combo preview */}
          {applicableCombos.length > 0 && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-2.5">
              <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.12em] text-primary/70 mb-1">
                <AlertTriangle className="w-3 h-3" /> ACTIVE COMBOS
              </p>
              <div className="space-y-1">
                {applicableCombos.map((c) => (
                  <div key={c.label} className="text-xs">
                    <span className="font-heading text-primary/80">{c.label}:</span>{' '}
                    <span className="font-body text-foreground/70">{c.result}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Choose purpose */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-2">
              2. CHOOSE PURPOSE
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {EVIDENCE_PACKAGE_PURPOSES.map((p) => (
                <button
                  key={p.key}
                  onClick={() => { setPurpose(p.key); setAudience(p.audience); }}
                  className={`text-[11px] font-body px-2 py-2 rounded border text-left transition-colors ${
                    purpose === p.key
                      ? 'border-primary/40 bg-primary/10 text-foreground'
                      : 'border-border/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Audience */}
          {purpose && (
            <div>
              <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1.5">
                3. AUDIENCE (EDITABLE)
              </p>
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Who are you presenting this to?"
                className="w-full bg-input border border-border/40 rounded px-2.5 py-1.5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40"
              />
            </div>
          )}

          {/* Assessment */}
          {selected.size >= 2 && purpose && (
            <div className="rounded-lg border border-border/40 bg-card/40 p-2.5 space-y-1">
              <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-0.5">ASSESSMENT PREVIEW</p>
              <p className="text-xs font-body text-foreground/70 leading-relaxed">
                {selected.size} item{selected.size > 1 ? 's' : ''} · weakest credibility{' '}
                <span className="text-foreground/80">{Object.keys(CRED_RANK).find((k) => CRED_RANK[k] === minCred)}</span>
                {isPackage && ' · Evidence Package (3+ items — usable in major speeches, broadcasts, and legal challenges)'}.
                The GM will evaluate combined credibility, audience receptiveness, timing, risk of panic, counter-propaganda, clock effects, and enemy response.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={buildPackage}
            disabled={selected.size < 2 || !purpose}
            className="gap-2"
          >
            <Package className="w-4 h-4" /> Build Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}