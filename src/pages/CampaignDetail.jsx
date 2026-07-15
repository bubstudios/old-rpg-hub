import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import PartyOverview from '@/components/PartyOverview';
import DMNarration from '@/components/DMNarration';
import JournalEntryCard from '@/components/JournalEntryCard';
import DiceRollerPanel from '@/components/DiceRollerPanel';
import SFDiceRollerPanel from '@/components/SFDiceRollerPanel';
import GWDiceRollerPanel from '@/components/GWDiceRollerPanel';
import BHDiceRollerPanel from '@/components/BHDiceRollerPanel';
import IJDiceRollerPanel from '@/components/IJDiceRollerPanel';
import TSDiceRollerPanel from '@/components/TSDiceRollerPanel';
import HyDiceRollerPanel from '@/components/HyDiceRollerPanel';
import GBDiceRollerPanel from '@/components/GBDiceRollerPanel';
import GangDiceRollerPanel from '@/components/GangDiceRollerPanel';
import LODDiceRollerPanel from '@/components/LODDiceRollerPanel';
import JitsiVideoPanel from '@/components/JitsiVideoPanel';
import NpcDossier from '@/components/NpcDossier';
import LocationDossier from '@/components/LocationDossier';
import EndSessionDialog from '@/components/EndSessionDialog';
import InviteDialog from '@/components/InviteDialog';
import RoundStatus from '@/components/RoundStatus';
import PurchaseSessionDialog from '@/components/PurchaseSessionDialog';
import FreeFriendsManager from '@/components/FreeFriendsManager';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2, Send, ScrollText, Swords, Skull, BookOpen, Users, MessageCircle,
  MapPin, ChevronLeft, Flame, Dices, Video, Flag, UserPlus,
  Check, RefreshCw, Gift
} from 'lucide-react';
import { toast } from 'sonner';

const DM2_SYSTEMS = ['starwars','marvel','dcheroes','jamesbond','shadowrun','cyberpunk','traveller','ravenloft','oddnd','bxdnd','add2e','dnd35','dnd4e','dnd5e'];

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
  const processingRef = useRef(false);
  const lastInputRef = useRef({ text: '', timestamp: 0 });
  const [latestResult, setLatestResult] = useState(null);
  const [diceOpen, setDiceOpen] = useState(false);
  const [discussMode, setDiscussMode] = useState(false);
  const [posting, setPosting] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [briefText, setBriefText] = useState('');
  const [savingBrief, setSavingBrief] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [endSessionOpen, setEndSessionOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [hasBillingAccess, setHasBillingAccess] = useState(true);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const [narrationStyle, setNarrationStyle] = useState(() => localStorage.getItem('narration_style') || 'cinematic_simple');
  const feedRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [campaignId]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [entries, latestResult, processing]);

  // Live-sync journal entries (discussion, narration, and declared actions) across the party
  useEffect(() => {
    const unsubscribe = base44.entities.JournalEntry.subscribe((event) => {
      if (event.data?.campaign_id === campaignId && ['discussion', 'narration', 'action', 'dice_roll'].includes(event.data?.entry_type)) {
        reloadEntries();
      }
    });
    return () => unsubscribe();
  }, [campaignId]);

  // Live-sync the full campaign state from the database (single source of truth).
  useEffect(() => {
    const unsubscribe = base44.entities.Campaign.subscribe((event) => {
      if (event.data?.id === campaignId) {
        setCampaign(prev => prev ? { ...prev, ...event.data } : event.data);
      }
    });
    return () => unsubscribe();
  }, [campaignId]);

  async function loadData() {
    try {
      setLoading(true);
      const user = await base44.auth.me();
      const [campaign, characters] = await Promise.all([
        base44.entities.Campaign.get(campaignId),
        base44.entities.Character.filter({ campaign_id: campaignId }, '-created_date', 50)
      ]);
      const myChar = characters.find(c => c.created_by_id === user.id && c.status === 'active');
      setCampaign(campaign);
      setCharacters(characters);
      setMyCharacter(myChar);
      setIsOwner(campaign.created_by_id === user.id);
      setBriefText(campaign.dm_brief || '');

      if (!myChar) {
        navigate(`/campaign/${campaignId}/create-character`);
        return;
      }

      const entries = await base44.entities.JournalEntry.filter({ campaign_id: campaignId }, '-created_date', 30);
      setEntries(entries.reverse());
    } catch (e) {
      toast.error('Failed to load campaign');
    } finally {
      setLoading(false);
    }
  }

  async function reloadEntries() {
    try {
      const entries = await base44.entities.JournalEntry.filter({ campaign_id: campaignId }, '-created_date', 30);
      setEntries(entries.reverse());
    } catch (e) { /* ignore */ }
  }

  async function handleRollCompleted(rollResult) {
    await reloadEntries();
    if (!rollResult?.summary || processing || campaign?.dm_processing) return;
    if (!hasBillingAccess) {
      setPurchaseOpen(true);
      return;
    }
    setDiceOpen(false);
    setProcessing(true);
    setLatestResult(null);
    try {
      const dmFunc = DM2_SYSTEMS.includes(campaign?.game_system) ? 'dungeonMaster2' : 'dungeonMaster';
      const res = await base44.functions.invoke(dmFunc, {
        campaign_id: campaignId,
        action: rollResult.summary,
        acting_character_id: myCharacter.id,
        is_roll_result: true,
        narration_style: narrationStyle
      });
      setLatestResult(res.data);
      setProcessing(false);
      await loadData();
      setLatestResult(null);
    } catch (e) {
      toast.error('The Dungeon Master falters... ' + (e.response?.data?.error || e.message));
    } finally {
      setProcessing(false);
    }
  }

  function isDuplicateInput(text) {
    const last = lastInputRef.current;
    if (last.text === text && Date.now() - last.timestamp < 5000) return true;
    lastInputRef.current = { text, timestamp: Date.now() };
    return false;
  }

  async function handleAction() {
    if (!action.trim() || processing || posting || processingRef.current) return;
    if (!hasBillingAccess) {
      setPurchaseOpen(true);
      return;
    }
    const submittedAction = action.trim();
    setAction('');

    // Duplicate submission protection
    if (isDuplicateInput(submittedAction)) return;

    if (discussMode) {
      setPosting(true);
      const tempEntry = {
        entry_type: 'discussion',
        narration: submittedAction,
        acting_character_name: myCharacter.name
      };
      setEntries(prev => [...prev, tempEntry]);
      try {
        await base44.entities.JournalEntry.create({
          campaign_id: campaignId,
          entry_type: 'discussion',
          narration: submittedAction,
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

    // Action mode: submit to the round system (the DM waits for every party member to act)
    await submitTurn(submittedAction, false);
  }

  // Submit an action or agreement to the round. When all party members have acted,
  // the DM is invoked with everyone's actions combined.
  async function submitTurn(actionText, isAgree) {
    if (processing || processingRef.current) return;
    processingRef.current = true;
    if (!hasBillingAccess) {
      processingRef.current = false;
      setPurchaseOpen(true);
      return;
    }
    setProcessing(true);
    setLatestResult(null);
    let dmCompleted = false;
    try {
      const user = await base44.auth.me();

      // Check dm_processing with 90s auto-reset (mirrors the backend logic)
      let camp = await base44.entities.Campaign.get(campaignId);
      if (camp.dm_processing) {
        const updatedAt = camp.updated_date ? new Date(camp.updated_date).getTime() : 0;
        if (updatedAt && Date.now() - updatedAt > 90000) {
          await base44.entities.Campaign.update(campaignId, { dm_processing: false, pending_actions: [] });
          camp = await base44.entities.Campaign.get(campaignId);
        } else {
          setCampaign(prev => prev ? { ...prev, dm_processing: true } : prev);
          let cleared = false;
          for (let attempt = 0; attempt < 8; attempt++) {
            await new Promise(r => setTimeout(r, 3000));
            camp = await base44.entities.Campaign.get(campaignId);
            if (!camp.dm_processing) { cleared = true; break; }
          }
          if (!cleared) {
            await base44.entities.Campaign.update(campaignId, { pending_actions: [], dm_processing: false });
            setCampaign(prev => prev ? { ...prev, pending_actions: [], dm_processing: false } : prev);
            if (!isAgree) setAction(actionText);
            toast.error('The DM was still processing. Please try sending your command again.');
            return;
          }
        }
      }

      const characters = await base44.entities.Character.filter({ campaign_id: campaignId, status: 'active' });
      const myChar = characters.find(c => c.id === myCharacter.id && c.created_by_id === user.id);
      if (!myChar) throw new Error('Character not found');

      const newEntry = {
        character_id: myCharacter.id,
        character_name: myChar.name,
        action: actionText,
        is_agree: !!isAgree,
        submitted_at: new Date().toISOString()
      };

      // Atomically append the action to pending_actions
      await base44.entities.Campaign.updateMany({ id: campaignId }, { $push: { pending_actions: newEntry } });

      // Re-read to evaluate the full pending list
      const updated = await base44.entities.Campaign.get(campaignId);
      const pending = Array.isArray(updated.pending_actions) ? updated.pending_actions : [];
      const submittedIds = pending.map(a => a.character_id);
      const missing = characters.filter(c => !submittedIds.includes(c.id));

      setCampaign(prev => prev ? { ...prev, pending_actions: pending, dm_processing: false } : prev);

      if (missing.length > 0) return; // Waiting for other party members

      // All party members have acted — claim the DM invocation
      await base44.entities.Campaign.update(campaignId, { dm_processing: true });
      setCampaign(prev => prev ? { ...prev, dm_processing: true } : prev);

      const combined = pending.map(a =>
        a.is_agree
          ? `${a.character_name} agrees and stands ready (no specific action this turn).`
          : `${a.character_name}: ${a.action}`
      ).join('\n');

      const dmFunc = DM2_SYSTEMS.includes(camp.game_system) ? 'dungeonMaster2' : 'dungeonMaster';
      const dmRes = await base44.functions.invoke(dmFunc, {
        campaign_id: campaignId,
        action: combined,
        acting_character_id: myCharacter.id,
        skip_action_log: true,
        narration_style: narrationStyle
      });
      await base44.entities.Campaign.update(campaignId, { pending_actions: [], dm_processing: false });
      dmCompleted = true;
      setCampaign(prev => prev ? { ...prev, pending_actions: [], dm_processing: false } : prev);
      setLatestResult(dmRes.data);
      await loadData();
      setLatestResult(null);
    } catch (e) {
      if (!dmCompleted) {
        try {
          await base44.entities.Campaign.update(campaignId, { pending_actions: [], dm_processing: false });
          setCampaign(prev => prev ? { ...prev, pending_actions: [], dm_processing: false } : prev);
        } catch { /* ignore */ }
        toast.error('The Dungeon Master falters... ' + (e.response?.data?.error || e.message));
        if (!isAgree) setAction(actionText);
      }
    } finally {
      setProcessing(false);
      processingRef.current = false;
    }
  }

  async function handleAgree() {
    if (processing || posting) return;
    await submitTurn('', true);
  }

  async function handleResetRound() {
    try {
      await base44.entities.Campaign.update(campaignId, { pending_actions: [], dm_processing: false });
      setCampaign(prev => prev ? { ...prev, pending_actions: [], dm_processing: false } : prev);
      toast.success('Round reset.');
    } catch (e) {
      toast.error('Failed to reset round');
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

  async function handleSaveBrief() {
    setSavingBrief(true);
    try {
      await base44.entities.Campaign.update(campaignId, { dm_brief: briefText.trim() });
      setCampaign(prev => prev ? { ...prev, dm_brief: briefText } : prev);
      toast.success('DM Brief saved — the DM will follow it from the next turn.');
      setBriefOpen(false);
    } catch (e) {
      toast.error('Failed to save DM Brief');
    } finally {
      setSavingBrief(false);
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

  // Round state: the DM waits for every active party member to act before responding
  const pendingActions = campaign.pending_actions || [];
  const submittedIds = pendingActions.map(a => a.character_id);
  const activeChars = characters.filter(c => c.status === 'active');
  const mySubmitted = myCharacter ? submittedIds.includes(myCharacter.id) : false;
  const missingCount = activeChars.filter(c => !submittedIds.includes(c.id)).length;
  const allIn = missingCount === 0;
  const dmResponding = !!campaign.dm_processing || processing;

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
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setVideoOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-heading tracking-wider border transition-colors ${videoOpen ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}
            title="Toggle party video call"
          >
            <Video className="w-3.5 h-3.5" strokeWidth={1.5} /> Video
          </button>
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-heading tracking-wider border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" strokeWidth={1.5} /> Invite
          </button>
          {isOwner && (
            <Button variant="ghost" size="sm" onClick={() => setBriefOpen(true)} className="text-muted-foreground hover:text-foreground h-8">
              <ScrollText className="w-3.5 h-3.5 mr-1" /> DM Brief
            </Button>
          )}
          {isOwner && (
            <Button variant="ghost" size="sm" onClick={() => setFriendsOpen(true)} className="text-muted-foreground hover:text-foreground h-8">
              <Gift className="w-3.5 h-3.5 mr-1" /> Free Friends
            </Button>
          )}
          <Link to={`/campaign/${campaignId}/journal`}>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8">
              <BookOpen className="w-3.5 h-3.5 mr-1" /> Journal
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setEndSessionOpen(true)} className="text-muted-foreground hover:text-foreground h-8">
            <Flag className="w-3.5 h-3.5 mr-1" /> End Session
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-5">
        {/* Main play area */}
        <div className="flex flex-col min-h-[60vh]">
          {videoOpen && (
            <JitsiVideoPanel
              roomName={campaign.invite_code}
              displayName={myCharacter?.name}
              onClose={() => setVideoOpen(false)}
            />
          )}
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
                {`${myCharacter?.name?.toUpperCase()} · ${(campaign?.game_system === 'gammaworld' || campaign?.game_system === 'boothill' || campaign?.game_system === 'indianajones' || campaign?.game_system === 'topsecret' || campaign?.game_system === 'conan' || campaign?.game_system === 'redsonja' || campaign?.game_system === 'ghostbusters' || campaign?.game_system === 'gangbusters' || campaign?.game_system === 'legionofdoom') ? myCharacter?.race : `${myCharacter?.race} ${myCharacter?.character_class}`} · LVL ${myCharacter?.level}`}
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
              campaign?.game_system === 'starfrontiers' ? (
                <SFDiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                />
              ) : campaign?.game_system === 'gammaworld' ? (
                <GWDiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                />
              ) : campaign?.game_system === 'boothill' ? (
                <BHDiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                />
              ) : campaign?.game_system === 'indianajones' ? (
                <IJDiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                />
              ) : campaign?.game_system === 'topsecret' ? (
                <TSDiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                />
              ) : campaign?.game_system === 'conan' || campaign?.game_system === 'redsonja' ? (
                <HyDiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                  gameSystem={campaign.game_system}
                />
              ) : campaign?.game_system === 'ghostbusters' ? (
                <GBDiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                />
              ) : campaign?.game_system === 'gangbusters' ? (
                <GangDiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                />
              ) : campaign?.game_system === 'legionofdoom' ? (
                <LODDiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                />
              ) : (
                <DiceRollerPanel
                  myCharacter={myCharacter}
                  campaignId={campaignId}
                  chapter={campaign.current_chapter}
                  onRolled={handleRollCompleted}
                  onClose={() => setDiceOpen(false)}
                />
              )
            )}
            {dmResponding ? (
              <div className="flex items-center justify-center gap-2 py-3">
                <Flame className="w-4 h-4 text-primary animate-flicker" strokeWidth={1.5} />
                <span className="font-tome italic text-sm text-muted-foreground">The Dungeon Master contemplates your fate...</span>
                <Loader2 className="w-4 h-4 text-primary/40 animate-spin" />
                {isOwner && (
                  <button onClick={handleResetRound} className="ml-2 flex items-center gap-1 text-[10px] font-heading tracking-wider text-muted-foreground/60 hover:text-foreground transition-colors">
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                )}
              </div>
            ) : (mySubmitted && !discussMode) ? (
              <RoundStatus activeChars={activeChars} submittedIds={submittedIds} allIn={allIn} />
            ) : (
              <>
            <div className="flex gap-2">
              <textarea
                value={action}
                onChange={(e) => setAction(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={processing || posting}
                placeholder={discussMode
                  ? "Discuss with your party (out of character)..."
                  : (campaign?.game_system === 'starfrontiers'
                    ? (isSetup ? "e.g. We dock at the station and scan for traffic..." : "What does your operative do?")
                    : campaign?.game_system === 'gammaworld'
                    ? (isSetup ? "e.g. We pick through the ruins of an ancient store, watching for movement..." : "What does your mutant do?")
                    : campaign?.game_system === 'boothill'
                    ? (isSetup ? "e.g. We ride into town and hitch our horses outside the saloon..." : "What does your gunslinger do?")
                    : campaign?.game_system === 'indianajones'
                    ? (isSetup ? "e.g. We step off the train in Cairo, map in hand, watching for tails..." : "What does your adventurer do?")
                    : campaign?.game_system === 'spelljammer'
                    ? (isSetup ? "e.g. We bring the spelljammer about and scan the crystal sphere for traffic..." : "What does your spacer do?")
                    : campaign?.game_system === 'darksun'
                    ? (isSetup ? "e.g. We emerge from the slave pens at dusk, counting the guards and eyeing the gate..." : "What does your Athasian survivor do?")
                    : campaign?.game_system === 'topsecret'
                    ? (isSetup ? "e.g. We make the dead drop at the tram station, watching for tails..." : "What does your agent do?")
                    : campaign?.game_system === 'greyhawk'
                    ? (isSetup ? "e.g. We gather at the Green Dragon Inn in the Free City, eyeing the stranger's map..." : "What does your hero do?")
                    : campaign?.game_system === 'forgottenrealms'
                    ? (isSetup ? "e.g. We step through the gates of Waterdeep as dusk falls over the harbor..." : "What does your hero do?")
                    : campaign?.game_system === 'hollowworld'
                    ? (isSetup ? "e.g. We emerge from the polar passage into the eternal light of the inner world..." : "What does your explorer do?")
                    : campaign?.game_system === 'conan'
                    ? (isSetup ? "e.g. We stride into the waterfront tavern in Messantia, hands on our hilts..." : "What does your warrior do?")
                    : campaign?.game_system === 'redsonja'
                    ? (isSetup ? "e.g. We ride into the Hyrkanian camp at dusk, our blades loose in their scabbards..." : "What does your warrior do?")
                    : campaign?.game_system === 'buckrogers'
                    ? (isSetup ? "e.g. We dock at the station and scan for RAM traffic..." : "What does your rocketjockey do?")
                    : campaign?.game_system === 'ghostbusters'
                    ? (isSetup ? "e.g. We roll up to the haunted brownstone, proton packs humming..." : "What does your buster do?")
                    : campaign?.game_system === 'gangbusters'
                    ? (isSetup ? "e.g. We walk into the speakeasy, hats low, looking for the boss..." : "What does your character do?")
                    : campaign?.game_system === 'legionofdoom'
                    ? (isSetup ? "e.g. We gather in the Hall of Doom, the hologram of the target spinning between us..." : "What does your villain do?")
                    : (isSetup ? "e.g. We enter the tavern and look around..." : "What does your hero do?"))}
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
            {!discussMode && (
              <button
                onClick={handleAgree}
                disabled={processing || posting}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border/50 text-[11px] font-heading tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" strokeWidth={1.5} /> I Agree — Stand Ready
              </button>
            )}
              </>
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
            <PartyOverview characters={characters} campaignId={campaignId} gameSystem={campaign.game_system} />
          </div>

          {/* World state */}
          <div className="border border-border/50 rounded-lg bg-card/40 p-3">
            <div className="flex items-center gap-2 mb-2.5">
              <MapPin className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">WORLD STATE</h3>
            </div>
            <div className="space-y-2 text-[11px] font-body">
              <LocationDossier campaignId={campaignId} legacyLocations={campaign.world_state?.locations_explored || []} />
              <NpcDossier campaignId={campaignId} />
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

      {/* DM Brief editor (owner only) */}
      <Dialog open={briefOpen} onOpenChange={setBriefOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading tracking-wide">Dungeon Master Brief</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground font-body leading-relaxed">
            Custom instructions for how the DM runs this table — tone, pacing, narration length, dice philosophy, NPCs, and table discipline. The DM reads this every turn and follows it over its defaults.
          </p>
          <Textarea
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            placeholder="Paste your DM Brief here..."
            className="min-h-[320px] font-body text-sm"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setBriefOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveBrief} disabled={savingBrief} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {savingBrief ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Brief'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EndSessionDialog open={endSessionOpen} onOpenChange={setEndSessionOpen} campaignId={campaignId} />
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} campaign={campaign} />
      <PurchaseSessionDialog open={purchaseOpen} onOpenChange={setPurchaseOpen} campaignId={campaignId} />
      <FreeFriendsManager open={friendsOpen} onOpenChange={setFriendsOpen} campaignId={campaignId} />
    </div>
  );
}