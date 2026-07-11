import { Link2, BookOpen } from 'lucide-react';
import { CODEX_CATEGORIES } from '@/lib/pullRules';
import { PLAYER_CODEX, getPlayerCodexContent, isPlayerCodexEntryVisible, getCurrentObjective } from '@/lib/pullSheetData';

export default function CodexLinksTab({ flags }) {
  const visible = Object.entries(PLAYER_CODEX).filter(([_, entry]) => isPlayerCodexEntryVisible(entry, flags));

  // Group by category
  const grouped = {};
  visible.forEach(([key, entry]) => {
    if (!grouped[entry.category]) grouped[entry.category] = [];
    grouped[entry.category].push(entry);
  });

  return (
    <div className="space-y-3">
      <div className="border border-border/50 rounded-lg bg-card/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Link2 className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">CODEX LINKS</h3>
        </div>
        <div className="space-y-4">
          {CODEX_CATEGORIES.map(cat => {
            const entries = grouped[cat.id];
            if (!entries || entries.length === 0) return null;
            return (
              <div key={cat.id}>
                <p className="text-xs font-heading tracking-[0.15em] text-primary/60 uppercase mb-2">{cat.label}</p>
                <div className="space-y-2">
                  {entries.map(entry => {
                    const content = entry.category === 'objective' ? getCurrentObjective(flags) : getPlayerCodexContent(entry, flags);
                    if (!content) return null;
                    return (
                      <div key={entry.title} className="border border-border/30 rounded-lg p-3 bg-secondary/5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <BookOpen className="w-3 h-3 text-primary/50" strokeWidth={1.5} />
                          <p className="font-heading text-xs text-foreground">{entry.title}</p>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{content}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {visible.length === 0 && (
          <p className="text-xs text-muted-foreground/50 font-body text-center py-4">
            No codex entries unlocked yet. The journey has just begun.
          </p>
        )}
      </div>
    </div>
  );
}