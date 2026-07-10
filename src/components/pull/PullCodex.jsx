import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { CODEX_CATEGORIES, CODEX_ENTRIES, PROVINCES } from '@/lib/pullRules';

export default function PullCodex({ open, onOpenChange, campaign, onSuggestAction }) {
  const [section, setSection] = useState('story');
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    if (open) {
      setSection('story');
      setExpanded(new Set(['story']));
    }
  }, [open]);

  function toggle(key) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (!campaign) return null;

  const flags = campaign.world_state?.quest_flags || {};
  const codexUnlocks = flags.codex_unlocks || [];
  const currentProvince = flags.current_province || 618;
  const provinceHistory = flags.province_history || [];
  const chapter = campaign.current_chapter || 1;

  function isEntryVisible(entry) {
    if (entry.alwaysVisible) return true;
    if (entry.requiresProvince !== undefined) {
      if (currentProvince === entry.requiresProvince) return true;
      if (provinceHistory.includes(entry.requiresProvince)) return true;
      // Special case: province 14 covers both 14 and 140
      if (entry.requiresProvince === 14 && (currentProvince === 14 || currentProvince === 140 || provinceHistory.includes(14) || provinceHistory.includes(140))) return true;
    }
    if (entry.requiresUnlock) {
      if (codexUnlocks.includes(entry.requiresUnlock)) return true;
    }
    return false;
  }

  function isEntryLocked(entry) {
    if (entry.alwaysVisible) return false;
    return !isEntryVisible(entry);
  }

  // Get entries for current section
  const sectionEntries = Object.entries(CODEX_ENTRIES)
    .filter(([key, entry]) => entry.category === section)
    .map(([key, entry]) => ({ key, ...entry }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40">
          <DialogTitle className="font-heading tracking-[0.15em] text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" strokeWidth={1.5} />
            CODEX
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row h-[68vh]">
          {/* Category sidebar */}
          <div className="sm:w-48 sm:shrink-0 border-b sm:border-b-0 sm:border-r border-border/40 overflow-y-auto">
            <div className="flex sm:flex-col gap-1 p-2 overflow-x-auto sm:overflow-x-visible">
              {CODEX_CATEGORIES.map(cat => {
                const active = section === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSection(cat.id)}
                    className={`shrink-0 sm:w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-heading tracking-wide transition-colors ${
                      active
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {sectionEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground font-body italic text-center py-8">
                No entries discovered yet. Explore the Provinces to uncover knowledge.
              </p>
            ) : (
              <div className="space-y-2">
                {sectionEntries.map(entry => {
                  const visible = isEntryVisible(entry);
                  const locked = isEntryLocked(entry);
                  const isExpanded = expanded.has(entry.key);
                  return (
                    <div key={entry.key} className={`border rounded-lg overflow-hidden bg-card/30 ${locked ? 'border-border/20 opacity-50' : 'border-border/40'}`}>
                      <button
                        onClick={() => !locked && toggle(entry.key)}
                        disabled={locked}
                        className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors disabled:cursor-not-allowed"
                      >
                        <span className="font-heading text-sm text-foreground pr-2">{entry.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {locked && <Lock className="w-3 h-3 text-muted-foreground/50" strokeWidth={1.5} />}
                          {!locked && (isExpanded
                            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />)}
                        </div>
                      </button>
                      {isExpanded && !locked && (
                        <div className="px-3 pb-3">
                          <p className="text-sm font-body text-foreground/80 leading-relaxed whitespace-pre-line">{entry.content}</p>
                          {onSuggestAction && entry.suggestAction && (
                            <button
                              onClick={() => { onSuggestAction(entry.suggestAction); }}
                              className="mt-2 text-[10px] font-heading tracking-wide text-primary hover:text-primary/80 transition-colors"
                            >
                              → {entry.suggestAction}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}