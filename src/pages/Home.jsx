import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ScrollText, Plus, Users, KeyRound, Loader2, Skull, MapPin, ChevronRight, Settings2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CampaignSetupForm from '@/components/CampaignSetupForm';
import ImportCampaignForm from '@/components/ImportCampaignForm';
import { getGameSystem } from '@/lib/gameSystems';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const game = getGameSystem(gameId);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      setLoading(true);
      const res = await base44.functions.invoke('campaignData', { op: 'list', game_system: game.id });
      setCampaigns(res.data.campaigns || []);
    } catch (e) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }

  function handleCreated(campaign) {
    setShowCreate(false);
    navigate(`/campaign/${campaign.id}/create-character`);
  }

  function handleImported(campaign) {
    setShowImport(false);
    navigate(`/campaign/${campaign.id}/create-character`);
  }

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      const res = await base44.functions.invoke('campaignData', {
        op: 'join',
        invite_code: joinCode.trim().toUpperCase()
      });
      navigate(`/campaign/${res.data.campaign.id}`);
    } catch (e) {
      toast.error('No campaign found with that code');
    } finally {
      setJoining(false);
    }
  }

  async function handleDelete(campaignId, campaignName) {
    if (!confirm(`Delete "${campaignName}"? This permanently removes the campaign and all its characters, journal entries, loot, and death records. This cannot be undone.`)) return;
    setDeletingId(campaignId);
    try {
      await base44.functions.invoke('campaignData', { op: 'deleteCampaign', campaign_id: campaignId });
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      toast.success('Campaign deleted');
    } catch (e) {
      toast.error('Failed to delete campaign');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full wax-seal mb-5 animate-flicker">
          <ScrollText className="w-7 h-7 text-primary-foreground" strokeWidth={1.2} />
        </div>
        <h1 className="font-heading font-900 text-3xl sm:text-5xl tracking-[0.08em] text-foreground mb-3">
          {game.dashboardTitle}
        </h1>
        <p className="font-tome text-base sm:text-lg text-muted-foreground italic max-w-xl mx-auto leading-relaxed">
          {game.dashboardSubtitle}
        </p>
        <div className="divider-rune max-w-xs mx-auto mt-6">
          <span className="text-xs tracking-[0.3em]">⚔</span>
        </div>
      </div>

      {/* Create / Join */}
      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        <div className="border border-border/50 rounded-lg p-5 bg-card/40 panel-glow">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">BEGIN A CAMPAIGN</h2>
          </div>
          {showCreate ? (
            <CampaignSetupForm gameSystem={game.id} onCreated={handleCreated} onCancel={() => setShowCreate(false)} />
          ) : showImport ? (
            <ImportCampaignForm gameSystem={game.id} onCreated={handleImported} onCancel={() => setShowImport(false)} />
          ) : (
            <div className="space-y-2">
              <Button onClick={() => setShowCreate(true)} variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10">
                <Settings2 className="w-4 h-4 mr-1.5" /> Create New Campaign
              </Button>
              <Button onClick={() => setShowImport(true)} variant="ghost" className="w-full border-border/50 text-muted-foreground hover:text-foreground">
                <Upload className="w-4 h-4 mr-1.5" /> Import Ongoing Campaign
              </Button>
            </div>
          )}
        </div>

        <div className="border border-border/50 rounded-lg p-5 bg-card/40 panel-glow">
          <div className="flex items-center gap-2 mb-3">
            <KeyRound className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">JOIN BY CODE</h2>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-3 leading-relaxed">
            Have an invite code from your party's organizer? Enter it to join the adventure.
          </p>
          <div className="flex gap-2">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="e.g. K7MP2Q"
              className="bg-background/60 font-heading tracking-wider uppercase"
              maxLength={6}
            />
            <Button onClick={handleJoin} disabled={joining || !joinCode.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join'}
            </Button>
          </div>
        </div>
      </div>

      {/* Campaign list */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">YOUR CAMPAIGNS</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
            <ScrollText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" strokeWidth={1} />
            <p className="font-tome italic text-muted-foreground text-sm">
              No campaigns yet. The tome awaits its first tale...
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="group relative text-left p-4 rounded-lg border border-border/50 bg-card/40 hover:border-primary/40 hover:bg-secondary/20 transition-all"
              >
                <button
                  onClick={() => navigate(`/campaign/${c.id}`)}
                  className="block w-full text-left"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-heading font-600 text-base text-foreground group-hover:text-primary transition-colors">
                      {c.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                  </div>
                <div className="flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground font-body">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Ch. {c.current_chapter}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {c.party_count} {c.party_count === 1 ? 'hero' : 'heroes'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-heading tracking-wide ${
                    c.status === 'active' ? 'bg-emerald-900/30 text-emerald-400' :
                    c.status === 'setup' ? 'bg-amber-900/30 text-amber-400' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {c.status.toUpperCase()}
                  </span>
                  {c.combat_active && (
                    <span className="flex items-center gap-1 text-red-400 font-heading tracking-wide">
                      <Skull className="w-3 h-3" /> COMBAT
                    </span>
                  )}
                </div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground/50">
                    CODE: {c.invite_code}
                  </span>
                  {!c.has_character && (
                    <span className="text-[10px] font-heading tracking-wide text-amber-400">
                      NO CHARACTER YET
                    </span>
                  )}
                </div>
                </button>
                {c.is_owner && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(c.id, c.name); }}
                    disabled={deletingId === c.id}
                    title="Delete campaign"
                    className="absolute top-2 right-2 p-1.5 rounded text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    {deletingId === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}