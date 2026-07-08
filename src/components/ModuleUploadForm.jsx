import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, BookOpen, Globe, Lock, Scale, Check, AlertTriangle } from 'lucide-react';
import { GAME_SYSTEMS, CATEGORIES, CATEGORY_MAP } from '@/lib/gameSystems';
import { toast } from 'sonner';

export default function ModuleUploadForm({ onUploaded, onCancel }) {
  const [legalAccepted, setLegalAccepted] = useState(false);
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
      const upRes = await base44.integrations.Core.UploadFile({ file });
      const file_url = upRes.file_url;
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

  // Legal notice — shown before the upload form
  if (!legalAccepted) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border/40">
          <div className="w-9 h-9 rounded-full wax-seal flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-heading font-700 text-base text-foreground tracking-wide">OWNERSHIP &amp; LEGALITY</h2>
            <p className="text-[10px] font-heading tracking-[0.15em] text-primary/60 uppercase">Please read before uploading</p>
          </div>
        </div>

        <div className="space-y-3 text-sm font-body text-foreground/80 leading-relaxed">
          <p>By uploading a module to the library, you confirm that:</p>
          <ul className="space-y-2 pl-1">
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" strokeWidth={2} />
              <span>You <strong>own</strong> the material or have <strong>permission</strong> from the rights holder to use and share it.</span>
            </li>
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" strokeWidth={2} />
              <span>The content is your <strong>original work</strong>, in the <strong>public domain</strong>, or used under <strong>fair use</strong> or an appropriate license.</span>
            </li>
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" strokeWidth={2} />
              <span>You understand that <strong>copyrighted material</strong> you do not own may be <strong>removed</strong> at the rights holder's request.</span>
            </li>
            <li className="flex gap-2">
              <Check className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" strokeWidth={2} />
              <span><strong>Shared</strong> modules are visible to all players — only share content you have the right to distribute.</span>
            </li>
          </ul>
          <div className="flex items-start gap-2 p-3 rounded-md bg-accent/10 border border-accent/20">
            <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-xs text-foreground/70 leading-relaxed">
              Old RPG Hub is not responsible for the content users upload. Users are solely liable for any material they add to the library.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button onClick={() => setLegalAccepted(true)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
            <Check className="w-4 h-4" /> I Understand &amp; Agree
          </Button>
          <Button onClick={onCancel} variant="ghost" className="text-muted-foreground">Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">GAME SYSTEM</label>
        <select
          value={gameSystem}
          onChange={(e) => setGameSystem(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-border/60 bg-background/60 text-sm font-body text-foreground focus:outline-none focus:border-primary/40"
        >
          {CATEGORIES.map(cat => (
            <optgroup key={cat} label={cat}>
              {GAME_SYSTEMS.filter(g => CATEGORY_MAP[g.id] === cat).map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
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