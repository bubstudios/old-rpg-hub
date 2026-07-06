import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, BookOpen, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function ModuleUploadForm({ onUploaded, onCancel }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('shared');
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file || uploading) return;
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
        visibility
      });
      toast.success('Module studied and added to the library!');
      onUploaded?.(res.data.module);
    } catch (e) {
      toast.error('Failed to study module: ' + (e.response?.data?.error || e.message));
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">MODULE FILE (PDF / TEXT)</label>
        <label className="flex items-center gap-2 px-3 py-3 rounded-lg border border-dashed border-border/60 bg-background/40 cursor-pointer hover:border-primary/40 transition-colors">
          <Upload className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <span className="text-xs font-body text-muted-foreground truncate">
            {file ? file.name : 'Choose a file...'}
          </span>
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx,.md"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
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
          The DM is reading the module in full and preparing a detailed reference brief. This can take 20-40 seconds for large documents.
        </p>
      )}
    </div>
  );
}