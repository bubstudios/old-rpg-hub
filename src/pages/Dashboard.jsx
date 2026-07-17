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
  Loader2, Skull, MapPin, Swords, Settings, Lock, BookOpen, ChevronRight
} from 'lucide-react';

const SYSTEM_THUMBS = {
  add1e: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80',
  starfrontiers: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80',
  gammaworld: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
  boothill: 'https://images.unsplash.com/photo-1544819075-5dbb73f17b87?w=400&q=80',
  indianajones: 'https://images.unsplash.com/photo-1582058091505-f87a2e55885?w=400&q=80',
  topsecret: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80',
  conan: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80',
  redsonja: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80',
  ghostbusters: 'https://images.unsplash.com/photo-1509248961158-e54f69343a14?w=400&q=80',
  gangbusters: 'https://images.unsplash.com/photo-1544819075-5dbb73f17b87?w=400&q=80',
  legionofdoom: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80',
  pathfinder: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
};

function thumbFor(system) {
  return SYSTEM_THUMBS[system] || SYSTEM_THUMBS.add1e;
}

const STATUS_STYLES = {
  active: 'text-emerald-400',
  paused: 'text-red-400',
  completed: 'text-emerald-400/60',
  setup: 'text-amber-400',
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
        <Loader2 className="w-6 h-6 text-[#d4af37]/50 animate-spin" />
      </div>
    );
  }

  const campaigns = data?.campaigns || [];
  const characters = data?.characters || [];
  const lastCampaign = campaigns[0] || null;
  const invites = campaigns.filter(c => !c.has_character);

  return (
    <div className="min-h-screen relative">
      <div className="cathedral-bg" />

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-10 relative">
        {/* CATHEDRAL PANEL — arched stone with gold leading */}
        <div className="cathedral-panel p-5 sm:p-7">
          {/* Title — crimson arch banner with compass seal */}
          <div className="flex items-stretch gap-0 mb-5">
            <div className="flex items-center pl-1 pr-3">
              <div className="w-11 h-11 rounded-full wax-seal flex items-center justify-center shrink-0 shadow-lg ring-2 ring-[#3a0808] candle-glow">
                <Compass className="w-4 h-4 text-amber-50" strokeWidth={1.4} />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center crimson-arch py-2.5 px-4">
              <h1 className="font-heading font-700 text-lg sm:text-xl tracking-[0.2em] text-[#d4af37]">
                COMMAND CENTER
              </h1>
            </div>
          </div>
          <p className="font-tome italic text-xs text-[#e5d3b3]/40 text-center -mt-3 mb-5">Your saga awaits</p>

          {/* Resume Last Campaign — gothic inset hero card */}
          {lastCampaign ? (
            <button
              onClick={() => navigate(`/campaign/${lastCampaign.id}`)}
              className="w-full text-left mb-4 group"
            >
              <div className="gothic-inset overflow-hidden flex flex-col sm:flex-row">
                {/* Left: campaign image + title */}
                <div className="flex-1 relative min-h-[100px]">
                  <img src={thumbFor(lastCampaign.game_system)} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-[#0d0a08]/50 to-transparent" />
                  <div className="relative p-3 flex flex-col justify-end h-full min-h-[100px]">
                    <p className="text-[8px] font-heading tracking-[0.2em] text-[#d4af37]/70 uppercase mb-0.5">Resume Last Campaign</p>
                    <h2 className="font-heading font-700 text-base sm:text-lg text-[#e5d3b3] leading-tight truncate group-hover:text-[#d4af37] transition-colors">{lastCampaign.name}</h2>
                    <div className="flex items-center gap-2 flex-wrap text-[9px] text-[#e5d3b3]/50 font-body mt-0.5">
                      <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> Ch.{lastCampaign.current_chapter}</span>
                      <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" /> {lastCampaign.party_count} {lastCampaign.party_count === 1 ? 'hero' : 'heroes'}</span>
                      {lastCampaign.combat_active && <span className="flex items-center gap-0.5 text-red-400"><Skull className="w-2.5 h-2.5" /> Combat</span>}
                    </div>
                  </div>
                </div>
                {/* Right: Continue Journey button */}
                <div className="flex items-center justify-center gap-2 p-3 sm:p-4 sm:border-l border-[#d4af37]/20">
                  <div className="flex flex-col items-center gap-1.5 group-hover:scale-105 transition-transform">
                    <div className="w-13 h-13 rounded-full gold-glow flex items-center justify-center" style={{ width: '3.25rem', height: '3.25rem' }}>
                      <Play className="w-5 h-5 text-amber-50" strokeWidth={2} fill="currentColor" />
                    </div>
                    <span className="font-heading text-[9px] tracking-[0.12em] text-[#d4af37]">CONTINUE JOURNEY</span>
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <div className="mb-4 text-center py-6">
              <p className="font-tome italic text-sm text-[#e5d3b3]/40">No campaigns yet — your saga awaits below.</p>
            </div>
          )}

          {/* Action tiles — gothic insets with gold leading */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {/* Join by Code */}
            <div className="gothic-inset p-2.5 text-center">
              <KeyRound className="w-4 h-4 mx-auto mb-1 text-[#d4af37]/70" strokeWidth={1.5} />
              <p className="text-[7px] sm:text-[8px] font-heading tracking-wider text-[#e5d3b3]/50 mb-1.5">JOIN BY CODE</p>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
                placeholder="CODE"
                className="bg-[#0d0a08] font-heading tracking-wider uppercase text-center text-[10px] h-7 border-[#d4af37]/20 text-[#e5d3b3] placeholder:text-[#e5d3b3]/25"
                maxLength={6}
              />
              <Button
                onClick={handleJoin}
                disabled={joining || !joinCode.trim()}
                className="w-full mt-1.5 h-7 text-[9px] bg-gradient-to-b from-[#d4af37] to-[#8a6a1f] text-[#0d0a08] hover:from-[#f0c66d] hover:to-[#d4af37] border border-[#d4af37]/30 font-heading tracking-wider"
              >
                {joining ? <Loader2 className="w-3 h-3 animate-spin" /> : 'JOIN'}
              </Button>
            </div>
            {/* Create New Campaign */}
            <Link to="/games" className="gothic-inset p-2.5 text-center flex flex-col items-center justify-center hover:border-[#d4af37]/40 transition-all min-h-[92px]">
              <Plus className="w-4 h-4 mx-auto mb-1 text-[#d4af37]/70" strokeWidth={1.5} />
              <p className="text-[7px] sm:text-[8px] font-heading tracking-wider text-[#e5d3b3]/50 leading-tight">CREATE NEW<br />CAMPAIGN</p>
            </Link>
            {/* Browse Adventures */}
            <Link to="/modules" className="gothic-inset p-2.5 text-center flex flex-col items-center justify-center hover:border-[#d4af37]/40 transition-all min-h-[92px]">
              <Library className="w-4 h-4 mx-auto mb-1 text-[#d4af37]/70" strokeWidth={1.5} />
              <p className="text-[7px] sm:text-[8px] font-heading tracking-wider text-[#e5d3b3]/50 leading-tight">BROWSE<br />ADVENTURES</p>
            </Link>
          </div>

          {/* Your Chronicles — gold leading divider */}
          <GothicDivider title="YOUR CHRONICLES" />

          {campaigns.length === 0 ? (
            <p className="font-tome italic text-xs text-[#e5d3b3]/30 text-center py-4">No chronicles yet.</p>
          ) : (
            <div className="gothic-inset overflow-hidden">
              {campaigns.map((c, idx) => {
                const sys = getGameSystem(c.game_system || 'add1e');
                return (
                  <Link
                    key={c.id}
                    to={`/campaign/${c.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2.5 ${idx > 0 ? 'border-t border-[#d4af37]/10' : ''} hover:bg-[#1a1612] transition-colors group`}
                  >
                    <div className="w-8 h-8 rounded overflow-hidden shrink-0 border border-[#d4af37]/15 bg-[#0d0a08]">
                      <img src={thumbFor(c.game_system)} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-600 text-sm text-[#e5d3b3] group-hover:text-[#d4af37] transition-colors truncate">{c.name}</p>
                      <div className="flex items-center gap-1.5 text-[9px] text-[#e5d3b3]/35 font-body">
                        <span className="truncate">{sys.short} · Ch.{c.current_chapter} · {c.party_count} {c.party_count === 1 ? 'hero' : 'heroes'}</span>
                      </div>
                    </div>
                    <span className={`text-[8px] font-heading tracking-wider whitespace-nowrap ${STATUS_STYLES[c.status] || STATUS_STYLES.setup}`}>
                      {(c.status || 'setup').toUpperCase()}
                    </span>
                    <span className="hidden sm:block text-[9px] text-[#e5d3b3]/30 font-body whitespace-nowrap w-16 text-right">{moment(c.updated_date).format('MMM D')}</span>
                    <Settings className="w-3.5 h-3.5 text-[#e5d3b3]/20 shrink-0" strokeWidth={1.5} />
                    {!c.is_owner && <Lock className="w-3.5 h-3.5 text-[#e5d3b3]/20 shrink-0" strokeWidth={1.5} />}
                    <ChevronRight className="w-3.5 h-3.5 text-[#e5d3b3]/25 shrink-0 group-hover:text-[#d4af37] transition-colors" strokeWidth={1.5} />
                  </Link>
                );
              })}
            </div>
          )}

          {/* My Characters */}
          {characters.length > 0 && (
            <>
              <GothicDivider title="MY CHARACTERS" className="mt-5" />
              <div className="gothic-inset overflow-hidden">
                {characters.map((ch, idx) => {
                  const sys = getGameSystem(ch.game_system || 'add1e');
                  const dead = ch.status === 'dead';
                  return (
                    <Link
                      key={ch.id}
                      to={`/campaign/${ch.campaign_id}/character/${ch.id}`}
                      className={`flex items-center gap-2.5 px-3 py-2.5 ${idx > 0 ? 'border-t border-[#d4af37]/10' : ''} hover:bg-[#1a1612] transition-colors group ${dead ? 'opacity-50' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0d0a08] border border-[#d4af37]/15 flex items-center justify-center shrink-0">
                        <ScrollText className="w-3.5 h-3.5 text-[#d4af37]/40" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-600 text-sm text-[#e5d3b3] group-hover:text-[#d4af37] transition-colors truncate">{ch.name}</p>
                        <p className="text-[9px] text-[#e5d3b3]/35 font-body truncate">{ch.race} {ch.character_class} · Lvl {ch.level}</p>
                      </div>
                      {dead ? (
                        <span className="text-[8px] font-heading tracking-wider text-red-400">FALLEN</span>
                      ) : (
                        <span className="text-[8px] font-heading tracking-wider text-[#e5d3b3]/35">{sys.short}</span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-[#e5d3b3]/25 shrink-0 group-hover:text-[#d4af37] transition-colors" strokeWidth={1.5} />
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Pending Invites */}
          {invites.length > 0 && (
            <>
              <GothicDivider title="PENDING INVITES" className="mt-5" />
              <div className="gothic-inset overflow-hidden">
                {invites.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/campaign/${c.id}/create-character`)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 ${idx > 0 ? 'border-t border-[#d4af37]/10' : ''} hover:bg-[#1a1612] transition-colors group text-left`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#0d0a08] border border-[#d4af37]/15 flex items-center justify-center shrink-0">
                      <KeyRound className="w-3.5 h-3.5 text-[#d4af37]/40" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-600 text-sm text-[#e5d3b3] group-hover:text-[#d4af37] transition-colors truncate">{c.name}</p>
                      <p className="text-[9px] text-[#e5d3b3]/35 font-body truncate">{c.is_owner ? 'Awaiting your hero' : 'Join the party'}</p>
                    </div>
                    <span className="text-[10px] font-heading tracking-wide text-[#d4af37]/50">JOIN</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#e5d3b3]/25 shrink-0 group-hover:text-[#d4af37] transition-colors" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* How It Works */}
          <GothicDivider title="HOW IT WORKS" className="mt-5" />
          <div className="space-y-1">
            <StepRow icon={Compass} title="Pick a Realm" desc="Choose from AD&D, Star Frontiers, Gamma World, Boot Hill, and more." />
            <StepRow icon={Plus} title="Create or Join a Campaign" desc="Start fresh, import an ongoing game, or enter an invite code." />
            <StepRow icon={ScrollText} title="Roll a Character" desc="Generate stats by the system's rules, or import a sheet." />
            <StepRow icon={Swords} title="Declare Your Actions" desc="The AI GM narrates, enforces rules, tracks HP, XP, loot, and story." />
          </div>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <Link to="/games"><Button variant="outline" size="sm" className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10"><Plus className="w-3.5 h-3.5 mr-1" /> Choose a Realm</Button></Link>
            <Link to="/modules"><Button variant="ghost" size="sm" className="text-[#e5d3b3]/40 hover:text-[#d4af37]"><Library className="w-3.5 h-3.5 mr-1" /> Library</Button></Link>
            <Link to="/how-to-use"><Button variant="ghost" size="sm" className="text-[#e5d3b3]/40 hover:text-[#d4af37]"><BookOpen className="w-3.5 h-3.5 mr-1" /> How to Use</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GothicDivider({ title, className = '' }) {
  return (
    <div className={`flex items-center gap-3 mb-2 ${className}`}>
      <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]/25" />
      <h3 className="font-heading text-[11px] tracking-[0.2em] text-[#d4af37]/50">{title}</h3>
      <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#d4af37]/25" />
    </div>
  );
}

function StepRow({ icon: Icon, title, desc }) {
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <div className="w-7 h-7 rounded-full wax-seal flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-amber-50" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-heading font-600 text-sm text-[#e5d3b3]">{title}</p>
        <p className="text-[11px] text-[#e5d3b3]/40 font-body leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}