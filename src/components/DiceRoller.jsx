import { useEffect, useState } from 'react';
import { Dices } from 'lucide-react';

// Renders a single animated die face
function DieFace({ sides, roll, delay }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`relative w-10 h-10 rounded-lg flex items-center justify-center font-heading font-700 text-sm shrink-0 ${
        show ? 'animate-dice' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, hsl(38 50% 92%), hsl(35 40% 82%))',
        color: 'hsl(20 40% 14%)',
        boxShadow: 'inset 0 1px 2px hsl(38 50% 95%), inset 0 -2px 3px hsl(30 40% 60% / 0.4), 0 2px 4px hsl(0 0% 0% / 0.3)',
        border: '1px solid hsl(30 40% 65%)'
      }}
    >
      {show ? roll : '?'}
    </div>
  );
}

export default function DiceRoller({ rolls }) {
  if (!rolls || !rolls.length) return null;

  return (
    <div className="space-y-2.5">
      {rolls.map((r, i) => (
        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/40 border border-border/40">
          <DieFace sides={r.die} roll={r.roll} delay={i * 120} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-heading tracking-wide text-foreground/80 truncate">
              {r.description || r.die}
            </p>
            <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
              <span className="text-xs text-muted-foreground">
                {r.die}: <span className="text-foreground font-600">{r.roll}</span>
              </span>
              {r.modifier ? (
                <span className="text-xs text-muted-foreground">
                  {r.modifier > 0 ? '+' : ''}{r.modifier}
                </span>
              ) : null}
              <span className="text-xs text-muted-foreground">=</span>
              <span className="text-sm font-heading font-700 text-primary">{r.total}</span>
            </div>
            {r.result ? (
              <span className={`inline-block mt-1 text-[10px] font-heading tracking-wider px-2 py-0.5 rounded ${
                /hit|success|pass/i.test(r.result)
                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40'
                  : /miss|fail/i.test(r.result)
                  ? 'bg-red-950/50 text-red-300 border border-red-800/40'
                  : 'bg-secondary text-muted-foreground border border-border/40'
              }`}>
                {r.result}
              </span>
            ) : null}
            {r.target ? (
              <span className="text-[10px] text-muted-foreground/70 ml-1">({r.target})</span>
            ) : null}
          </div>
          <Dices className="w-3.5 h-3.5 text-primary/40 shrink-0" strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
}