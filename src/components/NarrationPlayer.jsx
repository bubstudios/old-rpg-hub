import { useState, useRef } from 'react';
import { Volume2, Pause } from 'lucide-react';

export default function NarrationPlayer({ audioUrls }) {
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const audioRef = useRef(null);

  if (!audioUrls || !audioUrls.length) return null;

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setIdx(0);
      audio.src = audioUrls[0];
      audio.play().catch(() => {});
      setPlaying(true);
    }
  }

  function handleEnded() {
    const next = idx + 1;
    if (next < audioUrls.length) {
      setIdx(next);
      audioRef.current.src = audioUrls[next];
      audioRef.current.play().catch(() => {});
    } else {
      setPlaying(false);
      setIdx(0);
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-amber-900/20">
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-[11px] font-heading tracking-wide text-amber-900/70 hover:text-amber-900 transition-colors"
      >
        {playing ? <Pause className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
        {playing ? 'Pause narration' : 'Replay narration'}
      </button>
      <audio ref={audioRef} onEnded={handleEnded} />
    </div>
  );
}