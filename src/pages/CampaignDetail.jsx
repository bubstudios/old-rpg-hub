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
import PJCampaignStatus from '@/components/PJCampaignStatus';
import StorySoFarModal from '@/components/pj/StorySoFarModal';
import CodexDialog from '@/components/pj/CodexDialog';
import MissionsPanel from '@/components/pj/MissionsPanel';
import CrewAdviceDialog from '@/components/pj/CrewAdviceDialog';
import DecisionImpactPopup from '@/components/pj/DecisionImpactPopup';
import DecisionLogPanel from '@/components/pj/DecisionLogPanel';
import { buildDecisionImpact } from '@/lib/pjDecisionImpact';
import PullStatusPanel from '@/components/pull/PullStatusPanel';
import PullCodex from '@/components/pull/PullCodex';
import PullDecisionImpact from '@/components/pull/PullDecisionImpact';
import PullUnlockNotifications from '@/components/pull/PullUnlockNotifications';
import PullWorldState from '@/components/pull/PullWorldState';
import ChapterCompleteScreen from '@/components/pull/ChapterCompleteScreen';
import BattlePanel from '@/components/pull/BattlePanel';
import CombatImpactPopup from '@/components/pull/CombatImpactPopup';
import { getNextChapter } from '@/lib/pullChapters';
import { buildUnlockNotifications } from '@/lib/pullUnlockNotifications';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Loader2, Send, ScrollText, Swords, Skull, BookOpen, Users, MessageCircle,
  MapPin, Copy, ChevronLeft, Swords as SwordIcon, Flame, Dices, Video, Flag, UserPlus,
  Check, RefreshCw, Gift, Library, Target, Gavel, Lightbulb
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
  const processingRef = useRef(false);
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
  const [storyOpen, setStoryOpen] = useState(false);
  const [codexOpen, setCodexOpen] = useState(false);
  const [codexSection, setCodexSection] = useState(null);
  const [codexEntryKey, setCodexEntryKey] = useState(null);
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [crewAdviceOpen, setCrewAdviceOpen] = useState(false);
  const [decisionImpact, setDecisionImpact] = useState(null);
  const [decisionLogOpen, setDecisionLogOpen] = useState(false);
  const [popupSetting, setPopupSetting] = useState(() => localStorage.getItem('pj_decision_popup_setting') || 'normal');
  const [pullCodexOpen, setPullCodexOpen] = useState(false);
  const [pullImpact, setPullImpact] = useState(null);
  const [pullUnlocks, setPullUnlocks] = useState([]);
  const [chapterComplete, setChapterComplete] = useState(null);
  const [continuingChapter, setContinuingChapter] = useState(false);
  const [combatResult, setCombatResult] = useState(null);
  const [combatProcessing, setCombatProcessing] = useState(false);
  const feedRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [campaignId]);

  // Pre-fill action from character sheet special actions (Remember a Name, Accept Help)
  useEffect(() => {
    const pending = localStorage.getItem('pull_pending_action');
    if (pending) {
      setAction(pending);
      localStorage.removeItem('pull_pending_action');
    }
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
  // The GM saves updated clocks, world_state, and round state to the DB; this
  // subscription merges ALL of it into the local campaign so the sidebar,
  // popups, and clock panels always read the same live values.
  useEffect(() => {
    const unsubscribe = base44.entities.Campaign.subscribe((event) => {
      if (event.data?.id === campaignId) {
        setCampaign(prev => prev ? { ...prev, ...event.data } : event.data);
      }
    });
    return () => unsubscribe();
  }, [campaignId]);

  // Show Story So Far onboarding for new Pathfinder campaigns
  useEffect(() => {
    if (campaign?.game_system === 'pathfinder' && !localStorage.getItem(`pj_story_${campaignId}`)) {
      setStoryOpen(true);
    }
  }, [campaign, campaignId]);

  function openCodex(section, entryKey) {
    setStoryOpen(false);
    setCodexSection(section);
    setCodexEntryKey(entryKey || null);
    setCodexOpen(true);
  }

  function handleBeginAdventure() {
    localStorage.setItem(`pj_story_${campaignId}`, '1');
    setStoryOpen(false);
  }

  function handleSuggestAction(command) {
    setAction(command);
    setCodexOpen(false);
    setStoryOpen(false);
    toast.success('Command ready — review and send when ready.');
  }

  function processDecisionImpact(dmData, decisionText) {
    // The Pull: GM returns decision_impact directly + unlock notifications
    if (campaign?.game_system === 'thepull') {
      const impact = dmData?.decision_impact;
      const oldFlags = campaign?.world_state?.quest_flags || {};
      const oldUf = oldFlags.unlock_flags || {};

      // Build unlock notifications from the GM response (spoiler-gated)
      const unlocks = buildUnlockNotifications(dmData, oldFlags, popupSetting);
      if (unlocks.length > 0) {
        setPullUnlocks(unlocks);
      }

      if (impact && impact.is_meaningful) {
        // Suppress duplicate "Task Completed" popup if the task was already completed
        const isTaskCompleteDupe = oldUf.task_complete && (impact.impacts || []).some(imp =>
          /task\s*(complet|done|finish)/i.test(imp.label || '') ||
          /task\s*(complet|done|finish)/i.test(imp.change_label || '') ||
          /task\s*(complet|done|finish)/i.test(imp.reason || '')
        );
        if (!isTaskCompleteDupe) {
          base44.functions.invoke('campaignData', {
            op: 'saveDecisionLog',
            campaign_id: campaignId,
            chapter: campaign?.current_chapter || 1,
            decision: decisionText || '',
            impacts: impact.impacts || [],
            future_consequence: impact.future_consequence || ''
          }).catch(() => {});
          if (popupSetting !== 'off') {
            setPullImpact(impact);
          }
        }
      }
      return;
    }
    // Pathfinder: the LLM returns a curated decision_impact directly — use it
    // when available. Fall back to building from state-change arrays.
    let impact = null;
    if (dmData?.decision_impact && dmData.decision_impact.is_meaningful && (dmData.decision_impact.impacts || []).length) {
      impact = dmData.decision_impact;
    } else {
      impact = buildDecisionImpact(dmData);
    }

    // Enemy countermove — show a toast when the enemy responds to a success
    if (dmData?.enemy_countermove?.faction) {
      const ec = dmData.enemy_countermove;
      toast.warning(`⚠ ENEMY COUNTERMOVE — ${ec.faction.toUpperCase()}`, {
        description: ec.action || ec.narration || 'The enemy has responded.',
        duration: 8000,
      });
    }
    if (!impact) return;
    base44.functions.invoke('campaignData', {
      op: 'saveDecisionLog',
      campaign_id: campaignId,
      chapter: campaign?.current_chapter || 1,
      decision: decisionText || '',
      impacts: impact.impacts || [],
      future_consequence: impact.future_consequence || ''
    }).catch(() => {});
    if (popupSetting !== 'off') {
      setDecisionImpact(impact);
    }
  }

  function handlePopupSettingChange(value) {
    setPopupSetting(value);
    localStorage.setItem('pj_decision_popup_setting', value);
  }

  async function loadData() {
    try {
      setLoading(true);
      const res = await base44.functions.invoke('campaignData', { op: 'load', campaign_id: campaignId });
      const data = res.data;
      setCampaign(data.campaign);
      setCharacters(data.characters);
      setMyCharacter(data.my_character);
      setIsOwner(!!data.is_owner);
      setBriefText(data.campaign?.dm_brief || '');

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
    if (!rollResult?.summary || processing || campaign?.dm_processing) return;
    if (!hasBillingAccess) {
      setPurchaseOpen(true);
      return;
    }
    setDiceOpen(false);
    setProcessing(true);
    setLatestResult(null);
    try {
      const dmFunc = campaign?.game_system === 'thepull' ? 'pullGM' : campaign?.game_system === 'pathfinder' ? 'pathfinderTurn' : ['starwars','marvel','dcheroes','jamesbond','shadowrun','cyberpunk','traveller','ravenloft','oddnd','bxdnd','add2e','dnd35','dnd4e','dnd5e'].includes(campaign?.game_system) ? 'dungeonMaster2' : 'dungeonMaster';
      const res = await base44.functions.invoke(dmFunc, {
        campaign_id: campaignId,
        action: rollResult.summary,
        acting_character_id: myCharacter.id,
        is_roll_result: true
      });
      // Apply GM response state changes immediately (same as submitTurn)
      // Use the FINAL clock values returned by the GM, not LLM deltas
      setCampaign(prev => {
        if (!prev) return prev;
        const ws = prev.world_state || {};
        const flags = ws.quest_flags || {};
        const localClocks = res.data?.local_clocks || { ...(flags.local_clocks || {}) };
        return {
          ...prev,
          world_state: {
            ...ws,
            quest_flags: {
              ...flags,
              local_clocks: localClocks,
              ...(res.data?.pull_intensity !== undefined ? { pull_intensity: res.data.pull_intensity } : {}),
              ...(res.data?.scar_state ? { scar_state: res.data.scar_state } : {}),
              ...(res.data?.current_objective ? { current_objective: res.data.current_objective } : {})
            }
          }
        };
      });
      processDecisionImpact(res.data, rollResult?.summary);
      setLatestResult(res.data);
      setProcessing(false);
      if (res.data?.chapter_complete && res.data?.handoff && res.data?.chapter1_stage === 'water_wall_reached') {
        const completedNum = parseInt((res.data.handoff.completedChapter || 'chapter_001').replace('chapter_', '')) || 1;
        setChapterComplete({ handoff: res.data.handoff, chapterNumber: completedNum });
      }
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
    if (!hasBillingAccess) {
      setPurchaseOpen(true);
      return;
    }
    const submittedAction = action.trim();
    setAction('');

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
    try {
      const res = await base44.functions.invoke('campaignData', {
        op: 'submitAction',
        campaign_id: campaignId,
        acting_character_id: myCharacter.id,
        action: actionText,
        is_agree: isAgree
      });
      const data = res.data;

      // Reflect the round state immediately (avoids flicker before the subscription fires)
      setCampaign(prev => prev ? {
        ...prev,
        pending_actions: data.pending_actions || prev.pending_actions,
        dm_processing: !!data.should_invoke_dm
      } : prev);

      if (data.dm_processing) {
        toast('The Dungeon Master is already responding — please wait...');
        return;
      }

      if (data.should_invoke_dm) {
        const dmFunc = campaign?.game_system === 'thepull' ? 'pullGM' : campaign?.game_system === 'pathfinder' ? 'pathfinderTurn' : ['starwars','marvel','dcheroes','jamesbond','shadowrun','cyberpunk','traveller','ravenloft','oddnd','bxdnd','add2e','dnd35','dnd4e','dnd5e'].includes(campaign?.game_system) ? 'dungeonMaster2' : 'dungeonMaster';
        const dmRes = await base44.functions.invoke(dmFunc, {
          campaign_id: campaignId,
          action: data.combined_action,
          acting_character_id: myCharacter.id,
          skip_action_log: true
        });
        await base44.functions.invoke('campaignData', { op: 'clearRound', campaign_id: campaignId });
        // Apply GM response state changes to the local campaign immediately so
        // the sidebar (clocks, pull intensity, conditions) updates without
        // waiting for loadData(). The DB is the source of truth — loadData()
        // confirms these values, and the subscription keeps them in sync.
        // We use the FINAL clock values returned by the GM (after code-enforced
        // trust floor, stage cap, rest recovery) — NOT the LLM delta changes,
        // which may not match what was actually saved to the DB.
        setCampaign(prev => {
          if (!prev) return prev;
          const ws = prev.world_state || {};
          const flags = ws.quest_flags || {};
          // Use final clock values from the GM response (authoritative)
          const localClocks = dmRes.data?.local_clocks || { ...(flags.local_clocks || {}) };
          // Apply hidden clock changes
          const campaignClocks = { ...(flags.campaign_clocks || {}) };
          for (const cc of (dmRes.data?.clock_changes || [])) {
            campaignClocks[cc.clock] = Math.max(0, Math.min(100, (campaignClocks[cc.clock] || 0) + (cc.change || 0)));
          }
          if (dmRes.data?.enemy_turn) {
            if (dmRes.data.enemy_turn.province_1_alert_change) campaignClocks.province_1_alert = Math.max(0, Math.min(100, (campaignClocks.province_1_alert || 0) + dmRes.data.enemy_turn.province_1_alert_change));
            if (dmRes.data.enemy_turn.hunter_proximity_change) campaignClocks.hunter_proximity = Math.max(0, Math.min(100, (campaignClocks.hunter_proximity || 0) + dmRes.data.enemy_turn.hunter_proximity_change));
          }
          return {
            ...prev,
            pending_actions: [],
            dm_processing: false,
            world_state: {
              ...ws,
              quest_flags: {
                ...flags,
                local_clocks: localClocks,
                campaign_clocks: campaignClocks,
                ...(dmRes.data?.pull_intensity !== undefined ? { pull_intensity: dmRes.data.pull_intensity } : {}),
                ...(dmRes.data?.scar_state ? { scar_state: dmRes.data.scar_state } : {}),
                ...(dmRes.data?.shard_resonance !== undefined ? { shard_resonance: dmRes.data.shard_resonance } : {}),
                ...(dmRes.data?.current_objective ? { current_objective: dmRes.data.current_objective } : {}),
                ...(dmRes.data?.bullet_named ? { bullet_named: true } : {}),
                ...(dmRes.data?.camp_arc_complete !== undefined ? { camp_arc_complete: dmRes.data.camp_arc_complete } : {}),
                ...(dmRes.data?.chapter1_sequence ? { chapter1_sequence: dmRes.data.chapter1_sequence } : {}),
                ...(dmRes.data?.chapter1_stage ? { chapter1_stage: dmRes.data.chapter1_stage } : {}),
                ...(dmRes.data?.pipe_state ? { pipe_state: dmRes.data.pipe_state } : {}),
                ...(dmRes.data?.equipped_weapon ? { equipped_weapon: dmRes.data.equipped_weapon } : {}),
                ...(dmRes.data?.discovered_clocks?.length ? { discovered_clocks: [...new Set([...(flags.discovered_clocks || []), ...dmRes.data.discovered_clocks])] } : {})
              }
            }
          };
        });
        // Apply enemy countermove clock effects to local state
        if (dmRes.data?.enemy_countermove?.clock_effects) {
          setCampaign(prev => {
            if (!prev) return prev;
            const ws = prev.world_state || {};
            const flags = ws.quest_flags || {};
            const campaignClocks = { ...(flags.campaign_clocks || {}) };
            for (const ce of dmRes.data.enemy_countermove.clock_effects) {
              if (ce.clock && typeof ce.delta === 'number') {
                campaignClocks[ce.clock] = Math.max(0, Math.min(100, (campaignClocks[ce.clock] || 0) + ce.delta));
              }
            }
            return {
              ...prev,
              world_state: {
                ...ws,
                quest_flags: { ...flags, campaign_clocks: campaignClocks }
              }
            };
          });
        }
        processDecisionImpact(dmRes.data, actionText);
        setLatestResult(dmRes.data);
        setProcessing(false);
        if (dmRes.data?.chapter_complete && dmRes.data?.handoff && dmRes.data?.chapter1_stage === 'water_wall_reached') {
          const completedNum = parseInt((dmRes.data.handoff.completedChapter || 'chapter_001').replace('chapter_', '')) || 1;
          setChapterComplete({ handoff: dmRes.data.handoff, chapterNumber: completedNum });
        }
        await loadData();
        setLatestResult(null);
      }
      // else: waiting for other party members — the pending state updates via subscription
    } catch (e) {
      // If the DM call failed after dm_processing was claimed, reset the round so the campaign doesn't get stuck
      try {
        await base44.functions.invoke('campaignData', { op: 'clearRound', campaign_id: campaignId });
        setCampaign(prev => prev ? { ...prev, pending_actions: [], dm_processing: false } : prev);
      } catch { /* ignore */ }
      toast.error('The Dungeon Master falters... ' + (e.response?.data?.error || e.message));
      if (!isAgree) setAction(actionText);
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
      await base44.functions.invoke('campaignData', { op: 'clearRound', campaign_id: campaignId });
      setCampaign(prev => prev ? { ...prev, pending_actions: [], dm_processing: false } : prev);
      toast.success('Round reset.');
    } catch (e) {
      toast.error('Failed to reset round');
    }
  }

  async function handleContinueToNextChapter() {
    if (!chapterComplete) return;
    setContinuingChapter(true);
    try {
      const nextCh = getNextChapter(chapterComplete.chapterNumber);
      if (nextCh?.openingNarration) {
        await base44.entities.JournalEntry.create({
          campaign_id: campaignId,
          entry_type: 'narration',
          narration: nextCh.openingNarration,
          chapter: chapterComplete.chapterNumber + 1
        });
      }
      await loadData();
      setChapterComplete(null);
    } catch (e) {
      toast.error('Failed to start next chapter');
    } finally {
      setContinuingChapter(false);
    }
  }

  async function handleCombatResolve(intentKey) {
    if (combatProcessing) return;
    setCombatProcessing(true);
    try {
      const res = await base44.functions.invoke('pullBattle', {
        campaign_id: campaignId,
        intent_key: intentKey,
      });
      const data = res.data;
      setCombatResult(data.result);
      await reloadEntries();
      await loadData();
    } catch (e) {
      toast.error('Combat resolution failed: ' + (e.response?.data?.error || e.message));
    } finally {
      setCombatProcessing(false);
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
      await base44.functions.invoke('campaignData', { op: 'updateDmBrief', campaign_id: campaignId, dm_brief: briefText });
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
          {campaign.current_scene && campaign.game_system !== 'thepull' && (
            <p className="text-xs text-muted-foreground font-body italic mt-0.5 line-clamp-1">
              {campaign.current_scene}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {campaign?.game_system === 'pathfinder' && (
            <button
              onClick={() => openCodex('story')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-heading tracking-wider border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Library className="w-3.5 h-3.5" strokeWidth={1.5} /> Codex
            </button>
          )}
          {campaign?.game_system === 'pathfinder' && (
            <button
              onClick={() => setMissionsOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-heading tracking-wider border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Target className="w-3.5 h-3.5" strokeWidth={1.5} /> Missions
            </button>
          )}
          {campaign?.game_system === 'pathfinder' && (
            <button
              onClick={() => setCrewAdviceOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-heading tracking-wider border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" strokeWidth={1.5} /> Crew
            </button>
          )}
          {campaign?.game_system === 'pathfinder' && (
            <button
              onClick={() => setDecisionLogOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-heading tracking-wider border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Gavel className="w-3.5 h-3.5" strokeWidth={1.5} /> Decisions
            </button>
          )}
          {campaign?.game_system !== 'thepull' && (
            <button
              onClick={() => setVideoOpen((o) => !o)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-heading tracking-wider border transition-colors ${videoOpen ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}
              title="Toggle party video call"
            >
              <Video className="w-3.5 h-3.5" strokeWidth={1.5} /> Video
            </button>
          )}
          {campaign?.game_system !== 'thepull' && (
            <button
              onClick={() => setInviteOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-heading tracking-wider border border-border/50 hover:border-primary/40 text-muted-foreground hover:text-foreground transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" strokeWidth={1.5} /> Invite
            </button>
          )}
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
                {campaign?.game_system === 'pathfinder'
                  ? `${myCharacter?.name?.toUpperCase()} · UES PATHFINDER`
                  : `${((campaign?.game_system === 'thepull' && !campaign?.world_state?.quest_flags?.bullet_named) ? 'The Stranger' : myCharacter?.name)?.toUpperCase()} · ${(campaign?.game_system === 'gammaworld' || campaign?.game_system === 'boothill' || campaign?.game_system === 'indianajones' || campaign?.game_system === 'topsecret' || campaign?.game_system === 'conan' || campaign?.game_system === 'redsonja' || campaign?.game_system === 'ghostbusters' || campaign?.game_system === 'gangbusters' || campaign?.game_system === 'legionofdoom') ? myCharacter?.race : `${myCharacter?.race} ${myCharacter?.character_class}`} · LVL ${myCharacter?.level}`}
              </span>
              <button
                onClick={() => setDiscussMode((m) => !m)}
                className={`ml-auto flex items-center gap-1 text-[10px] font-heading tracking-wider px-2 py-1 rounded border transition-colors ${discussMode ? 'border-sky-500/50 text-sky-400 bg-sky-500/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}
                title={discussMode ? 'Discussing — the DM will not respond. Click to switch to actions.' : 'Switch to out-of-character party discussion (the DM will not respond).'}
              >
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} /> {discussMode ? 'Discussing' : 'Discuss'}
              </button>
              {campaign?.game_system !== 'thepull' && campaign?.game_system !== 'pathfinder' && (
                <button
                  onClick={() => setDiceOpen((o) => !o)}
                  className={`flex items-center gap-1 text-[10px] font-heading tracking-wider px-2 py-1 rounded border transition-colors ${diceOpen ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:text-foreground'}`}
                >
                  <Dices className="w-3.5 h-3.5" strokeWidth={1.5} /> Dice
                </button>
              )}
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
                    : campaign?.game_system === 'pathfinder'
                    ? (isSetup ? "e.g. Open communications. New Titan Control is requesting identification..." : "What are your orders, Captain?")
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
            {!discussMode && campaign?.game_system !== 'thepull' && (
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

        {/* Party sidebar (or Pull status for solo) */}
        <aside className="space-y-4">
          {campaign?.game_system === 'thepull' ? (
            <>
              <PullStatusPanel campaign={campaign} onOpenCodex={() => setPullCodexOpen(true)} />
              <BattlePanel campaign={campaign} onResolve={handleCombatResolve} processing={combatProcessing} />
              <button
                onClick={() => {
                  const order = ['minimal', 'normal', 'detailed', 'off'];
                  const next = order[(order.indexOf(popupSetting) + 1) % order.length];
                  handlePopupSettingChange(next);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border/40 bg-card/30 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <span>IMPACT DETAIL</span>
                <span className="text-primary/80 capitalize">{popupSetting}</span>
              </button>
            </>
          ) : (
          <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-3">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
              <h3 className="font-heading text-[11px] tracking-[0.15em] text-foreground">{campaign?.game_system === 'pathfinder' ? 'BRIDGE COMMAND' : 'THE PARTY'}</h3>
              <span className="text-[10px] text-muted-foreground/50 ml-auto">{campaign?.game_system === 'pathfinder' ? 'Captain' : `${characters.length} heroes`}</span>
            </div>
            <PartyOverview characters={characters} campaignId={campaignId} gameSystem={campaign.game_system} />
          </div>
          )}

          {/* World state — Pull reads live from campaign flags; other systems use entity dossiers */}
          {campaign?.game_system === 'thepull' ? (
            <PullWorldState campaign={campaign} />
          ) : (
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
          )}

          {campaign?.game_system === 'pathfinder' && (
            <PJCampaignStatus campaign={campaign} onOpenCodex={openCodex} />
          )}

          {myCharacter && (
            <Link to={`/campaign/${campaignId}/character/${myCharacter.id}`}>
              <Button variant="outline" className="w-full border-border/50 text-muted-foreground hover:text-foreground h-9">
                <ScrollText className="w-3.5 h-3.5 mr-1.5" /> {campaign?.game_system === 'pathfinder' ? "Captain's File" : 'My Character Sheet'}
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
            <Button variant="ghost" onClick={() => { setBriefOpen(false); setStoryOpen(true); }} className="text-muted-foreground hover:text-foreground">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Story So Far
            </Button>
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
      {campaign?.game_system === 'pathfinder' && (
        <>
          <StorySoFarModal
            open={storyOpen}
            onBegin={handleBeginAdventure}
            onNavigate={(section) => openCodex(section)}
          />
          <CodexDialog
            open={codexOpen}
            onOpenChange={setCodexOpen}
            initialSection={codexSection}
            initialEntryKey={codexEntryKey}
            campaign={campaign}
            onSuggestAction={handleSuggestAction}
          />
          <MissionsPanel
            open={missionsOpen}
            onOpenChange={setMissionsOpen}
            campaign={campaign}
            onSuggestAction={handleSuggestAction}
          />
          <CrewAdviceDialog
            open={crewAdviceOpen}
            onOpenChange={setCrewAdviceOpen}
            campaign={campaign}
            onSuggestAction={handleSuggestAction}
          />
        </>
      )}
      {campaign?.game_system === 'thepull' && (
        <>
          <PullCodex
            open={pullCodexOpen}
            onOpenChange={setPullCodexOpen}
            campaign={campaign}
          />
          <PullDecisionImpact
            impact={pullImpact}
            onDismiss={() => setPullImpact(null)}
            setting={popupSetting}
          />
          <CombatImpactPopup
            result={combatResult}
            onDismiss={() => setCombatResult(null)}
          />
          <PullUnlockNotifications
            notifications={pullUnlocks}
            onDismiss={() => setPullUnlocks([])}
          />
          <ChapterCompleteScreen
            open={!!chapterComplete}
            handoff={chapterComplete?.handoff}
            chapterNumber={chapterComplete?.chapterNumber || 1}
            onContinue={handleContinueToNextChapter}
            continuing={continuingChapter}
          />
        </>
      )}
      {campaign?.game_system === 'pathfinder' && (
        <>
          <DecisionImpactPopup
            impact={decisionImpact}
            onDismiss={() => setDecisionImpact(null)}
            onOpenLog={() => { setDecisionImpact(null); setDecisionLogOpen(true); }}
            setting={popupSetting}
          />
          <DecisionLogPanel
            open={decisionLogOpen}
            onOpenChange={setDecisionLogOpen}
            campaignId={campaignId}
            setting={popupSetting}
            onSettingChange={handlePopupSettingChange}
          />
        </>
      )}
    </div>
  );
}