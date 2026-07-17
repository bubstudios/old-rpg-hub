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

  const STOP_WORDS = new Set(['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','has','his','how','its','may','new','now','old','see','way','who','did','get','let','say','she','too','use','where','what','when','why','this','that','with','from','they','have','were','been','will','would','could','should','any','into','them','then','than','over','down','only','your','some','such']);

  function getSearchWords(term) {
    return term.toLowerCase().split(/\s+/).filter(w => w.length >= 3 && !STOP_WORDS.has(w));
  }

  function getEntryText(entry) {
    return [entry.narration, entry.player_action, entry.acting_character_name,
      ...(entry.dice_rolls || []).map(r => r.description || '')].join(' ').toLowerCase();
  }

  const searchWords = searchTerm.trim() ? getSearchWords(searchTerm) : [];

  const filteredEntries = searchTerm.trim()
    ? entries.map((e, i) => ({ entry: e, originalIndex: i })).filter(({ entry }) => {
        const text = getEntryText(entry);
        if (searchWords.length > 0) return searchWords.every(w => text.includes(w));
        return text.includes(searchTerm.toLowerCase());
      })
    : entries.map((e, i) => ({ entry: e, originalIndex: i }));

  function getMatchSnippet(entry, term) {
    const fields = [entry.narration, entry.player_action, entry.acting_character_name,
      ...(entry.dice_rolls || []).map(r => r.description || '')].filter(Boolean);
    const words = getSearchWords(term);
    const targets = words.length > 0 ? words : [term.toLowerCase()];
    for (const text of fields) {
      for (const target of targets) {
        const idx = text.toLowerCase().indexOf(target);
        if (idx >= 0) {
          const start = Math.max(0, idx - 35);
          const end = Math.min(text.length, idx + target.length + 35);
          return {
            before: (start > 0 ? '…' : '') + text.slice(start, idx),
            match: text.slice(idx, idx + target.length),
            after: text.slice(idx + target.length, end) + (end < text.length ? '…' : '')
          };
        }
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
        el.classList.add('ring-2', 'ring-[#d4af37]/40', 'rounded-lg');
        setTimeout(() => el.classList.remove('ring-2', 'ring-[#d4af37]/40', 'rounded-lg'), 2500);
      }
    }, 150);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 relative">
      <button
        onClick={() => navigate(`/campaign/${campaignId}`)}
        className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-[#e5d3b3]/50 hover:text-[#d4af37] mb-6 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
      </button>

      <div className="flex items-stretch gap-0 mb-6">
        <div className="flex items-center pl-1 pr-3">
          <div className="w-11 h-11 rounded-full wax-seal flex items-center justify-center shrink-0 ring-2 ring-[#3a0808] candle-glow">
            <BookOpen className="w-5 h-5 text-amber-50" strokeWidth={1.4} />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center crimson-arch py-2.5 px-4">
          <h1 className="font-heading font-700 text-lg sm:text-xl tracking-[0.18em] text-[#d4af37]">CAMPAIGN JOURNAL</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#d4af37]/15">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-heading tracking-wide transition-colors border-b-2 -mb-px ${
              tab === t.id ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#e5d3b3]/40 hover:text-[#d4af37]'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#d4af37]/50 animate-spin" />
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
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#e5d3b3]/30" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search the journal... (e.g. gold, inn, wizard)"
                        className="w-full gothic-inset rounded-lg pl-9 pr-8 py-2 text-sm font-body text-[#e5d3b3] placeholder:text-[#e5d3b3]/25 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/30 border-0"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#e5d3b3]/30 hover:text-[#d4af37]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setAskOpen(o => !o)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-heading tracking-wide border transition-colors shrink-0 ${
                        askOpen ? 'border-[#d4af37]/50 text-[#d4af37] bg-[#d4af37]/10' : 'border-[#d4af37]/20 text-[#e5d3b3]/40 hover:text-[#d4af37]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} /> Ask
                    </button>
                  </div>

                  {askOpen && (
                    <AskTheLog entries={entries} onJumpToEntry={handleJumpToEntry} />
                  )}

                  {searchTerm.trim() && (
                    <p className="text-[11px] text-[#e5d3b3]/40 font-body">
                      {filteredEntries.length} {filteredEntries.length === 1 ? 'match' : 'matches'} found
                      {filteredEntries.length === 0 && ' — try a different word.'}
                    </p>
                  )}

                  {filteredEntries.length === 0 && searchTerm.trim() ? (
                    <div className="text-center py-12 gothic-inset rounded-lg">
                      <Search className="w-7 h-7 text-[#d4af37]/20 mx-auto mb-2" strokeWidth={1} />
                      <p className="font-tome italic text-[#e5d3b3]/30 text-sm">No passages mention "{searchTerm}".</p>
                    </div>
                  ) : (
                    filteredEntries.map(({ entry, originalIndex }) => {
                      const snippet = searchTerm.trim() ? getMatchSnippet(entry, searchTerm.trim()) : null;
                      return (
                        <div key={entry.id || originalIndex} id={`journal-entry-${originalIndex}`} className="transition-all">
                          {snippet && (
                            <div className="text-[11px] text-[#e5d3b3]/40 font-body mb-1 ml-1">
                              {snippet.before}
                              <mark className="bg-[#d4af37]/20 text-[#d4af37] px-0.5 rounded">{snippet.match}</mark>
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
                  <div key={d.id || i} className="p-4 rounded-lg border border-red-900/30 bg-red-950/10 gothic-inset">
                    <div className="flex items-start gap-3">
                      <Skull className="w-5 h-5 text-red-500/70 shrink-0 mt-0.5" strokeWidth={1.2} />
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-700 text-base text-[#e5d3b3]">{d.character_name}</p>
                        <p className="text-[11px] text-[#e5d3b3]/40 font-body">
                          {d.race} {d.character_class} · Level {d.level} · Chapter {d.chapter}
                        </p>
                        <p className="text-sm text-[#e5d3b3]/60 font-body italic mt-1.5 leading-relaxed">
                          {d.cause_of_death}
                        </p>
                        {d.epitaph && (
                          <p className="text-[11px] text-red-400/60 font-tome italic mt-2 border-t border-red-900/20 pt-2">
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
    <div className="text-center py-16 gothic-inset rounded-lg">
      <Icon className="w-8 h-8 text-[#d4af37]/20 mx-auto mb-3" strokeWidth={1} />
      <p className="font-tome italic text-[#e5d3b3]/30 text-sm">{text}</p>
    </div>
  );
}