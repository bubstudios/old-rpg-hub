import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Swords, Compass, Map, Drama, Scale, Globe, Sparkles, Library, Rocket, Crosshair, Radar, Users, Atom } from 'lucide-react';
import { toast } from 'sonner';

const DND_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of combat, exploration, and story' },
  { id: 'combat_heavy', label: 'Combat-Heavy', icon: Swords, desc: 'Frequent battles and tactical fights' },
  { id: 'dungeon_crawler', label: 'Dungeon Crawler', icon: Compass, desc: 'Trap-filled ruins and deep delves' },
  { id: 'sandbox', label: 'Sandbox', icon: Map, desc: 'Open world, go where you please' },
  { id: 'character_driven', label: 'Character-Driven', icon: Drama, desc: 'Story, roleplay, and personal arcs' }
];

const DND_WORLDS = [
  'Greyhawk',
  'Forgotten Realms',
  'Blackmoor',
  'Mystara',
  'Ravenloft',
  'The Iron Realm',
  'A custom world of my own'
];

const SF_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Rocket, desc: 'A mix of combat, exploration, and story' },
  { id: 'combat_heavy', label: 'Combat-Heavy', icon: Crosshair, desc: 'Frequent firefights and tactical skirmishes' },
  { id: 'dungeon_crawler', label: 'Derelict Delve', icon: Radar, desc: 'Abandoned stations, alien ruins, and hidden facilities' },
  { id: 'sandbox', label: 'Free Frontier', icon: Globe, desc: 'Open space, go where you please' },
  { id: 'character_driven', label: 'Character-Driven', icon: Users, desc: 'Story, roleplay, and personal arcs' }
];

const SF_WORLDS = [
  'Mars',
  'Aqualand',
  'Volturnus',
  'Gran Quivera',
  'Clarion',
  'Outer Reach',
  'A custom world of my own'
];

const DND_SETUP = {
  worldLabel: 'WORLD SETTING',
  worldPlaceholder: 'Name your realm (or pick a preset above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or any details you want the DM to weave in. e.g. 'A grim low-magic frontier town besieged by winter wolves, where the party are the only defenders.'",
  namePlaceholder: 'e.g. Shadows of Greyhawk',
  forgeLabel: 'Forge Campaign'
};

const SF_SETUP = {
  worldLabel: 'NAME YOUR WORLD',
  worldPlaceholder: 'Name a world (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the GM to weave in. e.g. 'A 95% waterworld of floating cities and deep-sea leviathans, where the party are salvage divers.'",
  namePlaceholder: 'e.g. Voyage to Volturnus',
  forgeLabel: 'Launch Campaign'
};

const GW_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Atom, desc: 'A mix of exploration, combat, survival, and discovery' },
  { id: 'combat_heavy', label: 'Combat-Heavy', icon: Swords, desc: 'Frequent mutant brawls and salvage firefights' },
  { id: 'dungeon_crawler', label: 'Ruin Crawler', icon: Compass, desc: 'Irradiated ruins, bunkers, and lost installations' },
  { id: 'sandbox', label: 'Blasted Wastes', icon: Map, desc: 'Open wasteland, roam where you dare' },
  { id: 'character_driven', label: 'Survivor Saga', icon: Users, desc: 'Faction politics, survival, and personal arcs' }
];

const GW_WORLDS = [
  'Gamma Terra',
  'The Bonelands',
  'The Glowing Sea',
  'Old Earth',
  'A custom wasteland of my own'
];

const GW_SETUP = {
  worldLabel: 'NAME YOUR WASTELAND',
  worldPlaceholder: 'Name the region or wasteland (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the GM to weave in. e.g. 'A sprawling dead arcology where rival mutant clans war over a functioning water purifier, and the party are scavengers who just found a map to the lower levels.'",
  namePlaceholder: 'e.g. Ashes of the Ancients',
  forgeLabel: 'Venture Forth'
};

const BH_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Crosshair, desc: 'A mix of gunfights, frontier drama, and exploration' },
  { id: 'combat_heavy', label: 'Gunfighter', icon: Swords, desc: 'Frequent shootouts and quick-draw showdowns' },
  { id: 'dungeon_crawler', label: 'Border Patrol', icon: Compass, desc: 'Riding the range, tracking outlaws, and holding the line' },
  { id: 'sandbox', label: 'Open Range', icon: Map, desc: 'A free-roaming territory, go where you please' },
  { id: 'character_driven', label: 'Frontier Saga', icon: Drama, desc: 'Saloon politics, feuds, and personal legends' }
];

const BH_WORLDS = [
  'Tombstone Territory',
  'Dodge City',
  'Abilene',
  'The Dakota Badlands',
  'Promise City',
  'A custom frontier of my own'
];

const BH_SETUP = {
  worldLabel: 'NAME YOUR TERRITORY',
  worldPlaceholder: 'Name the town or territory (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the GM to weave in. e.g. 'A dying silver-mining town where a cattle baron hires guns to run roughshod over the locals, and the party drift in looking for work — and trouble.'",
  namePlaceholder: 'e.g. High Noon at Promise City',
  forgeLabel: 'Saddle Up'
};

const IJ_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Compass, desc: 'A mix of action, exploration, puzzle-solving, and derring-do' },
  { id: 'combat_heavy', label: 'Two-Fisted', icon: Swords, desc: 'Frequent fistfights, shootouts, chases, and pulp peril' },
  { id: 'dungeon_crawler', label: 'Tomb Raider', icon: Map, desc: 'Lost temples, ancient ruins, trapped tombs, and artifacts' },
  { id: 'sandbox', label: 'Globe-Trotting', icon: Globe, desc: 'A 1930s world to roam at your own pace and direction' },
  { id: 'character_driven', label: 'Pulp Saga', icon: Drama, desc: 'Rivalry, romance, personal legends, and dashing arcs' }
];

const IJ_WORLDS = [
  'The Lost Temple of Ikammanen',
  'The Egyptian Desert',
  'The Amazon',
  'The Himalayas',
  'The Streets of Cairo',
  'A custom expedition of my own'
];

const IJ_SETUP = {
  worldLabel: 'NAME YOUR EXPEDITION',
  worldPlaceholder: 'Name the region, site, or expedition (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the GM to weave in. e.g. 'A 1936 race against Nazi archaeologists to reach a lost Sumerian ziggurat deep in the desert, where the party are a mismatched crew of scholars and hired guns.'",
  namePlaceholder: 'e.g. The Ikons of Ikammanen',
  forgeLabel: 'Begin the Expedition'
};

export default function CampaignSetupForm({ gameSystem = 'add1e', onCreated, onCancel }) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState('async');
  const [tone, setTone] = useState('balanced');
  const [worldSetting, setWorldSetting] = useState('');
  const [settingNotes, setSettingNotes] = useState('');
  const [creating, setCreating] = useState(false);
  const [modules, setModules] = useState([]);
  const [moduleId, setModuleId] = useState(null);
  const [loadingModules, setLoadingModules] = useState(false);

  const isSF = gameSystem === 'starfrontiers';
  const isGW = gameSystem === 'gammaworld';
  const isBH = gameSystem === 'boothill';
  const isIJ = gameSystem === 'indianajones';
  const tones = isIJ ? IJ_TONES : isBH ? BH_TONES : isGW ? GW_TONES : isSF ? SF_TONES : DND_TONES;
  const worlds = isIJ ? IJ_WORLDS : isBH ? BH_WORLDS : isGW ? GW_WORLDS : isSF ? SF_WORLDS : DND_WORLDS;
  const setup = isIJ ? IJ_SETUP : isBH ? BH_SETUP : isGW ? GW_SETUP : isSF ? SF_SETUP : DND_SETUP;

  useEffect(() => {
    (async () => {
      try {
        setLoadingModules(true);
        const res = await base44.functions.invoke('moduleLibrary', { op: 'list', game_system: gameSystem });
        setModules(res.data.modules || []);
      } catch (e) { /* modules optional */ } finally {
        setLoadingModules(false);
      }
    })();
  }, []);

  async function handleCreate(overrideName) {
    const world = worldSetting.trim();
    const fallbackName = world ? (isIJ ? `Expedition to ${world}` : isBH ? `Legends of ${world}` : isGW ? `Wastes of ${world}` : isSF ? `Voyage to ${world}` : `Tales of ${world}`) : '';
    const finalName = (overrideName || name.trim() || fallbackName).trim();
    if (!finalName || creating) return;
    setCreating(true);
    try {
      const res = await base44.functions.invoke('campaignData', {
        op: 'createCampaign',
        name: finalName,
        mode,
        tone,
        world_setting: worldSetting.trim(),
        setting_notes: settingNotes.trim(),
        module_id: moduleId,
        game_system: gameSystem
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
          placeholder={setup.namePlaceholder}
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
          {tones.map((t) => (
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
          <Globe className="w-3 h-3" /> {setup.worldLabel}
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {worlds.map((w) => (
            <button
              key={w}
              onClick={() => setWorldSetting(w.startsWith('A custom') ? '' : w)}
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
          placeholder={setup.worldPlaceholder}
          className="bg-background/60 font-body"
        />
      </div>

      {/* Adventure module */}
      <div>
        <label className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-2">
          <Library className="w-3 h-3" /> ADVENTURE MODULE (OPTIONAL)
        </label>
        <p className="text-[10px] text-muted-foreground/70 font-body mb-2 leading-snug">
          Pick a module from the Library and the DM will study it to run the adventure faithfully. Upload new modules from the Library page.
        </p>
        {loadingModules ? (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" /> Loading library...
          </div>
        ) : modules.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/60 font-body italic">
            No {isIJ ? 'Indiana Jones' : isBH ? 'Boot Hill' : isGW ? 'Gamma World' : isSF ? 'Star Frontiers' : 'AD&D'} modules in the library yet. Visit the Library to add one.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-44 overflow-y-auto scrollbar-thin pr-1">
            <button
              onClick={() => setModuleId(null)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-body transition-colors ${
                !moduleId ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              None — an original adventure
            </button>
            {modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setModuleId(m.id)}
                className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                  moduleId === m.id ? 'border-primary/60 bg-primary/10' : 'border-border/50 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-heading tracking-wide ${moduleId === m.id ? 'text-primary' : 'text-foreground'}`}>
                    {m.title}
                  </span>
                  {m.recommended_levels && (
                    <span className="text-[9px] text-muted-foreground/60 font-heading shrink-0">{m.recommended_levels}</span>
                  )}
                </div>
                {m.description && (
                  <p className="text-[10px] text-muted-foreground/70 font-body mt-0.5 line-clamp-2">{m.description}</p>
                )}
              </button>
            ))}
          </div>
        )}
        {moduleId && (() => {
          const mod = modules.find(m => m.id === moduleId);
          if (!mod) return null;
          return (
            <Button
              onClick={() => handleCreate(mod.title)}
              disabled={creating}
              className="w-full mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Compass className="w-4 h-4" /> Begin This Adventure</>}
            </Button>
          );
        })()}
      </div>

      {/* Setting notes / vision */}
      <div>
        <label className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">
          <Sparkles className="w-3 h-3" /> YOUR VISION (OPTIONAL)
        </label>
        <textarea
          value={settingNotes}
          onChange={(e) => setSettingNotes(e.target.value)}
          placeholder={setup.visionPlaceholder}
          rows={3}
          className="w-full bg-background/60 border border-input rounded-lg px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button onClick={handleCreate} disabled={creating || (!name.trim() && !worldSetting.trim())} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : setup.forgeLabel}
        </Button>
        <Button onClick={onCancel} variant="ghost" className="text-muted-foreground">Cancel</Button>
      </div>
    </div>
  );
}