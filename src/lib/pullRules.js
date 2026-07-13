// THE PULL — Game Rules & Data
// A solo dark fantasy survival mystery RPG where the player controls Bullet,
// an amnesiac scarred wanderer pulled through nightmare Provinces toward Province 1.

// ─── Pull Intensity Scale ───
export const PULL_SCALE = [
  { level: 0, label: 'Quiet', desc: 'The Pull is silent. Following its direction keeps it at rest.' },
  { level: 1, label: 'Tug', desc: 'A gentle direction forward. Follow it and the Pull stays quiet.' },
  { level: 2, label: 'Ache', desc: 'The scar throbs. Lingering or resisting causes discomfort — move forward to ease it.' },
  { level: 3, label: 'Burn', desc: 'The scar burns. The longer Bullet resists, the harder it pushes.' },
  { level: 4, label: 'Commanding', desc: 'Pain and visions. Bullet may stumble forward against his will.' },
  { level: 5, label: 'Blackout Risk', desc: 'Forced movement. Memory surge possible.' },
  { level: 6, label: 'Override', desc: 'Bullet moves regardless of will.' }
];

export function getPullLevel(value) {
  const v = Math.max(0, Math.min(6, Math.round(value || 0)));
  return PULL_SCALE[v] || PULL_SCALE[0];
}

// ─── Scar States ───
export const SCAR_STATES = {
  quiet: { label: 'Quiet', desc: 'The scar is still.', color: 'text-muted-foreground' },
  pulse: { label: 'Pulsing', desc: 'The scar pulses faintly.', color: 'text-sky-400' },
  burn: { label: 'Burning', desc: 'The scar burns with heat.', color: 'text-amber-400' },
  flare: { label: 'Flaring', desc: 'The scar flares with light.', color: 'text-orange-400' },
  blackout: { label: 'Blackout', desc: 'The scar triggers a memory surge.', color: 'text-red-400' }
};

// ─── Conditions ───
export const CONDITIONS = [
  { key: 'dehydration', label: 'Dehydration', category: 'physical' },
  { key: 'hunger', label: 'Hunger', category: 'physical' },
  { key: 'fatigue', label: 'Fatigue', category: 'physical' },
  { key: 'blood_loss', label: 'Blood Loss', category: 'injury' },
  { key: 'broken_ribs', label: 'Broken Ribs', category: 'injury' },
  { key: 'shoulder_wound', label: 'Shoulder Wound', category: 'injury' },
  { key: 'leg_wound', label: 'Leg Wound', category: 'injury' },
  { key: 'frostbite', label: 'Frostbite', category: 'injury' },
  { key: 'burns', label: 'Burns', category: 'injury' },
  { key: 'rust_venom', label: 'Rust Venom', category: 'poison' },
  { key: 'shard_dust_venom', label: 'Shard-Dust Venom', category: 'poison' },
  { key: 'smoke_inhalation', label: 'Smoke Inhalation', category: 'physical' },
  { key: 'toxic_exposure', label: 'Toxic Exposure', category: 'poison' },
  { key: 'despair_pressure', label: 'Despair Pressure', category: 'mental' },
  { key: 'soul_fracture', label: 'Soul Fracture', category: 'mental' },
  { key: 'guilt_burden', label: 'Guilt Burden', category: 'mental' },
  { key: 'fear_of_self', label: 'Fear of Self', category: 'mental' }
];

export const CONDITION_CATEGORIES = {
  physical: { label: 'Physical', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/40' },
  injury: { label: 'Injury', color: 'text-red-400', bg: 'bg-red-950/40 border-red-800/40' },
  poison: { label: 'Poison', color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-800/40' },
  mental: { label: 'Mental', color: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-800/40' }
};

// ─── Hidden Clocks (tracked secretly by the GM) ───
export const HIDDEN_CLOCKS = [
  { key: 'province_1_alert', label: 'Province 1 Alert', desc: 'How much the central realm notices Bullet.', highIsBad: true, visible: false },
  { key: 'hunter_proximity', label: 'Hunter Proximity', desc: 'How close the Seeker and Dreadwraith are.', highIsBad: true, visible: false },
  { key: 'seeker_frustration', label: 'Seeker Frustration', desc: 'The Seeker\'s growing frustration.', highIsBad: true, visible: false },
  { key: 'dreadwraith_adaptation', label: 'Dreadwraith Adaptation', desc: 'The Dreadwraith\'s adaptive evolution.', highIsBad: true, visible: false },
  { key: 'shard_resonance_trail', label: 'Shard Resonance Trail', desc: 'The trail Bullet leaves through shard use.', highIsBad: true, visible: false },
  { key: 'bond_threat', label: 'Bond Threat', desc: 'Province 1 noticing that connection stabilizes Bullet.', highIsBad: true, visible: false },
  { key: 'mechanical_bird_surveillance', label: 'Mechanical Bird Surveillance', desc: 'The mechanical bird has scanned Bullet and reported to Province 1.', highIsBad: true, visible: false },
  { key: 'camp_raider_pressure', label: 'Camp Raider Pressure', desc: 'Hidden pressure building toward a raider attack on the camp.', highIsBad: true, visible: false },
  { key: 'camp_task_danger', label: 'Camp Task Danger', desc: 'Danger level of Shard\'s assigned task.', highIsBad: true, visible: false },
  { key: 'fear_of_self', label: 'Fear of Self', desc: 'Bullet\'s fear of what the Pull makes him do.', highIsBad: true, visible: true },
  { key: 'soul_fracture', label: 'Soul Fracture', desc: 'Damage to Bullet\'s soul.', highIsBad: true, visible: true },
  { key: 'guilt_burden', label: 'Guilt Burden', desc: 'The accumulated weight of guilt.', highIsBad: true, visible: true },
  { key: 'bullet_humanity', label: 'Bullet Humanity', desc: 'Bullet\'s remaining humanity.', highIsBad: false, visible: true }
];

// ─── Province Sequence (canon route) ───
export const PROVINCE_SEQUENCE = [
  { chapter: 1, province: 618, name: 'Red Sand Camp', phase: 'Lost Survivor' },
  { chapter: 2, province: 472, name: 'Liquid Block / Dome', phase: 'Lost Survivor' },
  { chapter: 3, province: 837, name: 'Digger/Borer Tunnels', phase: 'Lost Survivor' },
  { chapter: 4, province: 269, name: 'Dream Jungle', phase: 'Lost Survivor' },
  { chapter: 6, province: 391, name: 'Mirrorheart Plain', phase: 'Hunted Anomaly' },
  { chapter: 8, province: 512, name: 'Sky-Mist Ascents', phase: 'Hunted Anomaly' },
  { chapter: 9, province: 713, name: 'Frozen Tundra', phase: 'Hunted Anomaly' },
  { chapter: 10, province: 927, name: 'Obsidian City', phase: 'System Breaker' },
  { chapter: 12, province: 108, name: 'Rust Swamp', phase: 'System Breaker' },
  { chapter: 13, province: 429, name: 'Scorched Plain', phase: 'System Breaker' },
  { chapter: 14, province: 998, name: 'Prism Expanse', phase: 'System Breaker' },
  { chapter: 15, province: 0, name: 'The Gate / Way-Station', phase: 'System Breaker' },
  { chapter: 16, province: 14, name: 'The Park / Amphitheater', phase: 'System Breaker' },
  { chapter: 17, province: 140, name: 'The Meadow / Guilt Vision', phase: 'System Breaker' },
  { chapter: 18, province: 5121, name: 'Despair Peaks', phase: 'System Breaker' },
  { chapter: 19, province: 3911, name: 'Loop Room', phase: 'System Breaker' },
  { chapter: 20, province: 1, name: 'Final Castle', phase: 'Final Revelation' },
  { chapter: 21, province: -1, name: 'Cleanup / Return Home', phase: 'Cleanup' }
];

export function getProvinceInfo(provinceNum) {
  return PROVINCE_SEQUENCE.find(p => p.province === provinceNum) || PROVINCE_SEQUENCE[0];
}

// ─── Province Data (for Codex display) ───
export const PROVINCES = {
  618: {
    name: 'Province 618: Red Sand Camp', biome: 'Red dunes, harsh sun, auroras, water scarcity, ruins, raiders, metal bird drone',
    theme: 'Survival tutorial', danger: 'Thirst, raiders, sand maws',
    npcs: 'Shard (leader), Patch (healer), Spark (young inventor), Maul (rival bruiser), Cowboy, Rivet',
    enemy: 'Raiders, Sand Maw', mechanics: 'Thirst, Camp Trust, Purifier Stability, Raider Threat',
    choice: 'Help retrieve the purifier core, or follow the Pull alone',
    clue: 'A metal bird drone scans Bullet and seems to recognize something. The etched symbol matches ruins in the sand.',
    cleanup: 'Are the survivors trapped here, or did they choose this place?'
  },
  472: {
    name: 'Province 472: The Water Block', biome: 'A massive suspended block/cube of thick living liquid — not normal water. The breathing apparatus is required to enter. Strange ocean-like life moves inside. An underwater dome is discovered deep in the murk.',
    theme: 'Liquid survival, dome discovery, and first major monster', danger: 'Air depletion, pressure, spined creatures, Dreadwraith (revealed late)',
    npcs: 'Discovered at the dome: Ember (dome leader), Thread (gentle weaver), Veil (suspicious diver), Glint (tech worker), Flicker (young trainee)',
    enemy: 'Spined Creatures (early), Dreadwraith (revealed during underwater battle — adaptive material hunter)', mechanics: 'Air, Pressure, Swimming Fatigue, Dome Stability, Dome Trust, Dreadwraith Adaptation',
    choice: 'Traverse the block, find the dome, survive its crisis, then fight the Dreadwraith and exit to Province 837',
    clue: 'The block is not water. The Dreadwraith adapts to materials (liquid to solid to crystal to granite to exposed core). An exposed core is its weakness — Bullet shatters it with the pipe after pinning it in granite form beneath falling stone.',
    cleanup: 'Is the Dreadwraith a construct or a corrupted being?'
  },
  837: {
    name: 'Province 837: Digger/Borer Tunnels', biome: 'Rock tunnels, root gardens, underground farms, First Sowing altar',
    theme: 'Faction conflict and scarcity morality', danger: 'Sentinels, Cragbeasts, faction war',
    npcs: 'Ridge, Vest, Flint, Drift, Stitch, Knot, Husk, Gash',
    enemy: 'Sentinel, Cragbeasts', mechanics: 'Tunnel Stability, Faction Trust, First Sowing Truth, Sentinel Escalation',
    choice: 'Side with Diggers, Borers, or broker a truce',
    clue: 'The First Sowing altar reveals that the Provinces were seeded — they are not natural.',
    cleanup: 'Are the Diggers and Borers trapped enemies, or forced neighbors?'
  },
  269: {
    name: 'Province 269: Dream Jungle', biome: 'Bioluminescent fungal jungle, vines, spores, dream moss, trapped sleepers',
    theme: 'Stasis, dream temptation, and rescue from false peace', danger: 'Spore exposure, Weaver, identity loss',
    npcs: 'Glow, Sol, Lumen, Shade',
    enemy: 'Weaver / corrupted Hive-Warden', mechanics: 'Dream Grip, Spore Exposure, Identity Fragment Risk, Weaver Corruption',
    choice: 'Stay in the dream or fight free and help others escape',
    clue: 'The dreamers are not resting — they are being consumed. The jungle is a trap disguised as mercy.',
    cleanup: 'Are the dreamers souls to free, or echoes to release?'
  },
  391: {
    name: 'Province 391: Mirrorheart Plain', biome: 'Endless mirror plain, glass trees, mirror spires, eyeless wanderers, identity visions',
    theme: 'Identity horror', danger: 'Twisted Bullet reflections, Mirrorheart',
    npcs: 'Whisper, Glare, Echo',
    enemy: 'Mirrorheart (becomes dormant, not destroyed)', mechanics: 'Reflection Fracture, False Identity Visions, Mirrorheart Dormancy',
    choice: 'Confront your reflections or flee the plain',
    clue: 'The reflections show tyrant, thief, and monster possibilities. They are not random — they are what Bullet could become.',
    cleanup: 'Are the reflections warnings, or trapped possibilities?'
  },
  512: {
    name: 'Province 512: Sky-Mist Ascents', biome: 'Floating moss islands, rope bridges, clouds, vortex, vertical travel',
    theme: 'False escape and hope weaponized', danger: 'Falling, bridge collapse, vortex',
    npcs: 'Vine, Thorn, Fang, Briar',
    enemy: 'The Vortex (leads not home but to another Province)', mechanics: 'Escape Hope, Altitude Strain, Bridge Integrity, Vine Desperation',
    choice: 'Trust the vortex as escape, or resist and find another path',
    clue: 'The vortex does not lead home. It leads to Province 713. Hope is a weapon here.',
    cleanup: 'Are the island dwellers trapped or free?'
  },
  713: {
    name: 'Province 713: Frozen Tundra', biome: 'Ice fields, crystal storms, igloo camp, living crystals, ice wall',
    theme: 'Cold survival and guardian boss', danger: 'Skitterblades, Ice Hound, frostbite',
    npcs: 'Frosthawk, Cinder/Hearth, Stone, Twig, Glass, Shade',
    enemy: 'Three-headed Ice Hound (guardian boss)', mechanics: 'Cold Exposure, Frostbite, Static Crystals, Ice Hound Guardian',
    choice: 'Fight the Ice Hound or find a way around it',
    clue: 'Static crystals can kill the Ice Hound. The Seeker becomes more direct after this province.',
    cleanup: 'Is the Ice Hound a guardian or a prisoner?'
  },
  927: {
    name: 'Province 927: Obsidian City', biome: 'Black glass city, magma fissures, toxic air, scrying walls',
    theme: 'Truth corrupted into prophecy', danger: 'Obsidian Shades, scrying corruption, heat',
    npcs: 'Blade, Ash, Soot, Gleam, Flint, Cinder/Crucible',
    enemy: 'Obsidian Shades, camp division', mechanics: 'Scrying Corruption, Camp Division, Obsidian Shade Swarm, Molten Bridge Escape',
    choice: 'Trust the scrying walls or destroy them; save the divided camp',
    clue: 'The scrying walls show fear and desire visions. Vision is not command — but it can break you.',
    cleanup: 'Are the Shades corrupted souls or constructs?'
  },
  108: {
    name: 'Province 108: Rust Swamp', biome: 'Oily sludge, metal trees, rust vines, toxic gas, unstable platforms',
    theme: 'Corrosion and dehumanization', danger: 'Rust-born serpents, scrap harvesters, corrosion',
    npcs: 'Silt, Crag, Mire, Alloy, Scour, Tangle, Hiss, Static, Drench',
    enemy: 'Rust-born serpents, scrap harvesters', mechanics: 'Rust Conversion, Scrap Value, Toxic Air, Gear Corrosion',
    choice: 'When someone starts becoming metal, do others still see them as human?',
    clue: 'Rust venom hardens the body. The etched shard can counter it — but using it increases the resonance trail.',
    cleanup: 'Are the rust-born corrupted humans or new beings?'
  },
  429: {
    name: 'Province 429: Scorched Plain', biome: 'Burning ground, ash storms, molten fissures, volcanic ridge',
    theme: 'Fire survival and scarcity morality', danger: 'Fire Elemental, ash storms, burns',
    npcs: 'Tusk, Scorch, Kindle, Hearth',
    enemy: 'Fire Elemental (boss)', mechanics: 'Burn Exposure, Ash Inhalation, Fissure Timing, Fire Elemental Core, Scarcity Pressure',
    choice: 'Spare or kill Hearth after the attack',
    clue: 'The Fire Elemental can be defeated with ash, steam, and core strikes. Hearth attacks Bullet — mercy has a cost.',
    cleanup: 'Is Hearth corrupted or desperate?'
  },
  998: {
    name: 'Province 998: Prism Expanse', biome: 'Floating crystal fragments, prism spires, luminous threads, void below',
    theme: 'Perception, resonance, and light-bending puzzle combat', danger: 'Shardswarms, Frost-Wing Sentinels, void gaps',
    npcs: 'None (isolated)',
    enemy: 'Shardswarms, Frost-Wing Sentinels', mechanics: 'Refraction Drift, Shard-Dust Venom, Resonance Tuning, Obelisk Lock',
    choice: 'Use the etched shard to seal the obelisk rift, or flee',
    clue: 'Bullet sees steel-gray eyes through an obelisk rift. The etched shard slams the rift shut. Someone is watching.',
    cleanup: 'Are the Shardswarms natural or manufactured?'
  },
  0: {
    name: 'The Gate / Way-Station', biome: 'Iron gate, seven-fold descent, control room, surveillance monitors',
    theme: 'Major campaign turning point', danger: 'Thirty capture operatives, seven-fold descent tests',
    npcs: 'Thirty operatives',
    enemy: 'Capture operatives', mechanics: 'Soul Fracture, Seven-Fold Descent, Way-Station Alarm, Anomaly Status',
    choice: 'Fight through or find another way; the descent tests Pride, Envy, Wrath, Sloth, Greed, Gluttony, Longing',
    clue: 'Bullet sees Province 1 on a monitor. The Pull confirms it as the destination. He is identified as "the anomaly."',
    cleanup: 'N/A — this is a transition area'
  },
  14: {
    name: 'Province 14: The Park / Amphitheater', biome: 'Perfect park, ponds, trees, flowers, looping birdsong, hidden amphitheater',
    theme: 'Complicity and forced witnessing', danger: 'Audience creatures, winged puppeteers, storyteller',
    npcs: 'The Storyteller',
    enemy: 'Audience creatures, puppeteers', mechanics: 'Witness Guilt, Performance Cycle, False Rest, Park Watchfulness',
    choice: 'Intervene, observe, rescue one victim, sabotage, confront storyteller, or leave and carry guilt',
    clue: 'The Storyteller tells the myth of the Star and the Wanderer — a story about the Architect\'s fall.',
    cleanup: 'Are the audience creatures complicit or trapped?'
  },
  140: {
    name: 'Province 14 Deep: The Meadow', biome: 'Soft grass, willows, stream, false stars, honeyed air, guilt haze',
    theme: 'Corrupted guilt memory and blackout combat', danger: 'Memory rewriting, hidden husk predators, blackout',
    npcs: 'None (isolated)',
    enemy: 'Hidden husk predators (blackout combat)', mechanics: 'Corrupted Guilt Memory, Blackout Combat, Fear of Self',
    choice: 'Resist the meadow\'s rewriting, or lose yourself',
    clue: 'Myths of Blade of Dawn, Star-Crowned Ember, Silent Pulse. Bullet blacks out and wakes surrounded by dead husks.',
    cleanup: 'Are the husks natural predators or trapped souls?'
  },
  5121: {
    name: 'Province 512 Upper: Despair Peaks', biome: 'Mist mountains, geysers, despair vapors, toothed plants, cliffs',
    theme: 'Despair and being saved by others', danger: 'Spectral Wyrm, despair mist, cliffs',
    npcs: 'Mist, Knell, Glim, Haze, Veil/Hymn',
    enemy: 'Spectral Wyrm, Despair Mist', mechanics: 'Despair Pressure, Anchor Against Despair, Survivor Chorus, Bond Threat',
    choice: 'Accept help from the survivors or break alone',
    clue: 'Connection can resist Province systems. Bullet survives because others pull him back. The "With Help" flag is set.',
    cleanup: 'Are the spectral beings corrupted or natural?'
  },
  3911: {
    name: 'Province 391 Inner: Loop Room', biome: 'Vast obsidian chamber, living floor symbols, false distant door, hidden true door',
    theme: 'False exit puzzle and active shard unlock', danger: 'Loop strain, isolation, temporal echo',
    npcs: 'Temporal Double',
    enemy: 'The loop itself', mechanics: 'Loop Strain, False Door, True Door, Temporal Echo, Shard Focus',
    choice: 'Press the shard to your temple to reveal the true door',
    clue: 'The temporal double hints at shard use. The etched shard reveals hidden truth — but hidden truth can see you back.',
    cleanup: 'N/A — this is a transition area'
  },
  1: {
    name: 'Province 1: Final Castle', biome: 'Black shore, obsidian shore, ferryman, castle barrier, bone shards, ash sky',
    theme: 'Final confrontation and identity reveal', danger: 'Seeker, Dreadwraith, Serpent of Province 1',
    npcs: 'The Ferryman, The Leader (fallen brother)',
    enemy: 'Serpent of Province 1 (300ft, the provinces\' accumulated wrath incarnate, summoned by bone-tech whistle)', mechanics: 'Barrier (shattered by etched shard), Ferryman Payment (Spark\'s shard), Serpent Phases, Identity Reveal, Leader Redemption',
    choice: 'Throw the etched shard into the barrier to shatter it and awaken as Michael',
    clue: 'Bullet is Michael, sent by Father. The Leader is his fallen brother (the Star/Ember who defied Father). The Leader repents and returns home. "Only One can make the Garden." The amnesia was intentional — to choose righteousness, not divinity. Both identities remain true.',
    cleanup: 'Begin Cleanup Mode — return through all Provinces, judge souls, dismantle corruption'
  },
  [-1]: {
    name: 'Cleanup Mode', biome: 'Return through all Provinces',
    theme: 'Judgment and dismantling', danger: 'Moral judgment, uncertainty',
    npcs: 'All surviving NPCs',
    enemy: 'Irredeemable beings', mechanics: 'Send Home, Cleanse, Release, Unmake, Investigate',
    choice: 'Judge every soul — innocent, corrupted, artificial, redeemable, or irredeemable',
    clue: 'Where does corruption end and choice begin?',
    cleanup: 'This IS the cleanup'
  }
};

// ─── Key Items ───
export const KEY_ITEMS = {
  etched_shard: { name: 'Etched Shard', desc: 'A shard of metal or glass, warm to the touch. Etched with a circle bisected by a jagged line. Stabilizes wounds and resists corruption — but at a cost.', start: true },
  pipe: { name: 'Battered Metal Pipe', desc: 'Begins as a simple metal rod. Becomes weapon, walking stick, anchor, and symbol of survival. In Province 1, briefly reveals its true divine sword form.', start: true },
  spark_shard: { name: 'Spark\'s Unetched Shard', desc: 'A cool, unetched shard given by Spark in Province 618. Represents debt, hope, and connection. Used to pay the ferryman at Province 1.', start: false },
  patch_cloak: { name: 'Patch\'s Cloak', desc: 'A healer\'s cloak given in Province 618.', start: false },
  breathing_gear: { name: 'Shard\'s Breathing Apparatus', desc: 'Breathing gear from Shard for Province 472.', start: false },
  thread_knife: { name: 'Thread\'s Knife', desc: 'A knife from Thread in Province 472.', start: false },
  purifier_core: { name: 'Purifier Core', desc: 'A water purifier core from Province 618.', start: false },
  sentinel_eye: { name: 'Sentinel Eye Core', desc: 'A core from a destroyed Sentinel in Province 837.', start: false },
  mirrorheart_fragment: { name: 'Mirrorheart Fragment', desc: 'A dormant fragment from the Mirrorheart in Province 391.', start: false },
  ash_cloth: { name: 'Ash Cloth', desc: 'A cloth that resists heat, from Province 429.', start: false },
  bone_restraints: { name: 'Bone-Tech Restraints', desc: 'Technology that binds the Dreadwraith to the Seeker.', start: false }
};

// ─── Codex Categories ───
export const CODEX_CATEGORIES = [
  { id: 'story', label: 'Story So Far' },
  { id: 'objective', label: 'Current Objective' },
  { id: 'bullet', label: 'Bullet' },
  { id: 'pull', label: 'The Pull' },
  { id: 'scar', label: 'Scar' },
  { id: 'shard', label: 'Etched Shard' },
  { id: 'pipe', label: 'The Pipe' },
  { id: 'provinces', label: 'Provinces' },
  { id: 'people', label: 'People' },
  { id: 'threats', label: 'Threats' },
  { id: 'province1', label: 'Province 1' },
  { id: 'seeker', label: 'The Seeker' },
  { id: 'dreadwraith', label: 'Dreadwraith' },
  { id: 'lore', label: 'Hidden Lore' },
  { id: 'myths', label: 'Myths' },
  { id: 'memories', label: 'Memories' },
  { id: 'cleanup', label: 'Cleanup' }
];

// ─── Codex Entries ───
export const CODEX_ENTRIES = {
  story: {
    category: 'story', title: 'The Tale So Far',
    content: 'Bullet woke face-down in red sand with no memory, a circular scar over his heart, and an etched shard in his pocket. Something called the Pull drags him forward through nightmare Provinces, each one a surreal ecosystem of danger, mystery, and moral test. He does not know where the Pull leads. He does not know who he was. He only knows he must keep moving.',
    alwaysVisible: true
  },
  objective: {
    category: 'objective', title: 'Current Objective',
    content: 'Follow the Pull. Survive the Provinces. Discover the truth about the scar, the shard, and what waits at the end.',
    alwaysVisible: true
  },
  bullet: {
    category: 'bullet', title: 'Bullet',
    content: 'Bullet is Michael. A divine being sent by Father to end the Provinces\' torment. To cross the veil, Michael shot himself in the heart at Father\'s command - the scar that named him Bullet. He forgot everything: his name, his purpose, his divinity. The etched shard (Father\'s own light) guided him through amnesia. The Pull was Father\'s will, driving him forward. He survived every province not because he knew he was divine, but because he chose righteousness even without memory. Both identities are true: Michael (divine mission) and Bullet (the scarred wanderer). After Cleanup, Michael ascends home to Father.',
    alwaysVisible: true
  },
  pull: {
    category: 'pull', title: 'The Pull',
    content: 'A force in Bullet\'s chest that drags him forward. It is not a thought. Not a voice. A direction. It intensifies when resisted — from a gentle tug to an ache, a burn, a commanding force that can trigger blackouts. But it FADES when followed: move with the Pull and the scar goes quiet, the pressure eases, and Bullet can rest and think. At low intensity, Bullet can delay and explore. At high intensity, the scar burns, visions appear, and forced movement becomes a risk. The Pull never explains itself — but it rewards surrender to the journey and punishes defiance.',
    alwaysVisible: true
  },
  scar: {
    category: 'scar', title: 'The Scar',
    content: 'A circular scar over Bullet\'s heart - a bullet wound, self-inflicted at Father\'s command. To enter the realm of the damned, Michael had to commit an unforgivable sin: suicide. Father molded his heart to break it. Michael shot himself in the heart. That wound became the scar, which is why the camp named him Bullet. It reacts to the Pull, Province boundaries, shard activity, Sentinels, Wardens, memory fragments, and Province 1 signals. Not true suicide born of despair, but sacrifice born of mission.',
    alwaysVisible: true
  },
  etched_shard: {
    category: 'shard', title: 'The Etched Shard',
    content: 'A shard of metal or glass, warm to the touch. Etched with a circle bisected by a jagged line. Father shaped it from His own light as a beacon through amnesia. Progression: Early (passive warmth, minor healing, scar sync), Mid (resists venom, counters rust, resonates with crystals, sonic weapon vs Shardswarms), Late (reveals hidden doors, Shard Focus, enhanced perception/strength), Province 1 (shatters the barrier, awakens Michael). After the final battle, Michael gives it to his brother - the Leader takes it home to Father. Its purpose fulfilled. Warning: the more Bullet uses it, the easier he is to track (shard resonance trail).',
    alwaysVisible: true
  },
  spark_shard: {
    category: 'shard', title: 'Spark\'s Unetched Shard',
    content: 'A cool, unetched shard given to Bullet by Spark in Province 618. It represents debt, hope, connection, and a reminder of the people left behind. It will be used to pay the ferryman at the black shore of Province 1.',
    requiresUnlock: 'spark_shard'
  },
  pipe: {
    category: 'pipe', title: 'The Pipe',
    content: 'Bullet does not start with a weapon. The first time he faces a physical threat, he instinctively snatches up a battered metal pipe from the environment — his body remembering what his mind has forgotten. From that moment, it becomes his main weapon, walking stick, and emotional anchor. It collects scars and stories from every Province. In Province 1, after Michael awakens, the pipe briefly transforms into a radiant sword of white fire. After the final battle, it becomes the pipe again. The pipe is Bullet\'s survival. The sword is Michael\'s mission. Both are true.',
    requiresUnlock: 'pipe'
  },
  shard_focus: {
    category: 'shard', title: 'Shard Focus',
    content: 'Unlocked in Province 391 Loop Room. A permanent player action: Focus Etched Shard. Uses: reveal hidden seams, detect false exits, resist illusions, read hidden Province machinery, strengthen resonance, see layered truth. Cost: scar pain, mental strain, resonance trail, Hunter Proximity increase. Warning: the shard shows hidden truth. But hidden truth can see you back.',
    requiresUnlock: 'shard_focus'
  },
  province_618: {
    category: 'provinces', title: 'Province 618: Red Sand Camp',
    content: 'Red dunes under a harsh sun. A camp of survivors led by Shard. Water is scarce. A metal bird drone scans newcomers. Sand maws hunt beneath the dunes. This is where Bullet woke, was named, and first felt the Pull.',
    requiresProvince: 618
  },
  province_472: {
    category: 'provinces', title: 'Province 472: Liquid Block / Dome',
    content: 'A floating cube of thick jelly-water. An underwater dome settlement. Oxygen is scarce. Spine creatures hunt in the liquid. The Dreadwraith first appeared here.',
    requiresProvince: 472
  },
  province_837: {
    category: 'provinces', title: 'Province 837: Digger/Borer Tunnels',
    content: 'Underground tunnels with root gardens and farms. Two factions — Diggers and Borers — war over scarce resources. A Sentinel enforces boundaries. The First Sowing altar reveals the Provinces were seeded.',
    requiresProvince: 837
  },
  province_269: {
    category: 'provinces', title: 'Province 269: Dream Jungle',
    content: 'A bioluminescent fungal jungle. Spores whisper rest, stay, join. Dreamers are trapped in false peace. The Weaver corrupts the Hive-Warden.',
    requiresProvince: 269
  },
  province_391: {
    category: 'provinces', title: 'Province 391: Mirrorheart Plain',
    content: 'An endless mirror plain. Glass trees and mirror spires. Eyeless wanderers. False versions of Bullet show tyrant, thief, and monster possibilities. The Mirrorheart becomes dormant, not destroyed.',
    requiresProvince: 391
  },
  province_512: {
    category: 'provinces', title: 'Province 512: Sky-Mist Ascents',
    content: 'Floating moss islands connected by rope bridges. A vortex promises home but leads to another Province. Hope is a weapon here.',
    requiresProvince: 512
  },
  province_713: {
    category: 'provinces', title: 'Province 713: Frozen Tundra',
    content: 'Ice fields and crystal storms. An igloo camp led by Frosthawk. Skitterblades swarm. The three-headed Ice Hound guards the exit. Static crystals can kill it.',
    requiresProvince: 713
  },
  province_927: {
    category: 'provinces', title: 'Province 927: Obsidian City',
    content: 'A black glass city with magma fissures and toxic air. Scrying walls show fear and desire visions. Obsidian Shades attack. The camp is divided by the scrying slab.',
    requiresProvince: 927
  },
  province_108: {
    category: 'provinces', title: 'Province 108: Rust Swamp',
    content: 'An oily iron swamp with metal trees and rust vines. Rust-born serpents hunt. Rust venom hardens the body. Scrap harvesters try to harvest Bullet. Core question: when someone becomes metal, are they still human?',
    requiresProvince: 108
  },
  province_429: {
    category: 'provinces', title: 'Province 429: Scorched Plain',
    content: 'Burning ground, ash storms, and molten fissures. A Fire Elemental boss. A scorched camp offers broth. Hearth attacks Bullet.',
    requiresProvince: 429
  },
  province_998: {
    category: 'provinces', title: 'Province 998: Prism Expanse',
    content: 'Floating crystal fragments over a void. Shardswarms attack. Frost-Wing Sentinels patrol. An obelisk rift opens and steel-gray eyes see Bullet. The etched shard slams the rift shut.',
    requiresProvince: 998
  },
  province_14: {
    category: 'provinces', title: 'Province 14: The Park / Meadow',
    content: 'A beautiful false park hiding an amphitheater where humans are tortured as puppets. Deep below, the Meadow rewrites memories with guilt haze. The Storyteller tells the myth of the Star and the Wanderer.',
    requiresProvince: 14
  },
  province_1: {
    category: 'provinces', title: 'Province 1: Final Castle',
    content: 'A black shore. A ferryman demands payment — Bullet pays with Spark\'s unetched shard. A violet-green barrier blocks the castle; the etched shard shatters it, awakening Michael\'s divine memories. The Seeker and Dreadwraith are destroyed with a touch. The Leader is Michael\'s fallen brother — the Star who defied Father and built the Provinces. He summons the Serpent (the provinces\' accumulated wrath incarnate). Michael grows radiant wings; the pipe becomes a sword of white fire. After slaying the Serpent, Michael invites his brother home to the Garden. The Leader repents and returns to Father. The amnesia was intentional: to choose righteousness, not divinity. Both identities remain true: Michael and Bullet. The Pull vanishes. Cleanup begins.',
    requiresProvince: 1
  },
  seeker: {
    category: 'seeker', title: 'The Seeker',
    content: 'Province 1\'s hunter. Calm, precise, relentless, and increasingly frustrated. He begins by relying on guardians and interrogation. After the Ice Hound dies, he becomes more direct. After the way-station massacre, he tracks shard resonance. He catches Bullet at Province 1.',
    requiresUnlock: 'seeker'
  },
  dreadwraith: {
    category: 'dreadwraith', title: 'The Dreadwraith',
    content: 'A recurring adaptive monster. Early: liquid/crystal/stone adaptive hunter. Later: bound to the Seeker through bone-tech whistle. Final: material-adaptive form on Province 1 shore — mist, stone, metal, bone, shadow. It should not be easily killed until Michael awakens.',
    requiresUnlock: 'dreadwraith'
  },
  council: {
    category: 'province1', title: 'The Council of Twelve',
    content: 'Province 1 has a Council of Twelve: Overseer (data), Warden (hunt director), Scribe (torment records), Monitor (weather/environment), Enforcer (trial enforcement), Shroud (intelligence), Clawrend (operative training), Veiltongue (scrying visions), Gloom (prisoner torment), Ashenveil (Province design), Voidcalibrator (Nexus assignment), Rasp (relic and bone-tech forging). The Leader keeps them divided.',
    requiresUnlock: 'council'
  },
  genesis: {
    category: 'lore', title: 'Genesis (Unverified)',
    content: 'Fragmentary visions suggest the realm was shaped from chaos. The Threshold strips identities. The Nexus assigns souls to Provinces. Sentinels enforce boundaries. People lose names, memories, and time. This is unverified — it may be true memory, distorted memory, or Province-planted myth.',
    requiresUnlock: 'genesis'
  },
  architect_fall: {
    category: 'lore', title: 'The Leader\'s Fall',
    content: 'The Leader is the Star-Crowned Ember from the creation myths — a divine being who defied Father (the Sovereign/Silent Pulse) and fell from the Celestial Assembly/Lattice of Sparks. He built the Provinces as his own corrupted kingdom, trying to recreate the Garden and failing. Every province, every torture, every trapped soul was his creation. His pride corrupted everything he touched. He is Michael\'s fallen brother. After the final battle, he repents: "Tell Father I\'m sorry. That I remember now." He returns home in white light.',
    requiresUnlock: 'architect_fall'
  },
  blade_of_dawn: {
    category: 'myths', title: 'Blade of Dawn',
    content: 'The myth of a radiant sword of white fire that ends torment. CONFIRMED: In Province 1, after Michael awakens, the battered pipe transforms into a majestic sword radiating white fire, humming with divine will. With it, Michael slays the Serpent of Province 1. After the final battle, the sword becomes the pipe again. The pipe is Bullet\'s survival. The sword is Michael\'s mission. Both are true.',
    requiresUnlock: 'blade_of_dawn'
  },
  star_wanderer: {
    category: 'myths', title: 'The Star and the Wanderer (Myth)',
    content: 'A story told by the Storyteller in Province 14. It may describe the Architect\'s fall — a star who wanted to create beauty and became a wanderer in his own corrupted realm. Unverified.',
    requiresUnlock: 'star_wanderer'
  },
  father_garden: {
    category: 'lore', title: 'Father and the Garden',
    content: 'Father is the supreme being — the Sovereign/Silent Pulse from the creation myths. The Garden is the original home, a place of origin beyond the Provinces. The Leader tried to replicate the Garden in his corrupted kingdom and failed. "Only One can make the Garden." After the final battle, Michael invites the Leader home: "The family\'s waiting. In the Garden." The Leader repents and returns to Father. The Garden is real. Father is real. Home is real.',
    requiresUnlock: 'father_garden'
  },
  steel_gray_eyes: {
    category: 'bullet', title: 'Steel-Gray Eyes',
    content: 'Bullet has steel-gray eyes. In Province 998, steel-gray eyes see him through an obelisk rift. In Province 1, the Leader has steel-gray eyes. They are brothers. This is not a coincidence.',
    requiresUnlock: 'steel_gray_eyes'
  },
  the_greatest_task: {
    category: 'lore', title: 'The Greatest Task',
    content: 'Father gave Michael the greatest task: enter the realm of torment, forget himself, suffer as the trapped souls suffer, and end the Provinces\' torment. Father shaped the etched shard from His own light as a beacon through amnesia. To cross the veil into the realm of the damned, Michael had to commit an unforgivable sin: suicide. Father molded his heart to break it. Michael shot himself in the heart - the bullet wound that became the scar, that named him Bullet. The amnesia was intentional: to choose righteousness, not divinity. The Pull was Father\'s will. After all provinces are cleansed, Michael ascends home. The light embraced him, and he was home.',
    requiresProvince: 1
  },
  cleanup_mode: {
    category: 'cleanup', title: 'Cleanup Mode',
    content: 'After Province 1, Michael walks back through every province in reverse, touching each soul. White light flares at each contact. The irredeemably bad dissolve into nothing - their existence erased. The good ascend home to the Garden. TWIST: some NPCs who seemed kind hide deeper sins (betrayal, cruelty, hidden crimes) and are irredeemable - Mist, Knell, Glim, Haze, and Veil from Province 512 included some who dissolved. Others who seemed corrupted were genuinely redeemed through choices made in nightmare circumstances. This takes centuries. After all provinces are cleansed and the realm is completely dismantled, Michael ascends home to Father.',
    requiresProvince: 1
  }
};

// ─── Settings ───
export const GORE_LEVELS = ['Low', 'Normal', 'Extreme'];
export const DESPAIR_LEVELS = ['Low', 'Normal', 'Full'];
export const IMPACT_DISPLAY_LEVELS = ['Off', 'Minimal', 'Normal', 'Detailed'];

// ─── Initial campaign state ───
export const PULL_INITIAL_STATE = {
  current_province: 618,
  province_history: [],
  chapter1_sequence: 1,
  campaign_clocks: {
    province_1_alert: 0, hunter_proximity: 0, seeker_frustration: 0,
    dreadwraith_adaptation: 0, shard_resonance_trail: 0, bond_threat: 0,
    council_fracture: 0, ruler_strain: 50, realm_stability: 50,
    bullet_mystery: 0, fear_of_self: 0, soul_fracture: 0,
    witness_guilt: 0, guilt_burden: 0, bullet_humanity: 100,
    mechanical_bird_surveillance: 0, camp_raider_pressure: 0, camp_task_danger: 0
  },
  local_clocks: { thirst: 75, heat_exposure: 65, fatigue: 55, camp_trust: 10, purifier_stability: 40, raider_threat: 20, air: 0, pressure: 0, swimming_fatigue: 0 },
  discovered_clocks: ['thirst', 'heat_exposure', 'fatigue'],
  unlock_flags: {},
  pull_intensity: 1,
  scar_state: 'pulse',
  shard_resonance: 5,
  spark_shard: false,
  breathing_gear: false,
  pipe_state: 'unfound',
  bullet_named: false,
  camp_arc_complete: false,
  shard_focus_unlocked: false,
  conditions: [
    { type: 'dehydration', label: 'Dehydration', severity: 'moderate' },
    { type: 'burns', label: 'Burns', severity: 'moderate' },
    { type: 'fatigue', label: 'Fatigue', severity: 'moderate' }
  ],
  codex_unlocks: ['story', 'objective', 'bullet', 'pull', 'scar', 'etched_shard', 'province_618'],
  known_threats: [],
  npc_relationships: {},
  memories: [],
  guilt_echoes: [],
  current_objective: { title: 'Survive', description: 'Survive. Find water. Follow the Pull.' },
  phase: 'Lost Survivor',
  chapter_status: { chapter_001: 'available' },
  chapter_handoffs: {}
};

export const PULL_OPENING_SCENE = `You wake face-down in red sand.

Heat presses against your back. Your mouth is dry enough to crack. You do not know your name.

There is a circular scar over your heart.

Something hard presses against your thigh inside your pocket. A shard. Metal or glass. Warm. Etched with a circle split by a jagged line.

And inside your chest, something pulls.

Not a thought. Not a voice. A direction.

Forward.

When you follow, it quiets. When you resist, it burns.`;