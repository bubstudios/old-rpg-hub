import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import JournalEntryCard from '@/components/JournalEntryCard';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft, Loader2, BookOpen, Coins, Skull, ScrollText, Package
} from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { id: 'log', label: 'Session Log', icon: ScrollText },
  { id: 'loot', label: 'Treasure Hoard', icon: Coins },
  { id: 'deaths', label: 'Hall of the Fallen', icon: Skull }
];

export default function CampaignJournal() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('log');
  const [entries, setEntries] = useState([]);
  const [loot, setLoot] = useState([]);
  const [deaths, setDeaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [campaignId]);

  async function load() {
    try {
      setLoading(true);
      const res = await base44.functions.invoke('campaignData', { op: 'loadJournal', campaign_id: campaignId });
      setEntries(res.data.entries || []);
      setLoot(res.data.loot || []);
      setDeaths(res.data.deaths || []);
    } catch (e) {
      toast.error('Failed to load journal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(`/campaign/${campaignId}`)}
        className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
      </button>

      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.5} />
        <h1 className="font-heading font-700 text-xl text-foreground tracking-wide">CAMPAIGN JOURNAL</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border/40">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-heading tracking-wide transition-colors border-b-2 -mb-px ${
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
        </div>
      ) : (
        <>
          {/* Session Log */}
          {tab === 'log' && (
            <div className="space-y-4">
              {entries.length === 0 ? (
                <EmptyState icon={ScrollText} text="The journal is empty. Adventure has yet to be recorded..." />
              ) : (
                entries.map((e, i) => (
                  <JournalEntryCard key={e.id || i} entry={e} />
                ))
              )}
            </div>
          )}

          {/* Treasure Hoard */}
          {tab === 'loot' && (
            <div className="space-y-2.5">
              {loot.length === 0 ? (
                <EmptyState icon={Coins} text="No treasure claimed yet. The hoards await..." />
              ) : (
                loot.map((l, i) => (
                  <div key={l.id || i} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-card/40">
                    <Package className="w-4 h-4 text-primary/60 shrink-0" strokeWidth={1.5} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-heading font-600 text-foreground">
                        {l.item_name || 'Gold'}
                        {l.gold > 0 && <span className="text-primary ml-1.5">+{l.gold} gp</span>}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-body">
                        Found by {l.found_by || 'the party'}
                        {l.source && <> · {l.source}</>}
                      </p>
                    </div>
                    <span className="text-[10px] font-heading tracking-wide text-muted-foreground/50">Ch. {l.chapter}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Hall of the Fallen */}
          {tab === 'deaths' && (
            <div className="space-y-2.5">
              {deaths.length === 0 ? (
                <EmptyState icon={Skull} text="No heroes have fallen. Death has not yet claimed its due..." />
              ) : (
                deaths.map((d, i) => (
                  <div key={d.id || i} className="p-4 rounded-lg border border-red-900/30 bg-red-950/10">
                    <div className="flex items-start gap-3">
                      <Skull className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" strokeWidth={1.2} />
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-700 text-base text-foreground">{d.character_name}</p>
                        <p className="text-[11px] text-muted-foreground font-body">
                          {d.race} {d.character_class} · Level {d.level} · Chapter {d.chapter}
                        </p>
                        <p className="text-sm text-muted-foreground/80 font-body italic mt-1.5 leading-relaxed">
                          {d.cause_of_death}
                        </p>
                        {d.epitaph && (
                          <p className="text-[11px] text-red-400/70 font-tome italic mt-2 border-t border-red-900/20 pt-2">
                            "{d.epitaph}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div className="text-center py-16 border border-dashed border-border/40 rounded-lg">
      <Icon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1} />
      <p className="font-tome italic text-muted-foreground text-sm">{text}</p>
    </div>
  );
}