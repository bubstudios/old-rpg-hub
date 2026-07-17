import { ScrollText } from 'lucide-react';
import DiceRoller from './DiceRoller';
import { enforceReadableNarration } from '@/lib/pjNarrationFilter';

export default function DMNarration({ narration, diceRolls }) {
  if (!narration) return null;

  return (
    <div className="animate-ink">
      <div className="parchment-ornate rounded-lg p-6 sm:p-8 relative overflow-hidden">
        {/* Corner flourishes */}
        <div className="absolute top-3 left-3 text-primary/30">
          <ScrollText className="w-4 h-4" strokeWidth={1} />
        </div>
        <div className="absolute top-3 right-3 text-primary/30">
          <ScrollText className="w-4 h-4" strokeWidth={1} />
        </div>

        <div className="divider-rune mb-5 mt-2">
          <span className="text-xs tracking-[0.3em]">✦</span>
        </div>

        <div className="tome-text text-[15px] sm:text-base whitespace-pre-wrap">
          {enforceReadableNarration(narration)}
        </div>

        {diceRolls && diceRolls.length > 0 && (
          <div className="mt-6 pt-4 border-t border-amber-900/20">
            <p className="text-[10px] font-heading tracking-[0.2em] text-amber-900/60 mb-3">
              ⚄ DICE CAST BY THE DUNGEON MASTER ⚄
            </p>
            <DiceRoller rolls={diceRolls} />
          </div>
        )}

        <div className="divider-rune mt-6">
          <span className="text-xs tracking-[0.3em]">✦</span>
        </div>
      </div>
    </div>
  );
}