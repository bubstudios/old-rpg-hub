import { Outlet, Link, useLocation } from 'react-router-dom';
import { ScrollText, Home as HomeIcon, Library, Gauge } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { getGameSystem } from '@/lib/gameSystems';

export default function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const inCampaign = location.pathname.includes('/campaign/');
  const gameMatch = location.pathname.match(/^\/game\/([^/]+)/);
  const activeGameId = gameMatch ? gameMatch[1] : null;
  const activeGame = activeGameId ? getGameSystem(activeGameId) : null;

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="cathedral-bg" />
      <header className="sticky top-0 z-40 border-b border-[#d4af37]/20 bg-[#0d0a08]/90 backdrop-blur-sm candle-glow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded wax-seal flex items-center justify-center shrink-0">
              <ScrollText className="w-4 h-4 text-amber-50" strokeWidth={1.5} />
            </div>
            <div className="leading-none">
              <span className="font-heading font-700 text-sm sm:text-base tracking-[0.15em] text-[#d4af37]">
                OLD RPG HUB
              </span>
              <span className="hidden sm:block text-[10px] font-heading tracking-[0.2em] text-[#d4af37]/60 mt-0.5">
                {activeGame ? `${activeGame.short.toUpperCase()} · AI GAME MASTER` : location.pathname === '/games' ? 'CHOOSE YOUR REALM' : 'COMMAND CENTER'}
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-heading tracking-wider transition-colors ${
                location.pathname === '/' || location.pathname.startsWith('/game/') ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30' : 'text-[#e5d3b3]/50 hover:text-[#d4af37] hover:bg-[#d4af37]/5 border border-transparent'
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
              Dashboard
            </Link>
            <Link
              to="/modules"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-heading tracking-wider transition-colors ${
                location.pathname === '/modules' ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30' : 'text-[#e5d3b3]/50 hover:text-[#d4af37] hover:bg-[#d4af37]/5 border border-transparent'
              }`}
            >
              <Library className="w-3.5 h-3.5" strokeWidth={1.5} />
              Library
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin/usage"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-heading tracking-wider transition-colors ${
                  location.pathname === '/admin/usage' ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/30' : 'text-[#e5d3b3]/50 hover:text-[#d4af37] hover:bg-[#d4af37]/5 border border-transparent'
                }`}
              >
                <Gauge className="w-3.5 h-3.5" strokeWidth={1.5} />
                Usage
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <footer className="border-t border-[#d4af37]/15 py-3 px-6 text-center relative">
        <span className="text-[10px] font-heading tracking-[0.2em] text-[#d4af37]/30">
          ⚔ OLD RPG HUB · EST. IN DARKNESS ⚔
        </span>
      </footer>
    </div>
  );
}