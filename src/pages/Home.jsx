import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ScrollText, Plus, Users, KeyRound, Loader2, Skull, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMode, setNewMode] = useState('async');
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    try {
      setLoading(true);
      const res = await base44.functions.invoke('campaignData', { op: 'list' });
      setCampaigns(res.data.campaigns || []);
    } catch (e) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await base44.functions.invoke('campaignData', {
        op: 'createCampaign',
        name: newName.trim(),
        mode: newMode
      });
      toast.success('Campaign forged!');
      setShowCreate(false);
      setNewName('');
      navigate(`/campaign/${res.data.campaign.id}/create-character`);
    } catch (e) {
      toast.error('Failed to create campaign');
    } finally {
      setCreating(false);
    }
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full wax-seal mb-5 animate-flicker">
          <ScrollText className="w-7 h-7 text-primary-foreground" strokeWidth={1.2} />
        </div>
        <h1 className="font-heading font-900 text-3xl sm:text-5xl tracking-[0.08em] text-foreground mb-3">
          THE IRON REALM
        </h1>
        <p className="font-tome text-base sm:text-lg text-muted-foreground italic max-w-xl mx-auto leading-relaxed">
          An old-school AD&amp;D 1st Edition campaign, ruled by an AI Dungeon Master.
          Gather your party, roll your stats, and venture into the darkness —
          where every choice is written in ink that cannot be unwritten.
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
            <div className="space-y-3">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Campaign name (e.g. Shadows of Greyhawk)"
                className="bg-background/60 font-body"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setNewMode('async')}
                  className={`flex-1 px-3 py-2 rounded text-xs font-heading tracking-wide border transition-colors ${
                    newMode === 'async' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                  }`}
                >
                  ASYNC (Play-by-post)
                </button>
                <button
                  onClick={() => setNewMode('live')}
                  className={`flex-1 px-3 py-2 rounded text-xs font-heading tracking-wide border transition-colors ${
                    newMode === 'live' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'
                  }`}
                >
                  LIVE SESSION
                </button>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreate} disabled={creating || !newName.trim()} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Forge Campaign'}
                </Button>
                <Button onClick={() => setShowCreate(false)} variant="ghost" className="text-muted-foreground">Cancel</Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowCreate(true)} variant="outline" className="w-full border-primary/40 text-primary hover:bg-primary/10">
              <Plus className="w-4 h-4 mr-1.5" /> Create New Campaign
            </Button>
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
              <button
                key={c.id}
                onClick={() => navigate(`/campaign/${c.id}`)}
                className="group text-left p-4 rounded-lg border border-border/50 bg-card/40 hover:border-primary/40 hover:bg-secondary/20 transition-all"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}