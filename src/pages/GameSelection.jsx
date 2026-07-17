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
      <div className="library-bg" />

      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Parchment panel */}
        <div className="parchment-ornate rounded-xl p-5 sm:p-7">
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full wax-seal mb-3 animate-flicker">
              <ScrollText className="w-5 h-5 text-primary-foreground" strokeWidth={1.4} />
            </div>
            <h1 className="font-heading font-700 text-xl sm:text-2xl tracking-[0.18em] text-amber-950">
              CHOOSE YOUR REALM
            </h1>
            <div className="flex items-center gap-3 mt-2.5">
              <span className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-700/40" />
              <span className="text-amber-700/50 text-xs">◆</span>
              <span className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-700/40" />
            </div>
            <p className="font-tome italic text-xs text-amber-900/50 mt-2 max-w-md mx-auto leading-relaxed">
              Old RPG Hub supports over 20 classic tabletop RPG systems. Each one has its own rules,
              character creation flow, and Game Master personality. Pick the world you want to play in.
            </p>
          </div>

          {/* Join by code */}
          <div className="max-w-sm mx-auto mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-3.5 h-3.5 text-amber-800/60" strokeWidth={1.5} />
              <h3 className="font-heading text-[10px] tracking-[0.2em] text-amber-900/70">JOIN GAME BY CODE</h3>
            </div>
            <div className="flex gap-2">
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
                placeholder="Enter Realm Code..."
                className="bg-amber-50/50 border-amber-700/30 text-amber-900 placeholder:text-amber-700/30 font-heading tracking-wider uppercase"
                maxLength={6}
              />
              <Button
                onClick={handleJoin}
                disabled={joining || !joinCode.trim()}
                className="bg-amber-800/80 text-amber-50 hover:bg-amber-800 shrink-0"
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
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-700/30" />
                    <h3 className="font-heading text-[10px] tracking-[0.2em] text-amber-800/60">{cat.toUpperCase()}</h3>
                    <span className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-700/30" />
                  </div>
                  {/* Cards grid */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {games.map((game) => {
                      const Icon = ICONS[game.icon] || ScrollText;
                      return (
                        <button
                          key={game.id}
                          onClick={() => navigate(`/game/${game.id}`)}
                          className="group relative overflow-hidden rounded-lg border-2 border-amber-800/40 text-left h-52 flex flex-col justify-end hover:border-amber-600/60 transition-all"
                        >
                          {game.cardImage ? (
                            <img
                              src={game.cardImage}
                              alt={game.name}
                              className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-950/50 via-amber-900/30 to-stone-900/50" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-transparent" />
                          <div className="relative p-3.5 mt-auto">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <div className="w-8 h-8 rounded-full wax-seal flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={1.4} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[8px] font-heading tracking-[0.15em] text-amber-300/70 uppercase truncate">{game.tagline}</p>
                                <h4 className="font-heading font-700 text-sm text-amber-50 truncate">{game.name}</h4>
                              </div>
                            </div>
                            <p className="text-[10px] text-amber-100/50 font-body line-clamp-2 leading-relaxed mb-1.5">{game.description}</p>
                            <span className="inline-flex items-center gap-1 text-[9px] font-heading tracking-[0.15em] text-amber-300/80 group-hover:text-amber-200 group-hover:gap-2 transition-all">
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
            <div className="flex items-center gap-3 mb-3">
              <span className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-700/30" />
              <h3 className="font-heading text-[10px] tracking-[0.15em] text-amber-800/60">AVAILABLE GAME SYSTEMS INCLUDE:</h3>
              <span className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-700/30" />
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {GAME_SYSTEMS.map((g) => (
                <Link
                  key={g.id}
                  to={`/game/${g.id}`}
                  className="px-2.5 py-1 rounded-full bg-amber-900/12 border border-amber-700/20 text-[10px] font-heading tracking-wider text-amber-900/55 hover:bg-amber-800/20 hover:text-amber-900/80 hover:border-amber-600/35 transition-all"
                >
                  {g.short}
                </Link>
              ))}
            </div>
          </div>

          {/* Not sure which to pick? */}
          <div className="text-center mt-6 pt-4 border-t border-amber-700/20">
            <div className="flex items-center justify-center gap-1.5 mb-1.5">
              <Star className="w-3.5 h-3.5 text-amber-600/70" strokeWidth={1.5} fill="currentColor" />
              <p className="font-heading text-[10px] tracking-[0.2em] text-amber-800/60">NOT SURE WHICH TO PICK?</p>
            </div>
            <p className="font-tome italic text-[11px] text-amber-900/40 max-w-sm mx-auto leading-relaxed mb-2.5">
              Start with AD&D 1st Edition — the classic that started it all. Or browse the Adventure Library for ready-to-play modules.
            </p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Link to="/game/add1e">
                <Button size="sm" className="bg-amber-800/80 text-amber-50 hover:bg-amber-800 h-8 text-[11px]">
                  Start with AD&D
                </Button>
              </Link>
              <Link to="/modules">
                <Button variant="outline" size="sm" className="border-amber-700/30 text-amber-800 hover:bg-amber-700/10 h-8 text-[11px]">
                  <Library className="w-3.5 h-3.5 mr-1" /> Browse Library
                </Button>
              </Link>
              <Link to="/how-to-use">
                <Button variant="ghost" size="sm" className="text-amber-800/50 hover:text-amber-800 h-8 text-[11px]">
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