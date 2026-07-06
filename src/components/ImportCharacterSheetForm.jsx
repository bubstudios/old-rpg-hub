import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function ImportCharacterSheetForm({ campaignId, onCreated, onCancel }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [importing, setImporting] = useState(false);

  async function handleImport() {
    if (!file || importing) return;
    setImporting(true);
    try {
      const upRes = await base44.integrations.Core.UploadFile({ file });
      const res = await base44.functions.invoke('campaignData', {
        op: 'importCharacterSheet',
        file_url: upRes.file_url,
        campaign_id: campaignId,
        name: name.trim()
      });
      toast.success(`${res.data.character.name} joins the party!`);
      onCreated?.(res.data.character);
    } catch (e) {
      toast.error('Failed to import character: ' + (e.response?.data?.error || e.message));
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">CHARACTER SHEET (PDF / IMAGE / TEXT)</label>
        <label className="flex items-center gap-2 px-3 py-3 rounded-lg border border-dashed border-border/60 bg-background/40 cursor-pointer hover:border-primary/40 transition-colors">
          <Upload className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <span className="text-xs font-body text-muted-foreground truncate">
            {file ? file.name : 'Upload your character sheet...'}
          </span>
          <input type="file" accept=".pdf,.txt,.doc,.docx,.md,.png,.jpg,.jpeg" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <p className="text-[10px] text-muted-foreground/60 font-body mt-1.5 leading-snug">
          The DM will read your sheet and extract your stats, equipment, and spells exactly as written. Your character is tied to your account, so the DM always knows who's who.
        </p>
      </div>

      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">CHARACTER NAME (OPTIONAL)</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Leave blank to detect from the sheet"
          className="bg-background/60 font-body"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={handleImport} disabled={importing || !file} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Reading sheet...</> : <><FileText className="w-4 h-4" /> Import Character</>}
        </Button>
        <Button onClick={onCancel} variant="ghost" className="text-muted-foreground">Cancel</Button>
      </div>
      {importing && (
        <p className="text-[10px] text-muted-foreground/70 font-body italic leading-snug">
          The DM is transcribing your character sheet. This can take 20-40 seconds.
        </p>
      )}
    </div>
  );
}