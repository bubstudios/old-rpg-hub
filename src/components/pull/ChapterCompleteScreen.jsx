import { Loader2, ChevronRight, Package, Users, Heart, ScrollText, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// End-of-chapter screen shown when a chapter module completes.
// Displays the structured handoff: carried items, known people, debts, canonical events.
// The Continue button starts the next chapter module.
export default function ChapterCompleteScreen({ open, handoff, chapterNumber, onContinue, continuing }) {
  if (!handoff) return null;

  const nextChapterTitle = handoff.nextChapterTitle || 'The Next Province';

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto border-primary/30" >
        <DialogHeader>
          <DialogTitle className="font-heading tracking-[0.15em] text-center text-primary">
            CHAPTER {chapterNumber} COMPLETE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Summary */}
          <div className="text-center pb-3 border-b border-border/30">
            <p className="font-tome text-sm text-foreground/80 italic leading-relaxed">
              {handoff.bullet?.name || 'Bullet'} survived and moved onward.
              The Pull will not let the journey end here.
            </p>
          </div>

          {/* Bullet State */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-heading tracking-wider text-muted-foreground">CONDITION:</span>
            <span className="font-body text-foreground/90 capitalize">{handoff.bullet?.condition}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="font-heading tracking-wider text-muted-foreground">SCAR:</span>
            <span className="font-body text-foreground/90 capitalize">{handoff.bullet?.scarStatus}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="font-heading tracking-wider text-muted-foreground">PULL:</span>
            <span className="font-body text-foreground/90 capitalize">{handoff.bullet?.pullStatus}</span>
          </div>

          {/* Carried Forward Items */}
          {handoff.inventory?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Package className="w-3.5 h-3.5 text-primary/70" strokeWidth={1.5} />
                <h4 className="font-heading text-[11px] tracking-[0.15em] text-muted-foreground">CARRIED FORWARD</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-5">
                {handoff.inventory.map((item, i) => (
                  <span key={i} className="text-[11px] font-body px-2 py-0.5 rounded bg-secondary/40 border border-border/30 text-foreground/80">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* People Remembered */}
          {handoff.knownPeople?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-primary/70" strokeWidth={1.5} />
                <h4 className="font-heading text-[11px] tracking-[0.15em] text-muted-foreground">PEOPLE REMEMBERED</h4>
              </div>
              <div className="pl-5 space-y-0.5">
                {handoff.knownPeople.map((npc, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-body">
                    <span className="text-foreground/90">{npc.name}</span>
                    {npc.role && <span className="text-muted-foreground/50">({npc.role})</span>}
                    {npc.status && npc.status !== 'Alive' && (
                      <span className="text-red-400/70 text-[10px]">{npc.status}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Debts Carried */}
          {handoff.debts?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Heart className="w-3.5 h-3.5 text-primary/70" strokeWidth={1.5} />
                <h4 className="font-heading text-[11px] tracking-[0.15em] text-muted-foreground">DEBTS CARRIED</h4>
              </div>
              <div className="pl-5 space-y-0.5">
                {handoff.debts.map((debt, i) => (
                  <p key={i} className="text-[11px] font-body text-foreground/70 italic">{debt}</p>
                ))}
              </div>
            </div>
          )}

          {/* Canonical Events */}
          {handoff.canonicalEvents?.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <ScrollText className="w-3.5 h-3.5 text-primary/70" strokeWidth={1.5} />
                <h4 className="font-heading text-[11px] tracking-[0.15em] text-muted-foreground">WHAT HAPPENED</h4>
              </div>
              <div className="pl-5 space-y-0.5">
                {handoff.canonicalEvents.map((ev, i) => (
                  <p key={i} className="text-[11px] font-body text-foreground/60 leading-relaxed">{ev}</p>
                ))}
              </div>
            </div>
          )}

          {/* Player-Only Knowledge */}
          {handoff.playerOnlyKnowledge?.length > 0 && (
            <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400/70" strokeWidth={1.5} />
                <h4 className="font-heading text-[11px] tracking-[0.15em] text-indigo-300/70">ELSEWHERE — BULLET DOES NOT SEE THIS</h4>
              </div>
              <div className="pl-5 space-y-0.5">
                {handoff.playerOnlyKnowledge.map((k, i) => (
                  <p key={i} className="text-[11px] font-body text-indigo-200/60 italic leading-relaxed">{k}</p>
                ))}
              </div>
            </div>
          )}

          {/* Next Chapter Teaser */}
          <div className="pt-3 border-t border-border/30 text-center">
            <p className="font-tome text-sm text-foreground/80 italic">
              Next: {nextChapterTitle}
            </p>
          </div>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            disabled={continuing}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-heading tracking-[0.1em] h-11"
          >
            {continuing ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Loading Chapter {chapterNumber + 1}...</>
            ) : (
              <>Continue to Chapter {chapterNumber + 1} <ChevronRight className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}