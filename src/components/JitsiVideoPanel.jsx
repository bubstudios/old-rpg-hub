import { Video, X } from 'lucide-react';

export default function JitsiVideoPanel({ roomName, displayName, onClose }) {
  // Jitsi room names: alphanumeric only — prefix with app slug for uniqueness
  const safeRoom = `OldRPGHub-${String(roomName || '').replace(/[^a-zA-Z0-9]/g, '')}`;
  const name = encodeURIComponent(displayName || 'Adventurer');
  // Keep config minimal: passing too many config options via the URL hash triggers
  // meet.jit.si's "waiting for moderator" block (a known public-server issue).
  // The first person to join a fresh room is automatically granted moderator.
  const jitsiSrc = `https://meet.jit.si/${safeRoom}#userInfo.displayName=${name}&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden bg-card/40 panel-glow mb-4 animate-ink">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-card/60">
        <div className="flex items-center gap-2">
          <Video className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
          <span className="text-[10px] font-heading tracking-[0.15em] text-foreground">PARTY VIDEO CALL</span>
          <span className="text-[9px] text-muted-foreground/50 font-body italic">powered by Jitsi</span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="relative w-full" style={{ height: '340px' }}>
        <iframe
          src={jitsiSrc}
          allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-write"
          className="w-full h-full border-0"
          title="Party Video Call"
        />
      </div>
    </div>
  );
}