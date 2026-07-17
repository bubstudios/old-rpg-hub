import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Library, Plus, Upload, Loader2, Globe, Lock, Trash2, BookOpen, X } from 'lucide-react';
import ModuleUploadForm from '@/components/ModuleUploadForm';
import { getGameSystem } from '@/lib/gameSystems';
import { toast } from 'sonner';
import { useAuth } from '@/lib/AuthContext';

export default function ModuleLibrary() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => { loadModules(); }, []);

  async function loadModules() {
    try {
      setLoading(true);
      const res = await base44.functions.invoke('moduleLibrary', { op: 'list' });
      setModules(res.data.modules || []);
    } catch (e) {
      toast.error('Failed to load library');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this module from the library?')) return;
    try {
      await base44.functions.invoke('moduleLibrary', { op: 'delete', module_id: id });
      setModules(modules.filter(m => m.id !== id));
      toast.success('Module removed');
    } catch (e) {
      toast.error('Could not remove module');
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full wax-seal mb-4 animate-flicker ring-2 ring-[#3a0808] candle-glow">
          <Library className="w-6 h-6 text-amber-50" strokeWidth={1.2} />
        </div>
        <h1 className="font-heading font-900 text-2xl sm:text-4xl tracking-[0.08em] text-[#d4af37] mb-2">
          THE MODULE LIBRARY
        </h1>
        <p className="font-tome text-sm sm:text-base text-[#e5d3b3]/50 italic max-w-xl mx-auto leading-relaxed">
          A shared vault of adventure modules. Upload a tome and the DM will study it —
          then any adventurer may brave it, with or without its original uploader.
        </p>
        <div className="flex items-center gap-3 max-w-xs mx-auto mt-5">
          <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#d4af37]/30" />
          <span className="text-[#d4af37]/50 text-xs">📖</span>
          <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#d4af37]/30" />
        </div>
      </div>

      <div className="mb-8 cathedral-panel p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#d4af37]" strokeWidth={1.5} />
            <h2 className="font-heading text-sm tracking-[0.15em] text-[#e5d3b3]">CONTRIBUTE A MODULE</h2>
          </div>
          <Button onClick={() => setShowUpload(!showUpload)} variant="ghost" size="sm" className="text-[#e5d3b3]/50 hover:text-[#d4af37]">
            {showUpload ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
          </Button>
        </div>
        {showUpload ? (
          <ModuleUploadForm onUploaded={() => { setShowUpload(false); loadModules(); }} onCancel={() => setShowUpload(false)} />
        ) : (
          <p className="text-xs text-[#e5d3b3]/40 font-body leading-relaxed">
            Upload a published module (PDF or text) — Tomb of Horrors, Keep on the Borderlands, or your own homebrew.
            The DM reads it in full and learns to run it faithfully. Shared modules appear for every player.
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-[#d4af37]" strokeWidth={1.5} />
          <h2 className="font-heading text-sm tracking-[0.15em] text-[#e5d3b3]">AVAILABLE MODULES</h2>
          <span className="flex-1 h-px bg-gradient-to-r from-[#d4af37]/20 to-transparent" />
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-[#d4af37]/50 animate-spin" />
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-12 gothic-inset rounded-lg">
            <BookOpen className="w-8 h-8 text-[#d4af37]/20 mx-auto mb-3" strokeWidth={1} />
            <p className="font-tome italic text-[#e5d3b3]/30 text-sm">
              The library shelves are empty. Be the first to contribute a tome...
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {modules.map((m) => (
              <div
                key={m.id}
                onClick={() => navigate(`/game/${m.game_system || 'add1e'}?module=${m.id}`)}
                className="group p-4 rounded-lg gothic-inset hover:border-[#d4af37]/40 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-heading font-600 text-base text-[#e5d3b3] group-hover:text-[#d4af37] transition-colors">{m.title}</h3>
                  {m.visibility === 'shared' ? (
                    <Globe className="w-3.5 h-3.5 text-[#d4af37]/60 shrink-0" strokeWidth={1.5} />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#e5d3b3]/40 shrink-0" strokeWidth={1.5} />
                  )}
                </div>
                {m.description && (
                  <p className="text-xs text-[#e5d3b3]/40 font-body leading-snug mb-2 line-clamp-3">{m.description}</p>
                )}
                <div className="flex items-center gap-3 flex-wrap text-[10px] text-[#e5d3b3]/40 font-heading tracking-wide">
                  {m.author && <span className="text-[#e5d3b3]/50">{m.author}</span>}
                  {m.recommended_levels && <span className="text-[#d4af37]/60">{m.recommended_levels}</span>}
                  {m.is_mine && <span className="text-amber-400/80">YOUR UPLOAD</span>}
                </div>
                <div className="mt-1.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-heading tracking-wide border border-[#d4af37]/20 text-[#e5d3b3]/50">
                    {getGameSystem(m.game_system || 'add1e').short}
                  </span>
                </div>
                {(m.is_mine || isAdmin) && (
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="mt-2 flex items-center gap-1 text-[10px] text-[#e5d3b3]/30 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-xs font-heading tracking-wider text-[#d4af37]/60 hover:text-[#d4af37] transition-colors">
          ← Back to Campaigns
        </Link>
      </div>
    </div>
  );
}