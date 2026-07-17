import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ScrollText, Rocket, ChevronRight, Library, Atom, Crosshair, Compass, Orbit,
  Sun, Briefcase, Landmark, Crown, Globe, Flame, Swords, Satellite, Ghost,
  Skull, Zap, KeyRound, Loader2, Star, Shield, Cpu, Moon, BookOpen, Search
} from 'lucide-react';
import { GAME_SYSTEMS, CATEGORIES, CATEGORY_MAP } from '@/lib/gameSystems';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ICONS = {
  scroll: ScrollText, rocket: Rocket, atom: Atom, crosshair: Crosshair,
  compass: Compass, orbit: Orbit, sun: Sun, briefcase: Briefcase,
  landmark: Landmark, crown: Crown, globe: Globe, flame: Flame,
  swords: Swords, satellite: Satellite, ghost: Ghost, skull: Skull,
  zap: Zap, star: Star, shield: Shield, cpu: Cpu, moon: Moon, bookopen: BookOpen,
};

function GoldDivider({ title }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]/25" />
      {title && <h3 className="font-heading text-[10px] tracking-[0.2em] text-[#d4af37]/50">{title}</h3>}
      <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#d4af37]/25" />
    </div>
  );
}

export default function GameSelection() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

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
    <div className="min-h-screen relative">
      <div className="cathedral-bg" />

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10 relative">
        <div className="cathedral-panel p-5 sm:p-7">
          {/* Header */}
          <div className="flex items-stretch gap-0 mb-5">
            <div className="flex items-center pl-1 pr-3">
              <div className="w-11 h-11 rounded-full wax-seal flex items-center justify-center shrink-0 ring-2 ring-[#3a0808] candle-glow animate-flicker">
                <ScrollText className="w-5 h-5 text-amber-50" strokeWidth={1.4} />
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center crimson-arch py-2.5 px-4">
              <h1 className="font-heading font-700 text-lg sm:text-xl tracking-[0.18em] text-[#d4af37]">
                CHOOSE YOUR REALM
              </h1>
            </div>
          </div>
          <p className="font-tome italic text-xs text-[#e5d3b3]/40 text-center -mt-3 mb-5 max-w-md mx-auto leading-relaxed">
            Old RPG Hub supports over 20 classic tabletop RPG systems. Each one has its own rules,
            character creation flow, and Game Master personality. Pick the world you want to play in.
          </p>

          {/* Join by code */}
          <div className="max-w-sm mx-auto mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-3.5 h-3.5 text-[#d4af37]/60" strokeWidth={1.5} />
              <h3 className="font-heading text-[10px] tracking-[0.2em] text-[#e5d3b3]/50">JOIN GAME BY CODE</h3>
            </div>
            <div className="flex gap-2">
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
                placeholder="Enter Realm Code..."
                className="bg-[#0d0a08] border-[#d4af37]/25 text-[#e5d3b3] placeholder:text-[#e5d3b3]/25 font-heading tracking-wider uppercase"
                maxLength={6}
              />
              <Button
                onClick={handleJoin}
                disabled={joining || !joinCode.trim()}
                className="bg-gradient-to-b from-[#d4af37] to-[#8a6a1f] text-[#0d0a08] hover:from-[#f0c66d] hover:to-[#d4af37] border border-[#d4af37]/30 shrink-0"
              >
                {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Game cards by category */}
          <div className="space-y-5">
            {CATEGORIES.map((cat) => {
              const games = GAME_SYSTEMS.filter((g) => CATEGORY_MAP[g.id] === cat);
              if (!games.length) return null;
              return (
                <div key={cat}>
                  <GoldDivider title={cat.toUpperCase()} />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {games.map((game) => {
                      const Icon = ICONS[game.icon] || ScrollText;
                      return (
                        <button
                          key={game.id}
                          onClick={() => navigate(`/game/${game.id}`)}
                          className="group relative overflow-hidden rounded-lg border border-[#d4af37]/30 text-left h-52 flex flex-col justify-end hover:border-[#d4af37]/60 transition-all"
                        >
                          {game.cardImage ? (
                            <img
                              src={game.cardImage}
                              alt={game.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1612] via-[#12100d] to-[#0d0a08]" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a08] via-[#0d0a08]/60 to-transparent" />
                          <div className="relative p-3.5 mt-auto">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <div className="w-8 h-8 rounded-full wax-seal flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5 text-amber-50" strokeWidth={1.4} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[8px] font-heading tracking-[0.15em] text-[#d4af37]/60 uppercase truncate">{game.tagline}</p>
                                <h4 className="font-heading font-700 text-sm text-[#e5d3b3] truncate">{game.name}</h4>
                              </div>
                            </div>
                            <p className="text-[10px] text-[#e5d3b3]/40 font-body line-clamp-2 leading-relaxed mb-1.5">{game.description}</p>
                            <span className="inline-flex items-center gap-1 text-[9px] font-heading tracking-[0.15em] text-[#d4af37]/70 group-hover:text-[#d4af37] group-hover:gap-2 transition-all">
                              {game.enterLabel} <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Available game systems pills */}
          <div className="mt-6">
            <GoldDivider title="AVAILABLE GAME SYSTEMS INCLUDE:" />
            <div className="flex flex-wrap gap-1.5 justify-center">
              {GAME_SYSTEMS.map((g) => (
                <Link
                  key={g.id}
                  to={`/game/${g.id}`}
                  className="px-2.5 py-1 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/20 text-[10px] font-heading tracking-wider text-[#e5d3b3]/50 hover:bg-[#d4af37]/10 hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-all"
                >
                  {g.short}
                </Link>
              ))}
            </div>
          </div>

          {/* Not sure which to pick? */}
          <div className="text-center mt-6 pt-4 border-t border-[#d4af37]/15">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Star className="w-3.5 h-3.5 text-[#d4af37]/70" strokeWidth={1.5} fill="currentColor" />
              <p className="font-heading text-[10px] tracking-[0.2em] text-[#e5d3b3]/50">NOT SURE WHICH TO PICK?</p>
            </div>
            <p className="font-tome italic text-[11px] text-[#e5d3b3]/30 max-w-sm mx-auto leading-relaxed mb-2.5">
              Start with AD&D 1st Edition — the classic that started it all. Or browse the Adventure Library for ready-to-play modules.
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Link to="/game/add1e">
                <Button size="sm" className="bg-gradient-to-b from-[#d4af37] to-[#8a6a1f] text-[#0d0a08] hover:from-[#f0c66d] hover:to-[#d4af37] h-8 text-[11px]">
                  Start with AD&D
                </Button>
              </Link>
              <Link to="/modules">
                <Button variant="outline" size="sm" className="border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 h-8 text-[11px]">
                  <Library className="w-3.5 h-3.5 mr-1" /> Browse Library
                </Button>
              </Link>
              <Link to="/how-to-use">
                <Button variant="ghost" size="sm" className="text-[#e5d3b3]/40 hover:text-[#d4af37] h-8 text-[11px]">
                  <BookOpen className="w-3.5 h-3.5 mr-1" /> How to Use
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}