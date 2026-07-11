import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { CODEX_CATEGORIES } from '@/lib/pullRules';
import { PLAYER_CODEX, getPlayerCodexContent, isPlayerCodexEntryVisible, getPlayerCodexTitle } from '@/lib/pullSheetData';

export default function PullCodex({ open, onOpenChange, campaign, onSuggestAction }) {
  const [section, setSection] = useState('story');
  const [expanded, setExpanded] = useState(new Set());

  useEffect(() => {
    if (open) {
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

  // Build label map from CODEX_CATEGORIES
  const catLabels = {};
  CODEX_CATEGORIES.forEach(c => { catLabels[c.id] = c.label; });

  // Get all visible entries — undiscovered entries are excluded entirely (no locked placeholders)
  const visibleEntries = Object.entries(PLAYER_CODEX)
    .filter(([_, entry]) => isPlayerCodexEntryVisible(entry, flags))
    .map(([key, entry]) => ({ key, ...entry }));

  // Derive visible categories — only categories that have at least one visible entry appear
  const visibleCategoryIds = [...new Set(visibleEntries.map(e => e.category))];
  const visibleCategories = visibleCategoryIds.map(id => ({ id, label: catLabels[id] || id }));

  // Ensure the active section is valid
  const activeSection = visibleCategories.some(c => c.id === section) ? section : (visibleCategories[0]?.id || 'story');

  // Get entries for the active section
  const sectionEntries = visibleEntries.filter(e => e.category === activeSection);

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
          {/* Category sidebar — only categories with discovered content */}
          <div className="sm:w-48 sm:shrink-0 border-b sm:border-b-0 sm:border-r border-border/40 overflow-y-auto">
            <div className="flex sm:flex-col gap-1 p-2 overflow-x-auto sm:overflow-x-visible">
              {visibleCategories.map(cat => {
                const active = activeSection === cat.id;
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

          {/* Content — no locked entries, no lock icons */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {sectionEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground font-body italic text-center py-8">
                Nothing discovered yet.
              </p>
            ) : (
              <div className="space-y-2">
                {sectionEntries.map(entry => {
                  const content = getPlayerCodexContent(entry, flags);
                  const title = getPlayerCodexTitle(entry, flags);
                  const isExpanded = expanded.has(entry.key);
                  return (
                    <div key={entry.key} className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
                      <button
                        onClick={() => toggle(entry.key)}
                        className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors"
                      >
                        <span className="font-heading text-sm text-foreground pr-2">{title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          {isExpanded
                            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
                            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3">
                          <p className="text-sm font-body text-foreground/80 leading-relaxed whitespace-pre-line">{content}</p>
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