import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { ScrollText, TrendingUp, Users, AlertTriangle, Activity, Clock, Coins, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PLAN_OPTIONS = [
  { label: 'Builder', credits: 10000 },
  { label: 'Pro', credits: 20000 },
  { label: 'Elite 6', credits: 175000 }
];
const DEFAULT_CREDITS_PER_TURN = 15;
const TURNS_PER_HOUR = 20;

export default function AdminUsage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planIdx, setPlanIdx] = useState(1);
  const [dashboardCredits, setDashboardCredits] = useState('');

  const loadUsage = useCallback(async () => {
    try {
      setLoading(true);
      const res = await base44.functions.invoke('getUsageStats', {});
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to load usage data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsage(); }, [loadUsage]);

  const plan = PLAN_OPTIONS[planIdx];
  const allTimeTurns = data?.allTime?.totalTurns || 0;
  const calibratedRate = dashboardCredits && allTimeTurns > 0
    ? Math.max(1, Math.round(Number(dashboardCredits) / allTimeTurns))
    : DEFAULT_CREDITS_PER_TURN;
  const monthCredits = Math.round((data?.thisMonth?.totalTurns || 0) * calibratedRate);
  const monthTurns = data?.thisMonth?.totalTurns || 0;
  const usagePct = plan.credits > 0 ? Math.min(100, (monthCredits / plan.credits) * 100) : 0;
  const remaining = Math.max(0, plan.credits - monthCredits);
  const remainingTurns = Math.floor(remaining / calibratedRate);
  const isWarning = usagePct >= 80;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <ScrollText className="w-8 h-8 text-primary/40 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
        <p className="text-sm text-muted-foreground font-body text-center max-w-sm">{error}</p>
        <Button onClick={loadUsage} variant="outline" size="sm">Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded wax-seal flex items-center justify-center shrink-0">
            <ScrollText className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-heading font-700 text-lg sm:text-xl tracking-[0.15em] text-foreground">REALM LEDGER</h1>
            <p className="text-[11px] font-heading tracking-wider text-primary/60">USAGE &amp; CREDIT TRACKING</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {PLAN_OPTIONS.map((p, i) => (
            <Button key={p.label} onClick={() => setPlanIdx(i)} variant={i === planIdx ? 'default' : 'outline'} size="sm" className="text-xs">
              {p.label}
            </Button>
          ))}
          <Button onClick={loadUsage} variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Calibration input */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="font-heading tracking-wider text-muted-foreground">CALIBRATE:</span>
        <span className="text-muted-foreground font-body">Enter "This app" credits from your dashboard to get accurate estimates:</span>
        <input
          type="number"
          value={dashboardCredits}
          onChange={(e) => setDashboardCredits(e.target.value)}
          placeholder="e.g. 5523"
          className="w-28 h-8 rounded-md border border-input bg-transparent px-2 text-sm font-heading tabular-nums focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {calibratedRate !== DEFAULT_CREDITS_PER_TURN && (
          <span className="text-primary font-heading">
            {calibratedRate} credits/turn (calibrated)
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="bg-card/60 border-border/40">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
              <span className="text-[11px] font-heading tracking-wider text-muted-foreground">DM TURNS THIS MONTH</span>
            </div>
            <p className="font-heading font-700 text-2xl text-foreground tabular-nums">{monthTurns}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 border-border/40">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
              <span className="text-[11px] font-heading tracking-wider text-muted-foreground">EST. CREDITS USED</span>
            </div>
            <p className="font-heading font-700 text-2xl text-foreground tabular-nums">{monthCredits.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">of {plan.credits.toLocaleString()} ({plan.label})</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 border-border/40">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
              <span className="text-[11px] font-heading tracking-wider text-muted-foreground">EST. RUNWAY</span>
            </div>
            <p className="font-heading font-700 text-2xl text-foreground tabular-nums">{remainingTurns.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">turns remaining this cycle</p>
          </CardContent>
        </Card>
      </div>

      <Card className={`bg-card/60 border-border/40 ${isWarning ? 'border-destructive/50' : ''}`}>
        <CardContent className="pt-5 pb-5 px-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading tracking-wider text-muted-foreground">PLAN CAPACITY</span>
            <span className={`text-xs font-heading font-600 tabular-nums ${isWarning ? 'text-destructive' : 'text-primary'}`}>
              {usagePct.toFixed(1)}% used
            </span>
          </div>
          <Progress value={usagePct} className={`h-2.5 ${isWarning ? '[&>div]:bg-destructive' : ''}`} />
          {isWarning && (
            <p className="text-[11px] text-destructive font-body flex items-center gap-1.5 pt-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              Approaching credit cap — consider upgrading your plan.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/60 border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-sm tracking-wider text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
            PER-PLAYER USAGE — THIS MONTH
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-5 pb-4">
          {data?.thisMonth?.perUser?.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-heading tracking-wider text-muted-foreground border-b border-border/40">
                  <th className="text-left py-2 px-2 sm:px-3">PLAYER</th>
                  <th className="text-right py-2 px-2 sm:px-3">TURNS</th>
                  <th className="text-right py-2 px-2 sm:px-3 hidden sm:table-cell">EST. CREDITS</th>
                  <th className="text-right py-2 px-2 sm:px-3 hidden sm:table-cell">EST. HOURS</th>
                </tr>
              </thead>
              <tbody>
                {data.thisMonth.perUser.map((u, i) => (
                  <tr key={i} className="border-b border-border/20 last:border-0">
                    <td className="py-2 px-2 sm:px-3 font-body text-foreground">{u.name}</td>
                    <td className="py-2 px-2 sm:px-3 text-right font-heading tabular-nums text-foreground">{u.turns}</td>
                    <td className="py-2 px-2 sm:px-3 text-right font-heading tabular-nums text-muted-foreground hidden sm:table-cell">{(u.turns * calibratedRate).toLocaleString()}</td>
                    <td className="py-2 px-2 sm:px-3 text-right font-heading tabular-nums text-muted-foreground hidden sm:table-cell">{(u.turns / TURNS_PER_HOUR).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-muted-foreground italic font-body py-4 text-center">No play this month yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/60 border-border/40">
        <CardContent className="pt-5 pb-4 px-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
            <span className="text-[11px] font-heading tracking-wider text-muted-foreground">ALL-TIME</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="font-heading font-700 text-lg text-foreground tabular-nums">{data?.allTime?.totalTurns || 0}</p>
              <p className="text-[10px] text-muted-foreground/70">total turns</p>
            </div>
            <div className="text-right">
              <p className="font-heading font-700 text-lg text-foreground tabular-nums">{(allTimeTurns * calibratedRate).toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground/70">est. credits</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground/60 font-body italic text-center px-4">
        Est. {calibratedRate} credits per DM turn and ~{TURNS_PER_HOUR} turns/hour of play{dashboardCredits ? ' (calibrated from your dashboard)' : ' (default estimate — enter your dashboard credits above for accuracy)'}.
      </p>
    </div>
  );
}