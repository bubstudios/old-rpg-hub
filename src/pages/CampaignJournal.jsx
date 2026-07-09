import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import JournalEntryCard from '@/components/JournalEntryCard';
import LootCard from '@/components/LootCard';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft, Loader2, BookOpen, Coins, Skull, ScrollText, Search, X, Sparkles
} from 'lucide-react';
import AskTheLog from '@/components/AskTheLog';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [askOpen, setAskOpen] = useState(false);

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

  const filteredEntries = searchTerm.trim()
    ? entries.map((e, i) => ({ entry: e, originalIndex: i })).filter(({ entry }) => {
        const term = searchTerm.toLowerCase();
        const text = [entry.narration, entry.player_action, entry.acting_character_name,
          ...(entry.dice_rolls || []).map(r => r.description || '')].join(' ').toLowerCase();
        return text.includes(term);
      })
    : entries.map((e, i) => ({ entry: e, originalIndex: i }));

  function getMatchSnippet(entry, term) {
    const fields = [entry.narration, entry.player_action, entry.acting_character_name,
      ...(entry.dice_rolls || []).map(r => r.description || '')].filter(Boolean);
    const lower = term.toLowerCase();
    for (const text of fields) {
      const idx = text.toLowerCase().indexOf(lower);
      if (idx >= 0) {
        const start = Math.max(0, idx - 35);
        const end = Math.min(text.length, idx + term.length + 35);
        return {
          before: (start > 0 ? '…' : '') + text.slice(start, idx),
          match: text.slice(idx, idx + term.length),
          after: text.slice(idx + term.length, end) + (end < text.length ? '…' : '')
        };
      }
    }
    return null;
  }

  function handleJumpToEntry(index) {
    setSearchTerm('');
    setAskOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`journal-entry-${index}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-primary/40', 'rounded-lg');
        setTimeout(() => el.classList.remove('ring-2', 'ring-primary/40', 'rounded-lg'), 2500);
      }
    }, 150);
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
                <>
                  {/* Search + Ask controls */}
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search the journal... (e.g. gold, inn, wizard)"
                        className="w-full bg-card/60 border border-input rounded-lg pl-9 pr-8 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setAskOpen(o => !o)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading tracking-wide border transition-colors shrink-0 ${
                        askOpen ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} /> Ask
                    </button>
                  </div>

                  {askOpen && (
                    <AskTheLog entries={entries} onJumpToEntry={handleJumpToEntry} />
                  )}

                  {/* Match count */}
                  {searchTerm.trim() && (
                    <p className="text-[11px] text-muted-foreground font-body">
                      {filteredEntries.length} {filteredEntries.length === 1 ? 'match' : 'matches'} found
                      {filteredEntries.length === 0 && ' — try a different word.'}
                    </p>
                  )}

                  {/* Entries */}
                  {filteredEntries.length === 0 && searchTerm.trim() ? (
                    <div className="text-center py-12 border border-dashed border-border/40 rounded-lg">
                      <Search className="w-7 h-7 text-muted-foreground/30 mx-auto mb-2" strokeWidth={1} />
                      <p className="font-tome italic text-muted-foreground text-sm">No passages mention "{searchTerm}".</p>
                    </div>
                  ) : (
                    filteredEntries.map(({ entry, originalIndex }) => {
                      const snippet = searchTerm.trim() ? getMatchSnippet(entry, searchTerm.trim()) : null;
                      return (
                        <div key={entry.id || originalIndex} id={`journal-entry-${originalIndex}`} className="transition-all">
                          {snippet && (
                            <div className="text-[11px] text-muted-foreground font-body mb-1 ml-1">
                              {snippet.before}
                              <mark className="bg-primary/30 text-primary px-0.5 rounded">{snippet.match}</mark>
                              {snippet.after}
                            </div>
                          )}
                          <JournalEntryCard entry={entry} />
                        </div>
                      );
                    })
                  )}
                </>
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
                  <LootCard key={l.id || i} loot={l} />
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