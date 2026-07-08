import { useEffect, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import uitoolkit from '@zoom/videosdk-ui-toolkit';
import '@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css';
import { Video, X, Loader2 } from 'lucide-react';

export default function ZoomVideoPanel({ roomName, displayName, onClose }) {
  const containerRef = useRef(null);
  const sessionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const safeRoom = `OldRPGHub-${String(roomName || '').replace(/[^a-zA-Z0-9]/g, '')}`;

  useEffect(() => {
    let cancelled = false;

    async function join() {
      try {
        const res = await base44.functions.invoke('zoomVideoToken', {
          session_name: safeRoom,
          role_type: 1
        });
        if (cancelled) return;

        const config = {
          videoSDKJWT: res.data.token,
          sessionName: safeRoom,
          userName: displayName || 'Adventurer',
          sessionPasscode: '',
          featuresOptions: [
            'video', 'audio', 'share', 'chat', 'users', 'settings',
            'leave', 'footer', 'header', 'viewMode'
          ]
        };

        if (containerRef.current) {
          uitoolkit.joinSession(containerRef.current, config);
          sessionRef.current = config;
        }
        setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError(e.response?.data?.error || e.message);
          setLoading(false);
        }
      }
    }

    join();

    return () => {
      cancelled = true;
      try {
        if (sessionRef.current) {
          uitoolkit.closeSession(containerRef.current);
          sessionRef.current = null;
        }
      } catch (e) { /* ignore */ }
    };
  }, [safeRoom, displayName]);

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden bg-card/40 panel-glow mb-4 animate-ink">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-card/60">
        <div className="flex items-center gap-2">
          <Video className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <span className="text-[10px] font-heading tracking-[0.15em] text-foreground">PARTY VIDEO CALL</span>
          <span className="text-[9px] text-muted-foreground/50 font-body italic">powered by Zoom</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="relative w-full" style={{ height: '380px' }}>
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-primary/50 animate-spin" />
            <p className="text-[11px] font-body italic text-muted-foreground">Joining the party call...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <p className="text-[11px] text-red-400 font-body">Failed to join video call</p>
            <p className="text-[10px] text-muted-foreground/60">{error}</p>
          </div>
        )}
        <div
          ref={containerRef}
          id="zoom-session-container"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}