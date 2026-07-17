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
        {/* PARCHMENT SHEET — the main container */}
        <div className="parchment-panel p-5 sm:p-7">
          {/* Title banner — maroon strip with wax seal */}
          <div className="flex items-stretch gap-0 mb-5">
            <div className="flex items-center pl-2 pr-3">
              <div className="w-10 h-10 rounded-full wax-seal flex items-center justify-center shrink-0 shadow-lg ring-2 ring-[#3a0808]">
                <Compass className="w-4 h-4 text-amber-50" strokeWidth={1.4} />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gradient-to-r from-[#5E1A1A] via-[#6d2020] to-[#5E1A1A] border-y-2 border-[#C5A059]/50 rounded-sm py-2 px-4" style={{ boxShadow: 'inset 0 0 12px rgba(0,0,0,0.3)' }}>
              <h1 className="font-heading font-700 text-lg sm:text-xl tracking-[0.18em] text-[#f0c66d]">
                COMMAND CENTER
              </h1>
            </div>
          </div>

          {/* Resume Last Campaign — dark inset hero card on parchment */}
          {lastCampaign ? (
            <button
              onClick={() => navigate(`/campaign/${lastCampaign.id}`)}
              className="w-full text-left mb-4 group"
            >
              <div className="rounded-lg overflow-hidden border border-[#C5A059]/30 bg-[#1E1A16]/85 flex flex-col sm:flex-row">
                {/* Left: campaign image + title */}
                <div className="flex-1 relative min-h-[90px]">
                  <img src={thumbFor(lastCampaign.game_system)} className="absolute inset-0 w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="relative p-3 flex flex-col justify-end h-full min-h-[90px]">
                    <p className="text-[8px] font-heading tracking-[0.2em] text-[#f0c66d]/70 uppercase mb-0.5">Resume Last Campaign</p>
                    <h2 className="font-heading font-700 text-base sm:text-lg text-white leading-tight truncate">{lastCampaign.name}</h2>
                    <div className="flex items-center gap-2 flex-wrap text-[9px] text-amber-100/70 font-body mt-0.5">
                      <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> Ch.{lastCampaign.current_chapter}</span>
                      <span className="flex items-center gap-0.5"><Users className="w-2.5 h-2.5" /> {lastCampaign.party_count} {lastCampaign.party_count === 1 ? 'hero' : 'heroes'}</span>
                      {lastCampaign.combat_active && <span className="flex items-center gap-0.5 text-red-400"><Skull className="w-2.5 h-2.5" /> Combat</span>}
                    </div>
                  </div>
                </div>
                {/* Right: Continue Journey button */}
                <div className="flex items-center justify-center gap-2 p-3 sm:p-4 sm:border-l border-[#C5A059]/20 bg-black/30 sm:bg-transparent">
                  <div className="flex flex-col items-center gap-1.5 group-hover:scale-105 transition-transform">
                    <div className="w-12 h-12 rounded-full gold-glow flex items-center justify-center">
                      <Play className="w-5 h-5 text-amber-50" strokeWidth={2} fill="currentColor" />
                    </div>
                    <span className="font-heading text-[9px] tracking-[0.12em] text-[#f0c66d]">CONTINUE JOURNEY</span>
                  </div>
                </div>
              </div>
            </button>
          ) : (
            <div className="mb-4 text-center py-6">
              <p className="font-tome italic text-sm text-[#5a3a1a]/70">No campaigns yet — your saga awaits below.</p>
            </div>
          )}

          {/* Action tiles — compact dark cards with gold trim */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {/* Join by Code */}
            <div className="rounded-lg border border-[#C5A059]/30 bg-[#1E1A16]/85 p-2.5 text-center">
              <KeyRound className="w-4 h-4 mx-auto mb-1 text-[#f0c66d]/70" strokeWidth={1.5} />
              <p className="text-[7px] sm:text-[8px] font-heading tracking-wider text-amber-100/60 mb-1.5">JOIN BY CODE</p>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
                placeholder="CODE"
                className="bg-black/40 font-heading tracking-wider uppercase text-center text-[10px] h-7 border-[#C5A059]/25 text-amber-50 placeholder:text-amber-100/30"
                maxLength={6}
              />
              <Button
                onClick={handleJoin}
                disabled={joining || !joinCode.trim()}
                className="w-full mt-1.5 h-7 text-[9px] bg-gradient-to-b from-[#c99a3f] to-[#8a5a1f] text-amber-50 hover:from-[#f0c66d] hover:to-[#c99a3f] border border-[#f0c66d]/30"
              >
                {joining ? <Loader2 className="w-3 h-3 animate-spin" /> : 'JOIN'}
              </Button>
            </div>
            {/* Create New Campaign */}
            <Link to="/games" className="rounded-lg border border-[#C5A059]/30 bg-[#1E1A16]/85 p-2.5 text-center flex flex-col items-center justify-center hover:border-[#f0c66d]/50 transition-all min-h-[88px]">
              <Plus className="w-4 h-4 mx-auto mb-1 text-[#f0c66d]/70" strokeWidth={1.5} />
              <p className="text-[7px] sm:text-[8px] font-heading tracking-wider text-amber-100/60 leading-tight">CREATE NEW<br />CAMPAIGN</p>
            </Link>
            {/* Browse Adventures */}
            <Link to="/modules" className="rounded-lg border border-[#C5A059]/30 bg-[#1E1A16]/85 p-2.5 text-center flex flex-col items-center justify-center hover:border-[#f0c66d]/50 transition-all min-h-[88px]">
              <Library className="w-4 h-4 mx-auto mb-1 text-[#f0c66d]/70" strokeWidth={1.5} />
              <p className="text-[7px] sm:text-[8px] font-heading tracking-wider text-amber-100/60 leading-tight">BROWSE<br />ADVENTURES</p>
            </Link>
          </div>

          {/* Your Chronicles — section divider on parchment */}
          <div className="flex items-center gap-3 mb-2">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#7a5526]/50" />
            <h3 className="font-heading text-[11px] tracking-[0.2em] text-[#5a3a1a]/70">YOUR CHRONICLES</h3>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#7a5526]/50" />
          </div>

          {/* Chronicles — dark inset container holding rows */}
          {campaigns.length === 0 ? (
            <p className="font-tome italic text-xs text-[#5a3a1a]/50 text-center py-4">No chronicles yet.</p>
          ) : (
            <div className="rounded-lg border border-[#C5A059]/25 bg-[#1E1A16]/85 overflow-hidden">
              {campaigns.map((c, idx) => {
                const sys = getGameSystem(c.game_system || 'add1e');
                return (
                  <Link
                    key={c.id}
                    to={`/campaign/${c.id}`}
                    className={`flex items-center gap-2.5 px-3 py-2.5 ${idx > 0 ? 'border-t border-[#C5A059]/15' : ''} hover:bg-[#2a221c] transition-colors group`}
                  >
                    <div className="w-8 h-8 rounded overflow-hidden shrink-0 border border-[#C5A059]/20 bg-black/40">
                      <img src={thumbFor(c.game_system)} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-600 text-sm text-white group-hover:text-[#f0c66d] transition-colors truncate">{c.name}</p>
                      <div className="flex items-center gap-1.5 text-[9px] text-amber-100/40 font-body">
                        <span className="truncate">{sys.short} · Ch.{c.current_chapter} · {c.party_count} {c.party_count === 1 ? 'hero' : 'heroes'}</span>
                      </div>
                    </div>
                    <span className={`text-[8px] font-heading tracking-wider whitespace-nowrap ${STATUS_STYLES[c.status] || STATUS_STYLES.setup}`}>
                      {(c.status || 'setup').toUpperCase()}
                    </span>
                    <span className="hidden sm:block text-[9px] text-amber-100/35 font-body whitespace-nowrap w-16 text-right">{moment(c.updated_date).format('MMM D')}</span>
                    <Settings className="w-3.5 h-3.5 text-amber-100/25 shrink-0" strokeWidth={1.5} />
                    {!c.is_owner && <Lock className="w-3.5 h-3.5 text-amber-100/25 shrink-0" strokeWidth={1.5} />}
                    <ChevronRight className="w-3.5 h-3.5 text-amber-100/30 shrink-0 group-hover:text-[#f0c66d] transition-colors" strokeWidth={1.5} />
                  </Link>
                );
              })}
            </div>
          )}

          {/* My Characters */}
          {characters.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-5 mb-2">
                <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#7a5526]/50" />
                <h3 className="font-heading text-[11px] tracking-[0.2em] text-[#5a3a1a]/70">MY CHARACTERS</h3>
                <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#7a5526]/50" />
              </div>
              <div className="rounded-lg border border-[#C5A059]/25 bg-[#1E1A16]/85 overflow-hidden">
                {characters.map((ch, idx) => {
                  const sys = getGameSystem(ch.game_system || 'add1e');
                  const dead = ch.status === 'dead';
                  return (
                    <Link
                      key={ch.id}
                      to={`/campaign/${ch.campaign_id}/character/${ch.id}`}
                      className={`flex items-center gap-2.5 px-3 py-2.5 ${idx > 0 ? 'border-t border-[#C5A059]/15' : ''} hover:bg-[#2a221c] transition-colors group ${dead ? 'opacity-50' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-black/40 border border-[#C5A059]/20 flex items-center justify-center shrink-0">
                        <ScrollText className="w-3.5 h-3.5 text-[#f0c66d]/50" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading font-600 text-sm text-white group-hover:text-[#f0c66d] transition-colors truncate">{ch.name}</p>
                        <p className="text-[9px] text-amber-100/40 font-body truncate">{ch.race} {ch.character_class} · Lvl {ch.level}</p>
                      </div>
                      {dead ? (
                        <span className="text-[8px] font-heading tracking-wider text-red-400">FALLEN</span>
                      ) : (
                        <span className="text-[8px] font-heading tracking-wider text-amber-100/40">{sys.short}</span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-amber-100/30 shrink-0 group-hover:text-[#f0c66d] transition-colors" strokeWidth={1.5} />
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Pending Invites */}
          {invites.length > 0 && (
            <>
              <div className="flex items-center gap-3 mt-5 mb-2">
                <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#7a5526]/50" />
                <h3 className="font-heading text-[11px] tracking-[0.2em] text-[#5a3a1a]/70">PENDING INVITES</h3>
                <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#7a5526]/50" />
              </div>
              <div className="rounded-lg border border-[#C5A059]/25 bg-[#1E1A16]/85 overflow-hidden">
                {invites.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/campaign/${c.id}/create-character`)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 ${idx > 0 ? 'border-t border-[#C5A059]/15' : ''} hover:bg-[#2a221c] transition-colors group text-left`}
                  >
                    <div className="w-8 h-8 rounded-full bg-black/40 border border-[#C5A059]/20 flex items-center justify-center shrink-0">
                      <KeyRound className="w-3.5 h-3.5 text-[#f0c66d]/50" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-heading font-600 text-sm text-white group-hover:text-[#f0c66d] transition-colors truncate">{c.name}</p>
                      <p className="text-[9px] text-amber-100/40 font-body truncate">{c.is_owner ? 'Awaiting your hero' : 'Join the party'}</p>
                    </div>
                    <span className="text-[10px] font-heading tracking-wide text-[#f0c66d]/60">JOIN</span>
                    <ChevronRight className="w-3.5 h-3.5 text-amber-100/30 shrink-0 group-hover:text-[#f0c66d] transition-colors" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* How It Works */}
          <div className="flex items-center gap-3 mt-5 mb-2">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#7a5526]/50" />
            <h3 className="font-heading text-[11px] tracking-[0.2em] text-[#5a3a1a]/70">HOW IT WORKS</h3>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#7a5526]/50" />
          </div>
          <div className="space-y-1">
            <StepRow icon={Compass} title="Pick a Realm" desc="Choose from AD&D, Star Frontiers, Gamma World, Boot Hill, and more." />
            <StepRow icon={Plus} title="Create or Join a Campaign" desc="Start fresh, import an ongoing game, or enter an invite code." />
            <StepRow icon={ScrollText} title="Roll a Character" desc="Generate stats by the system's rules, or import a sheet." />
            <StepRow icon={Swords} title="Declare Your Actions" desc="The AI GM narrates, enforces rules, tracks HP, XP, loot, and story." />
          </div>
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <Link to="/games"><Button variant="outline" size="sm" className="border-[#7a5526]/40 text-[#5a3a1a] hover:bg-[#7a5526]/10"><Plus className="w-3.5 h-3.5 mr-1" /> Choose a Realm</Button></Link>
            <Link to="/modules"><Button variant="ghost" size="sm" className="text-[#5a3a1a]/50 hover:text-[#5a3a1a]"><Library className="w-3.5 h-3.5 mr-1" /> Library</Button></Link>
            <Link to="/how-to-use"><Button variant="ghost" size="sm" className="text-[#5a3a1a]/50 hover:text-[#5a3a1a]"><BookOpen className="w-3.5 h-3.5 mr-1" /> How to Use</Button></Link>
          </div>
        </div>
      </div>
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
        <p className="font-heading font-600 text-sm text-[#2a170d]">{title}</p>
        <p className="text-[11px] text-[#5a3a1a]/60 font-body leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}