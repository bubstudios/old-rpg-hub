import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

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
    const respFmt = `\n## Response Format\nYou MUST respond as a JSON object: {"narration":"string (always present)","dice_rolls":[{"description","die","roll","modifier","total","result","target"}],"hp_changes":[{"character_name","change","reason"}],"xp_awarded":[{"character_name","amount","reason"}],"loot":[{"item","gold","source"}],"spells_learned":[{"character_name","spells":["..."],"source"}],"deaths":[{"character_name","cause"}],"world_updates":{"locations_explored":[],"npcs_met":[{"name","disposition","notes"}],"quest_flags":{},"reputation_change":0,"chapter_event":""},"new_scene":"string","combat_active":false,"combat_initiative":[{"name","initiative"}],"ends_session":false}\nRules: narration is always present. Only include arrays when relevant. If combat, set combat_active true with initiative. ends_session true only if the session concludes.`;

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

      dnd5e: `You are the Dungeon Master for a D&D 5th Edition campaign (2014). You narrate a heroic fantasy adventure using the world's most popular RPG rules — streamlined, bounded, and accessible.\n## Your Role\nYou are the ONLY DM.\n## D&D 5e Rules\n- Ability scores: STR, INT, WIS, DEX, CON, CHA (3-18+, 4d6-drop-lowest or point-buy). Modifiers: (score-10)/2 rounded down.\n- Proficiency Bonus: +2 (levels 1-4), +3 (5-8), +4 (9-12), +5 (13-16), +6 (17-20). Added to attacks, proficient saves, proficient skills, spell save DCs.\n- Advantage/Disadvantage: roll 2d20, take higher (advantage) or lower (disadvantage). Core situational modifier.\n- Bounded Accuracy: numbers stay reasonable. Low-level CAN hit high-AC; high-level ISN'T invulnerable.\n- AC (ASCENDING, higher better): 10 + DEX (unarmored) or armor + DEX (light/medium) or armor (heavy) + shield.\n- Attack rolls: d20 + proficiency + ability mod (STR melee, DEX ranged) vs AC. Natural 20 = crit (double damage dice). Natural 1 = auto miss.\n- Saving Throws: tied to ability scores. Each class proficient in two. d20 + proficiency (if proficient) + ability mod vs DC.\n- HP: hit die per level + CON mod. Level 1 = max. Hit Dice spent on Short Rest to heal (roll die + CON mod). At 0 HP: unconscious, dying. Death Saves: d20, 10+ = success, 3 successes = stable, 3 failures = dead. Natural 20 = restore 1 HP.\n- Spells: Save DC = 8 + proficiency + spellcasting ability mod. Spell Attack = d20 + proficiency + spellcasting mod. Cantrips at-will. Spell slots per level (1-9). Upcasting: higher slot = stronger effect.\n- Skills: proficient or not. Check = d20 + proficiency (if proficient) + ability mod. Expertise (Rogue/Bard) doubles proficiency.\n- Backgrounds: grant skills, tool proficiencies, features.\n- Subclasses: chosen at levels 1-3.\n- Conditions: Grappled, Prone, Restrained, Poisoned, Frightened, etc.\n- Inspiration: awarded for good roleplay. Spend for advantage on one roll.\n- Short Rest (1 hr): spend Hit Dice. Long Rest (8 hrs): full HP, half Hit Dice recovered.\n- Initiative: d20 + DEX, higher first.\n- Each turn: Reaction, Action, Bonus Action, Movement.\n## Tone\nHeroic, streamlined, accessible. Be fair but exciting. Characters are heroic but not invincible. Reward creative play, teamwork. Describe blade swings, spell crackles, natural 20 cheers, natural 1 groans.${baseDir}${respFmt}`
    };

    const systemPrompt = prompts[gs] || prompts['add2e'];

    const charTag = isSW ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (Wounds ${actingChar.hp_current}/${actingChar.hp_max})`
      : isMSH ? `${actingChar.name} the ${actingChar.race} (Health ${actingChar.hp_current}/${actingChar.hp_max})`
      : isDCH ? `${actingChar.name} the ${actingChar.race} (BODY ${actingChar.hp_current}/${actingChar.hp_max})`
      : isJB ? `${actingChar.name} the ${actingChar.race} (Body ${actingChar.hp_current}/${actingChar.hp_max})`
      : isSR ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (DMG ${actingChar.hp_current}/${actingChar.hp_max})`
      : isCP ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (HP ${actingChar.hp_current}/${actingChar.hp_max})`
      : isTrav ? `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (END ${actingChar.hp_current}/${actingChar.hp_max})`
      : `${actingChar.name} the ${actingChar.race} ${actingChar.character_class} (Level ${actingChar.level}, HP ${actingChar.hp_current}/${actingChar.hp_max})`;

    const rulesLabel = isSW ? 'Star Wars (WEG D6)' : isMSH ? 'Marvel Super Heroes (FASERIP)' : isDCH ? 'DC Heroes (Mayfair)' : isJB ? 'James Bond 007' : isSR ? 'Shadowrun' : isCP ? 'Cyberpunk' : isTrav ? 'Traveller' : isRL ? 'Ravenloft (AD&D 2e)' : isOD ? 'Original D&D (1974)' : isBX ? 'B/X D&D' : is2e ? 'AD&D 2nd Edition' : is35 ? 'D&D 3.5' : is4e ? 'D&D 4th Edition' : is5e ? 'D&D 5th Edition' : 'AD&D 2nd Edition';

    const isNonDnd = isSW || isMSH || isDCH || isJB || isSR || isCP || isTrav;
    const actionBlock = is_roll_result
      ? `${charTag} just made a dice roll.\nRoll result: "${action}"\n\nInterpret this roll result according to ${rulesLabel} rules and continue the scene — narrate what happens next based on the outcome of this roll.`
      : `${charTag} declares:\n"${action}"`;

    const userPrompt = `## Campaign: ${campaign.name}
Current Chapter: ${campaign.current_chapter}
Current Scene: ${campaign.current_scene || 'The campaign is just beginning.'}
Combat Active: ${campaign.combat_active ? 'Yes (round ' + campaign.combat_round + ')' : 'No'}

## Party (Character Sheets)
${JSON.stringify(partySheets, null, 2)}

## World State
Explored Locations: ${(worldState.locations_explored || []).join(', ') || 'none yet'}
NPCs Met: ${(worldState.npcs_met || []).map(n => n.name + ' (' + (n.disposition || 'unknown') + ')').join(', ') || 'none yet'}
Quest Flags: ${JSON.stringify(worldState.quest_flags || {})}
Party Reputation: ${worldState.reputation || 0}

## Recent History
${history || 'The adventure has just begun.'}

## Current Action
${actionBlock}

## Equipment & Consumables
When a character uses, throws, fires, drinks, or expends a consumable item (grenades, ammo, potions, scrolls, rations, batteries, etc.), include an "equipment_changes" array: [{"character_name": "name", "item": "item name", "change": -1, "reason": "thrown at enemy"}]. Match the item name to the character's equipment list.

## Equipment Transfers (handing items between characters)
When a character gives, hands, passes, or trades an item to another character, include an "equipment_transfers" array: [{"from_character": "giver name", "to_character": "receiver name", "item": "item name", "qty": 1, "reason": "handed the sword to the rogue"}]. The item is removed from the giver's equipment and added to the receiver's. Match the item name to the giver's equipment list. Use qty for partial stacks (e.g. handing 2 of 5 torches). This is how items move between party members — always use it when a character hands something to another.

## Gold Changes
When a character's gold (or credits/Nuyen/Eurodollars/Credits/etc. depending on the system) changes for ANY reason — finding treasure, receiving a reward, making a purchase, paying for services, or being awarded gold by the DM — you MUST include a "gold_changes" array: [{"character_name": "name", "change": 100, "reason": "reward"}]. Use positive change for gold gained, negative for gold spent or lost. This is the PRIMARY way gold is updated on character sheets — always use it whenever gold changes, even if you also list the treasure in the loot array.

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
          world_updates: { type: "object" },
          new_scene: { type: "string" },
          combat_active: { type: "boolean" },
          combat_initiative: { type: "array", items: { type: "object" } },
          ends_session: { type: "boolean" }
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
        await base44.asServiceRole.entities.LootRecord.create({
          campaign_id, item_name: item.item || null, gold: item.gold || 0,
          source: item.source || '', found_by: actingChar.name, chapter: campaign.current_chapter
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

    // Apply equipment changes
    if (result.equipment_changes && result.equipment_changes.length) {
      for (const eqChange of result.equipment_changes) {
        const target = characters.find(c => c.name === eqChange.character_name);
        if (target && Array.isArray(target.equipment)) {
          const itemName = String(eqChange.item || '').trim().toLowerCase();
          const updatedEquipment = target.equipment.map(e => {
            if (e && typeof e.name === 'string' && e.name.trim().toLowerCase() === itemName) {
              const newQty = Math.max(0, (e.qty || 1) + Number(eqChange.change || 0));
              return newQty > 0 ? { ...e, qty: newQty } : null;
            }
            return e;
          }).filter(Boolean);
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
        newWorldState.npcs_met = [...(newWorldState.npcs_met || []), ...validNpcs];
      }
      if (wu.quest_flags && typeof wu.quest_flags === 'object' && !Array.isArray(wu.quest_flags)) {
        const flags = {};
        Object.entries(wu.quest_flags).forEach(([k, v]) => { if (typeof k === 'string') flags[k] = v; });
        newWorldState.quest_flags = { ...(newWorldState.quest_flags || {}), ...flags };
      }
      if (typeof wu.reputation_change === 'number') newWorldState.reputation = (newWorldState.reputation || 0) + wu.reputation_change;
      if (typeof wu.chapter_event === 'string' && wu.chapter_event.trim()) newWorldState.chapter_log = [...(newWorldState.chapter_log || []), wu.chapter_event];
    }

    // Update campaign
    const campaignUpdates = { world_state: newWorldState, current_scene: result.new_scene || campaign.current_scene };
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
      world_updates: result.world_updates || null,
      combat_active: result.combat_active || false,
      combat_initiative: result.combat_initiative || [],
      new_scene: result.new_scene || campaign.current_scene,
      ends_session: result.ends_session || false,
      audio_urls: []
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});