import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Volume2, Square, Loader2 } from 'lucide-react';
import { enforceReadableNarration } from '@/lib/pjNarrationFilter';

export default function NarrationPlayer({ narration }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);
  const narrationKey = useRef(null);

  useEffect(() => {
    if (!narration) return;
    const cleanText = enforceReadableNarration(narration).trim();
    if (!cleanText) return;

    // Skip if this is the same narration we already processed
    const key = cleanText.slice(0, 80);
    if (narrationKey.current === key) return;
    narrationKey.current = key;

    // If user muted, don't generate audio
    if (muted) {
      setAudioUrl(null);
      return;
    }

    let cancelled = false;
    async function generate() {
      setLoading(true);
      setAudioUrl(null);
      try {
        const res = await base44.integrations.Core.GenerateSpeech({
          text: cleanText.slice(0, 5000),
          voice: 'storm'
        });
        if (!cancelled && res?.url) {
          setAudioUrl(res.url);
        }
      } catch (e) {
        /* silent fail — narration still shows as text */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    generate();
    return () => { cancelled = true; };
  }, [narration, muted]);

  useEffect(() => {
    if (audioUrl && audioRef.current && !muted) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {
        /* autoplay blocked — user can click play */
      });
    }
  }, [audioUrl, muted]);

  if (muted) {
    return (
      <button
        onClick={() => setMuted(false)}
        className="flex items-center gap-1.5 text-[10px] font-heading tracking-wider text-muted-foreground/50 hover:text-foreground transition-colors"
        title="Unmute voice narration"
      >
        <Volume2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Voice
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <span className="flex items-center gap-1.5 text-[10px] font-heading tracking-wider text-primary/60">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Voice...
        </span>
      ) : audioUrl ? (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setPlaying(true)}
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
          />
          {playing ? (
            <button
              onClick={() => { audioRef.current?.pause(); setPlaying(false); }}
              className="flex items-center gap-1.5 text-[10px] font-heading tracking-wider text-primary hover:text-primary/80 transition-colors"
              title="Stop voice narration"
            >
              <Square className="w-3.5 h-3.5 fill-current" strokeWidth={1.5} /> Stop
            </button>
          ) : (
            <button
              onClick={() => { audioRef.current?.play(); setPlaying(true); }}
              className="flex items-center gap-1.5 text-[10px] font-heading tracking-wider text-primary/70 hover:text-primary transition-colors"
              title="Play voice narration"
            >
              <Volume2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Voice
            </button>
          )}
        </>
      ) : null}
      <button
        onClick={() => { setMuted(true); audioRef.current?.pause(); setPlaying(false); }}
        className="text-[10px] font-heading tracking-wider text-muted-foreground/40 hover:text-foreground transition-colors"
        title="Mute voice narration"
      >
        Mute
      </button>
    </div>
  );
}