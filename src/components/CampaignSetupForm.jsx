import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Swords, Compass, Map, Drama, Scale, Globe, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of combat, exploration, and story' },
  { id: 'combat_heavy', label: 'Combat-Heavy', icon: Swords, desc: 'Frequent battles and tactical fights' },
  { id: 'dungeon_crawler', label: 'Dungeon Crawler', icon: Compass, desc: 'Trap-filled ruins and deep delves' },
  { id: 'sandbox', label: 'Sandbox', icon: Map, desc: 'Open world, go where you please' },
  { id: 'character_driven', label: 'Character-Driven', icon: Drama, desc: 'Story, roleplay, and personal arcs' }
];

const WORLD_PRESETS = [
  'Greyhawk',
  'Forgotten Realms',
  'Blackmoor',
  'Mystara',
  'Ravenloft',
  'The Iron Realm',
  'A custom world of my own'
];

export default function CampaignSetupForm({ onCreated, onCancel }) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState('async');
  const [tone, setTone] = useState('balanced');
  const [worldSetting, setWorldSetting] = useState('');
  const [settingNotes, setSettingNotes] = useState('');
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    if (!name.trim() || creating) return;
    setCreating(true);
    try {
      const res = await base44.functions.invoke('campaignData', {
        op: 'createCampaign',
        name: name.trim(),
        mode,
        tone,
        world_setting: worldSetting.trim(),
        setting_notes: settingNotes.trim()
      });
      toast.success('Campaign forged!');
      onCreated(res.data.campaign);
    } catch (e) {
      toast.error('Failed to create campaign');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">CAMPAIGN NAME</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Shadows of Greyhawk"
          className="bg-background/60 font-body"
        />
      </div>

      {/* Play mode */}
      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">PLAY MODE</label>
        <div className="flex gap-2">
          <button
            onClick={() => setMode('async')}
            className={`flex-1 px-3 py-2 rounded text-xs font-heading tracking-wide border transition-colors ${
              mode === 'async' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            ASYNC (Play-by-post)
          </button>
          <button
            onClick={() => setMode('live')}
            className={`flex-1 px-3 py-2 rounded text-xs font-heading tracking-wide border transition-colors ${
              mode === 'live' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            LIVE SESSION
          </button>
        </div>
      </div>

      {/* Tone */}
      <div>
        <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-2">CAMPAIGN STYLE</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-left transition-all ${
                tone === t.id ? 'border-primary/60 bg-primary/10' : 'border-border/50 bg-card/30 hover:border-primary/30'
              }`}
            >
              <t.icon className={`w-4 h-4 shrink-0 mt-0.5 ${tone === t.id ? 'text-primary' : 'text-muted-foreground'}`} strokeWidth={1.5} />
              <div className="min-w-0">
                <p className={`text-xs font-heading tracking-wide ${tone === t.id ? 'text-primary' : 'text-foreground'}`}>{t.label}</p>
                <p className="text-[10px] text-muted-foreground font-body leading-snug mt-0.5">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* World setting */}
      <div>
        <label className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-2">
          <Globe className="w-3 h-3" /> WORLD SETTING
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {WORLD_PRESETS.map((w) => (
            <button
              key={w}
              onClick={() => setWorldSetting(w === 'A custom world of my own' ? '' : w)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-body border transition-colors ${
                worldSetting === w ? 'border-primary/50 text-primary bg-primary/10' : 'border-border/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
        <Input
          value={worldSetting}
          onChange={(e) => setWorldSetting(e.target.value)}
          placeholder="Name your realm (or pick a preset above)"
          className="bg-background/60 font-body"
        />
      </div>

      {/* Setting notes / vision */}
      <div>
        <label className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">
          <Sparkles className="w-3 h-3" /> YOUR VISION (OPTIONAL)
        </label>
        <textarea
          value={settingNotes}
          onChange={(e) => setSettingNotes(e.target.value)}
          placeholder="Describe the tone, themes, starting situation, or any details you want the DM to weave in. e.g. 'A grim low-magic frontier town besieged by winter wolves, where the party are the only defenders.'"
          rows={3}
          className="w-full bg-background/60 border border-input rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={handleCreate} disabled={creating || !name.trim()} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Forge Campaign'}
        </Button>
        <Button onClick={onCancel} variant="ghost" className="text-muted-foreground">Cancel</Button>
      </div>
    </div>
  );
}