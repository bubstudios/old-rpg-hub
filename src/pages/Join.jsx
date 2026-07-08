import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, ScrollText } from 'lucide-react';

export default function Join() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const code = params.get('code');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code) { setError('No invite code provided.'); return; }
    (async () => {
      try {
        const res = await base44.functions.invoke('campaignData', {
          op: 'join',
          invite_code: code.toUpperCase()
        });
        navigate(`/campaign/${res.data.campaign.id}`, { replace: true });
      } catch (e) {
        setError('No campaign found with that invite code.');
      }
    })();
  }, [code]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4">
        <ScrollText className="w-8 h-8 text-muted-foreground/40" strokeWidth={1} />
        <p className="font-tome italic text-sm text-muted-foreground text-center">{error}</p>
        <Button onClick={() => navigate('/')} variant="outline" className="border-border/50">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
      <p className="font-tome italic text-sm text-muted-foreground">Joining the adventure...</p>
    </div>
  );
}