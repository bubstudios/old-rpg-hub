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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4 relative">
        <div className="cathedral-bg" />
        <ScrollText className="w-8 h-8 text-[#d4af37]/30 relative" strokeWidth={1} />
        <p className="font-tome italic text-sm text-[#e5d3b3]/50 text-center relative">{error}</p>
        <Button onClick={() => navigate('/')} variant="outline" className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 relative">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 relative">
      <div className="cathedral-bg" />
      <Loader2 className="w-6 h-6 text-[#d4af37]/50 animate-spin relative" />
      <p className="font-tome italic text-sm text-[#e5d3b3]/50 relative">Joining the adventure...</p>
    </div>
  );
}