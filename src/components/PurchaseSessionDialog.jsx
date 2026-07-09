import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { User, Users, Loader2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function PurchaseSessionDialog({ open, onOpenChange, campaignId }) {
  const [purchasing, setPurchasing] = useState(null);

  async function handlePurchase(sessionType) {
    setPurchasing(sessionType);
    try {
      const res = await base44.functions.invoke('create-checkout', {
        session_type: sessionType,
        campaign_id: campaignId,
      });
      if (res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        toast.error('Failed to start checkout');
        setPurchasing(null);
      }
    } catch (e) {
      toast.error('Payment setup failed: ' + (e.response?.data?.error || e.message));
      setPurchasing(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Purchase Session Time
          </DialogTitle>
          <DialogDescription className="text-xs">
            Each block grants 4 hours of AI Game Master play. The timer starts when you begin playing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <button
            onClick={() => handlePurchase('solo')}
            disabled={!!purchasing}
            className="w-full flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card/40 hover:border-primary/40 hover:bg-secondary/20 transition-all text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-600 text-sm text-foreground">Solo Session</p>
              <p className="text-[11px] text-muted-foreground font-body">1 player + AI GM · 4 hours</p>
            </div>
            <span className="font-heading font-700 text-lg text-primary">$9.99</span>
            {purchasing === 'solo' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </button>
          <button
            onClick={() => handlePurchase('table')}
            disabled={!!purchasing}
            className="w-full flex items-center gap-4 p-4 rounded-lg border border-border/50 bg-card/40 hover:border-primary/40 hover:bg-secondary/20 transition-all text-left disabled:opacity-50"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-600 text-sm text-foreground">Table Session</p>
              <p className="text-[11px] text-muted-foreground font-body">2–7 players + AI GM · 4 hours</p>
            </div>
            <span className="font-heading font-700 text-lg text-primary">$17.99</span>
            {purchasing === 'table' && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 font-body italic text-center mt-2">
          You'll be redirected to secure checkout. Your session timer starts when you return and begin playing.
        </p>
      </DialogContent>
    </Dialog>
  );
}