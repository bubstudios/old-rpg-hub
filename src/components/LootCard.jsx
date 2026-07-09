import { Package, Coins, Lock, EyeOff, HelpCircle } from 'lucide-react';

export default function LootCard({ loot }) {
  const l = loot || {};
  const name = (l.item_name || '').trim();
  const currency = (l.currency_type || '').trim();
  const qty = Math.max(1, Number(l.quantity) || 1);
  const val = Number(l.value) || 0;
  const goldAmt = Number(l.gold) || 0;
  const holder = (l.current_holder || '').trim();
  const identified = (l.identified_status || 'identified').toLowerCase();
  const tradeable = l.tradeable !== false;
  const foundBy = (l.found_by || '').trim();
  const source = (l.source || '').trim();
  const notes = (l.notes || '').trim();

  // Title: never blank — fall back to currency or a generic label (never just "Gold")
  const title = name || (currency ? `${currency} (unspecified)` : 'Unrecorded treasure');

  // Value line
  let valueLine = '';
  if (val > 0 && currency) {
    valueLine = qty > 1 ? `${qty} × ${val} ${currency}` : `${val} ${currency}`;
  } else if (goldAmt > 0) {
    valueLine = qty > 1 ? `${qty} × ${goldAmt} ${currency || 'gp'}` : `${goldAmt} ${currency || 'gp'}`;
  } else if (currency) {
    valueLine = qty > 1 ? `${qty} ${currency}` : `1 ${currency}`;
  }

  const isCurrencyOnly = !name && !!currency;
  const Icon = isCurrencyOnly ? Coins : Package;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-card/40">
      <div className="mt-0.5 shrink-0">
        <Icon className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-heading font-600 text-foreground">{title}</p>
          {valueLine && <span className="text-primary text-xs font-heading">+{valueLine}</span>}
          {identified !== 'identified' && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400/90 border border-amber-800/40">
              {identified === 'unidentified' ? <EyeOff className="w-2.5 h-2.5" /> : <HelpCircle className="w-2.5 h-2.5" />}
              {identified}
            </span>
          )}
          {!tradeable && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-heading tracking-wide px-1.5 py-0.5 rounded bg-red-950/40 text-red-400/80 border border-red-900/40">
              <Lock className="w-2.5 h-2.5" /> bound
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground font-body mt-0.5">
          {holder ? `held by ${holder}` : 'unclaimed'}
          {foundBy && holder !== foundBy && <> · found by {foundBy}</>}
          {source && <> · {source}</>}
        </p>
        {notes && (
          <p className="text-[11px] text-muted-foreground/70 font-body italic mt-1 leading-relaxed">{notes}</p>
        )}
      </div>
      <span className="text-[10px] font-heading tracking-wide text-muted-foreground/50 shrink-0 mt-0.5">Ch. {l.chapter}</span>
    </div>
  );
}