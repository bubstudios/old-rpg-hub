import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Upload, Globe, Sparkles, Scale, Swords, Compass, Map, Drama, Rocket, Crosshair, Radar, Users } from 'lucide-react';
import { toast } from 'sonner';

const DND_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale },
  { id: 'combat_heavy', label: 'Combat-Heavy', icon: Swords },
  { id: 'dungeon_crawler', label: 'Dungeon Crawler', icon: Compass },
  { id: 'sandbox', label: 'Sandbox', icon: Map },
  { id: 'character_driven', label: 'Character-Driven', icon: Drama }
];

const SF_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Rocket },
  { id: 'combat_heavy', label: 'Combat-Heavy', icon: Crosshair },
  { id: 'dungeon_crawler', label: 'Derelict Delve', icon: Radar },
  { id: 'sandbox', label: 'Free Frontier', icon: Globe },
  { id: 'character_driven', label: 'Character-Driven', icon: Users }
];

export default function ImportCampaignForm({ gameSystem = 'add1e', onCreated, onCancel }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [mode, setMode] = useState('async');
  const [tone, setTone] = useState('balanced');
  const [settingNotes, setSettingNotes] = useState('');
  const [importing, setImporting] = useState(false);

  const isSF = gameSystem === 'starfrontiers';
  const tones = isSF ? SF_TONES : DND_TONES;

  async function handleImport() {
    if (!file || importing) return;
    setImporting(true);
    try {
      const upRes = await base44.integrations.Core.UploadFile({ file });
      const res = await base44.functions.invoke('campaignData', {
        op: 'importCampaign',
        file_url: upRes.file_url,
        game_system: gameSystem,
        name: name.trim(),
        mode,
        tone,
        setting_notes: settingNotes.trim()
      });
      toast.success('Campaign imported — the DM has taken the reins!');
      onCreated?.(res.data.campaign);
    } catch (e) {
      toast.error('Failed to import campaign: ' + (e.response?.data?.error || e.message));
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">CAMPAIGN DOCUMENT (PDF / TEXT)</label>
        <label className="flex items-center gap-2 px-3 py-3 rounded-lg border border-dashed border-border/60 bg-background/40 cursor-pointer hover:border-primary/40 transition-colors">
          <Upload className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.5} />
          <span className="text-xs font-body text-muted-foreground truncate">
            {file ? file.name : 'Upload your campaign log, session notes, or adventure document...'}
          </span>
          <input type="file" accept=".pdf,.txt,.doc,.docx,.md" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <p className="text-[10px] text-muted-foreground/60 font-body mt-1.5 leading-snug">
          The DM will read your campaign document in full, learn everything that has happened, and continue the story from where you left off.
        </p>
      </div>

      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">CAMPAIGN NAME (OPTIONAL)</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Leave blank to detect from the document"
          className="bg-background/60 font-body"
        />
      </div>

      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">PLAY MODE</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('async')}
            className={`flex-1 px-3 py-2 rounded text-xs font-heading tracking-wide border transition-colors ${mode === 'async' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            ASYNC
          </button>
          <button
            onClick={() => setMode('live')}
            className={`flex-1 px-3 py-2 rounded text-xs font-heading tracking-wide border transition-colors ${mode === 'live' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'}`}
          >
            LIVE
          </button>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-2">CAMPAIGN STYLE</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-left transition-all ${tone === t.id ? 'border-primary/60 bg-primary/10' : 'border-border/50 bg-card/30 hover:border-primary/30'}`}
            >
              <t.icon className={`w-3.5 h-3.5 shrink-0 ${tone === t.id ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={1.5} />
              <span className={`text-[11px] font-heading tracking-wide ${tone === t.id ? 'text-primary' : 'text-foreground'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">
          <Sparkles className="w-3 h-3" /> ADDITIONAL NOTES (OPTIONAL)
        </label>
        <textarea
          value={settingNotes}
          onChange={(e) => setSettingNotes(e.target.value)}
          placeholder="Anything else the DM should know — exactly where to pick up, tone shifts, house rules..."
          rows={3}
          className="w-full bg-background/60 border border-input rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={handleImport} disabled={importing || !file} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {importing ? <><Loader2 className="w-4 h-4 animate-spin" /> Studying campaign...</> : <><Upload className="w-4 h-4" /> Import &amp; Continue</>}
        </Button>
        <Button onClick={onCancel} variant="ghost" className="text-muted-foreground">Cancel</Button>
      </div>
      {importing && (
        <p className="text-[10px] text-muted-foreground/70 font-body italic leading-snug">
          The DM is reading your entire campaign history and preparing to take over. This can take 30-60 seconds for large documents.
        </p>
      )}
    </div>
  );
}