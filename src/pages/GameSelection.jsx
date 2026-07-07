import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScrollText, Rocket, ChevronRight, Library, Atom, Crosshair, Compass, Orbit, Sun, Briefcase, Landmark, Crown, Globe, Flame, Swords, Satellite, Ghost, Skull, Zap, KeyRound, Loader2 } from 'lucide-react';
import { GAME_SYSTEMS } from '@/lib/gameSystems';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ICONS = { scroll: ScrollText, rocket: Rocket, atom: Atom, crosshair: Crosshair, compass: Compass, orbit: Orbit, sun: Sun, briefcase: Briefcase, landmark: Landmark, crown: Crown, globe: Globe, flame: Flame, swords: Swords, satellite: Satellite, ghost: Ghost, skull: Skull, zap: Zap };

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full wax-seal mb-5 animate-flicker">
          <ScrollText className="w-7 h-7 text-primary-foreground" strokeWidth={1.2} />
        </div>
        <h1 className="font-heading font-700 text-3xl sm:text-5xl tracking-[0.08em] text-foreground mb-3">
          CHOOSE YOUR REALM
        </h1>
        <p className="font-tome text-base sm:text-lg text-muted-foreground italic max-w-xl mx-auto leading-relaxed">
          Many worlds await beyond the threshold. Select the game you wish to play,
          and an AI Game Master shall rise to guide your party through it.
        </p>
        <div className="divider-rune max-w-xs mx-auto mt-6">
          <span className="text-xs tracking-[0.3em]">✦</span>
        </div>
      </div>

      {/* Join by code */}
      <div className="max-w-md mx-auto mb-10">
        <div className="border border-border/50 rounded-lg p-4 bg-card/40 panel-glow">
          <div className="flex items-center gap-2 mb-2.5">
            <KeyRound className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <h2 className="font-heading text-xs tracking-[0.2em] text-foreground">JOIN BY CODE</h2>
          </div>
          <div className="flex gap-2">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
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

      {/* Game cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {GAME_SYSTEMS.map((game) => {
          const Icon = ICONS[game.icon] || ScrollText;
          return (
            <button
              key={game.id}
              onClick={() => navigate(`/game/${game.id}`)}
              className="group relative overflow-hidden rounded-xl border border-border/60 text-left h-[26rem] flex flex-col justify-end panel-glow hover:border-primary/50 transition-all"
            >
              <img
                src={game.cardImage}
                alt={game.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/20" />
              <div className="relative p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full wax-seal flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary-foreground" strokeWidth={1.4} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-heading tracking-[0.2em] text-primary/80 uppercase">{game.tagline}</p>
                    <h2 className="font-heading font-700 text-xl sm:text-2xl text-foreground tracking-wide">{game.name}</h2>
                  </div>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">
                  {game.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-heading tracking-[0.15em] text-primary group-hover:gap-2.5 transition-all">
                  {game.enterLabel} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Library link */}
      <div className="text-center mt-10">
        <Link
          to="/modules"
          className="inline-flex items-center gap-1.5 text-xs font-heading tracking-[0.15em] text-muted-foreground hover:text-primary transition-colors"
        >
          <Library className="w-3.5 h-3.5" /> Browse the Adventure Library
        </Link>
      </div>
    </div>
  );
}