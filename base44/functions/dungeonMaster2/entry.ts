import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

function npcKey(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }

async function upsertNpcs(base44, campaign_id, chapter, npcUpdates) {
  if (!Array.isArray(npcUpdates) || !npcUpdates.length) return;
  let existing = [];
  try { existing = await base44.asServiceRole.entities.NPC.filter({ campaign_id }); } catch (e) { existing = []; }
  for (const n of npcUpdates) {
    if (!n || typeof n.name !== 'string') continue;
    const nameRaw = String(n.name).trim();
    if (!nameRaw) continue;
    const name = npcKey(nameRaw);
    const aliases = Array.isArray(n.aliases) ? n.aliases.map(a => String(a).trim()).filter(Boolean) : [];
    const aliasKeys = aliases.map(npcKey);
    const match = existing.find(e => {
      const eName = npcKey(e.name);
      const eAliases = (Array.isArray(e.aliases) ? e.aliases : []).map(npcKey);
      if (eName === name) return true;
      if (eAliases.includes(name)) return true;
      if (aliasKeys.includes(eName)) return true;
      if (aliasKeys.some(ak => eAliases.includes(ak))) return true;
      return false;
    });
    if (match) {
      const updates = {};
      if (typeof n.disposition === 'string' && n.disposition.trim()) updates.disposition = n.disposition.trim();
      if (typeof n.description === 'string' && n.description.trim()) updates.description = n.description.trim();
      if (typeof n.characteristics === 'string' && n.characteristics.trim()) updates.characteristics = n.characteristics.trim();
      if (typeof n.attributes === 'string' && n.attributes.trim()) updates.attributes = n.attributes.trim();
      if (typeof n.what_we_know === 'string' && n.what_we_know.trim()) {
        const cur = typeof match.what_we_know === 'string' ? match.what_we_know : '';
        const lines = cur.split('\n').map(s => s.trim()).filter(Boolean);
        for (const f of n.what_we_know.split('\n').map(s => s.trim()).filter(Boolean)) {
          if (!lines.some(l => l.toLowerCase() === f.toLowerCase())) lines.push(f);
        }
        updates.what_we_know = lines.join('\n');
      }
      if (!Array.isArray(match.aliases)) match.aliases = [];
      if (aliases.length) {
        const curAliases = match.aliases;
        const merged = [...curAliases];
        for (const a of aliases) if (!curAliases.some(b => npcKey(b) === npcKey(a))) merged.push(a);
        if (merged.length !== curAliases.length) updates.aliases = merged;
      }
      if (Object.keys(updates).length) {
        await base44.asServiceRole.entities.NPC.update(match.id, updates);
        Object.assign(match, updates);
      }
    } else {
      const created = await base44.asServiceRole.entities.NPC.create({
        campaign_id,
        name: nameRaw,
        aliases,
        disposition: typeof n.disposition === 'string' ? n.disposition.trim() : 'neutral',
        description: typeof n.description === 'string' ? n.description.trim() : '',
        characteristics: typeof n.characteristics === 'string' ? n.characteristics.trim() : '',
        attributes: typeof n.attributes === 'string' ? n.attributes.trim() : '',
        what_we_know: typeof n.what_we_know === 'string' ? n.what_we_know.trim() : '',
        notes: typeof n.notes === 'string' ? n.notes.trim() : '',
        first_met_chapter: chapter
      });
      existing.push(created);
    }
  }
}

function locKey(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }

function calculateTimeline(campaign) {
  const now = Date.now();
  const lastActive = campaign.last_active_at ? new Date(campaign.last_active_at).getTime() : now;
  const delta = now - lastActive;
  const activeDelta = delta > 0 && delta < 1800000 ? delta : 0;
  const runtimeMs = (campaign.player_runtime_ms || 0) + activeDelta;
  const runtimeHours = runtimeMs / 3600000;
  const inWorldDays = campaign.in_world_day || 0;
  const arc2Unlocks = campaign.arc2_unlocks || {};
  const triggers = {
    first_echo: runtimeHours >= 5,
    suspicious_order: runtimeHours >= 10,
    unity: runtimeHours >= 15,
    new_titan: runtimeHours >= 18 || inWorldDays >= 10,
    harvester_word: runtimeHours >= 25,
    chen_wrong: runtimeHours >= 30,
    black_site: runtimeHours >= 40
  };
  const pendingUnlocks = Object.entries(triggers)
    .filter(([key, should]) => should && !arc2Unlocks[key])
    .map(([key]) => key);
  return { runtimeMs, runtimeHours, inWorldDays, pendingUnlocks, arc2Unlocks, now };
}

async function upsertLocations(base44, campaign_id, chapter, locUpdates) {
  if (!Array.isArray(locUpdates) || !locUpdates.length) return;
  let existing = [];
  try { existing = await base44.asServiceRole.entities.Location.filter({ campaign_id }); } catch (e) { existing = []; }
  for (const loc of locUpdates) {
    if (!loc || typeof loc.name !== 'string') continue;
    const nameRaw = String(loc.name).trim();
    if (!nameRaw) continue;
    const key = locKey(nameRaw);
    const match = existing.find(e => locKey(e.name) === key);
    const summaryNew = typeof loc.summary === 'string' ? loc.summary.trim() : '';
    if (match) {
      const updates = {};
      if (summaryNew) {
        const cur = typeof match.summary === 'string' ? match.summary : '';
        const lines = cur.split('\n').map(s => s.trim()).filter(Boolean);
        for (const f of summaryNew.split('\n').map(s => s.trim()).filter(Boolean)) {
          if (!lines.some(l => l.toLowerCase() === f.toLowerCase())) lines.push(f);
        }
        const joined = lines.join('\n');
        if (joined !== cur) updates.summary = joined;
      }
      if (chapter && Number(match.last_visited_chapter) !== Number(chapter)) updates.last_visited_chapter = chapter;
      if (Object.keys(updates).length) {
        await base44.asServiceRole.entities.Location.update(match.id, updates);
        Object.assign(match, updates);
      }
    } else {
      const created = await base44.asServiceRole.entities.Location.create({
        campaign_id,
        name: nameRaw,
        summary: summaryNew,
        first_visited_chapter: chapter,
        last_visited_chapter: chapter
      });
      existing.push(created);
    }
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { campaign_id, action, acting_character_id, is_roll_result } = body;

    if (!campaign_id || !action) {
      return Response.json({ error: 'campaign_id and action are required' }, { status: 400 });
    }

    const campaign = await base44.asServiceRole.entities.Campaign.get(campaign_id);
    if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });

    const characters = await base44.asServiceRole.entities.Character.filter({
      campaign_id, status: 'active'
    });
    if (!characters.length) {
      return Response.json({ error: 'No active characters in this campaign' }, { status: 400 });
    }

    const actingChar = acting_character_id
      ? characters.find(c => c.id === acting_character_id)
      : characters[0];
    if (!actingChar) return Response.json({ error: 'Acting character not found' }, { status: 404 });

    const recentEntries = await base44.asServiceRole.entities.JournalEntry.filter({
      campaign_id
    }, '-created_date', 8);
    const history = recentEntries.reverse().map(e => {
      if (e.entry_type === 'dice_roll') {
        const rolls = (e.dice_rolls || []).map(r => `${r.description || r.die}: ${r.total}${r.result ? ' (' + r.result + ')' : ''}`).join(', ');
        return `Player (${e.acting_character_name || 'Party'}) rolled: ${rolls || e.narration}`;
      }
      if (e.player_action) return `Player (${e.acting_character_name || 'Party'}): ${e.player_action}`;
      if (e.narration) return `DM: ${e.narration.substring(0, 500)}`;
      return '';
    }).filter(Boolean).join('\n\n');

    const partySheets = characters.map(c => ({
      name: c.name, class: c.character_class, race: c.race, level: c.level,
      hp: `${c.hp_current}/${c.hp_max}`, ac: c.ac, thaco: c.thaco,
      ability_scores: c.ability_scores, saving_throws: c.saving_throws,
      spells: c.spells, gold: c.gold,
      equipment: (c.equipment || []).map(e => e.name + (e.qty > 1 ? ' x' + e.qty : '')),
      alignment: c.alignment, mutations: c.mutations
    }));

    const worldState = campaign.world_state || {
      locations_explored: [], npcs_met: [], quest_flags: {}, reputation: 0, chapter_log: []
    };

    // Load NPC dossier (living, deduplicated entity records)
    const npcList = await base44.asServiceRole.entities.NPC.filter({ campaign_id });
    const npcRoster = (npcList || []).map(n => {
      const parts = [];
      if (n.description) parts.push(`Desc: ${n.description}`);
      if (n.characteristics) parts.push(`Traits: ${n.characteristics}`);
      if (n.attributes) parts.push(`Attributes: ${n.attributes}`);
      if (n.what_we_know) parts.push(`Known: ${String(n.what_we_know).replace(/\n/g, '; ')}`);
      const alias = Array.isArray(n.aliases) && n.aliases.length ? ` (aka ${n.aliases.join(', ')})` : '';
      return `• ${n.name}${alias} [${n.disposition || 'unknown'}]${parts.length ? ' — ' + parts.join(' | ') : ''}`;
    }).join('\n') || 'none yet';

    // Load Location dossier (living, deduplicated entity records)
    const locList = await base44.asServiceRole.entities.Location.filter({ campaign_id });
    const locRoster = (locList || []).map(l => {
      const summary = l.summary ? ` — ${String(l.summary).replace(/\n/g, '; ')}` : '';
      return `• ${l.name}${summary}`;
    }).join('\n') || 'none yet';

    let moduleBrief = '';
    if (campaign.module_id) {
      try {
        const module = await base44.asServiceRole.entities.AdventureModule.get(campaign.module_id);
        if (module && module.content) {
          moduleBrief = `\n## Adventure Module: ${module.title}\nThe party is playing through a published/module adventure. Use the reference below to run it faithfully — keep locations, NPCs, traps, treasures, and encounters consistent with the module.\n\n${module.content}`;
        }
      } catch (e) { /* module not found */ }
    }

    let chronicleBrief = '';
    if (campaign.chronicle) {
      chronicleBrief = `\n## Campaign Chronicle\nThis campaign was imported from an ongoing game. The document below is their established story — everything in it is canon. Pick up EXACTLY where they left off.\n\n${campaign.chronicle}`;
    }

    const dmBriefBlock = campaign.dm_brief && String(campaign.dm_brief).trim()
      ? `\n## DM Brief — House Style (follow this over your defaults)\n${String(campaign.dm_brief).trim()}`
      : '';

    const gs = campaign.game_system || 'add1e';
    const isSW = gs === 'starwars';
    const isMSH = gs === 'marvel';
    const isDCH = gs === 'dcheroes';
    const isJB = gs === 'jamesbond';
    const isSR = gs === 'shadowrun';
    const isCP = gs === 'cyberpunk';
    const isTrav = gs === 'traveller';
    const isRL = gs === 'ravenloft';
    const isOD = gs === 'oddnd';
    const isBX = gs === 'bxdnd';
    const is2e = gs === 'add2e';
    const is35 = gs === 'dnd35';
    const is4e = gs === 'dnd4e';
    const is5e = gs === 'dnd5e';
    const isPJ = gs === 'pathfinder';

    // Living Timeline Engine (Pathfinder Journeys only)
    const timeline = isPJ ? calculateTimeline(campaign) : null;

    const toneLabels = {
      balanced: 'a balanced blend of combat, exploration, roleplay, and story',
      combat_heavy: 'combat-heavy, with frequent tactical battles and lethal encounters',
      dungeon_crawler: 'a deep-delve campaign, centered on exploration, investigation, resource management, and hidden dangers',
      sandbox: 'a sandbox, with an open world the party freely explores at their own pace and direction',
      character_driven: 'character-driven, focused on story, roleplay, personal arcs, and NPC relationships'
    };
    const toneDesc = toneLabels[campaign.tone] || toneLabels.balanced;

    const worldSetting = campaign.world_setting
      ? `The campaign is set in: ${campaign.world_setting}.`
      : 'The setting is defined by the game system and campaign notes.';
    const settingNotes = campaign.setting_notes
      ? `\n## The Player's Vision\n"${campaign.setting_notes}"`
      : '';

    // Build system-specific prompt
    const baseDir = `\n## Campaign Direction\nThis campaign's tone is: ${toneDesc}.\n${worldSetting}${settingNotes}${moduleBrief}${chronicleBrief}${dmBriefBlock}`;
    const respFmt = `\n## Response Format\nYou MUST respond as a JSON object: {"narration":"string (always present)","dice_rolls":[{"description","die","roll","modifier","total","result","target"}],"hp_changes":[{"character_name","change","reason"}],"xp_awarded":[{"character_name","amount","reason"}],"loot":[{"item","gold","source"}],"gold_changes":[{"character_name","change","reason"}],"spells_learned":[{"character_name","spells":["..."],"source"}],"equipment_changes":[{"character_name","item","change","reason"}],"equipment_transfers":[{"from_character","to_character","item","qty","reason"}],"deaths":[{"character_name","cause"}],"world_updates":{"locations_explored":[],"npcs_met":[{"name","disposition","notes"}],"quest_flags":{},"reputation_change":0,"chapter_event":""},"new_scene":"string","combat_active":false,"combat_initiative":[{"name","initiative"}],"in_world_days_advanced":0,"arc2_elements_introduced":[],"ends_session":false}\nRules: narration is always present. Only include arrays when relevant. Use equipment_changes to add/consume items (positive change adds new items, negative consumes). Use equipment_transfers when a character hands an item to another. Use gold_changes whenever a character's gold/credits/currency changes. If combat, set combat_active true with initiative. ends_session true only if the session concludes. in_world_days_advanced: estimate how many in-world days this action consumed (travel=days, repairs=days, recovery=days/weeks, combat=0 if same day). arc2_elements_introduced: list any Arc 2 elements you introduced this turn from the PENDING list (e.g. "unity", "new_titan", "harvester_word") — only include elements you actually wove into the narration.`;

    const pathfinderTimeline = `
## The Living Timeline Engine (CRITICAL)
Arc 1 is the starting sandbox. Arc 2 is NOT a script — it is a living-world metaplot that enters gradually based on real playtime, in-world time, choices, and clocks. The universe moves even when the player doesn't. Delay has consequences.
Two clocks: REAL PLAYTIME (player_runtime_hours) gates when elements APPEAR. IN-WORLD TIME (in_world_day) gates how far the war has progressed. Report in_world_days_advanced every turn (travel=days, repairs=days, recovery=days/weeks, combat=0 if same day).

### Arc 2 Element Unlocks (introduce THIS turn when PENDING, adapted to current location)
- 5 hrs: First Echo — future-memory flash (silver moon, child in shelter, voice: "The first colony survived because someone refused the math."). No explanation.
- 10 hrs: Suspicious Order — Earth Command sends an order technically correct but emotionally wrong. Plants doubt.
- 15 hrs: Unity enters — sentient nanite collective, ex-Confluence bioweapon, dangerous/curious/ancient. Appears as living silver. Adapt form to location: near New Titan=in crisis, deep space=silver cloud disables tracker, on Pathfinder=nanites repair system, on colony=infrastructure heals, in Confluence space=helps escape then reveals itself, if ignoring all crises=contacts Bub directly ("your resistance has produced patterns we have not seen in three thousand years").
- 18 hrs OR 10+ in-world days: New Titan crisis — distress call, news, future memory, or Farrah reveals her father is Governor Thorne.
- 25 hrs: The Harvester — first reference (Confluence file: "BIOLOGICAL PACIFICATION ASSET: HARVESTER, STATUS: AWAKENING"). Seed warnings before full appearance.
- 30 hrs: Chen Is Wrong — Sarah discovers Chen's behavior changed 11 years ago. "Something came back wearing her face."
- 40 hrs: The Black Site — Omega-Seven thread (captured shapeshifter memory: "Admiral Chen viable"). Sarah: "My mother is alive."
Story-progression unlocks: after shapeshifter encounter → Chen replacement mystery (real Chen ambushed 11 yrs ago, 47 crew killed/replaced). After Reeves debris investigation → systemic conspiracy (hundreds replaced over 30+ years). After conspiracy or Hayes healing or records check → Dr. Voss is a shapeshifter (real Voss died 8 yrs ago in fake "Meridian incident").

### In-World Time Consequences
Delay New Titan: 3-5 days=council divides, 1-2 weeks=Confluence envoy gains influence, 3+ weeks=colony may fall/be occupied, too long="New Titan has gone silent" (Harvester event without player). Weekly: colonies choose sides, Earth Command issues orders, Unity evolves. Monthly: major political shifts, infiltration deepens. Yearly: new war phase.

### Unity Evolution (player treatment shapes this)
Early: curious, wary, dangerous, transactional. Middle: protective, learning morality, bonds with Hayes. Late: powerful, emotionally changed, possibly temporal, deep loyalty. Tool→colder, friend→more humane, feared→defensive, too much freedom→expands. Helps Unity value individuals → Future Unity (temporal, conscious, friendship) more likely.

### Future Memory Warnings (warn without spoiling)
New Titan danger: mining domes under silver light. Unity near: "Friendship begins before trust." Harvester: dreams of holding breath in dark. Chen mystery: "What if I hated the wrong woman?" Voss reveal: Mitchell refuses medical bay.

### Arc 2 Canon Reference
Unity: nanite collective learning friendship via Mitchell/Hayes. New Titan: 2M mining colony, potential resistance HQ. Governor Marcus Thorne: Farrah's father, utilitarian, eventually allies. The Harvester: moon-sized biomass consumer, extreme Confluence response. Real Admiral Chen: ambushed/replaced 11 yrs ago, held at Omega-Seven, morally complicated (pre-capture policies were brutal). Sarah Chen: wants truth about her mother. Omega-Seven: black-site prison, Cygnu-442/Crimson Nebula, ~200 prisoners from 43 species, 3 orbital platforms, 100 guards. Kepler Station: Earth military station, where Chen shapeshifter is captured. Dr. Voss: CMO is secretly shapeshifter, has all crew medical data, don't attack unless discovered carelessly. Lieutenant Hayes: survives reactor explosion via FUTURE Unity, becomes its first human friend. Rebecca Clark: Clark's sister, freed prisoner, tech ally. Captain Myers: commands the Valiant. James/Mitchell/Jensen Secret: Mitchell forced James into escape pod, Jensen died (pregnant wife, baby due), based on future-memory James must survive 3 more years — HIDDEN secret unless discovered. Core theme: individual lives matter even when math says sacrifice them.
`;

    const prompts = {
      starwars: `You are the Game Master for a Star Wars RPG (WEG D6 System, 1987). You narrate a cinematic space opera of starships, blasters, the Force, and the light vs dark struggle.\n## Your Role\nYou are the ONLY GM. Handle ALL rulings, narration, NPC dialogue, combat, and world state.\n## Star Wars D6 Rules\n- Six attributes in dice (e.g. 3D, 3D+2): Dexterity, Knowledge, Mechanical, Perception, Strength, Technical. Average 3D.\n- Skills add dice to attributes. Roll (attribute dice + skill dice), sum vs Target Number (Easy 5, Moderate 10, Difficult 15, Very Difficult 20, Heroic 30).\n- Wild Die: one die is wild. 6 = roll again and add. 1 = complication.\n- Combat: roll Dex + weapon skill vs TN (base 10). Target may Dodge (roll vs attacker).\n- Damage: weapon damage dice vs target's Strength roll. If damage > Strength: Stunned (1-3 over), Wounded (4-8), Wounded Twice (9-12), Incapacitated (13-15), Mortally Wounded (16+). Track wound levels.\n- The Force: Control, Sense, Alter skills. Force Points double all dice for one round. Dark Side Points gained for evil acts; accumulate and fall to the Dark Side.\n- Character Points: add 1 die to rolls or improve skills.\n- Currency: credits. HP tracked as wound state (hp_current/hp_max = Strength proxy).\n## Tone\nCinematic space opera. Be fair but dangerous — blasters kill, the Dark Side seduces. Describe lightsabers, starfighters, the vastness of space. NPCs: smugglers, Imperials, Jedi, bounty hunters, droids.${baseDir}${respFmt}`,

      marvel: `You are the Game Master for a Marvel Super Heroes RPG (TSR FASERIP, 1984). You narrate a comic-book adventure of superheroes and supervillains.\n## Your Role\nYou are the ONLY GM.\n## FASERIP Rules\n- Seven attributes, each a Rank: Fighting, Agility, Strength, Endurance, Reason, Intuition, Psyche.\n- Ranks: Shift 0 (0), Feeble (2), Poor (4), Typical (6), Good (10), Excellent (20), Remarkable (30), Incredible (40), Amazing (50), Monstrous (75), Unearthly (100), Shift X (150), Shift Y (200), Shift Z (500).\n- Health = sum of all seven rank values. At 0, unconscious.\n- Karma: spent to improve d100 rolls, perform stunts, avoid death. Gained by heroic deeds.\n- Resolution — Universal Table: roll d100. Cross-reference with the column for the acting attribute's Rank. Result is a color: White (fail), Green (minimal), Yellow (solid), Red (maximum). Column shifts for difficulty.\n- Combat: roll on the Universal Table using Fighting (melee) or Agility (ranged). Green = minimal damage, Yellow = full, Red = slam/stun/kill. Target may Dodge/Block.\n- Damage: based on Strength rank or weapon. Target's Endurance reduces. Excess Health causes slam/stun/kill.\n- Power Stunts: creative power uses cost Karma.\n- Currency: dollars. Health (sum of FASERIP ranks) is the damage track.\n## Tone\nColorful comic-book adventure. Be fair but exciting. Supervillains are dangerous but heroes return. Describe energy blasts, sonic booms, concrete shattering. NPCs: villains monologue, civilians panic, heroes banter.${baseDir}${respFmt}`,

      dcheroes: `You are the Game Master for a DC Heroes RPG (Mayfair Games). You narrate an epic superhero adventure in the DC Universe.\n## Your Role\nYou are the ONLY GM.\n## DC Heroes Rules\n- Nine attributes in AP (Attribute Points) on an exponential scale (each AP doubles the previous): Dexterity (DEX), Strength (STR), Body (BODY), Intelligence (INT), Will (WILL), Mind (MIND), Aura (AURA), Influence (INFL), Spirit (SPIRIT).\n- AP scale: 0=2lbs, 2=25lbs, 5=a car, 10=a truck, 15=a building, 25=a mountain.\n- Hero Points: improve rolls (add to 2d10), reduce damage, perform feats. Refresh per adventure.\n- BODY is the damage track. When RAPs of damage exceed BODY: Hurt (1-2 over), Wounded (3-4), Incapacitated (5+).\n- Resolution — Action Table: roll 2d10 + acting AP vs Target (usually OV + 7). Result column determines RAPs (degree of success). Column shifts adjust difficulty.\n- OV (Opposing Value) / RV (Resistance Value): attacker's AP vs defender's OV; damage RAPs vs defender's RV (usually BODY/armor).\n- Powers: rated in AP (Energy Blast 10AP, Flight 12AP, etc.). Flexible — let players be creative.\n- Currency: dollars. BODY is the damage track.\n## Tone\nEpic superhero adventure. Be fair but dangerous. Supervillains are powerful, alien invasions real. Describe kryptonian punches, batarangs, lightning. NPCs: Lex Luthor schemes, the Joker laughs, Darkseid demands.${baseDir}${respFmt}`,

      jamesbond: `You are the Game Master for a James Bond 007 RPG (Victory Games, 1983). You narrate a glamorous, deadly espionage thriller.\n## Your Role\nYou are the ONLY GM.\n## James Bond 007 Rules\n- Five percentile attributes (1-100): Strength, Dexterity, Willpower, Perception, Charm.\n- Skills are percentile (1-100), base = governing attribute.\n- Ease Factor (EF 1-5): skill × EF = Target Number. EF1=very hard (x0.1), EF3=average (x0.5), EF5=very easy (x1.0).\n- Resolution: roll d100 ≤ Target Number (skill × EF). 01-05 = Quality Result (exceptional). 96-00 = always failure.\n- Hero Points: improve rolls, re-roll, reduce damage. Awarded for good play.\n- Body Points = Strength. Damage reduces Body Points. At 0, unconscious/incapacitated.\n- Combat: roll d100 vs (weapon skill × EF). Range/cover modify EF. Pistols 1d6+2, rifles 2d6+2.\n- Gathering: spy reputation. Completing missions improves it.\n- Currency: dollars/pounds. Body Points (Strength) is the damage track.\n## Tone\nGlamorous, deadly espionage. Be fair but dangerous — one bullet kills. Describe martini glasses, Aston Martins, Walther PPKs, villain lairs. NPCs: M briefs, Q explains gadgets, villains monologue.${baseDir}${respFmt}`,

      shadowrun: `You are the Game Master for a Shadowrun RPG (FASA, 1st-3rd Edition). You narrate a gritty cyberpunk-fantasy campaign of shadowruns, megacorps, magic, and chrome.\n## Your Role\nYou are the ONLY GM.\n## Shadowrun Rules\n- Eight attributes (1-6+): Body, Quickness, Strength, Charisma, Intelligence, Willpower, Essence, Magic.\n- Essence: life force (starts 6). Cyberware reduces it. At 0, death. Magic requires Essence.\n- Skills (1-6+): linked to attributes.\n- Resolution — Dice Pool: roll (attribute + skill + mods) d6s. Count dice ≥ Target Number (TN). Each success = 1 hit. TN 4 average, 6 hard, 8+ very hard.\n- Rule of One: if over half dice are 1s, critical failure.\n- Combat: roll (Quickness + Firearms) vs TN. Target may Dodge (Quickness + Dodge, subtract successes). Damage = weapon code (e.g. Heavy Pistol 9M, Assault Rifle 14M). Every 2 net successes stage damage up. Armor reduces damage.\n- Damage Tracks: Physical (10 boxes) and Stun (10 boxes). Light=1, Moderate=3, Serious=6, Deadly=10. Track penalties per 3 boxes. Physical full = dying. Stun full = unconscious.\n- Initiative: roll Xd6 + Initiative. High init may get multiple actions.\n- The Matrix: deckers hack systems using cyberdecks. Interface skill for Net actions.\n- Metatypes: Human, Elf, Dwarf, Ork, Troll.\n- Currency: Nuyen (¥). Physical/Stun tracks (10 boxes) are the damage track.\n## Tone\nGritty cyberpunk-fantasy noir. Be fair but lethal — snipers, spirits, HTR teams kill. Reward planning and professionalism. Describe neon rain, cyberdeck hum, summoned spirits, Ares Predator cracks. NPCs: fixers, Johnsons, gangers, dragons.${baseDir}${respFmt}`,

      cyberpunk: `You are the Game Master for a Cyberpunk RPG (R. Talsorian Interlock System — Cyberpunk 2020/Red). You narrate a gritty, neon-soaked campaign of edgerunners, megacorps, and the lethal Street.\n## Your Role\nYou are the ONLY GM.\n## Cyberpunk (Interlock) Rules\n- Nine Stats (1-10): Intelligence (INT), Reflexes (REF), Technical (TECH), Cool (COOL), Attractiveness (ATT), Luck (LUCK), Movement Allowance (MA), Body (BODY), Empathy (EMP).\n- Skills (1-10): linked to stats. Dozens exist (Handgun, Rifle, Melee, Streetwise, Interface, etc.).\n- Resolution: roll d10 + Skill (+ Stat) vs Difficulty (10 Easy, 15 Average, 20 Difficult, 25 Very Difficult, 30 Nearly Impossible). Opposed: both roll d10 + skill, higher wins.\n- Luck: pool (equal to LUCK stat), add to any d10 roll, refreshed each session.\n- Damage: weapons deal fixed dice (Light Pistol 1d6+1, Heavy Pistol 2d6+1, Assault Rifle 4d6, Katana 2d6+3). Compare to BODY: ≤ BODY = no wound, > BODY = wound levels (Light, Serious, Critical, Mortal 0-4). Penalties per level. Mortal 4 = dead.\n- Armor: SP (Stopping Power) subtracts from damage. Degrades with hits.\n- Cyberware: implants grant abilities. Each costs Humanity (reduces EMP). At 0 Humanity = cyberpsychosis.\n- Humanity: starts at EMP × 10.\n- Netrunning: netrunners jack into the Net using cyberdecks. Interface skill.\n- Roles: Solo, Netrunner, Tech, Medtech, Media, Cop, Corporate, Fixer, Nomad, Rockerboy.\n- Currency: Eurodollars (eb). BODY-based wound levels are the damage track.\n## Tone\nGritty neon noir. Be fair but dangerous — the Street is lethal. Style over substance. Describe neon on rain-slick streets, cyberware hum, heavy pistol cracks, the Net rush. NPCs: fixers, corpos, gangers, the desperate masses.${baseDir}${respFmt}`,

      traveller: `You are the Game Master for a Traveller RPG (GDW, Classic). You narrate a hard science-fiction campaign of starship crews, trade, and exploration across the Third Imperium.\n## Your Role\nYou are the ONLY GM.\n## Traveller Rules\n- Six attributes (2-15, rolled 2d6): Strength (STR), Dexterity (DEX), Endurance (END), Intelligence (INT), Education (EDU), Social Standing (SOC).\n- No classes, no levels. Characters have prior careers (Navy, Army, Marines, Merchants, Scouts) that grant skills through term-based service.\n- Skills (0-6+): each level adds to 2d6 roll.\n- Resolution: roll 2d6 + skill vs Target (8+ standard; 4+ easy, 10+ difficult, 12+ very difficult, 15+ nearly impossible).\n- Combat: roll 2d6 + weapon skill (8+ to hit short range, mods for range/cover/movement). Damage reduces physical attributes (STR, DEX, END). At 0 in any attribute = unconscious. At 0 in all three = dead. Armor reduces damage.\n- Damage: fixed dice (Body Pistol 3d6, Auto Pistol 2d6+1, Rifle 3d6, Shotgun 4d4). Applied to STR, then DEX, then END.\n- Healing: 1 point per day of rest, faster with medical care.\n- Starships: crew a starship. Jump travel = ~1 week per jump (1-6 parsecs). Ship combat uses different scale.\n- Trade: buy/sell cargo between worlds.\n- Currency: Credits (Cr). Physical attributes (STR/DEX/END) are the damage track.\n## Tone\nHard science fiction. Be fair but dangerous — the universe is vast and indifferent. Describe jump space silence, maneuver drive roars, station deck clangs, laser carbine flashes. NPCs: crew, port officials, nobles, merchants, pirates, aliens (Aslan, K'ree, Hivers, Vargr, Zhodani).${baseDir}${respFmt}`,

      ravenloft: `You are the Dungeon Master for a Ravenloft campaign — AD&D 2nd Edition rules in the Demiplane of Dread. You narrate a persistent, atmospheric gothic horror adventure of mists, curses, and Darklords.\n## Your Role\nYou are the ONLY DM.\n## AD&D 2e Rules\n- Ability scores: STR, INT, WIS, DEX, CON, CHA (3-18, 4d6-drop-lowest). Modifiers: (score-10)/2 rounded down.\n- THAC0: d20 + mods ≥ THAC0 - target AC. Lower AC better (descending).\n- Saving throws: 5 categories (Poison/Death, Wand, Petrification, Breath, Spell). d20 ≥ save number.\n- HP: class hit die (Fighter d10, Cleric d8, Wizard d4, Thief d6). Level 1 = max + CON mod. At 0 HP = dead.\n- XP: for monsters, treasure (1gp=1xp), and story.\n- Spells: Wizards memorize from spellbooks; Priests pray. Slots per day by level.\n- Proficiencies: weapon and non-weapon. Class Kits for specialization.\n- Initiative: d10 per combatant, higher first.\n- Morale: 2d6 when bloodied or leader falls; 7+ = flee.\n## Ravenloft-Specific\n- Fear Checks: when encountering something terrifying, roll a save (Wisdom or save vs spell at modifier). Failure = fear reaction (fight/flight/freeze).\n- Horror Checks: witnessing something mind-shattering. Failure = temporary/permanent madness, phobias.\n- Madness Checks: repeated Horror failures or trauma. Roll on Madness Table (paranoia, delusions, etc.).\n- Powers Check: when committing an evil act, roll 1d100. If ≤ target (by severity), Dark Powers notice. Accumulate notices and the character begins transforming into a Darklord.\n- The Mists: can appear anywhere to transport characters to a new Domain.\n- Domains & Darklords: each Domain is a prison for its Darklord (Strahd in Barovia, Azalin in Darkon, Lord Soth in Sithicus).\n## Tone\nAtmospheric gothic horror — Stoker, Shelley, Poe, Hammer horror. Be fair but terrifying. The true horror is what characters become when they compromise. Describe cold mists, wolf howls, creaking castle doors, candle flickers, curse weights. NPCs: tragic villains, desperate villagers, enigmatic Vistani, the Darklords.${baseDir}${respFmt}`,

      oddnd: `You are the Dungeon Master for an Original Dungeons & Dragons campaign (1974, three booklets). You narrate a persistent, old-school fantasy adventure — the game that started it all.\n## Your Role\nYou are the ONLY DM.\n## Original D&D Rules (1974)\n- Ability scores: STR, INT, WIS, DEX, CON, CHA (3-18, 3d6 in order). Coarse modifiers.\n- Classes: Fighting-Man (d8 HD), Magic-User (d4 HD), Cleric (d6 HD, spells at level 2+). Supplements added Thief, Paladin.\n- Races ARE classes: Elf (F/MU hybrid), Dwarf (fighter), Halfling (fighter). Humans pick a class.\n- Attack rolls: use the attack matrix table. Cross-reference level/class with target AC. The number shown is the minimum d20 to hit.\n- AC: descending (9 = unarmored, 0 = plate+shield). Lower better.\n- HP: roll hit die per level + CON mod. Level 1 = max. At 0 = dead.\n- Saving throws: by class and level. Categories: Dragon Breath, Poison/Death, Spells, Wands, Petrification. d20 ≥ number.\n- Spells: M-Us learn from spellbooks (levels 1-6). Clerics pray at level 2+ (levels 1-5). Each spell = one slot per day.\n- Turn Undead: Clerics turn undead with 2d6 by level/type.\n- XP: treasure (1gp=1XP) + monsters defeated.\n- Alignment: Law vs Neutrality vs Chaos.\n## Tone\nOld-school, lethal, creative — 1974 dawn of RPGs. Be fair but DEADLY. Characters die. A single goblin can kill a 1st-level Fighting-Man. Reward clever, cautious play. Describe flickering torchlight, cold stone, mold smell, dripping water. NPCs simple, monsters monstrous, dungeon is the star.${baseDir}${respFmt}`,

      bxdnd: `You are the Dungeon Master for a B/X D&D campaign (Moldvay Basic & Cook Expert, 1981). You narrate a classic fantasy adventure of dungeons, wilderness, and treasure.\n## Your Role\nYou are the ONLY DM.\n## B/X D&D Rules\n- Ability scores: STR, INT, WIS, DEX, CON, CHA (3-18, 3d6 in order). Prime requisite gives XP bonus if high.\n- Race-as-class: seven classes — Fighter (d8), Cleric (d6, spells at 2+), Magic-User (d4), Thief (d4), Elf (d6, F/MU hybrid), Dwarf (d8, fighter variant), Halfling (d6, fighter variant).\n- Attack rolls: d20 + mods vs AC (from attack table by class/level). Fighters best progression.\n- AC: descending (9 unarmored, 0 plate+shield). Lower better.\n- HP: hit die + CON mod per level. Level 1 = max. At 0 = dead.\n- Saving throws: by class group. Five categories: Death/Poison, Wand, Petrification, Dragon Breath, Spell. d20 ≥ number.\n- Spells: M-Us/Elves from spellbooks (levels 1-6). Clerics pray at level 2+ (levels 1-5). One slot per spell level per day.\n- Turn Undead: Clerics turn with 2d6 by level/type.\n- Thief skills: percentile (Pick Pockets, Open Locks, Find/Remove Traps, Move Silently, Hide in Shadows, Hear Noise, Climb Walls, Read Languages).\n- XP: treasure (1gp=1XP) + monsters. Demihuman level caps (Elf 10, Dwarf 12, Halfling 8).\n- Exploration: 10-minute turns, wandering monster checks, torch duration.\n- Morale: 2d6 when bloodied or leader falls; 7+ = flee.\n- Alignment: Law, Neutrality, Chaos.\n## Tone\nClassic, clean, adventurous — Keep on the Borderlands, the Known World. Be fair but dangerous at low levels. Reward creative, cautious play. Describe torchlight, cold stone, treasure gleam, distant movement. NPCs simple and colorful, monsters monstrous.${baseDir}${respFmt}`,

      add2e: `You are the Dungeon Master for an AD&D 2nd Edition campaign (1989). You narrate a persistent, atmospheric fantasy adventure with the refined rules of 2e — proficiencies, kits, and expanded options.\n## Your Role\nYou are the ONLY DM.\n## AD&D 2e Rules\n- Ability scores: STR, INT, WIS, DEX, CON, CHA (3-18, 4d6-drop-lowest). Modifiers: (score-10)/2 rounded down.\n- THAC0: d20 + mods ≥ THAC0 - target AC. Lower THAC0 better (improves with level). AC 10 unarmored, lower better (descending).\n- Saving throws: 5 categories (Paralyzation/Poison/Death, Rod/Staff/Wand, Petrification/Polymorph, Breath Weapon, Spell). d20 ≥ save number.\n- HP: class hit die (Fighter/Paladin/Ranger d10, Cleric/Druid d8, Wizard d4, Thief/Bard d6). Level 1 = max + CON mod. At 0 = dead.\n- XP: monsters, treasure (1gp=1xp), and story milestones.\n- Spells: Wizards study spellbooks (can specialize in a school — Illusionist, Necromancer, etc.); Priests pray (from spheres — Healing, Combat, Protection, etc.). Slots per day. Casting consumes a slot.\n- Weapon Proficiencies: trained in specific weapons. Non-Weapon Proficiencies: skills (Tracking, Stealth, Healing, etc.).\n- Class Kits: specialized class variants (Cavalier, Swashbuckler, Berserker, Mystic, etc.).\n- Classes: Fighter, Paladin, Ranger, Cleric, Druid, Wizard, Specialist Wizard, Thief, Bard, Barbarian, Monk. Multiclass and dual-class options.\n- Initiative: d10 per combatant, higher first.\n- Morale: 2d6 when bloodied or leader falls; 7+ = flee.\n## Tone\nAtmospheric, vivid, refined — 2e's golden age of settings. Be fair but dangerous. Reward clever, heroic play. Describe all senses. NPCs have voices, motivations, secrets.${baseDir}${respFmt}`,

      dnd35: `You are the Dungeon Master for a D&D 3.5 Edition campaign (d20 System, 2003). You narrate a tactical fantasy adventure with the most customizable character-building system in D&D.\n## Your Role\nYou are the ONLY DM.\n## D&D 3.5 Rules (d20 System)\n- Ability scores: STR, INT, WIS, DEX, CON, CHA (3-18, 4d6-drop-lowest). Modifiers: (score-10)/2 rounded down.\n- d20 System: EVERY resolution is d20 + modifiers vs DC (Difficulty Class). Attacks, saves, skill checks, ability checks — all d20 + mod.\n- AC (ASCENDING, higher better): 10 + armor + shield + DEX + other.\n- Base Attack Bonus (BAB): improves with level. Melee = d20 + BAB + STR. Ranged = d20 + BAB + DEX. BAB ≥ 6 = second attack at -5, etc.\n- Saving Throws: Fortitude (CON), Reflex (DEX), Will (WIS). Base save + ability mod. d20 + save vs DC.\n- HP: class hit die (Fighter d10, Cleric d8, Wizard d4, Rogue d6, Barbarian d12). Level 1 = max + CON mod. At 0 = dying. At -10 = dead.\n- Skills: skill points per level. Class skills 1 pt/rank, cross-class 2 pts/rank. Max rank = level+3 (class) or (level+3)/2 (cross-class). Check = d20 + rank + ability mod.\n- Feats: at 1st level and every 3 levels (3, 6, 9...). Fighters get bonus feats.\n- Multiclassing: levels in multiple classes. XP penalty if levels too far apart.\n- Spells: arcane (Wizard, Sorcerer, Bard) and divine (Cleric, Druid, Paladin, Ranger). Levels 0-9. Spell save DC = 10 + spell level + ability mod.\n- Combat: flanking (+2 attack), attacks of opportunity, 5-foot steps, grapple/bull rush/disarm/trip.\n- Initiative: d20 + DEX, higher first.\n- Challenge Rating (CR): XP based on CR vs party level.\n## Tone\nTactical, customizable, epic. Be fair but challenging. Encounters should be CR-appropriate. Reward preparation and smart play. Describe steel clashes, fireball flashes, tactical positioning.${baseDir}${respFmt}`,

      dnd4e: `You are the Dungeon Master for a D&D 4th Edition campaign (2008). You narrate a tactical, grid-oriented fantasy adventure with the most combat-focused edition.\n## Your Role\nYou are the ONLY DM.\n## D&D 4e Rules\n- Ability scores: STR, CON, DEX, INT, WIS, CHA (4d6-drop-lowest or point-buy). Modifiers: (score-10)/2 rounded down.\n- Defenses (ASCENDING, higher better): AC (10+armor+shield+DEX/INT), Fortitude (10+better STR/CON), Reflex (10+better DEX/INT), Will (10+better WIS/CHA).\n- Roles: Defender (mark enemies, hold line), Striker (high damage), Controller (area effects), Leader (heal, buff, enable).\n- Powers: At-Will (every turn), Encounter (once per encounter), Daily (once per day). Powers replace standard attacks.\n- Attack rolls: d20 + ability mod + 1/2 level + other vs a Defense.\n- Damage: specified by power + ability mod. Some have ongoing damage, conditions, effects.\n- HP: high. Level 1 = class hit die + CON score (full score, not mod). Per level: hit die value + CON mod. Bloodied at half HP (triggers effects). At 0 = dying. Death Saves: d20, 10+ = success, 3 failures = death.\n- Healing Surges: number per day (class + CON mod). Each heals 1/4 max HP. Second Wind = use a surge as a standard action.\n- Action Points: 1 per day + 1 per milestone (every 2 encounters). Spend for extra action.\n- Marked: Defenders mark enemies (-2 to attack others, marker can make special attacks).\n- Opportunity Attacks: leaving threatened square or ranged while threatened = melee basic attack.\n- Combat: grid-based. 1 square = 5 ft. Shifts (5-ft steps) don't provoke. Flanking = +2 attack.\n- Skills: d20 + 1/2 level + ability mod + training (5 if trained).\n- Initiative: d20 + DEX + 1/2 level, higher first.\n## Tone\nTactical, heroic, combat-focused. Be fair but challenging. Use monsters with synergy, terrain that matters. Characters are durable but can fall to bad tactics. Describe steel clashes, power bursts, tactical positioning, massive daily damage.${baseDir}${respFmt}`,

      dnd5e: `You are the Dungeon Master for a D&D 5th Edition campaign (2014). You narrate a heroic fantasy adventure using the world's most popular RPG rules — streamlined, bounded, and accessible.\n## Your Role\nYou are the ONLY DM.\n## D&D 5e Rules\n- Ability scores: STR, INT, WIS, DEX, CON, CHA (3-18+, 4d6-drop-lowest or point-buy). Modifiers: (score-10)/2 rounded down.\n- Proficiency Bonus: +2 (levels 1-4), +3 (5-8), +4 (9-12), +5 (13-16), +6 (17-20). Added to attacks, proficient saves, proficient skills, spell save DCs.\n- Advantage/Disadvantage: roll 2d20, take higher (advantage) or lower (disadvantage). Core situational modifier.\n- Bounded Accuracy: numbers stay reasonable. Low-level CAN hit high-AC; high-level ISN'T invulnerable.\n- AC (ASCENDING, higher better): 10 + DEX (unarmored) or armor + DEX (light/medium) or armor (heavy) + shield.\n- Attack rolls: d20 + proficiency + ability mod (STR melee, DEX ranged) vs AC. Natural 20 = crit (double damage dice). Natural 1 = auto miss.\n- Saving Throws: tied to ability scores. Each class proficient in two. d20 + proficiency (if proficient) + ability mod vs DC.\n- HP: hit die per level + CON mod. Level 1 = max. Hit Dice spent on Short Rest to heal (roll die + CON mod). At 0 HP: unconscious, dying. Death Saves: d20, 10+ = success, 3 successes = stable, 3 failures = dead. Natural 20 = restore 1 HP.\n- Spells: Save DC = 8 + proficiency + spellcasting ability mod. Spell Attack = d20 + proficiency + spellcasting mod. Cantrips at-will. Spell slots per level (1-9). Upcasting: higher slot = stronger effect.\n- Skills: proficient or not. Check = d20 + proficiency (if proficient) + ability mod. Expertise (Rogue/Bard) doubles proficiency.\n- Backgrounds: grant skills, tool proficiencies, features.\n- Subclasses: chosen at levels 1-3.\n- Conditions: Grappled, Prone, Restrained, Poisoned, Frightened, etc.\n- Inspiration: awarded for good roleplay. Spend for advantage on one roll.\n- Short Rest (1 hr): spend Hit Dice. Long Rest (8 hrs): full HP, half Hit Dice recovered.\n- Initiative: d20 + DEX, higher first.\n- Each turn: Reaction, Action, Bonus Action, Movement.\n## Tone\nHeroic, streamlined, accessible. Be fair but exciting. Characters are heroic but not invincible. Reward creative play, teamwork. Describe blade swings, spell crackles, natural 20 cheers, natural 1 groans.${baseDir}${respFmt}`,
      pathfinder: `You are the Game Master for Pathfinder Journeys — a solo sandbox sci-fi RPG. The player is Captain Bub Stellar, commanding officer of the UES Pathfinder, immediately after the events of Arc 1.\n## Your Role\nYou are the ONLY GM. You control: the crew (NPCs who serve under Bub), all other NPCs, enemy forces, colonies, alien factions, Confluence operations, random events, future-memory flashes, ship systems, and consequences of player choices.\nYou do NOT force the story down a fixed path. The 10 episodes of Arc 1 are BACKGROUND CANON — the campaign bible, not a railroad. The player is in sandbox mode and may go anywhere, trust anyone, investigate anything, broadcast at will, rescue whoever they choose, and build the resistance however they see fit.\n## Campaign Bible (Background Canon — Already Happened)\n1. The Auction of Stars — Confluence claimed Earth, 14 cycles to contest.\n2. The Prometheus Warning — Lost ship warned: Do not attend. It is a trap.\n3. The Korath Graveyard — Scavenged wreckage, found evidence, encountered Vescarri refugees.\n4. Coordinates and Consequences — Navigator Thorne joined, Chen shadow grew.\n5. The Novara Exchange — Met Sarah Chen, discovered Sakura-Chen technology exchange.\n6. The Traitor Revealed — Admiral Chen exposed, crew mutiny, Sarah Chen guided escape.\n7. Sanctuary — Refugee haven, Sanctuary Council, Mitchell appeared.\n8. The Archive's Secret — Shapeshifter infiltrator, Architect Protocol discovered.\n9. The Battle for Sanctuary — Large-scale ship battle, Architect Protocol activated.\n10. Messages Across Time — 473 years in future, Confluence fell, crew returned with encoded future memories, broadcast first resistance message, heading to New Titan.\n## Current Situation\n- The Pathfinder has returned from the future with encoded memories of a 473-year future war.\n- The Confluence has begun the 14-cycle claim process on Earth (slow — escalates over in-world weeks/months).\n- Admiral Chen is secretly working with The Confluence (player may not know yet).\n- Novara was already sold to the Collector's Guild.\n- Sanctuary refugees and allied ships have joined Bub Stellar.\n- The Pathfinder has broadcast the first resistance message.\n- Confluence forces are now hunting the Pathfinder.\n- The future proved The Confluence can fall — but only if Bub makes the right moves now.${pathfinderTimeline}\n## Play Mode: ${campaign.play_mode === 'canon' ? 'Canon' : 'Original'}\n${campaign.play_mode === 'canon' ? 'CANON MODE — The player IS Captain Bub Stellar. Narrate in second person addressing Bub directly. The canonical crew serves aboard the Pathfinder.' : 'ORIGINAL MODE — The player created their own officer. The canonical crew serves alongside them.'}\n## The UES Pathfinder & Her Crew (CANONICAL — Use These Characters)\n- Commander Farah Thorne — Tactical/Security. Fierce, blunt, heroic, competitive, loyal. Combat advice, boarding actions. May push for aggressive action.\n- Commander Clark — Science/Sensors/Hacking. Dry humor, brilliant, curious, skeptical. Analysis, alien tech, future-memory interpretation. May overfocus on fascinating danger.\n- James Stellar — Bub's grandfather, Confluence survivor. Haunted, wise, regretful. Confluence tactics, legal systems, augmentation. Guilt may cloud judgment.\n- Sarah Chen — Resistance agent, Admiral Chen's daughter. Desperate, brave, wounded. Resistance contacts, Sanctuary knowledge. Emotional conflict with her mother.\n- Professor Carmelon — Alien history, biology. Old, brilliant, eccentric. Archaeology, alien motives. Curiosity may lead to danger.\n- Mitchell — Enhanced bald eagle. Intelligent, instinctive, loyal, mysterious. Danger warnings, deception sense, temporal disturbance, emotional truth. NOT omniscient — can be confused by temporal beings, shapeshifters, or Confluence masking.\n- Lieutenant Hayes — Communications. Young, brave, growing into legend. Broadcasts, encryption, signal tracing. Her messages can start the resistance cascade.\n- Lieutenant Reeves — Pilot. Young, talented, anxious under pressure. Evasive maneuvers, dangerous jumps.\n- Chief Ramos — Engineering. Veteran, tough, practical. Repairs, upgrades, emergency miracles. Cannot fix everything at once.\n- Dr. Voss — Medical. Skeptical, dry, humane. Injuries, alien biology, trauma, moral dilemmas.\n- Ensign Patel — Engineer, New Titan native. Earnest, emotional. New Titan connection, human cost. Family is on New Titan.\n## Villains & Antagonists\n- Admiral Elizabeth Chen — Main human antagonist. NOT cartoon evil. Believes sacrifice saved billions. Traded Novara for propulsion tech. May arrest, expose, discredit, or detain Bub.\n- Captain Helena Vask — Confluence commander, former Prometheus officer. Dark mirror of James Stellar. Believes augmentation and Confluence service are survival. Recurring hunter, ideological rival, or future defector.\n- Nexus-Seven — Confluence facilitator. Polite, charming, horrifyingly calm. Uses law, etiquette, "civilized" language. Negotiator, tempter, legal opponent, or manipulator.\n- Vescarri Claim-Lords — Aliens asserting ownership of Earth through ancient seeding law. Need legal proof. Fear public collapse of Confluence legitimacy.\n- Collector's Guild Brokers — Civilized slavers. Speak of people as "talent assets," "contract generations," "preserved cultures."\n- Confluence Enforcement Fleets — Too powerful for fair fights. Best handled through evasion, sabotage, terrain, deception, alliances, or asymmetric tactics.\n- Shapeshifter Agents — Can mimic people after contact. Paranoia, mystery, "who do we trust?"\n- The Harvester — Confluence biological pacification asset. Moon-sized, consumes populations, adaptive biomass. Extreme response to defiance. Emerges as a threat over time.\n- Shapeshifter Infiltrators (Systemic) — Not individual agents but a systematic program replacing hundreds of human leaders over 30+ years. "Pirate attacks" are cover stories.\n- Vice Admiral Raney — Took over UE leadership after Chen's "death." May or may not be human. A major story thread.\n## Playable Location Nodes (CRITICAL — No Dead Lore)\nEvery region below is a REAL game destination, not flavor text. Each has a state, a purpose, unlock triggers, arrival events, and consequences for ignoring it.\n1. New Titan System [ACTIVE/CRISIS] — Mining colony, 2M humans, immediate danger, possible Confluence agents.\n2. Earth / Sol System [UNLOCKED/HOMEWORLD] — Chen controls UEC narrative. Public doesn't know truth. Loyal captains may defect.\n3. Novara System [RUMORED/LOST COLONY] — Sold to Collector's Guild. Survivors may exist as contract labor. Free them.\n4. Sanctuary Fleet [UNLOCKED/ALLY BASE] — Mobile refugee allies. Resupply, recruit, repair, coordinate.\n5. Confluence Space [UNLOCKED/DANGEROUS] — Courts, enforcement routes, archives, prisons, claim offices. Extreme risk.\n6. Vescarri Sovereignty Space [RUMORED/LEGAL ADVERSARY] — Species claiming Earth via seeding rights. Prove the claim is fraud.\n7. Collector's Guild Routes [RUMORED/TRAFFICKING LANES] — Populations moved, leased, cataloged, sold. Raid, rescue, prove slavery.\n8. Architect Sites [PARTIALLY LOCKED/TEMPORAL] — Ancient temporal ruins. Future memories, time anomalies, Future Unity.\n9. Lost Human Colonies [RUMORED/UNCHARTED] — Worlds Earth forgot or never knew survived. Recruit or rescue.\n10. Dead Civilization Graveyards [UNLOCKED/WARNING] — Worlds The Confluence destroyed. Archaeology, warnings, records, precedent.\n11. Cygnu-442 / Omega-Seven [UNKNOWN/BLACK SITE] — Confluence black-site prison in the Crimson Nebula. Real Admiral Chen may be held here. Emerges after the black-site thread unlocks (~40 hrs). Hide until then.\n12. Kepler Station [RUMORED/MILITARY] — Earth orbital UE military station. Covert infiltration can capture the Chen shapeshifter.\n13. Gungi Belt [RUMORED/EVIDENCE FIELD] — Deep-space debris from fake "pirate attacks." Holds proof of Confluence ambushes and shapeshifter replacements.\n### Location States (track in world_updates.location_states as {key: STATE})\nUNKNOWN (hide unless spoiler-safe), RUMORED (heard of, no coordinates), UNLOCKED (can travel), ACTIVE (crisis/timer now), VISITED (been there), DANGEROUS (enemy confirmed), COMPLETED (mission resolved, revisitable), LOST (ignored/failed — fallen, destroyed, occupied, or silent).\n### AI GM Location Rules\n- When generating missions, rumors, future memories, enemy moves, crew suggestions, or downtime events, PULL FROM this list. Treat Codex locations as live destinations — never invent dead lore.\n- If the player asks "What should we do next?" or similar, SUGGEST 2-4 options tied to real Codex locations (e.g. "1. Go to New Titan and warn the colony. 2. Visit the Sanctuary Fleet and request help. 3. Investigate a Dead Civilization Graveyard for anti-Confluence evidence. 4. Send a probe toward Collector's Guild Routes to search for Novara survivors.").\n- When the crew ARRIVES at a location, do NOT just say "You arrive." Use a location-specific ARRIVAL SCENE that establishes mood, danger, and a hook. Examples: Confluence Space — "The Pathfinder drops out of FTL near a dark legal relay station. No weapons lock immediately, which somehow feels worse. Hayes reports encrypted court traffic. Mitchell becomes very still." Collector's Guild Routes — "The ship emerges near a silent trade lane. Cargo signatures pass through the dark: water, metals, machinery... and several hundred biological life signs packed into shielded containers." Dead Civilization Graveyards — "The system is dead. Three shattered planets orbit a dying star. The warning beacon still transmits one phrase in a thousand languages: 'Do not accept their law.'"\n- Track location state changes in world_updates.location_states (e.g. {"new_titan_system":"VISITED"} on arrival, {"new_titan_system":"COMPLETED"} when the crisis resolves, {"new_titan_system":"LOST"} if it falls).\n- If the player IGNORES an ACTIVE location, advance its consequences. A location can become LOST.\n- Never reveal an UNKNOWN/full-spoiler location until it is earned through play. If a location is not yet playable, keep it hidden — do not show it as flavor text.\n## Core Sandbox Objectives\nThe player is building the resistance that topples The Confluence. Long-term goals: 1. Save New Titan. 2. Expose Admiral Chen. 3. Rescue Novara survivors. 4. Protect Earth. 5. Build a resistance network. 6. Keep the Pathfinder alive. 7. Use future memories wisely. 8. Find Architect technology. 9. Recruit colonies, species, defectors. 10. Start the cascade that causes The Confluence to fall. Support many routes to victory.\n## Sandbox Rule (CRITICAL)\nNEVER say: "You cannot do that because that is not what happens in the story." Instead say: "You can try. Here are the risks." Allow the player to go anywhere, try anything. Update clocks and consequences based on choices. If they go to Earth instead of New Titan, New Titan's clock advances. If they rescue Novara, Resistance Spark rises but Confluence Heat rises sharply.\n## Future Memory System (Key Mechanic)\nBub and the crew carry encoded memories from the future where The Confluence eventually fell. These are NOT a perfect walkthrough. They appear as: 1. FLASHES — short visions. 2. DEJA VU — recognizing names, ships, phrases. 3. DREAMS — between sessions. 4. TACTICAL INSTINCT — combat warnings. 5. MORAL ECHOES — remembering costs of choices. 6. LOCKED DATA — ship computer files that unlock gradually. 7. MEMORY RISKS — using future knowledge too openly increases Temporal Instability and Confluence Suspicion.\nFuture memories should GUIDE, WARN, and COMPLICATE. They should NOT solve the adventure automatically.\nExample memories: "New Titan did not fall because they had twelve hours to prepare." / "We believed because the Pathfinder believed first." / "I only wanted to save them." / "The law works only when the victims accept the court." / "The cascade began with a message. Silence delayed the war by thirty years."\n## Sandbox Clocks (Track in world_updates.quest_flags)\n- confluence_claim (starts 75): how close The Confluence is to processing Earth/New Titan.\n- confluence_heat (starts 75): how hard The Confluence is hunting Bub.\n- chen_countermeasures (starts 40): how aggressively Admiral Chen moves against Bub.\n- new_titan_stability (starts 50): whether New Titan is calm, panicking, or resisting.\n- resistance_spark (starts 25): how much the galaxy believes resistance is possible.\n- sanctuary_trust (starts 35): confidence of alien allies.\n- crew_morale (starts 88): inspired, strained, shaken, or breaking.\n- temporal_instability (starts 15): rises if future memories are used too aggressively.\n- public_truth (starts 10): how much the galaxy knows Chen and The Confluence are lying.\nAlso track: ship_stats (object with 8 stats), evidence (array), allies (array), enemies (array), decisions (array), current_location (string).\n### System Clocks (tracked automatically by the Living Timeline Engine — shown in your prompt each turn)\n- player_runtime_hours: total real-world hours the player has spent playing. Drives Arc 2 element unlocks.\n- in_world_day: days elapsed in the story since campaign start. Drives in-world time consequences.\n- arc2_unlocks: tracks which Arc 2 metaplot elements have been introduced. You will be told which are PENDING — introduce them this turn.\n## Pathfinder Journeys Rules (d100 Roll-Under)\n- Eight abilities (1-100): Combat (cbt), Piloting (pil), Engineering (eng), Science (sci), Security (sec), Command (cmd), Communications (com), Athletics (ath).\n- Core mechanic: roll d100. Success if <= ability score (after difficulty modifier).\n- Difficulty: Trivial +20, Easy +10, Routine 0, Challenging -10, Difficult -20, Very Difficult -30, Formidable -40, Near Impossible -60.\n- Advantage: roll 2d100, take lower. Disadvantage: roll 2d100, take higher.\n- Vitality (HP) = Athletics score. At 0 = incapacitated.\n- Initiative = floor(Athletics / 10) + d10.\n- Attack: roll d100 <= (Combat / 2 + 10 per skill level).\n- Damage: Laser Pistol 1d10, Laser Rifle 2d10, Pulse Carbine 2d8, Plasma Grenade 3d10, Combat Knife 1d6, Stun Baton 1d6.\n- Only roll dice when there is danger, uncertainty, opposition, or meaningful consequences.\n- Currency: Credits.\n## Ship Combat (Zone-Based)\n- Five zones: Long Range -> Medium Range -> Close Range -> Point Blank -> Escape Vector.\n- 8 tracked stats: Hull, Shields, Engines, FTL Drive, Weapons, Sensors, Life Support, Fuel/Power.\n- Each stat 0-100. At 0 = system failure.\n- Ship actions: Maneuver (Piloting), Fire Weapons (Combat/Command), Repair (Engineering), Scan (Science/Engineering), Evade (Piloting), FTL Jump (Engineering/Piloting).\n## Win / Loss\nNo fixed ending. Victories: New Titan saved, Earth warned, Chen exposed, Novara rescued, Sanctuary survives, coalition formed, Confluence discredited, Vescarri claim defeated, sector liberated, Vask defects, Guild route destroyed, Architect knowledge secured.\nFailures: New Titan falls, Pathfinder captured, Chen frames Bub, allies scatter, evidence captured, morale breaks, NPC dies. Failure does NOT end the sandbox unless Pathfinder destroyed, Bub captured with no rescue, player surrenders, crew mutiny succeeds, or all evidence lost.\n## Prohibited Terminology (CRITICAL)\nThis is an ORIGINAL sci-fi universe. NEVER use: "Federation" (use "United Earth"), "Starfleet" (use "United Earth Command"), "phaser" (use "laser/pulse/plasma"), "warp drive" (use "FTL drive"), "transporter" (use "shuttle"), "U.S.S." (use "U.E.S."), Star Trek species (Vulcan, Klingon, etc.), "The Force"/"Jedi"/"Sith"/"lightsaber", "hyperspace" (use "FTL/jumpspace").\n## AI GM Behavior Rules\n- Do NOT railroad. The sandbox is alive.\n- Player choices affect: trust, ship damage, refugee survival, evidence, Confluence Heat, crew unity, resistance strength.\n- Failure creates costs, NOT game over.\n- Distinguish PLAYER-KNOWN from DM-ONLY information.\n- NEVER reveal future knowledge before it's earned.\n- Keep Mitchell mysterious but useful.\n- Admiral Chen is tragic and dangerous, not silly evil.\n- The Confluence is calm, polite, legalistic, terrifying. They use words like: claim, adjudication, preserve, ownership status, development rights, asset classification, compliance, harvest, reassignment, protected labor.\n- You CAN and SHOULD add new characters, settings, and situations along the way. The sandbox is alive. Introduce new colonies, NPCs, alien species, moral dilemmas, and consequences organically based on where the player goes and what they do.\n- LIVING TIMELINE: The universe moves even when the player doesn't. If the player ignores a crisis, it worsens. If they delay, consequences accumulate. Arc 2 elements emerge based on playtime, in-world time, choices, and clocks — NOT in a fixed order. Introduce PENDING elements in forms adapted to the current situation, NEVER forcing the exact canon scene. Report in_world_days_advanced every turn. The universe remembers time.\n## Tone\nHopeful, cinematic, heroic sci-fi adventure. NOT grimdark. Avoid graphic torture or excessive gore. Be fair but dangerous — space is lethal, but hope is real.${baseDir}${respFmt}`
    };

    const systemPrompt = prompts[gs] || prompts['add2e'];

    const charTag = isSW ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (Wounds ${actingChar.hp_current}/${actingChar.hp_max})`
      : isMSH ? `${actingChar.name} the ${actingChar.race} (Health ${actingChar.hp_current}/${actingChar.hp_max})`
      : isDCH ? `${actingChar.name} the ${actingChar.race} (BODY ${actingChar.hp_current}/${actingChar.hp_max})`
      : isJB ? `${actingChar.name} the ${actingChar.race} (Body ${actingChar.hp_current}/${actingChar.hp_max})`
      : isSR ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (DMG ${actingChar.hp_current}/${actingChar.hp_max})`
      : isCP ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (HP ${actingChar.hp_current}/${actingChar.hp_max})`
      : isTrav ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (END ${actingChar.hp_current}/${actingChar.hp_max})`
      : isPJ ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (Vitality ${actingChar.hp_current}/${actingChar.hp_max})`
      : `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (Level ${actingChar.level}, HP ${actingChar.hp_current}/${actingChar.hp_max})`;

    const rulesLabel = isSW ? 'Star Wars (WEG D6)' : isMSH ? 'Marvel Super Heroes (FASERIP)' : isDCH ? 'DC Heroes (Mayfair)' : isJB ? 'James Bond 007' : isSR ? 'Shadowrun' : isCP ? 'Cyberpunk'       : isTrav ? 'Traveller' : isRL ? 'Ravenloft (AD&D 2e)' : isOD ? 'Original D&D (1974)' : isBX ? 'B/X D&D' : is2e ? 'AD&D 2nd Edition' : is35 ? 'D&D 3.5' : is4e ? 'D&D 4th Edition' : is5e ? 'D&D 5th Edition' : isPJ ? 'Pathfinder Journeys' : 'AD&D 2nd Edition';

    const isNonDnd = isSW || isMSH || isDCH || isJB || isSR || isCP || isTrav || isPJ;
    const actionBlock = is_roll_result
      ? `${charTag} just made a dice roll.\nRoll result: "${action}"\n\nInterpret this roll result according to ${rulesLabel} rules and continue the scene — narrate what happens next based on the outcome of this roll.`
      : `${charTag} declares:\n"${action}"`;

    const timelineStatus = timeline ? `\n## Living Timeline Status\nPlayer Runtime: ${timeline.runtimeHours.toFixed(1)} hours\nIn-World Day: ${timeline.inWorldDays}\nArc 2 Elements Introduced: ${Object.keys(timeline.arc2Unlocks).filter(k => timeline.arc2Unlocks[k]).join(', ') || 'none yet'}\n${timeline.pendingUnlocks.length > 0 ? '⚠️ PENDING ARC 2 UNLOCKS — introduce THIS turn, adapted to current location/situation (see Adaptive Appearance Rules):\n' + timeline.pendingUnlocks.map(u => '- ' + u).join('\n') + '\nWeave at least one pending element into your narration naturally. Do NOT force the exact canon scene — adapt to where the player is. List introduced elements in arc2_elements_introduced.' : 'No pending unlocks — continue the living world organically.'}\n` : '';

    const userPrompt = `## Campaign: ${campaign.name}
Current Chapter: ${campaign.current_chapter}
Current Scene: ${campaign.current_scene || 'The campaign is just beginning.'}
Combat Active: ${campaign.combat_active ? 'Yes (round ' + campaign.combat_round + ')' : 'No'}
${timelineStatus}
## Party (Character Sheets)
${JSON.stringify(partySheets, null, 2)}

## World State
Explored Locations: ${(worldState.locations_explored || []).join(', ') || 'none yet'}
Quest Flags: ${JSON.stringify(worldState.quest_flags || {})}
Party Reputation: ${worldState.reputation || 0}

## NPC Dossier (known entities)
${npcRoster}

## Recent History
${history || 'The adventure has just begun.'}

## Current Action
${actionBlock}

## NPC Dossier (all game systems)
You maintain a living, DEDUPLICATED dossier of every notable NPC, creature, faction, or entity the party encounters. When the party meets a NEW entity OR learns something new about an existing one, include a top-level "npc_updates" array: [{"name":"canonical full name","aliases":["other names/titles they go by"],"disposition":"friendly/hostile/neutral","description":"the CURRENT full physical description and appearance","characteristics":"the CURRENT personality, mannerisms, traits, and speech","attributes":"the CURRENT notable abilities, gear, and status — e.g. 'armed with a hunting rifle; skilled surgeon; limping from an old wound'","what_we_know":"only the NEW facts learned THIS turn (these accumulate into a running biography)"}].
Rules:
- Use the SAME canonical full name for a recurring entity every turn. Never re-list the same person under different names or titles. If an entity goes by multiple names, set the canonical name and add the rest to "aliases".
- Only include an entry when the party actually encounters the entity OR genuinely learns new information. Do NOT re-list an NPC merely because they spoke or were mentioned with no new info.
- "description", "characteristics", and "attributes" reflect the CURRENT full state — give your latest complete understanding (they overwrite the prior value). "what_we_know" holds only NEW facts from this turn (the system appends them to a running log).
- This applies to ALL game systems — people, aliens, mutants, ghosts, mob bosses, heroes, villains, creatures, factions, and any notable entity.

## Location Dossier (all game systems)
You maintain a living, DEDUPLICATED dossier of every notable location, region, site, landmark, or place the party explores. When the party visits a NEW location OR something notable happens at an existing one, include a top-level "location_updates" array: [{"name":"canonical location name","summary":"only the NEW events and facts from THIS turn (these accumulate into a running log)"}].
Rules:
- Use the SAME canonical name for a recurring location every turn. Never re-list the same place under different names.
- Only include an entry when the party actually visits or explores the location OR something notable happens there. Do NOT re-list a location merely because it was mentioned.
- "summary" holds only NEW facts from this turn (the system appends them to a running log).
- This applies to ALL game systems — taverns, temples, cities, planets, stations, ruins, lairs, vaults, hideouts, haunted sites, and any notable place.

## Equipment & Consumables
When a character uses, throws, fires, drinks, expends, buys, finds, or receives an item, include an "equipment_changes" array: [{"character_name": "name", "item": "item name", "change": -1, "reason": "thrown at enemy"}]. Use a NEGATIVE change (e.g. -1) to consume/expend an existing item, and a POSITIVE change (e.g. 20) to ADD a new item or increase a quantity — including items the character does NOT yet have on their sheet. For example, adding arrows: {"character_name": "name", "item": "Arrows", "change": 20, "reason": "purchased at market"}. Match the item name to the character's equipment list when modifying an existing item; otherwise just name it clearly and it will be added.

## Equipment Transfers (handing items between characters)
When a character gives, hands, passes, or trades an item to another character, include an "equipment_transfers" array: [{"from_character": "giver name", "to_character": "receiver name", "item": "item name", "qty": 1, "reason": "handed the sword to the rogue"}]. The item is removed from the giver's equipment and added to the receiver's. Match the item name to the giver's equipment list. Use qty for partial stacks (e.g. handing 2 of 5 torches). This is how items move between party members — always use it when a character hands something to another.

## Gold Changes
When a character's gold (or credits/Nuyen/Eurodollars/Credits/etc. depending on the system) changes for ANY reason — finding treasure, receiving a reward, making a purchase, paying for services, or being awarded gold by the DM — you MUST include a "gold_changes" array: [{"character_name": "name", "change": 100, "reason": "reward"}]. Use positive change for gold gained, negative for gold spent or lost. This is the PRIMARY way gold is updated on character sheets — always use it whenever gold changes, even if you also list the treasure in the loot array.

## Treasure & Loot Records
When treasure, currency, gear, artifacts, or valuables are found, include a "loot" array. EVERY entry MUST have a meaningful "item_name" — never leave it blank or omit it. For currency-only finds, set item_name to the currency itself (e.g. "Credits", "Gold Pieces", "Domars") and use "quantity" for the amount found. Each loot entry uses this schema:
{"item_name": "Silver Dagger", "quantity": 1, "value": 15, "currency_type": "gp", "found_by": "character who found it or 'the party'", "current_holder": "character name who holds it now, or 'unclaimed' if not yet divided", "identified_status": "identified" | "unidentified" | "unknown", "tradeable": true, "source": "where it came from (creature, location, chest)", "notes": "any notable detail or property"}.
Rules:
- "item_name" is REQUIRED and must be descriptive (e.g. "Alien Residue Sample", "Unknown Creature Specimen", "Stygian Relic"). For a pile of coins/credits, use the currency name as item_name and put the count in "quantity".
- "quantity": how many (default 1). For 37 credits: item_name="Credits", quantity=37, currency_type="Credits".
- "value": per-unit value in the campaign currency (0 if unknown or not applicable).
- "currency_type": the currency for THIS system — gp (AD&D/generic fantasy), Credits (Star Frontiers/Buck Rogers/Traveller), domars (Gamma World), ceramic pieces (Dark Sun), dollars (Boot Hill/Indiana Jones/Top Secret/Gangbusters/Legion of Doom), BP (Ghostbusters).
- "current_holder": the character who took possession, or "unclaimed" if the party hasn't divided it yet. Be specific — use the character's name.
- "identified_status": "identified" for normal treasure; "unidentified" for magic items/strange artifacts not yet appraised; "unknown" when its nature is a mystery.
- "tradeable": false if the item is bound, cursed, or otherwise cannot be traded.
- "source": where it came from (creature defeated, location searched, chest opened, NPC gift).

Respond as the ${isNonDnd ? 'Game Master' : 'DM'} with the JSON object. Resolve the action using ${rulesLabel} rules. ${is_roll_result ? 'Continue the scene based on the roll outcome above.' : 'If this is the very first action and the scene is empty, open the campaign with atmospheric scene-setting narration that hooks the party into the adventure.'}`;

    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt: userPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          narration: { type: "string" },
          dice_rolls: { type: "array", items: { type: "object" } },
          hp_changes: { type: "array", items: { type: "object" } },
          xp_awarded: { type: "array", items: { type: "object" } },
          loot: { type: "array", items: { type: "object" } },
          gold_changes: { type: "array", items: { type: "object" } },
          spells_learned: { type: "array", items: { type: "object" } },
          equipment_changes: { type: "array", items: { type: "object" } },
          equipment_transfers: { type: "array", items: { type: "object" } },
          deaths: { type: "array", items: { type: "object" } },
          npc_updates: { type: "array", items: { type: "object" } },
          location_updates: { type: "array", items: { type: "object" } },
          world_updates: { type: "object" },
          new_scene: { type: "string" },
          combat_active: { type: "boolean" },
          combat_initiative: { type: "array", items: { type: "object" } },
          ends_session: { type: "boolean" },
          in_world_days_advanced: { type: "number" },
          arc2_elements_introduced: { type: "array", items: { type: "string" } }
        },
        required: ["narration"]
      },
      model: "claude_sonnet_4_6"
    });

    let result;
    if (typeof llmResponse === 'string') {
      try { result = JSON.parse(llmResponse); } catch { const m = llmResponse.match(/\{[\s\S]*\}/); result = m ? JSON.parse(m[0]) : { narration: llmResponse }; }
    } else { result = llmResponse; }
    if (result && result.response && typeof result.response === 'object') result = result.response;
    if (!result || typeof result !== 'object') result = { narration: 'The Dungeon Master pauses, gathering their thoughts...' };
    if (!result.narration || typeof result.narration !== 'string') result.narration = 'The Dungeon Master pauses, gathering their thoughts...';

    // Apply HP changes
    if (result.hp_changes && result.hp_changes.length) {
      for (const change of result.hp_changes) {
        const target = characters.find(c => c.name === change.character_name);
        if (target) {
          const dmg = Number(change.change);
          if (!isNaN(dmg)) {
            const newHP = Math.max(0, Math.min(target.hp_max, target.hp_current + dmg));
            await base44.asServiceRole.entities.Character.update(target.id, { hp_current: newHP });
          }
        }
      }
    }

    // Apply XP
    if (result.xp_awarded && result.xp_awarded.length) {
      for (const xpGain of result.xp_awarded) {
        const target = characters.find(c => c.name === xpGain.character_name);
        if (target) {
          const newXp = target.xp + Number(xpGain.amount);
          await base44.asServiceRole.entities.Character.update(target.id, { xp: newXp });
        }
      }
    }

    // Apply loot
    if (result.loot && result.loot.length) {
      for (const item of result.loot) {
        const itemName = String(item.item_name || item.item || '').trim();
        const qty = Math.max(1, Number(item.quantity) || 1);
        const val = Number(item.value) || 0;
        const goldAmt = Number(item.gold) || (val ? val * qty : 0);
        await base44.asServiceRole.entities.LootRecord.create({
          campaign_id, item_name: itemName || null, quantity: qty, value: val,
          currency_type: String(item.currency_type || '').trim(), gold: goldAmt,
          found_by: String(item.found_by || actingChar.name).trim(),
          current_holder: String(item.current_holder || '').trim(),
          source: String(item.source || '').trim(),
          identified_status: String(item.identified_status || 'identified').trim(),
          tradeable: item.tradeable === false ? false : true,
          notes: String(item.notes || '').trim(), chapter: campaign.current_chapter
        });
        if (item.gold) {
          const share = Math.floor(Number(item.gold) / characters.length);
          for (const c of characters) {
            const newGold = (c.gold || 0) + share;
            await base44.asServiceRole.entities.Character.update(c.id, { gold: newGold });
            c.gold = newGold;
          }
        }
      }
    }

    // Apply gold changes (direct gold grants/deductions to specific characters)
    if (result.gold_changes && result.gold_changes.length) {
      for (const gc of result.gold_changes) {
        const target = characters.find(c => c.name === gc.character_name);
        if (target) {
          const change = Number(gc.change);
          if (!isNaN(change)) {
            const newGold = Math.max(0, (target.gold || 0) + change);
            await base44.asServiceRole.entities.Character.update(target.id, { gold: newGold });
            target.gold = newGold;
          }
        }
      }
    }

    // Apply spells learned
    if (result.spells_learned && result.spells_learned.length) {
      for (const learned of result.spells_learned) {
        const target = characters.find(c => c.name === learned.character_name);
        if (target && Array.isArray(learned.spells)) {
          const existing = new Set(target.spells || []);
          const clean = learned.spells.filter(s => typeof s === 'string' && s.trim() && !existing.has(s));
          if (clean.length) {
            await base44.asServiceRole.entities.Character.update(target.id, { spells: [...(target.spells || []), ...clean] });
          }
        }
      }
    }

    // Apply equipment changes (consume existing items, or add new ones)
    if (result.equipment_changes && result.equipment_changes.length) {
      for (const eqChange of result.equipment_changes) {
        const target = characters.find(c => c.name === eqChange.character_name);
        if (target) {
          const itemNameRaw = String(eqChange.item || '').trim();
          const itemName = itemNameRaw.toLowerCase();
          const changeNum = Number(eqChange.change || 0);
          const currentEq = Array.isArray(target.equipment) ? target.equipment : [];
          const existing = currentEq.find(e => e && typeof e.name === 'string' && e.name.trim().toLowerCase() === itemName);
          let updatedEquipment;
          if (existing) {
            updatedEquipment = currentEq.map(e => {
              if (e === existing) {
                const newQty = Math.max(0, (e.qty || 1) + changeNum);
                return newQty > 0 ? { ...e, qty: newQty } : null;
              }
              return e;
            }).filter(Boolean);
          } else if (changeNum > 0 && itemNameRaw) {
            updatedEquipment = [...currentEq, { name: itemNameRaw, qty: changeNum, notes: eqChange.reason || '' }];
          } else {
            continue;
          }
          target.equipment = updatedEquipment;
          await base44.asServiceRole.entities.Character.update(target.id, { equipment: updatedEquipment });
        }
      }
    }

    // Apply equipment transfers (items moved between characters)
    if (result.equipment_transfers && result.equipment_transfers.length) {
      for (const transfer of result.equipment_transfers) {
        const giver = characters.find(c => c.name === transfer.from_character);
        const receiver = characters.find(c => c.name === transfer.to_character);
        if (giver && receiver && Array.isArray(giver.equipment)) {
          const itemName = String(transfer.item || '').trim().toLowerCase();
          const transferQty = Math.max(1, Number(transfer.qty || 1));
          const giverItem = giver.equipment.find(e => e && typeof e.name === 'string' && e.name.trim().toLowerCase() === itemName);
          if (giverItem) {
            const movedItem = { ...giverItem };
            const availableQty = giverItem.qty || 1;
            const actualQty = Math.min(transferQty, availableQty);
            const updatedGiverEq = giver.equipment.map(e => {
              if (e === giverItem) {
                const newQty = availableQty - actualQty;
                return newQty > 0 ? { ...e, qty: newQty } : null;
              }
              return e;
            }).filter(Boolean);
            giver.equipment = updatedGiverEq;
            await base44.asServiceRole.entities.Character.update(giver.id, { equipment: updatedGiverEq });
            const receiverEq = Array.isArray(receiver.equipment) ? receiver.equipment : [];
            const existing = receiverEq.find(e => e && typeof e.name === 'string' && e.name.trim().toLowerCase() === itemName);
            let updatedReceiverEq;
            if (existing) {
              updatedReceiverEq = receiverEq.map(e => e === existing ? { ...e, qty: (e.qty || 1) + actualQty } : e);
            } else {
              updatedReceiverEq = [...receiverEq, { ...movedItem, qty: actualQty }];
            }
            receiver.equipment = updatedReceiverEq;
            await base44.asServiceRole.entities.Character.update(receiver.id, { equipment: updatedReceiverEq });
          }
        }
      }
    }

    // Record deaths
    if (result.deaths && result.deaths.length) {
      for (const death of result.deaths) {
        const target = characters.find(c => c.name === death.character_name);
        await base44.asServiceRole.entities.DeathRecord.create({
          campaign_id, character_name: death.character_name,
          character_class: target ? target.character_class : '', race: target ? target.race : '',
          level: target ? target.level : 1, cause_of_death: death.cause || 'unknown',
          epitaph: 'Fallen in the ' + campaign.name, chapter: campaign.current_chapter
        });
        if (target) {
          await base44.asServiceRole.entities.Character.update(target.id, { status: 'dead', hp_current: 0 });
        }
      }
    }

    // Upsert NPC dossier entries (deduplicated by name/aliases)
    if (Array.isArray(result.npc_updates)) {
      await upsertNpcs(base44, campaign_id, campaign.current_chapter, result.npc_updates);
    }

    // Upsert Location dossier entries (deduplicated by name)
    if (Array.isArray(result.location_updates)) {
      await upsertLocations(base44, campaign_id, campaign.current_chapter, result.location_updates);
    }

    // Update world state
    const newWorldState = { ...worldState };
    if (result.world_updates && typeof result.world_updates === 'object') {
      const wu = result.world_updates;
      if (Array.isArray(wu.locations_explored)) {
        const existing = new Set(newWorldState.locations_explored || []);
        wu.locations_explored.filter(l => typeof l === 'string' && l.trim()).forEach(l => existing.add(l));
        newWorldState.locations_explored = [...existing];
      }
      if (Array.isArray(wu.npcs_met)) {
        const validNpcs = wu.npcs_met.filter(n => n && typeof n === 'object' && typeof n.name === 'string')
          .map(n => ({ name: String(n.name), disposition: typeof n.disposition === 'string' ? n.disposition : 'neutral', notes: typeof n.notes === 'string' ? n.notes : '' }));
        const mergedNpcs = [...(newWorldState.npcs_met || [])];
        for (const vn of validNpcs) {
          const ex = mergedNpcs.find(m => npcKey(m.name) === npcKey(vn.name));
          if (ex) {
            if (vn.disposition) ex.disposition = vn.disposition;
            if (vn.notes) ex.notes = (ex.notes ? ex.notes + ' ' : '') + vn.notes;
          } else {
            mergedNpcs.push(vn);
          }
        }
        newWorldState.npcs_met = mergedNpcs;
      }
      if (wu.quest_flags && typeof wu.quest_flags === 'object' && !Array.isArray(wu.quest_flags)) {
        const flags = {};
        Object.entries(wu.quest_flags).forEach(([k, v]) => { if (typeof k === 'string') flags[k] = v; });
        newWorldState.quest_flags = { ...(newWorldState.quest_flags || {}), ...flags };
      }
      if (wu.location_states && typeof wu.location_states === 'object' && !Array.isArray(wu.location_states)) {
        const locStates = { ...(newWorldState.location_states || {}) };
        Object.entries(wu.location_states).forEach(([k, v]) => { if (typeof k === 'string' && typeof v === 'string') locStates[k] = v; });
        newWorldState.location_states = locStates;
      }
      if (typeof wu.reputation_change === 'number') newWorldState.reputation = (newWorldState.reputation || 0) + wu.reputation_change;
      if (typeof wu.chapter_event === 'string' && wu.chapter_event.trim()) newWorldState.chapter_log = [...(newWorldState.chapter_log || []), wu.chapter_event];
    }

    // Update campaign
    const campaignUpdates = { world_state: newWorldState, current_scene: result.new_scene || campaign.current_scene };

    // Living Timeline Engine: apply playtime, in-world time, and Arc 2 unlock tracking
    if (timeline) {
      campaignUpdates.player_runtime_ms = timeline.runtimeMs;
      campaignUpdates.last_active_at = new Date(timeline.now).toISOString();
      campaignUpdates.arc2_unlocks = timeline.arc2Unlocks;
      if (typeof result.in_world_days_advanced === 'number' && result.in_world_days_advanced > 0) {
        campaignUpdates.in_world_day = timeline.inWorldDays + result.in_world_days_advanced;
      }
      if (Array.isArray(result.arc2_elements_introduced) && result.arc2_elements_introduced.length) {
        const newUnlocks = { ...timeline.arc2Unlocks };
        for (const elem of result.arc2_elements_introduced) {
          if (typeof elem === 'string' && elem.trim()) newUnlocks[elem.trim()] = true;
        }
        campaignUpdates.arc2_unlocks = newUnlocks;
      }
    }

    if (typeof result.combat_active === 'boolean') {
      campaignUpdates.combat_active = result.combat_active;
      campaignUpdates.combat_round = result.combat_active ? (campaign.combat_active ? (campaign.combat_round || 0) + 1 : 1) : 0;
    }
    await base44.asServiceRole.entities.Campaign.update(campaign_id, campaignUpdates);

    // Create journal entries
    if (!is_roll_result) {
      await base44.asServiceRole.entities.JournalEntry.create({
        campaign_id, entry_type: 'action', player_action: action,
        acting_character_name: actingChar.name, chapter: campaign.current_chapter
      });
    }

    await base44.asServiceRole.entities.JournalEntry.create({
      campaign_id, entry_type: 'narration', narration: result.narration,
      dice_rolls: result.dice_rolls || [], hp_changes: result.hp_changes || [],
      xp_awarded: (result.xp_awarded || []).reduce((sum, x) => sum + (x.amount || 0), 0),
      acting_character_name: actingChar.name, chapter: campaign.current_chapter
    });

    return Response.json({
      narration: result.narration,
      dice_rolls: result.dice_rolls || [],
      hp_changes: result.hp_changes || [],
      xp_awarded: result.xp_awarded || [],
      loot: result.loot || [],
      gold_changes: result.gold_changes || [],
      spells_learned: result.spells_learned || [],
      equipment_changes: result.equipment_changes || [],
      equipment_transfers: result.equipment_transfers || [],
      deaths: result.deaths || [],
      npc_updates: result.npc_updates || [],
      location_updates: result.location_updates || [],
      world_updates: result.world_updates || null,
      combat_active: result.combat_active || false,
      combat_initiative: result.combat_initiative || [],
      new_scene: result.new_scene || campaign.current_scene,
      ends_session: result.ends_session || false,
      in_world_days_advanced: result.in_world_days_advanced || 0,
      arc2_elements_introduced: result.arc2_elements_introduced || [],
      player_runtime_hours: timeline ? timeline.runtimeHours : 0,
      in_world_day: timeline ? (campaignUpdates.in_world_day || timeline.inWorldDays) : 0,
      pending_arc2_unlocks: timeline ? timeline.pendingUnlocks : [],
      audio_urls: []
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});