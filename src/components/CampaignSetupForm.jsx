import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Swords, Compass, Map, Drama, Scale, Globe, Sparkles, Library, Rocket, Crosshair, Radar, Users, Atom, BookOpen, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const DND_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of combat, exploration, and story' },
  { id: 'combat_heavy', label: 'Combat-Heavy', icon: Swords, desc: 'Frequent battles and tactical fights' },
  { id: 'dungeon_crawler', label: 'Dungeon Crawler', icon: Compass, desc: 'Trap-filled ruins and deep delves' },
  { id: 'sandbox', label: 'Sandbox', icon: Map, desc: 'Open world, go where you please' },
  { id: 'character_driven', label: 'Character-Driven', icon: Drama, desc: 'Story, roleplay, and personal arcs' }
];

const DND_WORLDS = [
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

const SJ_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of ship combat, exploration, and swashbuckling' },
  { id: 'combat_heavy', label: 'Void Battles', icon: Swords, desc: 'Frequent skirmishes and boarding actions' },
  { id: 'dungeon_crawler', label: 'Salvager', icon: Compass, desc: 'Derelict hulks, lost colonies, and ancient wrecks' },
  { id: 'sandbox', label: 'Open Spheres', icon: Globe, desc: 'The crystal spheres and the Flow, go where you please' },
  { id: 'character_driven', label: 'Crew Saga', icon: Drama, desc: 'Faction politics, crew bonds, and personal legends' }
];

const SJ_WORLDS = [
  'Krynnspace',
  'Realmspace',
  'Greyspace',
  'The Rock of Bral',
  'The Tears of Selûne',
  'A custom sphere of my own'
];

const SJ_SETUP = {
  worldLabel: 'CRYSTAL SPHERE / SETTING',
  worldPlaceholder: 'Name the sphere, rock, or region (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the DM to weave in. e.g. 'A crew of free traders on a battered Squid Ship, fleeing a neogi slave fleet through the Flow toward the Rock of Bral, carrying a stolen helm the Arcane want back.'",
  namePlaceholder: 'e.g. Voyage Beyond the Crystal Sphere',
  forgeLabel: 'Set Sail'
};

const DS_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of brutal combat, desert survival, and story' },
  { id: 'combat_heavy', label: 'Arena Blood', icon: Swords, desc: 'Frequent arena fights, raids, and lethal clashes' },
  { id: 'dungeon_crawler', label: 'Ruin Delver', icon: Compass, desc: 'Shattered Green-Age ruins and buried complexes' },
  { id: 'sandbox', label: 'Tablelands', icon: Map, desc: 'The wastes and city-states, roam at your peril' },
  { id: 'character_driven', label: 'Slave Revolt', icon: Drama, desc: 'Merchant-house politics, revolts, and legends' }
];

const DS_WORLDS = [
  'Tyr (the free city)',
  'Urik',
  'Balic',
  'Gulg',
  'Nibenay',
  'The Tablelands',
  'The Sea of Silt',
  'A custom Athasian city-state of my own'
];

const DS_SETUP = {
  worldLabel: 'CITY-STATE / REGION',
  worldPlaceholder: 'Name the city-state or region (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the DM to weave in. e.g. 'Newly freed slaves escaped from the Tyr arena, fleeing across the Tablelands with a stolen defiler scroll the templars will kill to recover, racing the sun toward the Forest Ridge.'",
  namePlaceholder: 'e.g. Blood Beneath the Crimson Sun',
  forgeLabel: 'Brave the Wastes'
};

const TS_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of tradecraft, action, and intrigue' },
  { id: 'combat_heavy', label: 'Firefights', icon: Crosshair, desc: 'Frequent shootouts, raids, and lethal clashes' },
  { id: 'dungeon_crawler', label: 'Deep Cover', icon: Compass, desc: 'Infiltration, facilities, and hidden bases' },
  { id: 'sandbox', label: 'Globe-Trotting', icon: Globe, desc: 'Open Cold War world, go where the mission leads' },
  { id: 'character_driven', label: 'Spycraft', icon: Drama, desc: 'Betrayal, moles, and personal arcs' }
];

const TS_WORLDS = [
  'Cold War Europe',
  'The Caribbean',
  'Southeast Asia',
  'The Middle East',
  'North America',
  'A custom theatre of my own'
];

const TS_SETUP = {
  worldLabel: 'THEATRE / SETTING',
  worldPlaceholder: 'Name the city, country, or theatre (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, agency, mission, or details you want the Administrator to weave in. e.g. 'Cold War Berlin, 1965. A CIA station chief hands your team a defector's file and a photograph of a Soviet mole inside Western intelligence. Find the mole before he vanishes — or before your own side burns you.'",
  namePlaceholder: 'e.g. Operation Ghost Protocol',
  forgeLabel: 'Accept the Mission'
};

const GH_WORLDS = [
  'The Free City of Greyhawk',
  'The Flanaess',
  'The Wild Coast',
  'Furyondy',
  'The Bandit Kingdoms',
  'The Domain of Greyhawk',
  'A custom region of Oerth'
];

const GH_SETUP = {
  worldLabel: 'REGION OF OERIK',
  worldPlaceholder: 'Name the city, region, or domain (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the DM to weave in. e.g. 'A band of adventurers gathered in the Free City of Greyhawk, hired by a mysterious patron to delve the ruins beneath Castle Greyhawk — where the Archmage's dungeons grow more deadly with every level descended.'",
  namePlaceholder: 'e.g. Shadows of the Flanaess',
  forgeLabel: 'Enter the Flanaess'
};

const FR_WORLDS = [
  'Waterdeep',
  'The Dalelands',
  'The Sword Coast',
  'Cormyr',
  "Baldur's Gate",
  'The North',
  'A custom region of Faerûn'
];

const FR_SETUP = {
  worldLabel: 'REGION OF FAERÛN',
  worldPlaceholder: 'Name the city, region, or realm (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the DM to weave in. e.g. 'A party of adventurers arrives in Waterdeep the City of Splendors, drawn by a Harper's plea to investigate a Zhentarim plot threatening the Lords' Alliance — a conspiracy reaching into the highest towers of the city.'",
  namePlaceholder: 'e.g. Shadows over Waterdeep',
  forgeLabel: 'Enter the Realms'
};

const HW_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of exploration, survival, and ancient cultures' },
  { id: 'combat_heavy', label: 'Beast Hunter', icon: Swords, desc: 'Frequent clashes with beasts, raiders, and preserved perils' },
  { id: 'dungeon_crawler', label: 'Ruins of the Ancients', icon: Compass, desc: 'Lost cities, buried complexes, and Immortal secrets' },
  { id: 'sandbox', label: 'The Inner World', icon: Map, desc: 'A vast curved world, free to explore' },
  { id: 'character_driven', label: 'Cultural Saga', icon: Drama, desc: 'Faction politics, ancient lineages, and personal arcs' }
];

const HW_WORLDS = [
  'The Milenian Empire',
  'The Traldar Kingdoms',
  'Azcanta',
  'The Oltec Lands',
  'Nithia',
  'The Polar Opening',
  'A custom region of the Hollow World'
];

const HW_SETUP = {
  worldLabel: 'REGION OF THE HOLLOW WORLD',
  worldPlaceholder: 'Name the culture, region, or land (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the DM to weave in. e.g. 'A party of surface-world explorers plunges through the polar opening into the Hollow World, finding themselves among the marble colonnades of the Milenian Empire — a civilization preserved by the Immortals, unaware that the surface world moved on millennia ago.'",
  namePlaceholder: 'e.g. Descent into the Hollow World',
  forgeLabel: 'Descend Within'
};

const HY_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of combat, exploration, sorcery, and survival' },
  { id: 'combat_heavy', label: 'Sword & Steel', icon: Swords, desc: 'Frequent melees, raids, and lethal clashes' },
  { id: 'dungeon_crawler', label: 'Ruins & Tombs', icon: Compass, desc: 'Lost cities, ancient ruins, and forgotten temples' },
  { id: 'sandbox', label: 'Wanderer', icon: Map, desc: 'The Hyborian kingdoms, roam where you will' },
  { id: 'character_driven', label: 'Legend', icon: Drama, desc: 'Kingdoms, thrones, sorcery, and personal arcs' }
];

const HY_WORLDS = [
  'Cimmeria',
  'Aquilonia',
  'Nemedia',
  'The Vilayet Sea',
  'Turan',
  'Stygia',
  'Hyrkania',
  'Zamora',
  'A custom Hyborian kingdom'
];

const HY_SETUP = {
  worldLabel: 'HYBORIAN KINGDOM / REGION',
  worldPlaceholder: 'Name the kingdom, region, or city (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the DM to weave in. e.g. 'A band of mercenaries hired by a Nemedian lord to recover a stolen relic from a Stygian tomb, hunted across the borderlands by the sorcerer-priests of Set who want it back.'",
  namePlaceholder: 'e.g. Blood of the Hyborian Age',
  forgeLabel: 'Stride Forth'
};

const BR_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of space combat, intrigue, and exploration' },
  { id: 'combat_heavy', label: 'Dogfights', icon: Swords, desc: 'Frequent ship battles, raids, and blaster fights' },
  { id: 'dungeon_crawler', label: 'Station Delve', icon: Compass, desc: 'Derelict stations, asteroid bases, and hidden labs' },
  { id: 'sandbox', label: 'Open System', icon: Globe, desc: 'The solar system, go where your rocket takes you' },
  { id: 'character_driven', label: 'Rebellion', icon: Drama, desc: 'RAM vs the Belt, freedom, and personal arcs' }
];

const BR_WORLDS = [
  'Earth (Neworg)',
  'Mars (RAM capital)',
  'The Asteroid Belt',
  'Venus',
  'Luna',
  'A custom station or world'
];

const BR_SETUP = {
  worldLabel: 'LOCATION / THEATRE',
  worldPlaceholder: 'Name the planet, station, or region (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the DM to weave in. e.g. 'A crew of Belters running a smuggling ship between the asteroids, hired to extract a RAM defector carrying genetic secrets the geniocracy will kill to suppress.'",
  namePlaceholder: 'e.g. Rebels of the Belt',
  forgeLabel: 'Blast Off'
};

const GB_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of investigation, ghost-wrangling, and comedy' },
  { id: 'combat_heavy', label: 'Slime Time', icon: Swords, desc: 'Frequent ghost-trapping, proton-blasting, and chaos' },
  { id: 'dungeon_crawler', label: 'Haunted Sites', icon: Compass, desc: 'Spook-infested buildings, sewers, and subways' },
  { id: 'sandbox', label: 'City Patrol', icon: Map, desc: 'The haunted city, respond to calls as they come' },
  { id: 'character_driven', label: 'Franchise Drama', icon: Drama, desc: 'Bills, rivals, Walter Peck, and personal arcs' }
];

const GB_WORLDS = [
  'New York City',
  'The Firehouse (Hook & Ladder 8)',
  'A haunted hotel',
  'The NYC Public Library',
  'Dana Barrett\u2019s apartment',
  'A custom haunted city'
];

const GB_SETUP = {
  worldLabel: 'BASE OF OPERATIONS',
  worldPlaceholder: 'Name the city, franchise, or site (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the GM to weave in. e.g. 'A brand-new Ghostbusters franchise in a city where the supernatural is suddenly everywhere. The team just got a call about a Class 5 full-torso repeater haunting an old hotel — and the EPA is sniffing around too.'",
  namePlaceholder: 'e.g. Ghostbusters: City of Phantoms',
  forgeLabel: 'Suit Up'
};

const GANG_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of crime, investigation, and gunfights' },
  { id: 'combat_heavy', label: 'Gunfights', icon: Crosshair, desc: 'Frequent shootouts, raids, and Tommy gun mayhem' },
  { id: 'dungeon_crawler', label: 'Heist', icon: Compass, desc: 'Safecracking, second-story jobs, and smuggling runs' },
  { id: 'sandbox', label: 'Open City', icon: Globe, desc: 'The Prohibition city, go where the money leads' },
  { id: 'character_driven', label: 'Syndicate', icon: Drama, desc: 'Mob politics, turf wars, and personal legends' }
];

const GANG_WORLDS = [
  'Chicago',
  'New York City',
  'Atlantic City',
  'Detroit',
  'New Orleans',
  'A custom Prohibition city'
];

const GANG_SETUP = {
  worldLabel: 'CITY / TERRITORY',
  worldPlaceholder: 'Name the city or territory (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the GM to weave in. e.g. 'Prohibition Chicago, 1929. The party are a crew of bootleggers and muscle working for a rising outfit, smuggling Canadian whisky across the lake — but the feds are closing in and a rival syndicate wants their territory.'",
  namePlaceholder: 'e.g. The Chicago Outfit',
  forgeLabel: 'Hit the Streets'
};

const LOD_TONES = [
  { id: 'balanced', label: 'Balanced', icon: Scale, desc: 'A mix of heists, combat, scheming, and villainy' },
  { id: 'combat_heavy', label: 'Hero Brawls', icon: Swords, desc: 'Frequent super-powered clashes with heroes' },
  { id: 'dungeon_crawler', label: 'Caper', icon: Compass, desc: 'Heists, infiltrations, and daring raids' },
  { id: 'sandbox', label: 'Open City', icon: Globe, desc: 'A world to scheme across, go where you please' },
  { id: 'character_driven', label: 'Villain Saga', icon: Drama, desc: 'Rivalries, ego, arcs, and villain bonds' }
];

const LOD_WORLDS = [
  'Metropolis',
  'Gotham City',
  'The Hall of Doom',
  'A custom hero city of my own'
];

const LOD_SETUP = {
  worldLabel: 'CITY / BASE OF OPERATIONS',
  worldPlaceholder: 'Name the city or lair (or pick one above)',
  visionPlaceholder: "Describe the tone, themes, starting situation, or details you want the GM to weave in. e.g. 'The Legion of Doom has just formed — a cabal of supervillains united to pull off the heist of the century: stealing the power core from the heroes headquarters. Rivalries simmer, heroes patrol, and the world doesn't yet know their names.'",
  namePlaceholder: 'e.g. The Doom Heist',
  forgeLabel: 'Enter the Hall of Doom'
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
  const isSJ = gameSystem === 'spelljammer';
  const isDS = gameSystem === 'darksun';
  const isTS = gameSystem === 'topsecret';
  const isGH = gameSystem === 'greyhawk';
  const isFR = gameSystem === 'forgottenrealms';
  const isHW = gameSystem === 'hollowworld';
  const isHY = gameSystem === 'conan' || gameSystem === 'redsonja';
  const isBR = gameSystem === 'buckrogers';
  const isGB = gameSystem === 'ghostbusters';
  const isGang = gameSystem === 'gangbusters';
  const isLOD = gameSystem === 'legionofdoom';
  const isPJ = gameSystem === 'pathfinder';
  const [playMode, setPlayMode] = useState('original');
  const showFullSetup = !isPJ || playMode === 'original';
  const tones = isTS ? TS_TONES : isDS ? DS_TONES : isSJ ? SJ_TONES : isIJ ? IJ_TONES : isBH ? BH_TONES : isGW ? GW_TONES : isSF ? SF_TONES : isHW ? HW_TONES : isGang ? GANG_TONES : isGB ? GB_TONES : isBR ? BR_TONES : isHY ? HY_TONES : isLOD ? LOD_TONES : DND_TONES;
  const worlds = isTS ? TS_WORLDS : isDS ? DS_WORLDS : isSJ ? SJ_WORLDS : isIJ ? IJ_WORLDS : isBH ? BH_WORLDS : isGW ? GW_WORLDS : isSF ? SF_WORLDS : isHW ? HW_WORLDS : isGang ? GANG_WORLDS : isGB ? GB_WORLDS : isBR ? BR_WORLDS : isHY ? HY_WORLDS : isLOD ? LOD_WORLDS : isFR ? FR_WORLDS : isGH ? GH_WORLDS : DND_WORLDS;
  const setup = isTS ? TS_SETUP : isDS ? DS_SETUP : isSJ ? SJ_SETUP : isIJ ? IJ_SETUP : isBH ? BH_SETUP : isGW ? GW_SETUP : isSF ? SF_SETUP : isHW ? HW_SETUP : isGang ? GANG_SETUP : isGB ? GB_SETUP : isBR ? BR_SETUP : isHY ? HY_SETUP : isLOD ? LOD_SETUP : isFR ? FR_SETUP : isGH ? GH_SETUP : DND_SETUP;

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
    const fallbackName = world ? (isTS ? `Operation ${world}` : isDS ? `Blood Beneath ${world}` : isSJ ? `Voyage to ${world}` : isIJ ? `Expedition to ${world}` : isBH ? `Legends of ${world}` : isGW ? `Wastes of ${world}` : isSF ? `Voyage to ${world}` : isHW ? `Descent into ${world}` : isBR ? `Run to ${world}` : isGB ? `Ghosts of ${world}` : isGang ? `The ${world} Outfit` : isLOD ? `The ${world} Legion` : `Tales of ${world}`) : '';
    const canonName = isPJ && playMode === 'canon' ? 'The Pathfinder Journeys' : '';
    const finalName = (overrideName || name.trim() || fallbackName || canonName || 'New Campaign').trim();
    if (creating) return;
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
        game_system: gameSystem,
        play_mode: isPJ ? playMode : undefined
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
      {/* Story Mode (Pathfinder only) */}
      {isPJ && (
        <div>
          <label className="block text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-2">STORY MODE</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button onClick={() => setPlayMode('canon')} className={`text-left p-3 rounded-lg border transition-all ${playMode === 'canon' ? 'border-primary bg-primary/10' : 'border-border/50 bg-card/30 hover:border-primary/30'}`}>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-primary" strokeWidth={1.5} />
                <p className={`text-xs font-heading tracking-wide ${playMode === 'canon' ? 'text-primary' : 'text-foreground'}`}>Canon Mode</p>
              </div>
              <p className="text-[10px] text-muted-foreground font-body leading-snug">Play as Captain Bub Stellar after Arc 1. The crew, the future memories, and the galaxy are yours.</p>
            </button>
            <button onClick={() => setPlayMode('original')} className={`text-left p-3 rounded-lg border transition-all ${playMode === 'original' ? 'border-primary bg-primary/10' : 'border-border/50 bg-card/30 hover:border-primary/30'}`}>
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="w-4 h-4 text-primary" strokeWidth={1.5} />
                <p className={`text-xs font-heading tracking-wide ${playMode === 'original' ? 'text-primary' : 'text-foreground'}`}>Original Mode</p>
              </div>
              <p className="text-[10px] text-muted-foreground font-body leading-snug">Create your own officer aboard the Pathfinder.</p>
            </button>
          </div>
        </div>
      )}

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
            No {isTS ? 'Top Secret' : isDS ? 'Dark Sun' : isSJ ? 'Spelljammer' : isIJ ? 'Indiana Jones' : isBH ? 'Boot Hill' : isGW ? 'Gamma World' : isSF ? 'Star Frontiers' : isHW ? 'Hollow World' : isGang ? 'Gangbusters' : isGB ? 'Ghostbusters' : isBR ? 'Buck Rogers' : isHY ? (gameSystem === 'redsonja' ? 'Red Sonja' : 'Conan') : isLOD ? 'Legion of Doom' : isFR ? 'Forgotten Realms' : isGH ? 'Greyhawk' : 'AD&D'} modules in the library yet. Visit the Library to add one.
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
        <Button onClick={() => handleCreate()} disabled={creating} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : setup.forgeLabel}
        </Button>
        <Button onClick={onCancel} variant="ghost" className="text-muted-foreground">Cancel</Button>
      </div>
    </div>
  );
}