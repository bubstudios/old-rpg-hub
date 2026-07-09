import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, X, Mail, Loader2, Gift } from 'lucide-react';
import { toast } from 'sonner';

const MAX_FRIENDS = 3;

export default function FreeFriendsManager({ campaignId, open, onOpenChange }) {
  const [friends, setFriends] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (open) loadFriends();
  }, [campaignId, open]);

  async function loadFriends() {
    try {
      const res = await base44.functions.invoke('sessionBilling', {
        op: 'getFreeFriends',
        campaign_id: campaignId,
      });
      setFriends(res.data.free_friend_emails || []);
    } catch (e) {
      toast.error('Failed to load friends list');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!email.trim()) return;
    setAdding(true);
    try {
      const res = await base44.functions.invoke('sessionBilling', {
        op: 'addFreeFriend',
        campaign_id: campaignId,
        email: email.trim(),
      });
      setFriends(res.data.free_friend_emails || []);
      setEmail('');
      toast.success('Friend added — they get free DM access.');
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to add friend');
    } finally {
      setAdding(false);
    }
  }

  async function handleRemove(em) {
    try {
      const res = await base44.functions.invoke('sessionBilling', {
        op: 'removeFreeFriend',
        campaign_id: campaignId,
        email: em,
      });
      setFriends(res.data.free_friend_emails || []);
    } catch (e) {
      toast.error('Failed to remove friend');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-wide flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" /> Free Friends
          </DialogTitle>
          <DialogDescription className="text-xs">
            Up to {MAX_FRIENDS} friends get free AI Game Master access in this campaign. Add them by email — they must register with that exact email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
            </div>
          ) : friends.length === 0 ? (
            <p className="text-[11px] font-tome italic text-muted-foreground text-center py-4">
              No free friends added yet.
            </p>
          ) : (
            friends.map((em) => (
              <div key={em} className="flex items-center gap-2 p-2.5 rounded-lg border border-border/40 bg-card/30">
                <Mail className="w-3.5 h-3.5 text-primary/60 shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-foreground font-body flex-1 truncate">{em}</span>
                <button onClick={() => handleRemove(em)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {friends.length < MAX_FRIENDS && !loading && (
          <div className="flex gap-2 mt-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="friend@email.com"
              className="bg-background/60 text-sm"
              disabled={adding}
            />
            <Button onClick={handleAdd} disabled={adding || !email.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 px-3">
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {friends.length >= MAX_FRIENDS && !loading && (
          <p className="text-[10px] text-muted-foreground/60 font-body italic text-center mt-2">
            Maximum of {MAX_FRIENDS} free friends reached.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}