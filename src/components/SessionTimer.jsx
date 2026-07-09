import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Clock, AlertCircle, UserCheck, Loader2 } from 'lucide-react';

export default function SessionTimer({ campaignId, onAccessChange, onPurchaseClick }) {
  const [status, setStatus] = useState('loading');
  const [remaining, setRemaining] = useState(0);
  const [blockType, setBlockType] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const warningShownRef = useRef(false);

  async function checkStatus() {
    try {
      const res = await base44.functions.invoke('sessionBilling', {
        op: 'getStatus',
        campaign_id: campaignId,
      });
      const data = res.data;
      setBlockType(data.block_type);
      setRemaining(data.remaining_seconds);
      setIsOwner(data.is_owner);

      if (data.has_access) {
        setStatus('active');
        onAccessChange?.(true);
      } else if (data.pending) {
        setStatus('pending');
        onAccessChange?.(false);
      } else {
        setStatus('no_access');
        onAccessChange?.(false);
      }
    } catch (e) {
      setStatus('error');
      onAccessChange?.(false);
    }
  }

  useEffect(() => {
    checkStatus();
    const poll = setInterval(checkStatus, 30000);
    return () => clearInterval(poll);
  }, [campaignId]);

  // Local countdown tick (only for paid blocks, not free friends)
  useEffect(() => {
    if (status !== 'active' || blockType === 'free_friend') return;
    const tick = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(tick);
          checkStatus();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [status, blockType]);

  // 15-minute warning toast
  useEffect(() => {
    if (status === 'active' && blockType !== 'free_friend' && remaining > 0 && remaining <= 900 && !warningShownRef.current) {
      warningShownRef.current = true;
      import('sonner').then(({ toast }) => {
        toast.warning('⏳ 15 minutes remaining in your session block. Extend now to keep the adventure going!', { duration: 8000 });
      });
    }
    if (remaining > 900) warningShownRef.current = false;
  }, [remaining, status, blockType]);

  if (status === 'loading' || status === 'error') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-border/40 text-muted-foreground">
        <Loader2 className="w-3 h-3 animate-spin" />
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-amber-700/40 bg-amber-950/30">
        <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />
        <span className="text-[10px] font-heading tracking-wider text-amber-400">PROCESSING…</span>
      </div>
    );
  }

  if (status === 'active' && blockType === 'free_friend') {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-emerald-700/40 bg-emerald-950/30">
        <UserCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={1.5} />
        <span className="text-[10px] font-heading tracking-wider text-emerald-400">GUEST ACCESS</span>
      </div>
    );
  }

  if (status === 'active') {
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    const timeStr = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const isLow = remaining <= 900;

    return (
      <button
        onClick={onPurchaseClick}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors ${isLow ? 'border-red-600/50 bg-red-950/30 hover:bg-red-950/50' : 'border-primary/40 bg-primary/10 hover:bg-primary/20'}`}
        title={isLow ? 'Time running low — click to extend' : 'Click to extend'}
      >
        <Clock className={`w-3.5 h-3.5 ${isLow ? 'text-red-400' : 'text-primary'} animate-flicker`} strokeWidth={1.5} />
        <span className={`text-[10px] font-heading tracking-wider ${isLow ? 'text-red-400' : 'text-primary'}`}>{timeStr}</span>
        {isLow && <AlertCircle className="w-3 h-3 text-red-400 animate-flicker" />}
      </button>
    );
  }

  // no_access — show purchase button
  return (
    <button
      onClick={onPurchaseClick}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-primary/50 bg-primary/15 hover:bg-primary/25 transition-colors"
    >
      <Clock className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
      <span className="text-[10px] font-heading tracking-wider text-primary">BUY TIME</span>
    </button>
  );
}