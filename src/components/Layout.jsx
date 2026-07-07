import { Outlet, Link, useLocation } from 'react-router-dom';
import { ScrollText, Home as HomeIcon, Library } from 'lucide-react';
import { getGameSystem } from '@/lib/gameSystems';

export default function Layout() {
  const location = useLocation();
  const inCampaign = location.pathname.includes('/campaign/');
  const gameMatch = location.pathname.match(/^\/game\/([^/]+)/);
  const activeGameId = gameMatch ? gameMatch[1] : null;
  const activeGame = activeGameId ? getGameSystem(activeGameId) : null;
  const campaignsPath = activeGameId ? `/game/${activeGameId}` : '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded wax-seal flex items-center justify-center shrink-0">
              <ScrollText className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div className="leading-none">
              <span className="font-heading font-700 text-sm sm:text-base tracking-[0.15em] text-foreground">
                OLD RPG HUB
              </span>
              <span className="hidden sm:block text-[10px] font-heading tracking-[0.2em] text-primary/70 mt-0.5">
                {activeGame ? `${activeGame.short.toUpperCase()} · AI GAME MASTER` : 'CHOOSE YOUR REALM'}
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to={campaignsPath}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-heading tracking-wider transition-colors ${
                location.pathname === '/' || location.pathname.startsWith('/game/') ? 'text-primary bg-secondary/60' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
              Campaigns
            </Link>
            <Link
              to="/modules"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-heading tracking-wider transition-colors ${
                location.pathname === '/modules' ? 'text-primary bg-secondary/60' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <Library className="w-3.5 h-3.5" strokeWidth={1.5} />
              Library
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/40 py-3 px-6 text-center">
        <span className="text-[10px] font-heading tracking-[0.2em] text-muted-foreground/60">
          ⚔ OLD RPG HUB · EST. IN DARKNESS ⚔
        </span>
      </footer>
    </div>
  );
}