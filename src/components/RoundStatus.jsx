import { Check, Loader2 } from 'lucide-react';

export default function RoundStatus({ activeChars, submittedIds, allIn }) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-2 mb-2">
        <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
        <span className="text-[11px] font-heading tracking-[0.15em] text-muted-foreground">
          {allIn ? 'ALL PARTY MEMBERS HAVE ACTED — THE DM IS RESPONDING' : 'WAITING FOR THE PARTY TO ACT'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {activeChars.map(c => {
          const done = submittedIds.includes(c.id);
          return (
            <span
              key={c.id}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-body border ${done ? 'border-emerald-700/40 bg-emerald-900/20 text-emerald-300' : 'border-border/50 bg-secondary/30 text-muted-foreground'}`}
            >
              {done ? <Check className="w-3 h-3" /> : <Loader2 className="w-3 h-3 animate-spin opacity-50" />}
              {c.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}