import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PartyOverview from '@/components/PartyOverview';
import DMNarration from '@/components/DMNarration';
import JournalEntryCard from '@/components/JournalEntryCard';
import DiceRollerPanel from '@/components/DiceRollerPanel';
import { Button } from '@/components/ui/button';
import {
  Loader2, Send, ScrollText, Swords, Skull, BookOpen, Users, MessageCircle,
  MapPin, Copy, ChevronLeft, Swords as SwordIcon, Flame, Dices
} from 'lucide-react';
import { toast } from 'sonner';

export default function CampaignDetail() {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [myCharacter, setMyCharacter] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [processing, setProcessing] = useState(false);
  const [latestResult, setLatestResult] = useState(null);
  const [diceOpen, setDiceOpen] = useState(false);
  const [discussMode, setDiscussMode] = useState(false);
  const [posting, setPosting] = useState(false);
  const feedRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [campaignId]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [entries, latestResult, processing]);

  // Live-sync out-of-character discussion messages so party members see each other's chat
  useEffect(() => {
    const unsubscribe = base44.entities.JournalEntry.subscribe((event) => {
      if (event.data?.campaign_id === campaignId && event.data?.entry_type === 'discussion') {
        reloadEntries();
      }
    });
    return () => unsubscribe();
  }, [campaignId]);

  async function loadData() {
    try {
      setLoading(true);
      const res = await base44.functions.invoke('campaignData', { op: 'load', campaign_id: campaignId });
      const data = res.data;
      setCampaign(data.campaign);
      setCharacters(data.characters);
      setMyCharacter(data.my_character);

      if (!data.my_character) {
        navigate(`/campaign/${campaignId}/create-character`);
        return;
      }

      const entriesRes = await base44.functions.invoke('campaignData', { op: 'recentEntries', campaign_id: campaignId, limit: 30 });
      setEntries(entriesRes.data.entries || []);
    } catch (e) {
      toast.error('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  }

  async function reloadEntries() {
    try {
      const entriesRes = await base44.functions.invoke('campaignData', { op: 'recentEntries', campaign_id: campaignId, limit: 30 });
      setEntries(entriesRes.data.entries || []);
    } catch (e) { /* ignore */ }
  }

  async function handleRollCompleted(rollResult) {
    await reloadEntries();
    if (!rollResult?.summary || processing) return;
    setDiceOpen(false);
    setProcessing(true);
    setLatestResult(null);
    try {
      const res = await base44.functions.invoke('dungeonMaster', {
        campaign_id: campaignId,
        action: rollResult.summary,
        acting_character_id: myCharacter.id,
        is_roll_result: true
      });
      setLatestResult(res.data);
      await loadData();
      setLatestResult(null);
    } catch (e) {
      toast.error('The Dungeon Master falters... ' + (e.response?.data?.error || e.message));
    } finally {
      setProcessing(false);
    }
  }

  async function handleAction() {
    if (!action.trim() || processing || posting) return;
    const submittedAction = action.trim();
    setAction('');

    // Discuss mode: post an out-of-character message to the party (DM is NOT triggered)
    if (discussMode) {
      setPosting(true);
      const tempEntry = {
        entry_type: 'discussion',
        narration: submittedAction,
        acting_character_name: myCharacter.name
      };
      setEntries(prev => [...prev, tempEntry]);
      try {
        await base44.functions.invoke('campaignData', {
          op: 'postDiscussion',
          campaign_id: campaignId,
          message: submittedAction,
          acting_character_name: myCharacter.name
        });
        await reloadEntries();
      } catch (e) {
        toast.error('Failed to post message');
        setEntries(prev => prev.slice(0, -1));
        setAction(submittedAction);
      } finally {
        setPosting(false);
      }
      return;
    }

    setProcessing(true);
    setLatestResult(null);

    // Optimistically show the player's action
    const tempActionEntry = {
      entry_type: 'action',
      player_action: submittedAction,
      acting_character_name: myCharacter.name
    };
    setEntries(prev => [...prev, tempActionEntry]);

    try {
      const res = await base44.functions.invoke('dungeonMaster', {
        campaign_id: campaignId,
        action: submittedAction,
        acting_character_id: myCharacter.id
      });
      const result = res.data;
      setLatestResult(result);

      // Reload campaign + characters to reflect changes (narration now lives in entries)
      await loadData();
      setLatestResult(null);
    } catch (e) {
      toast.error('The Dungeon Master falters... ' + (e.response?.data?.error || e.message));
      setEntries(prev => prev.slice(0, -1));
      setAction(submittedAction);
    } finally {
      setProcessing(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAction();
    }
  }

  function copyInviteCode() {
    if (campaign?.invite_code) {
      navigator.clipboard.writeText(campaign.invite_code);
      toast.success('Invite code copied!');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return <div className="text-center py-20 text-muted-foreground">Campaign not found.</div>;
  }

  const hasEntries = entries.length > 0;
  const isSetup = campaign.status === 'setup' || !hasEntries;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-heading tracking-wide mb-1">
            <Link to={`/game/${campaign.game_system || 'add1e'}`} className="hover:text-foreground transition-colors">Campaigns</Link>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Chapter {campaign.current_chapter}</span>
            {campaign.combat_active && (
              <span className="flex items-center gap-1 text-red-400 ml-1">
                <Skull className="w-3 h-3" /> COMBAT (Round {campaign.combat_round})
              </span>
            )}
          </div>
          <h1 className="font-heading font-700 text-xl sm:text-2xl text-foreground tracking-wide truncate">
            {campaign.name}
          </h1>
          {campaign.current_scene && (
            <p className="text-xs text-muted-foreground font-body italic mt-0.5 line-clamp-1">
              {campaign.current_scene}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyInviteCode}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-heading tracking-wider border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>CODE: {campaign.invite_code}</span>
            <Copy className="w-3 h-3" />
          </button>
          <Link to={`/campaign/${campaignId}/journal`}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8">
              <BookOpen className="w-3.5 h-3.5 mr-1" /> Journal
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        {/* Main play area */}
        <div className="flex flex-col min-h-[60vh]">
          {/* Narration feed */}
          <div ref={feedRef} className="flex-1 space-y-4 overflow-y-auto scrollbar-thin pr-1 pb-4 max-h-[calc(100vh-320px)]">
            {!hasEntries && !processing && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full wax-seal mb-4 animate-flicker">
                  <ScrollText className="w-6 h-6 text-primary-foreground" strokeWidth={1.2} />
                </div>
                <h2 className="font-heading font-600 text-lg text-foreground mb-2">The Tale Begins</h2>
                <p className="font-tome italic text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                  Your party stands at the threshold of adventure. Declare your first action below, and the Dungeon Master shall set the scene...
                </p>
              </div>
            )}

            {entries.map((e, i) => (
              <JournalEntryCard key={e.id || i} entry={e} />
            ))}

            {processing && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Flame className="w-6 h-6 text-primary animate-flicker" strokeWidth={1.2} />
                <p className="font-tome italic text-sm text-muted-foreground">
                  The Dungeon Master contemplates your fate...
                </p>
                <Loader2 className="w-4 h-4 text-primary/40 animate-spin" />
              </div>
            )}

            {latestResult && !processing && (
              <DMNarration narration={latestResult.narration} diceRolls={latestResult.dice_rolls} />
            )}
          </div>

          {/* Action input */}
          <div className="mt-4 border-t border-border/40 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Swords className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              <span className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground">
                {myCharacter?.name?.toUpperCase()} · {myCharacter?.race} {myCharacter?.character_class} · LVL {myCharacter?.level}
              </span>
              <button
                onClick={() => setDiscussMode((m) => !m)}
                className={`ml-auto flex items-center gap-1 text-[10px] font-heading tracking-wider px-2 py-1 rounded border transition-colors ${discussMode ? 'border-sky-500/50 text-sky-400 bg-sky-500/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}
                title={discussMode ? 'Discussing — the DM will not respond. Click to switch to actions.' : 'Switch to out-of-character party discussion (the DM will not respond).'}
              >
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} /> {discussMode ? 'Discussing' : 'Discuss'}
              </button>
              <button
                onClick={() => setDiceOpen((o) => !o)}
                className={`flex items-center gap-1 text-[10px] font-heading tracking-wider px-2 py-1 rounded border transition-colors ${diceOpen ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}
              >
                <Dices className="w-3.5 h-3.5" strokeWidth={1.5} /> Dice
              </button>
            </div>
            {diceOpen && myCharacter && (
              <DiceRollerPanel
                myCharacter={myCharacter}
                campaignId={campaignId}
                chapter={campaign.current_chapter}
                onRolled={handleRollCompleted}
                onClose={() => setDiceOpen(false)}
              />
            )}
            <div className="flex gap-2">
              <textarea
                value={action}
                onChange={(e) => setAction(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={processing || posting}
                placeholder={discussMode
                  ? "Discuss with your party (out of character)..."
                  : (isSetup ? "e.g. We enter the tavern and look around..." : "What does your hero do?")}
                className={`flex-1 bg-card/60 border rounded-lg px-3.5 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 min-h-[44px] max-h-32 ${discussMode ? 'border-sky-700/50 focus:ring-sky-600/40' : 'border-input focus:ring-ring'}`}
                rows={1}
              />
              <Button
                onClick={handleAction}
                disabled={!action.trim() || processing || posting}
                className={`self-stretch px-4 ${discussMode ? 'bg-sky-700 text-white hover:bg-sky-600' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
              >
                {(processing || posting) ? <Loader2 className="w-4 h-4 animate-spin" /> : (discussMode ? <MessageCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />)}
              </Button>
            </div>
            {discussMode && (
              <p className="mt-1.5 text-[10px] font-body italic text-sky-400/70">
                Out-of-character discussion — your message will be seen by the party, but the Dungeon Master will not respond.
              </p>
            )}
          </div>
        </div>

        {/* Party sidebar */}
        <aside className="space-y-4">
          <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-3">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">THE PARTY</h3>
              <span className="text-[10px] text-muted-foreground/50 ml-auto">{characters.length} heroes</span>
            </div>
            <PartyOverview characters={characters} campaignId={campaignId} />
          </div>

          {/* World state summary */}
          <div className="border border-border/50 rounded-lg bg-card/40 p-3">
            <div className="flex items-center gap-2 mb-2.5">
              <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">WORLD STATE</h3>
            </div>
            <div className="space-y-2 text-[11px] font-body">
              <div>
                <p className="text-muted-foreground/60 text-[10px] font-heading tracking-wide">EXPLORED</p>
                <p className="text-muted-foreground">
                  {(campaign.world_state?.locations_explored || []).length
                    ? (campaign.world_state?.locations_explored || []).join(', ')
                    : 'Nothing yet'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground/60 text-[10px] font-heading tracking-wide">NPCS MET</p>
                <p className="text-muted-foreground">
                  {(campaign.world_state?.npcs_met || []).length
                    ? (campaign.world_state?.npcs_met || []).map(n => n.name).join(', ')
                    : 'No one yet'}
                </p>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border/30">
                <span className="text-muted-foreground/60 text-[10px] font-heading tracking-wide">REPUTATION</span>
                <span className={`font-heading font-600 ${campaign.world_state?.reputation >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {campaign.world_state?.reputation || 0 >= 0 ? '+' : ''}{campaign.world_state?.reputation || 0}
                </span>
              </div>
            </div>
          </div>

          {myCharacter && (
            <Link to={`/campaign/${campaignId}/character/${myCharacter.id}`}>
              <Button variant="outline" className="w-full border-border/50 text-muted-foreground hover:text-foreground h-9">
                <ScrollText className="w-3.5 h-3.5 mr-1.5" /> My Character Sheet
              </Button>
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}