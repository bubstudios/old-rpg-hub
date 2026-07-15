import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getGameSystem } from '@/lib/gameSystems';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  ScrollText, Play, KeyRound, Plus, Library, Users, Compass, HelpCircle,
  ChevronRight, Loader2, Skull, MapPin, Swords, Sparkles, ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const user = await base44.auth.me();
      const [myChars, createdCampaigns, featured] = await Promise.all([
        base44.entities.Character.filter({ created_by_id: user.id }, '-updated_date', 50),
        base44.entities.Campaign.filter({ created_by_id: user.id }, '-updated_date', 100),
        base44.entities.AdventureModule.filter({ visibility: 'shared' }, '-updated_date', 6)
      ]);

      const campaignIds = [...new Set([...myChars.map(c => c.campaign_id), ...createdCampaigns.map(c => c.id)])];
      const campaigns = [];
      for (const cid of campaignIds) {
        try {
          const camp = await base44.entities.Campaign.get(cid);
          const partyCount = await base44.entities.Character.filter({ campaign_id: cid, status: 'active' });
          campaigns.push({
            id: camp.id, name: camp.name, game_system: camp.game_system || 'add1e',
            status: camp.status, current_chapter: camp.current_chapter,
            combat_active: camp.combat_active, invite_code: camp.invite_code,
            updated_date: camp.updated_date, created_date: camp.created_date,
            party_count: partyCount.length,
            has_character: myChars.some(c => c.campaign_id === cid),
            is_owner: camp.created_by_id === user.id
          });
        } catch (e) { /* campaign may be deleted */ }
      }
      campaigns.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));

      const characters = [];
      for (const ch of myChars) {
        let campaign_name = '';
        let game_system = ch.game_system || 'add1e';
        try {
          const camp = await base44.entities.Campaign.get(ch.campaign_id);
          campaign_name = camp.name;
          game_system = camp.game_system || game_system;
        } catch (e) { /* campaign may be deleted */ }
        characters.push({
          id: ch.id, name: ch.name, race: ch.race, character_class: ch.character_class,
          level: ch.level, hp_current: ch.hp_current, hp_max: ch.hp_max, status: ch.status,
          campaign_id: ch.campaign_id, campaign_name, game_system
        });
      }

      setData({ campaigns, characters, featured });
    } catch (e) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (!joinCode.trim()) return;
    setJoining(true);
    try {
      const campaigns = await base44.entities.Campaign.filter({ invite_code: joinCode.trim().toUpperCase() });
      if (!campaigns.length) throw new Error('not found');
      navigate(`/campaign/${campaigns[0].id}`);
    } catch (e) {
      toast.error('No campaign found with that code');
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
      </div>
    );
  }

  const campaigns = data?.campaigns || [];
  const characters = data?.characters || [];
  const featured = data?.featured || [];
  const lastCampaign = campaigns[0] || null;
  const invites = campaigns.filter(c => !c.has_character);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded wax-seal flex items-center justify-center shrink-0 animate-flicker">
            <Compass className="w-5 h-5 text-primary-foreground" strokeWidth={1.4} />
          </div>
          <div>
            <h1 className="font-heading font-700 text-2xl sm:text-3xl tracking-[0.08em] text-foreground">
              COMMAND CENTER
            </h1>
            <p className="font-tome italic text-sm text-muted-foreground">
              Your saga awaits — resume a tale, join a party, or begin anew.
            </p>
          </div>
        </div>
      </div>

      {/* Resume last campaign */}
      {lastCampaign ? (
        <button
          onClick={() => navigate(`/campaign/${lastCampaign.id}`)}
          className="group w-full text-left mb-6 relative overflow-hidden rounded-xl border border-primary/40 bg-gradient-to-br from-primary/15 via-card/60 to-background panel-glow hover:border-primary/60 transition-all p-5"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full wax-seal flex items-center justify-center shrink-0">
              <Play className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-heading tracking-[0.2em] text-primary/80 uppercase mb-0.5">RESUME LAST CAMPAIGN</p>
              <h2 className="font-heading font-700 text-lg sm:text-xl text-foreground truncate group-hover:text-primary transition-colors">{lastCampaign.name}</h2>
              <div className="flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground font-body mt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Ch. {lastCampaign.current_chapter}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {lastCampaign.party_count} {lastCampaign.party_count === 1 ? 'hero' : 'heroes'}</span>
                <span>{getGameSystem(lastCampaign.game_system || 'add1e').short}</span>
                {lastCampaign.combat_active && <span className="flex items-center gap-1 text-red-400"><Skull className="w-3 h-3" /> COMBAT</span>}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
          </div>
        </button>
      ) : (
        <div className="mb-6 rounded-xl border border-dashed border-border/50 p-5 text-center">
          <p className="font-tome italic text-sm text-muted-foreground">No campaigns yet — begin your first tale below.</p>
        </div>
      )}

      {/* My Campaigns */}
      {campaigns.length > 1 && (
        <Panel icon={ScrollText} title="My Campaigns" count={campaigns.length} className="mb-8">
          <div className="space-y-2">
            {campaigns.map((c) => {
              const sys = getGameSystem(c.game_system || 'add1e');
              const dead = c.combat_active;
              return (
                <Link key={c.id} to={`/campaign/${c.id}`} className="flex items-center gap-3 p-2.5 rounded-lg border border-border/40 bg-card/30 hover:border-primary/40 hover:bg-secondary/20 transition-all group">
                  <div className="w-9 h-9 rounded-full bg-secondary/60 flex items-center justify-center shrink-0">
                    <ScrollText className="w-4 h-4 text-primary/70" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-600 text-sm text-foreground group-hover:text-primary transition-colors truncate">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground font-body truncate">
                      {sys.short} · Ch. {c.current_chapter} · {c.party_count} {c.party_count === 1 ? 'hero' : 'heroes'}
                    </p>
                  </div>
                  {dead && <span className="text-[9px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-destructive/20 text-destructive shrink-0">COMBAT</span>}
                  <span className="text-[9px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground shrink-0">{sys.short}</span>
                </Link>
              );
            })}
          </div>
        </Panel>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <ActionCard icon={KeyRound} title="Join by Code" desc="Enter a party invite code">
          <div className="flex gap-2 mt-2">
            <Input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }} placeholder="K7MP2Q" className="bg-background/60 font-heading tracking-wider uppercase" maxLength={6} />
            <Button onClick={handleJoin} disabled={joining || !joinCode.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 px-3">
              {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </Button>
          </div>
        </ActionCard>
        <ActionCard icon={Plus} title="Create New Campaign" desc="Pick a realm and begin" to="/games" />
        <ActionCard icon={Library} title="Browse Adventures" desc="The shared module library" to="/modules" />
      </div>

      {/* My Characters + Recent Invites */}
      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        <Panel icon={Swords} title="My Characters" count={characters.length}>
          {characters.length === 0 ? (
            <Empty text="No characters yet. Create or join a campaign to roll one." />
          ) : (
            <div className="space-y-2">
              {characters.map((ch) => {
                const sys = getGameSystem(ch.game_system || 'add1e');
                const dead = ch.status === 'dead';
                return (
                  <Link key={ch.id} to={`/campaign/${ch.campaign_id}/character/${ch.id}`} className={`flex items-center gap-3 p-2.5 rounded-lg border border-border/40 bg-card/30 hover:border-primary/40 hover:bg-secondary/20 transition-all group ${dead ? 'opacity-50' : ''}`}>
                    <div className="w-9 h-9 rounded-full bg-secondary/60 flex items-center justify-center shrink-0">
                      <ScrollText className="w-4 h-4 text-primary/70" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-600 text-sm text-foreground group-hover:text-primary transition-colors truncate">{ch.name}</p>
                      <p className="text-[11px] text-muted-foreground font-body truncate">
                        {ch.race} {ch.character_class} · Lvl {ch.level} · {ch.campaign_name || 'Unknown campaign'}
                      </p>
                    </div>
                    {dead ? (
                      <span className="text-[9px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-destructive/20 text-destructive shrink-0">FALLEN</span>
                    ) : (
                      <span className="text-[9px] font-heading tracking-wider px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground shrink-0">{sys.short}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </Panel>

        <Panel icon={Sparkles} title="Recent Invites" count={invites.length}>
          {invites.length === 0 ? (
            <Empty text="No pending invites. Share your campaign codes to gather a party." />
          ) : (
            <div className="space-y-2">
              {invites.map((c) => (
                <button key={c.id} onClick={() => navigate(`/campaign/${c.id}/create-character`)} className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-border/40 bg-card/30 hover:border-primary/40 hover:bg-secondary/20 transition-all group text-left">
                  <div className="w-9 h-9 rounded-full bg-amber-900/30 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-600 text-sm text-foreground group-hover:text-primary transition-colors truncate">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground font-body truncate">
                      {getGameSystem(c.game_system || 'add1e').short} · {c.is_owner ? 'You created · awaiting your hero' : 'Awaiting your character'}
                    </p>
                  </div>
                  <span className="text-[10px] font-heading tracking-wide text-amber-400 shrink-0">JOIN</span>
                </button>
              ))}
            </div>
          )}
        </Panel>
      </div>

      {/* Featured adventures */}
      <Panel icon={Compass} title="Featured Public Adventures" count={featured.length} className="mb-8">
        {featured.length === 0 ? (
          <Empty text="No shared adventures yet. Upload a module to the library to feature it." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featured.map((m) => (
              <Link key={m.id} to="/modules" className="block p-3 rounded-lg border border-border/40 bg-card/30 hover:border-primary/40 hover:bg-secondary/20 transition-all group">
                <p className="font-heading font-600 text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{m.title}</p>
                {m.author && <p className="text-[10px] text-muted-foreground font-body">by {m.author}</p>}
                <p className="text-[11px] text-muted-foreground/80 font-body mt-1 line-clamp-2 leading-relaxed">{m.description || 'No description.'}</p>
                <p className="text-[9px] font-heading tracking-wider text-primary/70 mt-2">{getGameSystem(m.game_system || 'add1e').short}</p>
              </Link>
            ))}
          </div>
        )}
      </Panel>

      {/* Learn how it works */}
      <Panel icon={HelpCircle} title="Learn How It Works">
        <div className="grid sm:grid-cols-2 gap-3">
          <Step n={1} title="Pick a realm" desc="Choose from AD&D, Star Frontiers, Gamma World, and many more classic systems." />
          <Step n={2} title="Create or join a campaign" desc="Start fresh with a custom world, import an ongoing game, or enter an invite code." />
          <Step n={3} title="Roll a character" desc="Generate stats by the system's rules, or import an existing character sheet." />
          <Step n={4} title="Declare your actions" desc="The AI Game Master narrates the world, enforces the rules, and tracks HP, XP, loot, NPCs, and the story." />
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          <Link to="/games"><Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10"><Plus className="w-4 h-4 mr-1.5" /> Choose a Realm</Button></Link>
          <Link to="/modules"><Button variant="ghost" className="text-muted-foreground hover:text-foreground"><Library className="w-4 h-4 mr-1.5" /> Browse Library</Button></Link>
        </div>
      </Panel>
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, to, children }) {
  const content = (
    <div className="h-full border border-border/50 rounded-lg p-4 bg-card/40 panel-glow hover:border-primary/40 hover:bg-secondary/20 transition-all">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
        <h3 className="font-heading text-xs tracking-[0.15em] text-foreground">{title.toUpperCase()}</h3>
      </div>
      <p className="text-[11px] text-muted-foreground font-body mb-2">{desc}</p>
      {children}
    </div>
  );
  if (to) return <Link to={to} className="block h-full">{content}</Link>;
  return content;
}

function Panel({ icon: Icon, title, count, children, className = '' }) {
  return (
    <div className={`border border-border/50 rounded-lg bg-card/30 panel-glow p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-primary" strokeWidth={1.5} />
        <h3 className="font-heading text-xs tracking-[0.15em] text-foreground">{title.toUpperCase()}</h3>
        {count != null && <span className="text-[10px] text-muted-foreground/50 ml-auto">{count}</span>}
      </div>
      {children}
    </div>
  );
}

function Empty({ text }) {
  return (
    <div className="text-center py-6">
      <p className="font-tome italic text-xs text-muted-foreground/70 leading-relaxed">{text}</p>
    </div>
  );
}

function Step({ n, title, desc }) {
  return (
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full wax-seal flex items-center justify-center shrink-0 text-[11px] font-heading font-700 text-primary-foreground">{n}</div>
      <div>
        <p className="font-heading font-600 text-sm text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground font-body leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}