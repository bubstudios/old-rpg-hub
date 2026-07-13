import { useEffect, useState } from 'react';
import { X, Sparkles, Crosshair, Heart, FileSearch, AlertTriangle, Lock } from 'lucide-react';
import { ECHO_TYPES, CERTAINTY_LEVELS, CREW_NAMES } from '@/lib/pjFutureEchoes';

const ICONS = { Crosshair, Heart, FileSearch, AlertTriangle };

export default function FutureEchoPopup({ echo, onDismiss, onOpenLog }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!echo) return;
    setVisible(true);
  }, [echo]);

  if (!echo) return null;

  const echoType = ECHO_TYPES[echo.echo_type] || ECHO_TYPES.warning;
  const Icon = ICONS[echoType.icon] || Sparkles;
  const certainty = CERTAINTY_LEVELS[echo.certainty] || CERTAINTY_LEVELS.low;
  const crewName = CREW_NAMES[echo.crew_member] || echo.crew_member;

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 250);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop — distinct from Decision Impact: purple-tinted */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleDismiss} />

      {/* Popup card */}
      <div className={`relative w-full max-w-md border-2 ${echoType.border} bg-card/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>

        {/* Header — distinct shimmer header */}
        <div className={`flex items-center justify-between px-4 py-3 ${echoType.bg} border-b ${echoType.border}`}>
          <span className={`flex items-center gap-2 text-sm font-heading tracking-[0.2em] ${echoType.color}`}>
            <Sparkles className="w-4 h-4 animate-flicker" strokeWidth={1.5} /> FUTURE ECHO
          </span>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[9px] font-heading tracking-wide text-purple-400/80 px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              <Lock className="w-2.5 h-2.5" /> CREW SECRET
            </span>
            <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary/50">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">

          {/* Crew member + echo type */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${echoType.bg} border ${echoType.border}`}>
              <Icon className={`w-5 h-5 ${echoType.color}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-heading text-foreground">{crewName}</p>
              <p className={`text-[10px] font-heading tracking-wide ${echoType.color}`}>{echoType.label.toUpperCase()}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[9px] font-heading tracking-wide text-muted-foreground/60">CERTAINTY</p>
              <p className={`text-[11px] font-heading ${certainty.color}`}>{certainty.label}</p>
            </div>
          </div>

          {/* Memory fragment — the core narrative */}
          <div className="px-3.5 py-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
            <p className="text-sm font-body italic text-foreground/90 leading-relaxed">
              {echo.memory_fragment}
            </p>
          </div>

          {/* Practical meaning */}
          {echo.practical_hint && (
            <div>
              <p className="text-[10px] font-heading tracking-wide text-muted-foreground/70 mb-1">PRACTICAL MEANING</p>
              <p className="text-sm font-body text-foreground/80 leading-relaxed">{echo.practical_hint}</p>
            </div>
          )}

          {/* Unlocked options / warnings */}
          {echo.effects && echo.effects.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-heading tracking-wide text-muted-foreground/70">EFFECT</p>
              {echo.effects.map((eff, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className={`w-1 h-1 rounded-full mt-2 ${echoType.color.replace('text', 'bg')}`} />
                  <span className="font-body text-foreground/80">{eff}</span>
                </div>
              ))}
            </div>
          )}

          {/* Secrecy reminder */}
          <div className="px-3 py-2 rounded border border-purple-500/15 bg-purple-500/5">
            <p className="text-[10px] font-body italic text-purple-300/60 leading-relaxed">
              This memory cannot be proven to outsiders. It is crew knowledge only — an advantage, not evidence.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border/30">
          <button onClick={() => { handleDismiss(); onOpenLog?.(); }} className="flex items-center gap-1 text-[11px] font-heading tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            ECHO LOG <Sparkles className="w-3 h-3" />
          </button>
          <button onClick={handleDismiss} className="ml-auto px-4 py-1.5 rounded text-xs font-heading tracking-wide bg-purple-600/80 text-white hover:bg-purple-600 transition-colors">
            ACKNOWLEDGE
          </button>
        </div>
      </div>
    </div>
  );
}