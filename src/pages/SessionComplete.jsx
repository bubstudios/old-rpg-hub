import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';

export default function SessionComplete() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const campaignId = new URLSearchParams(window.location.search).get('campaign');

  useEffect(() => {
    const timer = setTimeout(() => setChecking(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!checking && campaignId) {
      const t = setTimeout(() => navigate(`/campaign/${campaignId}`, { replace: true }), 2500);
      return () => clearTimeout(t);
    }
  }, [checking, campaignId, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 relative">
      <div className="cathedral-bg" />
      <div className="text-center relative">
        {checking ? (
          <>
            <Loader2 className="w-10 h-10 text-[#d4af37] animate-spin mx-auto mb-4" />
            <p className="font-tome italic text-sm text-[#e5d3b3]/50">
              Processing your payment...
            </p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full wax-seal flex items-center justify-center mx-auto mb-4 animate-flicker ring-2 ring-[#3a0808] candle-glow">
              <CheckCircle className="w-7 h-7 text-amber-50" strokeWidth={1.5} />
            </div>
            <h1 className="font-heading font-700 text-xl text-[#d4af37] mb-2">Payment Received</h1>
            <p className="font-tome italic text-sm text-[#e5d3b3]/50 mb-6 max-w-sm">
              Your 4-hour session block is active. {campaignId ? 'Returning you to your campaign…' : 'Return to your campaign to begin your adventure — the timer starts when you start playing.'}
            </p>
            {campaignId ? (
              <Link to={`/campaign/${campaignId}`}>
                <Button className="bg-gradient-to-b from-[#d4af37] to-[#8a6a1f] text-[#0d0a08] hover:from-[#f0c66d] hover:to-[#d4af37]">
                  Return to Campaign <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <Link to="/">
                <Button className="bg-gradient-to-b from-[#d4af37] to-[#8a6a1f] text-[#0d0a08] hover:from-[#f0c66d] hover:to-[#d4af37]">
                  Return to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}