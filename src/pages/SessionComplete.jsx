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

  // Auto-return to the campaign once payment is confirmed
  useEffect(() => {
    if (!checking && campaignId) {
      const t = setTimeout(() => navigate(`/campaign/${campaignId}`, { replace: true }), 2500);
      return () => clearTimeout(t);
    }
  }, [checking, campaignId, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {checking ? (
          <>
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
            <p className="font-tome italic text-sm text-muted-foreground">
              Processing your payment...
            </p>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full wax-seal flex items-center justify-center mx-auto mb-4 animate-flicker">
              <CheckCircle className="w-7 h-7 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <h1 className="font-heading font-700 text-xl text-foreground mb-2">Payment Received</h1>
            <p className="font-tome italic text-sm text-muted-foreground mb-6 max-w-sm">
              Your 4-hour session block is active. {campaignId ? 'Returning you to your campaign…' : 'Return to your campaign to begin your adventure — the timer starts when you start playing.'}
            </p>
            {campaignId ? (
              <Link to={`/campaign/${campaignId}`}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Return to Campaign <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <Link to="/">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
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