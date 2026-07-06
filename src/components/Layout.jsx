import { Outlet, Link, useLocation } from 'react-router-dom';
import { ScrollText, Home as HomeIcon } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const inCampaign = location.pathname.includes('/campaign/');

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
                THE IRON REALM
              </span>
              <span className="hidden sm:block text-[10px] font-heading tracking-[0.2em] text-primary/70 mt-0.5">
                AD&amp;D 1ST EDITION · AI DUNGEON MASTER
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-heading tracking-wider transition-colors ${
                location.pathname === '/' ? 'text-primary bg-secondary/60' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <HomeIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
              Campaigns
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-border/40 py-3 px-6 text-center">
        <span className="text-[10px] font-heading tracking-[0.2em] text-muted-foreground/60">
          ⚔ THE IRON REALM · EST. IN DARKNESS ⚔
        </span>
      </footer>
    </div>
  );
}