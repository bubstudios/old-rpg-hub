import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Library, Plus, Upload, Loader2, Globe, Lock, Trash2, BookOpen, X } from 'lucide-react';
import ModuleUploadForm from '@/components/ModuleUploadForm';
import { toast } from 'sonner';

export default function ModuleLibrary() {
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full wax-seal mb-4 animate-flicker">
          <Library className="w-6 h-6 text-primary-foreground" strokeWidth={1.2} />
        </div>
        <h1 className="font-heading font-900 text-2xl sm:text-4xl tracking-[0.08em] text-foreground mb-2">
          THE MODULE LIBRARY
        </h1>
        <p className="font-tome text-sm sm:text-base text-muted-foreground italic max-w-xl mx-auto leading-relaxed">
          A shared vault of adventure modules. Upload a tome and the DM will study it —
          then any adventurer may brave it, with or without its original uploader.
        </p>
        <div className="divider-rune max-w-xs mx-auto mt-5">
          <span className="text-xs tracking-[0.3em]">📖</span>
        </div>
      </div>

      <div className="mb-8 border border-border/50 rounded-lg p-5 bg-card/40 panel-glow">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" strokeWidth={1.5} />
            <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">CONTRIBUTE A MODULE</h2>
          </div>
          <Button onClick={() => setShowUpload(!showUpload)} variant="ghost" size="sm" className="text-muted-foreground">
            {showUpload ? <X className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
          </Button>
        </div>
        {showUpload ? (
          <ModuleUploadForm onUploaded={() => { setShowUpload(false); loadModules(); }} onCancel={() => setShowUpload(false)} />
        ) : (
          <p className="text-xs text-muted-foreground font-body leading-relaxed">
            Upload a published module (PDF or text) — Tomb of Horrors, Keep on the Borderlands, or your own homebrew.
            The DM reads it in full and learns to run it faithfully. Shared modules appear for every player.
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-primary" strokeWidth={1.5} />
          <h2 className="font-heading text-sm tracking-[0.15em] text-foreground">AVAILABLE MODULES</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/50 rounded-lg">
            <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" strokeWidth={1} />
            <p className="font-tome italic text-muted-foreground text-sm">
              The library shelves are empty. Be the first to contribute a tome...
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {modules.map((m) => (
              <div key={m.id} className="group p-4 rounded-lg border border-border/50 bg-card/40 hover:border-primary/40 transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-heading font-600 text-base text-foreground">{m.title}</h3>
                  {m.visibility === 'shared' ? (
                    <Globe className="w-3.5 h-3.5 text-primary/60 shrink-0" strokeWidth={1.5} />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" strokeWidth={1.5} />
                  )}
                </div>
                {m.description && (
                  <p className="text-xs text-muted-foreground font-body leading-snug mb-2 line-clamp-3">{m.description}</p>
                )}
                <div className="flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground font-heading tracking-wide">
                  {m.author && <span className="text-muted-foreground/70">{m.author}</span>}
                  {m.recommended_levels && <span className="text-primary/60">{m.recommended_levels}</span>}
                  {m.is_mine && <span className="text-amber-400/80">YOUR UPLOAD</span>}
                </div>
                {m.is_mine && (
                  <button onClick={() => handleDelete(m.id)} className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-destructive transition-colors">
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-xs font-heading tracking-wider text-primary/70 hover:text-primary transition-colors">
          ← Back to Campaigns
        </Link>
      </div>
    </div>
  );
}