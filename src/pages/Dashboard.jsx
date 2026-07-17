import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getGameSystem } from '@/lib/gameSystems';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import moment from 'moment';
import {
  ScrollText, Play, KeyRound, Plus, Library, Users, Compass,
  Loader2, Skull, MapPin, Swords, Settings, Lock, BookOpen
} from 'lucide-react';

const SYSTEM_THUMBS = {
  add1e: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&q=80',
  starfrontiers: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&q=80',
  gammaworld: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80',
  boothill: 'https://images.unsplash.com/photo-1544819075-5dbb73f17b87?w=300&q=80',
  indianajones: 'https://images.unsplash.com/photo-1582058091505-f87a2e55885?w=300&q=80',
  topsecret: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&q=80',
  conan: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&q=80',
  redsonja: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&q=80',
  ghostbusters: 'https://images.unsplash.com/photo-1509248961158-e54f69343a14?w=300&q=80',
  gangbusters: 'https://images.unsplash.com/photo-1544819075-5dbb73f17b87?w=300&q=80',
  legionofdoom: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80',
  pathfinder: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80',
};

function thumbFor(system) {
  return SYSTEM_THUMBS[system] || SYSTEM_THUMBS.add1e;
}

const STATUS_STYLES = {
  active: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/30',
  paused: 'bg-red-900/30 text-red-400 border-red-700/30',
  completed: 'bg-emerald-900/30 text-emerald-400 border-emerald-700/30',
  setup: 'bg-amber-900/30 text-amber-400 border-amber-700/30',
};

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
  const lastCampaign = campaigns[0] || null;
  const invites = campaigns.filter(c => !c.has_character);

  return (
    <div className="min-h-screen relative">
      <div className="library-bg" />

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10 relative">
        {/* Dark candlelit main panel */}
        <div className="ornate-frame rounded-xl bg-card/80 backdrop-blur-sm p-5 sm:p-7">
          {/* Header — centered */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full wax-seal mb-3 animate-flicker">
              <Compass className="w-5 h-5 text-primary-foreground" strokeWidth={1.4} />
            </div>
            <h1 className="font-heading font-700 text-xl sm:text-2xl tracking-[0.18em] text-foreground">
              COMMAND CENTER
            </h1>
            <div className="flex items-center gap-3 mt-2.5">
              <span className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/40" />
              <span className="text-primary/50 text-xs">◆</span>
              <span className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/40" />
            </div>
            <p className="font-tome italic text-xs text-muted-foreground mt-2">Your saga awaits</p>
          </div>

          {/* Resume Last Campaign — hero card */}
          {lastCampaign ? (
            <button
              onClick={() => navigate(`/campaign/${lastCampaign.id}`)}
              className="w-full text-left mb-5 group"
            >
              <div className="rpg-card rounded-xl p-3 transition-all group-hover:border-primary/50">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 border-primary/30 shadow-lg bg-secondary/40">
                    <img src={thumbFor(lastCampaign.game_system)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-heading tracking-[0.2em] text-primary/70 uppercase mb-0.5">Resume Last Campaign</p>
                    <h2 className="font-heading font-700 text-base sm:text-lg text-foreground truncate group-hover:text-primary transition-colors">{lastCampaign.name}</h2>
                    <div className="flex items-center gap-2 flex-wrap text-[10px] text-muted-foreground font-body mt-0.5">
                      <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> Ch.{lastCampaign.current_chapter}</span>
                      <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" /> {lastCampaign.party_count} {lastCampaign.party_count === 1 ? 'hero' : 'heroes'}</span>
                      {lastCampaign.combat_active && <span className="flex items-center gap-0.5 text-red-400"><Skull className="w-2.5 h-2.5" /> Combat</span>}
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-full gold-glow flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 text-amber-50" strokeWidth={2} fill="currentColor" />
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <div className="mb-5 text-center py-6">
              <p className="font-tome italic text-sm text-muted-foreground">No campaigns yet — your saga awaits below.</p>
            </div>
          )}

          {/* Quick Actions — 3 dark gold-trimmed tiles */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            {/* Join by Code */}
            <div className="rpg-card rounded-lg p-2.5 text-center">
              <KeyRound className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-primary/70" strokeWidth={1.5} />
              <p className="text-[8px] sm:text-[9px] font-heading tracking-wider text-muted-foreground mb-1.5">JOIN BY CODE</p>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
                placeholder="CODE"
                className="bg-background/60 font-heading tracking-wider uppercase text-center text-[10px] h-7 border-primary/20 text-foreground placeholder:text-muted-foreground/40"
                maxLength={6}
              />
              <Button
                onClick={handleJoin}
                disabled={joining || !joinCode.trim()}
                className="w-full mt-1.5 h-7 text-[9px] bg-gradient-to-b from-amber-500 to-amber-700 text-amber-50 hover:from-amber-400 hover:to-amber-600 border border-amber-400/30"
              >
                {joining ? <Loader2 className="w-3 h-3 animate-spin" /> : 'JOIN'}
              </Button>
            </div>
            {/* Create New Campaign */}
            <Link to="/games" className="rpg-card rounded-lg p-2.5 text-center flex flex-col items-center justify-start hover:border-primary/50 transition-all">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-primary/70" strokeWidth={1.5} />
              <p className="text-[8px] sm:text-[9px] font-heading tracking-wider text-muted-foreground leading-tight">CREATE NEW<br />CAMPAIGN</p>
            </Link>
            {/* Browse Adventures */}
            <Link to="/modules" className="rpg-card rounded-lg p-2.5 text-center flex flex-col items-center justify-start hover:border-primary/50 transition-all">
              <Library className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 text-primary/70" strokeWidth={1.5} />
              <p className="text-[8px] sm:text-[9px] font-heading tracking-wider text-muted-foreground leading-tight">BROWSE<br />ADVENTURES</p>
            </Link>
          </div>

          {/* Your Chronicles */}
          <SectionHeader title="YOUR CHRONICLES" />
          {campaigns.length === 0 ? (
            <p className="font-tome italic text-xs text-muted-foreground/50 text-center py-3">No chronicles yet.</p>
          ) : (
            <div>
              {campaigns.map((c) => {
                const sys = getGameSystem(c.game_system || 'add1e');
                return (
                  <Link key={c.id} to={`/campaign/${c.id}`} className="flex items-center gap-2.5 py-2 border-b border-border/20 hover:bg-secondary/20 transition-colors group">
                    <div className="w-9 h-9 rounded overflow-hidden shrink-0 border border-primary/20 bg-secondary/40">
                      <img src={thumbFor(c.game_system)} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-600 text-sm text-foreground group-hover:text-primary transition-colors truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground font-body truncate">{sys.short} · Ch.{c.current_chapter} · {c.party_count} {c.party_count === 1 ? 'hero' : 'heroes'}</p>
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-heading tracking-wider px-1.5 py-0.5 rounded border ${STATUS_STYLES[c.status] || STATUS_STYLES.setup}`}>
                      {(c.status || 'setup').toUpperCase()}
                    </span>
                    <span className="hidden sm:block text-[10px] text-muted-foreground/60 font-body whitespace-nowrap w-20 text-right">{moment(c.updated_date).fromNow()}</span>
                    <Settings className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" strokeWidth={1.5} />
                    {!c.is_owner && <Lock className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" strokeWidth={1.5} />}
                  </Link>
                );
              })}
            </div>
          )}

          {/* My Characters */}
          {characters.length > 0 && (
            <>
              <SectionHeader title="MY CHARACTERS" className="mt-5" />
              <div>
                {characters.map((ch) => {
                  const sys = getGameSystem(ch.game_system || 'add1e');
                  const dead = ch.status === 'dead';
                  return (
                    <Link key={ch.id} to={`/campaign/${ch.campaign_id}/character/${ch.id}`} className={`flex items-center gap-2.5 py-2 border-b border-border/20 hover:bg-secondary/20 transition-colors group ${dead ? 'opacity-50' : ''}`}>
                      <div className="w-9 h-9 rounded-full bg-secondary/40 border border-primary/20 flex items-center justify-center shrink-0">
                        <ScrollText className="w-4 h-4 text-primary/50" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-600 text-sm text-foreground group-hover:text-primary transition-colors truncate">{ch.name}</p>
                        <p className="text-[10px] text-muted-foreground font-body truncate">{ch.race} {ch.character_class} · Lvl {ch.level}</p>
                      </div>
                      {dead ? (
                        <span className="text-[8px] sm:text-[9px] font-heading tracking-wider px-1.5 py-0.5 rounded border bg-red-900/30 text-red-400 border-red-700/30">FALLEN</span>
                      ) : (
                        <span className="text-[8px] sm:text-[9px] font-heading tracking-wider px-1.5 py-0.5 rounded border bg-amber-900/20 text-amber-400/60 border-amber-700/20">{sys.short}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Pending Invites */}
          {invites.length > 0 && (
            <>
              <SectionHeader title="PENDING INVITES" className="mt-5" />
              <div>
                {invites.map((c) => (
                  <button key={c.id} onClick={() => navigate(`/campaign/${c.id}/create-character`)} className="w-full flex items-center gap-2.5 py-2 border-b border-border/20 hover:bg-secondary/20 transition-colors group text-left">
                    <div className="w-9 h-9 rounded-full bg-secondary/40 border border-primary/20 flex items-center justify-center shrink-0">
                      <KeyRound className="w-4 h-4 text-primary/50" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-600 text-sm text-foreground group-hover:text-primary transition-colors truncate">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground font-body truncate">{c.is_owner ? 'Awaiting your hero' : 'Join the party'}</p>
                    </div>
                    <span className="text-[10px] font-heading tracking-wide text-primary/60">JOIN</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* How It Works */}
          <SectionHeader title="HOW IT WORKS" className="mt-5" />
          <div className="space-y-1">
            <StepRow icon={Compass} title="Pick a Realm" desc="Choose from AD&D, Star Frontiers, Gamma World, Boot Hill, and more." />
            <StepRow icon={Plus} title="Create or Join a Campaign" desc="Start fresh, import an ongoing game, or enter an invite code." />
            <StepRow icon={ScrollText} title="Roll a Character" desc="Generate stats by the system's rules, or import a sheet." />
            <StepRow icon={Swords} title="Declare Your Actions" desc="The AI GM narrates, enforces rules, tracks HP, XP, loot, and story." />
          </div>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <Link to="/games"><Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10"><Plus className="w-3.5 h-3.5 mr-1" /> Choose a Realm</Button></Link>
            <Link to="/modules"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><Library className="w-3.5 h-3.5 mr-1" /> Library</Button></Link>
            <Link to="/how-to-use"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground"><BookOpen className="w-3.5 h-3.5 mr-1" /> How to Use</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, className = '' }) {
  return (
    <div className={`flex items-center gap-3 mb-1 ${className}`}>
      <span className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/30" />
      <h3 className="font-heading text-[11px] tracking-[0.2em] text-muted-foreground">{title}</h3>
      <span className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/30" />
    </div>
  );
}

function StepRow({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <div className="w-7 h-7 rounded-full wax-seal flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-heading font-600 text-sm text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}