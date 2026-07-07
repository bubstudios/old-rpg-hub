import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, BookOpen, Globe, Lock, Scroll, Rocket, Atom, Crosshair } from 'lucide-react';
import { toast } from 'sonner';

export default function ModuleUploadForm({ onUploaded, onCancel }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('shared');
  const [gameSystem, setGameSystem] = useState('add1e');
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file || uploading) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`That file is ${(file.size / 1024 / 1024).toFixed(1)} MB — the DM can't read documents larger than 10 MB. Compress the PDF, split it into parts, or save it as a .txt file and upload that instead.`);
      return;
    }
    setUploading(true);
    try {
      // 1. Upload the source file
      const upRes = await base44.integrations.Core.UploadFile({ file });
      const file_url = upRes.file_url;
      // 2. DM studies the document + creates the library record
      const res = await base44.functions.invoke('moduleLibrary', {
        op: 'upload',
        file_url,
        title: title.trim(),
        visibility,
        game_system: gameSystem
      });
      toast.success('Module studied and added to the library!');
      onUploaded?.(res.data.module);
    } catch (e) {
      const errMsg = e.response?.data?.error || e.response?.data?.message || e.message || 'Unknown error';
      toast.error('Failed to study module: ' + errMsg, { duration: 8000 });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">GAME SYSTEM</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGameSystem('add1e')}
            className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded text-[10px] font-heading tracking-wide border transition-colors ${gameSystem === 'add1e' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}
          >
            <Scroll className="w-3.5 h-3.5" /> AD&D 1E
          </button>
          <button
            onClick={() => setGameSystem('starfrontiers')}
            className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded text-[10px] font-heading tracking-wide border transition-colors ${gameSystem === 'starfrontiers' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}
          >
            <Rocket className="w-3.5 h-3.5" /> STAR FRONTIERS
          </button>
          <button
            onClick={() => setGameSystem('gammaworld')}
            className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded text-[10px] font-heading tracking-wide border transition-colors ${gameSystem === 'gammaworld' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}
          >
            <Atom className="w-3.5 h-3.5" /> GAMMA WORLD
          </button>
          <button
            onClick={() => setGameSystem('boothill')}
            className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded text-[10px] font-heading tracking-wide border transition-colors ${gameSystem === 'boothill' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}
          >
            <Crosshair className="w-3.5 h-3.5" /> BOOT HILL
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">MODULE FILE (PDF / TEXT)</label>
        <label className="flex items-center gap-2 px-3 py-3 rounded-lg border border-dashed border-border/60 bg-background/40 cursor-pointer hover:border-primary/40 transition-colors">
          <Upload className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <span className="text-xs font-body text-muted-foreground truncate">
            {file ? `${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB)` : 'Choose a file... (max 10 MB)'}
          </span>
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx,.md"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        <p className="text-[10px] text-muted-foreground/60 font-body mt-1.5 leading-snug">
          Text-based PDFs work best — the DM reads the actual text. Scanned or image-only PDFs often fail because the DM can't reliably read pictures of text. If yours won't process, copy the module content into a .txt file and upload that instead. Files must be under 10 MB.
        </p>
      </div>

      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">TITLE (OPTIONAL)</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Leave blank to auto-detect from the document"
          className="bg-background/60 font-body"
        />
      </div>

      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">SHARING</label>
        <div className="flex gap-2">
          <button
            onClick={() => setVisibility('shared')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-heading tracking-wide border transition-colors ${visibility === 'shared' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}
          >
            <Globe className="w-3.5 h-3.5" /> SHARED
          </button>
          <button
            onClick={() => setVisibility('private')}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-heading tracking-wide border transition-colors ${visibility === 'private' ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/40 text-muted-foreground hover:text-foreground'}`}
          >
            <Lock className="w-3.5 h-3.5" /> PRIVATE
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/60 font-body mt-1.5 leading-snug">
          Shared modules appear in every player's library. Private modules are yours alone.
        </p>
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={handleUpload} disabled={uploading || !file} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Studying module...</> : <><BookOpen className="w-4 h-4" /> Upload &amp; Study</>}
        </Button>
        <Button onClick={onCancel} variant="ghost" className="text-muted-foreground">Cancel</Button>
      </div>
      {uploading && (
        <p className="text-[10px] text-muted-foreground/70 font-body italic leading-snug">
          The DM is reading the module in full and preparing a reference brief. This can take up to 3 minutes for large documents — please be patient and don't close this window.
        </p>
      )}
    </div>
  );
}