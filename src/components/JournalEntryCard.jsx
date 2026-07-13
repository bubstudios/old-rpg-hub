import { Coins, Package, MessageCircle } from 'lucide-react';
import DiceRoller from '@/components/DiceRoller';
import NarrationPlayer from '@/components/NarrationPlayer';

export default function JournalEntryCard({ entry }) {
  const isAction = entry.entry_type === 'action';
  const isNarration = entry.entry_type === 'narration';

  if (isAction) {
    return (
      <div className="flex justify-end animate-ink">
        <div className="max-w-[80%]">
          <div className="bg-secondary/60 border border-border/50 rounded-lg rounded-tr-sm px-4 py-2.5">
            <p className="text-[10px] font-heading tracking-wider text-primary/70 mb-1">
              {entry.acting_character_name || 'A Hero'}
            </p>
            <p className="text-sm text-foreground font-body italic">"{entry.player_action}"</p>
          </div>
        </div>
      </div>
    );
  }

  if (entry.entry_type === 'discussion') {
    return (
      <div className="flex justify-start animate-ink">
        <div className="max-w-[80%]">
          <div className="bg-sky-950/40 border border-sky-800/40 rounded-lg rounded-tl-sm px-4 py-2.5">
            <p className="text-[10px] font-heading tracking-wider text-sky-400/80 mb-1 flex items-center gap-1">
              <MessageCircle className="w-3 h-3" /> {entry.acting_character_name || 'A Hero'} · Discuss
            </p>
            <p className="text-sm text-foreground/90 font-body">{entry.narration}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isNarration) {
    return (
      <div className="animate-ink">
        <div className="tome-surface rounded-lg rounded-tl-sm p-5">
          <p className="tome-text text-sm whitespace-pre-wrap">{entry.narration}</p>
          {entry.audio_urls && entry.audio_urls.length > 0 && (
            <NarrationPlayer audioUrls={entry.audio_urls} />
          )}
          {entry.dice_rolls && entry.dice_rolls.length > 0 && (
            <div className="mt-4 pt-3 border-t border-amber-900/20 space-y-1.5">
              {entry.dice_rolls.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-amber-900/70">
                  <span className="font-heading">⚂</span>
                  <span>{r.description}: {r.die} = <b>{r.total}</b></span>
                  {r.result && <span className="text-amber-900/60">({r.result})</span>}
                </div>
              ))}
            </div>
          )}
          {entry.xp_awarded > 0 && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-900/70">
              <span className="font-heading">✦</span>
              <span>{entry.xp_awarded} XP awarded</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (entry.entry_type === 'dice_roll') {
    return (
      <div className="flex justify-end animate-ink">
        <div className="max-w-[85%]">
          <div className="bg-secondary/50 border border-border/50 rounded-lg rounded-tr-sm px-4 py-2.5">
            <p className="text-[10px] font-heading tracking-wider text-primary/70 mb-1.5">
              {entry.acting_character_name || 'A Hero'} · Roll
            </p>
            <DiceRoller rolls={entry.dice_rolls} />
            {entry.narration && (
              <p className="text-[11px] text-muted-foreground/60 mt-2 italic">{entry.narration}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pull interlude — player-only cutscene (distinct from GM narration)
  if (entry.entry_type === 'system' && entry.narration && entry.narration.startsWith('✦ INTERLUDE')) {
    return (
      <div className="animate-ink">
        <div className="border border-indigo-900/40 bg-indigo-950/30 rounded-lg p-4 text-center panel-glow">
          <p className="text-[10px] font-heading tracking-[0.25em] text-indigo-400/70 mb-2">✦ INTERLUDE — ELSEWHERE ✦</p>
          <p className="text-sm font-body italic text-indigo-100/90 whitespace-pre-wrap leading-relaxed">
            {entry.narration.replace(/^✦ INTERLUDE — ELSEWHERE ✦\n\n/, '')}
          </p>
          <p className="text-[9px] font-heading tracking-[0.2em] text-indigo-500/40 mt-3">— Bullet does not see this —</p>
        </div>
      </div>
    );
  }

  // Event / system entry
  return (
    <div className="flex justify-center animate-ink">
      <div className="text-center py-2">
        <span className="text-[10px] font-heading tracking-[0.2em] text-muted-foreground/60">
          ✦ {entry.narration} ✦
        </span>
      </div>
    </div>
  );
}