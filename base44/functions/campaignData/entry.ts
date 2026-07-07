import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// AD&D 1e rules tables (mirrored from src/lib/dndRules.js for backend use)
const RACES = {
  Human: { abilityAdjustments: {}, classes: ["Fighter","Paladin","Ranger","Cleric","Druid","Magic-User","Illusionist","Thief","Assassin","Monk"] },
  Elf: { abilityAdjustments: { dex: 1, con: -1 }, classes: ["Fighter","Magic-User","Thief","Assassin","Ranger"] },
  Dwarf: { abilityAdjustments: { con: 1, cha: -1 }, classes: ["Fighter","Thief","Assassin","Cleric"] },
  Halfling: { abilityAdjustments: { dex: 1, str: -1 }, classes: ["Fighter","Thief"] },
  Gnome: { abilityAdjustments: { int: 1, wis: -1 }, classes: ["Fighter","Thief","Illusionist","Cleric"] },
  "Half-Elf": { abilityAdjustments: {}, classes: ["Fighter","Magic-User","Thief","Assassin","Cleric","Ranger"] },
  "Half-Orc": { abilityAdjustments: { str: 1, con: 1, int: -1, cha: -2 }, classes: ["Fighter","Thief","Assassin","Cleric"] }
};

const CLASSES = {
  Fighter: { hitDie: 10, thaco: [20,19,18,17,16,15,14,13,12,11,10,10,9,9,8,8,7,7,6,6], xp: [0,2000,4000,8000,16000,35000,70000,125000,250000,500000], saves: { poison_death:[14,13,12,11,10,9,8,7,6,5], wand:[16,15,14,13,12,11,10,9,8,7], petrification:[15,14,13,12,11,10,9,8,7,6], breath:[17,16,15,14,13,12,11,10,9,8], spell:[17,16,15,14,13,12,11,10,9,8] } },
  Paladin: { hitDie: 10, thaco: [20,19,18,17,16,15,14,13,12,11,10,10,9,9,8,8,7,7,6,6], xp: [0,2750,5500,12000,25000,50000,100000,175000,350000,600000], saves: { poison_death:[14,13,12,11,10,9,8,7,6,5], wand:[15,14,13,12,11,10,9,8,7,6], petrification:[12,11,10,9,8,7,6,5,4,3], breath:[16,15,14,13,12,11,10,9,8,7], spell:[15,14,13,12,11,10,9,8,7,6] } },
  Ranger: { hitDie: 10, thaco: [20,19,18,17,16,15,14,13,12,11,10,10,9,9,8,8,7,7,6,6], xp: [0,2250,4500,9500,20000,40000,90000,150000,225000,375000], saves: { poison_death:[14,13,12,11,10,9,8,7,6,5], wand:[16,15,14,13,12,11,10,9,8,7], petrification:[15,14,13,12,11,10,9,8,7,6], breath:[17,16,15,14,13,12,11,10,9,8], spell:[17,16,15,14,13,12,11,10,9,8] } },
  Cleric: { hitDie: 8, thaco: [20,20,20,18,18,18,16,16,16,14,14,14,12,12,12,10,10,10,8,8], xp: [0,1500,3000,6000,13000,27500,55000,110000,225000,450000], saves: { poison_death:[10,10,10,9,9,7,7,6,6,5], wand:[14,14,13,12,11,10,9,8,7,6], petrification:[13,13,12,11,10,9,8,7,6,5], breath:[16,16,15,14,13,12,11,10,9,8], spell:[15,15,14,13,12,11,10,9,8,7] } },
  Druid: { hitDie: 8, thaco: [20,20,20,18,18,18,16,16,16,14,14,14,12,12,12], xp: [0,2000,4000,7500,12500,20000,35000,60000,90000,125000], saves: { poison_death:[10,10,10,9,9,7,7,6,6,5], wand:[14,14,13,12,11,10,9,8,7,6], petrification:[13,13,12,11,10,9,8,7,6,5], breath:[16,16,15,14,13,12,11,10,9,8], spell:[15,15,14,13,12,11,10,9,8,7] } },
  "Magic-User": { hitDie: 4, thaco: [20,20,20,20,19,19,19,19,17,17,17,17,15,15,15,15,13,13,13,13], xp: [0,2500,5000,10000,22500,40000,60000,90000,135000,250000], saves: { poison_death:[14,14,13,13,12,12,11,11,10,10], wand:[11,11,10,10,9,9,8,8,7,7], petrification:[13,13,12,12,11,11,10,10,9,9], breath:[15,15,14,14,13,13,12,12,11,11], spell:[12,12,11,11,10,10,9,9,8,8] } },
  Illusionist: { hitDie: 4, thaco: [20,20,20,20,19,19,19,19,17,17,17,17,15,15,15,15,13,13,13,13], xp: [0,2250,4500,9500,20000,40000,60000,95000,145000,220000], saves: { poison_death:[14,14,13,13,12,12,11,11,10,10], wand:[11,11,10,10,9,9,8,8,7,7], petrification:[13,13,12,12,11,11,10,10,9,9], breath:[15,15,14,14,13,13,12,12,11,11], spell:[12,12,11,11,10,10,9,9,8,8] } },
  Thief: { hitDie: 6, thaco: [20,20,20,19,19,19,17,17,17,15,15,15,13,13,13,11,11,11,9,9], xp: [0,1250,2500,5000,10000,20000,40000,70000,110000,160000], saves: { poison_death:[13,13,12,12,11,10,9,8,7,6], wand:[14,14,13,13,12,11,10,9,8,7], petrification:[12,12,11,11,10,9,8,7,6,5], breath:[16,16,15,14,13,12,11,10,9,8], spell:[15,15,14,14,13,12,11,10,9,8] } },
  Assassin: { hitDie: 6, thaco: [20,20,20,19,19,19,17,17,17,15,15,15,13,13,13,11,11,11,9,9], xp: [0,1500,3000,6000,12000,25000,50000,100000,200000,425000], saves: { poison_death:[13,13,12,12,11,10,9,8,7,6], wand:[14,14,13,13,12,11,10,9,8,7], petrification:[12,12,11,11,10,9,8,7,6,5], breath:[16,16,15,14,13,12,11,10,9,8], spell:[15,15,14,14,13,12,11,10,9,8] } },
  Monk: { hitDie: 6, thaco: [20,20,19,19,18,18,17,17,16,16,15,15,14,14,13,13,12,12,11,11], xp: [0,2250,4750,10000,22500,47500,97550,175000,350000,650000], saves: { poison_death:[13,13,12,12,11,10,9,8,7,6], wand:[14,14,13,13,12,11,10,9,8,7], petrification:[12,12,11,11,10,9,8,7,6,5], breath:[16,16,15,14,13,12,11,10,9,8], spell:[15,15,14,14,13,12,11,10,9,8] } }
};

const ARMOR_AC = { "None": 10, "Robes": 10, "Leather armor": 8, "Chain mail": 5, "Plate mail": 3 };
const SHIELD_BONUS = 1;

function getTHAC0(className, level) {
  const cls = CLASSES[className];
  if (!cls) return 20;
  return cls.thaco[Math.min(Math.max(level,1), cls.thaco.length) - 1];
}

function getSavingThrows(className, level) {
  const cls = CLASSES[className];
  if (!cls) return { poison_death: 20, wand: 20, petrification: 20, breath: 20, spell: 20 };
  const idx = Math.min(Math.max(level,1), cls.saves.poison_death.length) - 1;
  return {
    poison_death: cls.saves.poison_death[idx],
    wand: cls.saves.wand[idx],
    petrification: cls.saves.petrification[idx],
    breath: cls.saves.breath[idx],
    spell: cls.saves.spell[idx]
  };
}

function getNextXP(className, level) {
  const cls = CLASSES[className];
  if (!cls) return 2000;
  return cls.xp[Math.min(Math.max(level,1), cls.xp.length - 1)];
}

function computeAC(equipment) {
  if (!equipment || !equipment.length) return 10;
  let best = 10, shield = false;
  equipment.forEach(item => {
    if (ARMOR_AC[item.name] !== undefined) best = Math.min(best, ARMOR_AC[item.name]);
    if (item.name === "Shield") shield = true;
  });
  return shield ? best - SHIELD_BONUS : best;
}

function rollDie(sides) { return Math.floor(Math.random() * sides) + 1; }

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const op = body.op;

    const admin = base44.asServiceRole;

    // List campaigns the user is part of
    if (op === 'list') {
      const { game_system } = body;
      const myChars = await admin.entities.Character.filter({ created_by_id: user.id }, '-updated_date', 100);
      const campaignIds = [...new Set(myChars.map(c => c.campaign_id))];
      const createdCampaigns = await admin.entities.Campaign.filter({ created_by_id: user.id }, '-updated_date', 100);
      const allIds = [...new Set([...campaignIds, ...createdCampaigns.map(c => c.id)])];
      const campaigns = [];
      for (const cid of allIds) {
        try {
          const camp = await admin.entities.Campaign.get(cid);
          const partyCount = await admin.entities.Character.filter({ campaign_id: cid, status: 'active' });
          campaigns.push({
            ...camp,
            party_count: partyCount.length,
            has_character: myChars.some(c => c.campaign_id === cid),
            is_owner: camp.created_by_id === user.id
          });
        } catch (e) { /* campaign may be deleted */ }
      }
      let result = campaigns;
      if (game_system) {
        result = campaigns.filter(c => (c.game_system || 'add1e') === game_system);
      }
      result.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
      return Response.json({ campaigns: result });
    }

    // Load full campaign data
    if (op === 'load') {
      const { campaign_id } = body;
      if (!campaign_id) return Response.json({ error: 'campaign_id required' }, { status: 400 });

      const campaign = await admin.entities.Campaign.get(campaign_id);
      if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });

      const characters = await admin.entities.Character.filter({ campaign_id }, '-created_date', 50);
      const myCharacter = characters.find(c => c.created_by_id === user.id && c.status === 'active');

      let module_title = null;
      if (campaign.module_id) {
        try {
          const mod = await admin.entities.AdventureModule.get(campaign.module_id);
          if (mod) module_title = mod.title;
        } catch (e) { /* module may be deleted */ }
      }

      return Response.json({
        campaign,
        characters,
        my_character: myCharacter || null,
        module_title,
        is_owner: campaign.created_by_id === user.id
      });
    }

    // Load journal + loot + deaths
    if (op === 'loadJournal') {
      const { campaign_id } = body;
      if (!campaign_id) return Response.json({ error: 'campaign_id required' }, { status: 400 });
      const entries = await admin.entities.JournalEntry.filter({ campaign_id }, 'created_date', 200);
      const loot = await admin.entities.LootRecord.filter({ campaign_id }, '-created_date', 100);
      const deaths = await admin.entities.DeathRecord.filter({ campaign_id }, '-created_date', 100);
      return Response.json({ entries, loot, deaths });
    }

    // Load recent journal entries (for play view)
    if (op === 'recentEntries') {
      const { campaign_id, limit } = body;
      const entries = await admin.entities.JournalEntry.filter({ campaign_id }, '-created_date', limit || 20);
      return Response.json({ entries: entries.reverse() });
    }

    // Post an out-of-character discussion message (does NOT trigger the DM)
    if (op === 'postDiscussion') {
      const { campaign_id, message, acting_character_name } = body;
      if (!campaign_id || !message) return Response.json({ error: 'campaign_id and message required' }, { status: 400 });
      const entry = await base44.entities.JournalEntry.create({
        campaign_id,
        entry_type: 'discussion',
        narration: message.trim(),
        acting_character_name: acting_character_name || 'A Hero'
      });
      return Response.json({ entry });
    }

    // Join campaign by invite code
    if (op === 'join') {
      const { invite_code } = body;
      if (!invite_code) return Response.json({ error: 'invite_code required' }, { status: 400 });
      const campaigns = await admin.entities.Campaign.filter({ invite_code: invite_code.toUpperCase().trim() });
      if (!campaigns.length) return Response.json({ error: 'No campaign found with that code' }, { status: 404 });
      return Response.json({ campaign: campaigns[0] });
    }

    // Create campaign
    if (op === 'createCampaign') {
      const { name, mode, tone, world_setting, setting_notes, module_id, game_system } = body;
      if (!name) return Response.json({ error: 'name required' }, { status: 400 });
      const campaign = await base44.entities.Campaign.create({
        name: name.trim(),
        invite_code: generateInviteCode(),
        status: 'setup',
        mode: mode || 'async',
        tone: tone || 'balanced',
        world_setting: (world_setting || '').trim(),
        setting_notes: (setting_notes || '').trim(),
        module_id: module_id || null,
        game_system: game_system || 'add1e',
        current_chapter: 1,
        current_scene: '',
        combat_active: false,
        combat_round: 0,
        world_state: { locations_explored: [], npcs_met: [], quest_flags: {}, reputation: 0, chapter_log: [] }
      });
      return Response.json({ campaign });
    }

    // Create character with computed stats
    if (op === 'createCharacter') {
      const { campaign_id, name, race, character_class, alignment, ability_scores, equipment, appearance, background, level, game_system, skills, gold, mutations } = body;
      if (!campaign_id || !name || !race || !character_class) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // Star Frontiers branch: stamina = STA ability score, no THAC0/saves/spells
      if (game_system === 'starfrontiers') {
        const sta = Math.max(1, Math.round((ability_scores && ability_scores.sta) || 50));
        const character = await base44.entities.Character.create({
          name: name.trim(),
          campaign_id,
          game_system: 'starfrontiers',
          race,
          character_class,
          alignment: alignment || 'True Neutral',
          ability_scores,
          level: 1,
          hp_current: sta,
          hp_max: sta,
          ac: 0,
          thaco: 0,
          xp: 0,
          saving_throws: {},
          gold: Number(gold) || 0,
          equipment: equipment || [],
          skills: skills || [],
          spells: [],
          spell_slots: {},
          appearance: appearance || '',
          background: background || '',
          status: 'active'
        });
        return Response.json({ character });
      }

      // Gamma World branch: HP = CN, AC from mutations/armor, mutations stored, no THAC0/saves/spells
      if (game_system === 'gammaworld') {
        const cn = Math.max(1, Math.round((ability_scores && ability_scores.cn) || 10));
        const character = await base44.entities.Character.create({
          name: name.trim(),
          campaign_id,
          game_system: 'gammaworld',
          race,
          character_class: character_class,
          alignment: alignment || 'True Neutral',
          ability_scores,
          level: 1,
          hp_current: cn,
          hp_max: cn,
          ac: Number(body.ac) || 10,
          thaco: 0,
          xp: 0,
          saving_throws: {},
          gold: Number(gold) || 0,
          equipment: equipment || [],
          skills: [],
          mutations: mutations || [],
          spells: [],
          spell_slots: {},
          appearance: appearance || '',
          background: background || '',
          status: 'active'
        });
        return Response.json({ character });
      }

      // Boot Hill branch: HP = Strength (percentile), percentile attributes, no THAC0/saves/spells
      if (game_system === 'boothill') {
        const str = Math.max(1, Math.round((ability_scores && ability_scores.str) || 50));
        const character = await base44.entities.Character.create({
          name: name.trim(),
          campaign_id,
          game_system: 'boothill',
          race,
          character_class,
          alignment: alignment || 'True Neutral',
          ability_scores,
          level: 1,
          hp_current: str,
          hp_max: str,
          ac: 0,
          thaco: 0,
          xp: 0,
          saving_throws: {},
          gold: Number(gold) || 0,
          equipment: equipment || [],
          skills: skills || [],
          mutations: [],
          spells: [],
          spell_slots: {},
          appearance: appearance || '',
          background: background || '',
          status: 'active'
        });
        return Response.json({ character });
      }

      // Indiana Jones branch: HP = Strength (Vitality), percentile attributes, no THAC0/saves/spells
      if (game_system === 'indianajones') {
        const str = Math.max(1, Math.round((ability_scores && ability_scores.str) || 50));
        const character = await base44.entities.Character.create({
          name: name.trim(),
          campaign_id,
          game_system: 'indianajones',
          race,
          character_class,
          alignment: alignment || 'True Neutral',
          ability_scores,
          level: 1,
          hp_current: str,
          hp_max: str,
          ac: 0,
          thaco: 0,
          xp: 0,
          saving_throws: {},
          gold: Number(gold) || 0,
          equipment: equipment || [],
          skills: skills || [],
          mutations: [],
          spells: [],
          spell_slots: {},
          appearance: appearance || '',
          background: background || '',
          status: 'active'
        });
        return Response.json({ character });
      }

      // Legion of Doom branch: HP = Toughness + level, Defense in ac (10 + TGH mod), powers in skills, no THAC0/saves/spells
      if (game_system === 'legionofdoom') {
        const tgh = Math.max(3, Math.round((ability_scores && ability_scores.tgh) || 10));
        const tghMod = Math.floor((tgh - 10) / 2);
        const hp = tgh + Math.max(1, Number(level) || 1);
        const character = await base44.entities.Character.create({
          name: name.trim(),
          campaign_id,
          game_system: 'legionofdoom',
          race,
          character_class,
          alignment: alignment || 'Chaotic Evil',
          ability_scores,
          level: Math.max(1, Number(level) || 1),
          hp_current: hp,
          hp_max: hp,
          ac: 10 + tghMod,
          thaco: 0,
          xp: 0,
          saving_throws: {},
          gold: Number(gold) || 0,
          equipment: equipment || [],
          skills: skills || [],
          mutations: [],
          spells: [],
          spell_slots: {},
          appearance: appearance || '',
          background: background || '',
          status: 'active'
        });
        return Response.json({ character });
      }

      // Hyborian branch (Conan / Red Sonja): HP = Endurance (Vitality), percentile attributes, no THAC0/saves/spells
      if (game_system === 'conan' || game_system === 'redsonja') {
        const end = Math.max(1, Math.round((ability_scores && ability_scores.end) || 50));
        const character = await base44.entities.Character.create({
          name: name.trim(),
          campaign_id,
          game_system,
          race,
          character_class,
          alignment: alignment || 'True Neutral',
          ability_scores,
          level: 1,
          hp_current: end,
          hp_max: end,
          ac: 0,
          thaco: 0,
          xp: 0,
          saving_throws: {},
          gold: Number(gold) || 0,
          equipment: equipment || [],
          skills: skills || [],
          mutations: [],
          spells: [],
          spell_slots: {},
          appearance: appearance || '',
          background: background || '',
          status: 'active'
        });
        return Response.json({ character });
      }

      // Ghostbusters branch: HP = Brownie Points (D6 System), 4 attribute dice, tag skills, no THAC0/saves/spells
      if (game_system === 'ghostbusters') {
        const bp = Math.max(1, Number(gold) || 20);
        const character = await base44.entities.Character.create({
          name: name.trim(),
          campaign_id,
          game_system: 'ghostbusters',
          race,
          character_class,
          alignment: alignment || 'True Neutral',
          ability_scores,
          level: 1,
          hp_current: bp,
          hp_max: bp,
          ac: 0,
          thaco: 0,
          xp: 0,
          saving_throws: {},
          gold: Number(gold) || 0,
          equipment: equipment || [],
          skills: skills || [],
          mutations: [],
          spells: [],
          spell_slots: {},
          appearance: appearance || '',
          background: background || '',
          status: 'active'
        });
        return Response.json({ character });
      }

      // Gangbusters branch: HP = Muscle (Grit), percentile attributes, no THAC0/saves/spells
      if (game_system === 'gangbusters') {
        const mus = Math.max(1, Math.round((ability_scores && ability_scores.mus) || 50));
        const character = await base44.entities.Character.create({
          name: name.trim(),
          campaign_id,
          game_system: 'gangbusters',
          race,
          character_class,
          alignment: alignment || 'True Neutral',
          ability_scores,
          level: 1,
          hp_current: mus,
          hp_max: mus,
          ac: 0,
          thaco: 0,
          xp: 0,
          saving_throws: {},
          gold: Number(gold) || 0,
          equipment: equipment || [],
          skills: skills || [],
          mutations: [],
          spells: [],
          spell_slots: {},
          appearance: appearance || '',
          background: background || '',
          status: 'active'
        });
        return Response.json({ character });
      }

      // Top Secret branch: HP = Physical Strength (Vitality), percentile attributes, no THAC0/saves/spells
      if (game_system === 'topsecret') {
        const str = Math.max(1, Math.round((ability_scores && ability_scores.str) || 50));
        const character = await base44.entities.Character.create({
          name: name.trim(),
          campaign_id,
          game_system: 'topsecret',
          race,
          character_class,
          alignment: alignment || 'True Neutral',
          ability_scores,
          level: 1,
          hp_current: str,
          hp_max: str,
          ac: 0,
          thaco: 0,
          xp: 0,
          saving_throws: {},
          gold: Number(gold) || 0,
          equipment: equipment || [],
          skills: skills || [],
          mutations: [],
          spells: [],
          spell_slots: {},
          appearance: appearance || '',
          background: background || '',
          status: 'active'
        });
        return Response.json({ character });
      }

      const cls = CLASSES[character_class];
      if (!cls) return Response.json({ error: 'Invalid class' }, { status: 400 });

      // HP: max die at level 1 + CON modifier
      const startLevel = Math.min(Math.max(Number(level) || 1, 1), 20);
      const conMod = Math.floor((ability_scores.con - 10) / 2);
      const avgPerLevel = Math.floor(cls.hitDie / 2) + 1;
      let hpMax = Math.max(1, cls.hitDie + conMod);
      for (let l = 2; l <= startLevel; l++) hpMax += Math.max(1, avgPerLevel + conMod);
      const ac = computeAC(equipment);

      const character = await base44.entities.Character.create({
        name: name.trim(),
        campaign_id,
        game_system: body.game_system || 'add1e',
        race,
        character_class,
        alignment: alignment || 'True Neutral',
        ability_scores,
        level: startLevel,
        hp_current: hpMax,
        hp_max: hpMax,
        ac,
        thaco: getTHAC0(character_class, startLevel),
        xp: getNextXP(character_class, startLevel),
        saving_throws: getSavingThrows(character_class, startLevel),
        gold: body.gold || 0,
        equipment: equipment || [],
        spells: body.spells || [],
        spell_slots: body.spell_slots || {},
        appearance: appearance || '',
        background: background || '',
        status: 'active'
      });

      return Response.json({ character });
    }

    // Import an ongoing campaign from an uploaded document — DM studies it and takes over
    if (op === 'importCampaign') {
      const { file_url, game_system, name, mode, tone, setting_notes } = body;
      if (!file_url) return Response.json({ error: 'file_url required' }, { status: 400 });
      const sys = game_system === 'starfrontiers' ? 'starfrontiers' : game_system === 'gammaworld' ? 'gammaworld' : game_system === 'boothill' ? 'boothill' : game_system === 'indianajones' ? 'indianajones' : game_system === 'spelljammer' ? 'spelljammer' : game_system === 'darksun' ? 'darksun' : game_system === 'topsecret' ? 'topsecret' : game_system === 'greyhawk' ? 'greyhawk' : game_system === 'forgottenrealms' ? 'forgottenrealms' : game_system === 'hollowworld' ? 'hollowworld' : game_system === 'conan' ? 'conan' : game_system === 'redsonja' ? 'redsonja' : game_system === 'buckrogers' ? 'buckrogers' : game_system === 'ghostbusters' ? 'ghostbusters' : 'add1e';
      const isSF = sys === 'starfrontiers';
      const isGW = sys === 'gammaworld';
      const isBH = sys === 'boothill';
      const isIJ = sys === 'indianajones';
      const isSJ = sys === 'spelljammer';
      const isDS = sys === 'darksun';
      const isTS = sys === 'topsecret';
      const systemContext = isBH
        ? 'a Boot Hill Wild West role-playing campaign (percentile attributes — Speed, Gun Accuracy, Throwing Accuracy, Strength, Bravery, Experience; quick-draw shootouts, wound location and severity tables, frontier towns, dollars)'
        : isSF
        ? 'a Star Frontiers sci-fi role-playing campaign (percentile d100 skills, stamina, species like Human/Yazirian/Vrusk/Dralasite, the Frontier)'
        : isGW
        ? 'a Gamma World post-apocalyptic science-fantasy role-playing campaign (7 attributes 3-18, mutations physical and mental, genotypes like Pure Strain Human/Altered Human/Mutated Animal/Sentient Plant, domars, Gamma Terra ruins)'
        : isIJ
        ? 'an Indiana Jones pulp action-adventure role-playing campaign set in the 1930s (six percentile attributes 1-100 — Strength, Movement, Prowess, Backbone, Instinct, Appeal; d100 roll-under resolution; light/medium/serious wound levels; archaeology, lost temples, ancient artifacts, Nazis, rival treasure hunters; dollars)'
        : isSJ
        ? 'a Spelljammer science-fantasy role-playing campaign using AD&D 2nd Edition Adventures in Space rules (crystal spheres, the phlogiston, spelljamming helms powered by spellcasters, wildspace, ship combat with SR and hull points, spacefaring races like Giff/Scro/Dracon/Hadozee/Xixchil, neogi and mind flayer fleets, the Arcane traders, gold pieces)'
        : isDS
        ? 'a Dark Sun post-apocalyptic fantasy role-playing campaign using AD&D 2nd Edition rules set on the dying desert world of Athas (crimson sun, Sea of Silt, defiling vs preserving magic, psionics common, metal scarcity with bone/stone/obsidian weapons, sorcerer-kings and templars, gladiatorial arenas, slavery, races like Mul/Half-Giant/Thri-kreen/Athasian Elf/Dwarf/Halfling, ceramic pieces, city-states like Tyr/Urik/Balic/Gulg/Nibenay)'
        : isTS
        ? 'a Top Secret Cold War espionage role-playing campaign using TSR 1980 rules (seven percentile attributes 1-100 — Physical Strength, Physical Beauty, Charm, Courage, Knowledge, Judgment, Coordination; d100 roll-under resolution; Coordination for combat to-hit and initiative; Courage nerve modifier; wound location and severity tables; weapon and tradecraft skills; dollars; rival intelligence services like CIA/KGB/MI6/Mossad; cover identities, dead drops, moles, double agents, sabotage, and assassination)'
        : isGH
        ? 'a Greyhawk fantasy role-playing campaign using AD&D 1st Edition rules set on the World of Oerth, continent of Oerik — the Flanaess (the Free City of Greyhawk, the Great Kingdom, Furyondy, the Bandit Kingdoms, Iuz, the Circle of Eight, ruined dungeons like Castle Greyhawk, classic Gygaxian adventure)'
        : isFR
        ? 'a Forgotten Realms fantasy role-playing campaign using AD&D rules set on the world of Toril, continent of Faerûn (Waterdeep the City of Splendors, the Dalelands, the Sword Coast, Cormyr, Baldur\'s Gate, the Underdark, active gods, the Harpers, the Zhentarim, the Red Wizards of Thay, high magic)'
        : isHW
        ? 'a Hollow World fantasy role-playing campaign using D&D BECMI/Rules Cyclopedia rules set inside the planet Mystara (a vast inner world with its own central sun, land curving upward, the Immortals who preserved ancient civilizations — Milenian Empire, Traldar, Azcans, Oltecs, Nithians — dinosaurs in eternal jungles, marble cities and jade pyramids, the polar openings)'
        : sys === 'conan' || sys === 'redsonja'
        ? 'a Hyborian Age sword-and-sorcery role-playing campaign using a percentile (d100 roll-under) system with eight attributes (Strength, Dexterity, Agility, Endurance, Stature, Intelligence, Mentation, Luck), wound location and severity tables, weapon and adventuring skills, dark sorcery that corrupts, gold pieces, and the savage kingdoms of Robert E. Howard (Cimmeria, Aquilonia, Nemedia, Stygia, Turan, Hyrkania, Zamora)'
        : sys === 'buckrogers'
        ? 'a Buck Rogers XXVc science-fiction role-playing campaign using AD&D 2nd Edition rules adapted for the 25th century (THAC0, saving throws, hit dice, classes like Rocketjockey/Warrior/Medic/Engineer/Pilot, blasters and rocket ships, the geniocracy of RAM on Mars, the Asteroid Belt rebellion, Earth as a poisoned relic, genetically engineered races, corporate intrigue across the solar system)'
        : sys === 'ghostbusters'
        ? 'a Ghostbusters supernatural comedy-horror role-playing campaign using the West End Games D6 System (four attributes rated in dice — Brain, Muscle, Moves, Cool; tag skills that add bonus dice; the Ghost Die where a 6 summons a ghost; Brownie Points as currency, hero points, and the damage track; Target Numbers for task resolution; proton packs, ghost traps, PKE meters, and ghost classifications; modern-day haunted New York)'
        : 'an AD&D 1st Edition fantasy role-playing campaign (THAC0, saving throws, classes like Fighter/Cleric/Magic-User/Thief)';

      const extraction = await base44.integrations.Core.InvokeLLM({
        prompt: `You are reading a document that chronicles an ONGOING tabletop role-playing campaign — ${systemContext}. The party has already been playing and wants an AI ${isSF || isBH || isGW || isIJ ? 'Game Master' : 'Dungeon Master'} to take over and continue seamlessly from where they left off.

Read the document in full and extract the campaign's established state.

Extract:
- campaign_name: a fitting title for this campaign (use the document's name if present, otherwise craft a concise evocative one)
- world_setting: the world, realm, region, or planet the campaign is set in
- current_scene: a 1-2 sentence summary of exactly where the party is right now and what they're doing
- locations_explored: notable locations the party has already visited
- npcs_met: named NPCs encountered, each with disposition (friendly/neutral/hostile) and brief notes
- quest_flags: an object capturing key story/quest states (e.g. {"rescued_mayor": true, "debt_to_guild": "500gp"})
- chapter_log: a chronological list of the major beats/events that have happened so far
- reputation: the party's general standing in the world (-100 to 100; 0 if neutral/unknown)
- brief: a COMPREHENSIVE narrative summary of everything that has happened — the full story so far, key NPCs and their relationships to the party, accomplishments, active quests, looming threats, and unresolved threads. This is the DM's memory. Be thorough; do not summarize away important details.

If the document is sparse, extract what you can and infer reasonable defaults. Never invent major events that contradict the document.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            campaign_name: { type: "string" },
            world_setting: { type: "string" },
            current_scene: { type: "string" },
            locations_explored: { type: "array", items: { type: "string" } },
            npcs_met: { type: "array", items: { type: "object", properties: { name: { type: "string" }, disposition: { type: "string" }, notes: { type: "string" } } } },
            quest_flags: { type: "object" },
            chapter_log: { type: "array", items: { type: "string" } },
            reputation: { type: "number" },
            brief: { type: "string" }
          },
          required: ["brief"]
        },
        model: "claude_sonnet_4_6"
      });

      let ext = extraction;
      if (typeof ext === 'string') { try { ext = JSON.parse(ext); } catch { ext = {}; } }
      if (ext && ext.response && typeof ext.response === 'object') ext = ext.response;
      if (ext && ext.brief && typeof ext.brief === 'object') ext = ext.brief;

      const brief = (ext && ext.brief) || '';
      const unreadable = !brief || /too large|exceeds|could not read|cannot be read|unable to read|file size/i.test(brief.slice(0, 400));
      if (unreadable) {
        return Response.json({ error: 'The DM could not read that document. If it is a PDF, ensure it is under 10 MB and contains selectable text (not just scanned images).' }, { status: 400 });
      }

      const finalName = (name && name.trim()) || (ext && ext.campaign_name) || 'Imported Campaign';

      const campaign = await base44.entities.Campaign.create({
        name: finalName.trim(),
        invite_code: generateInviteCode(),
        status: 'active',
        mode: mode || 'async',
        tone: tone || 'balanced',
        world_setting: (ext && ext.world_setting) || '',
        setting_notes: (setting_notes || '').trim(),
        module_id: null,
        game_system: sys,
        current_chapter: 1,
        current_scene: (ext && ext.current_scene) || '',
        combat_active: false,
        combat_round: 0,
        chronicle: (ext && ext.brief) || '',
        world_state: {
          locations_explored: (ext && ext.locations_explored) || [],
          npcs_met: (ext && ext.npcs_met) || [],
          quest_flags: (ext && ext.quest_flags) || {},
          reputation: typeof (ext && ext.reputation) === 'number' ? ext.reputation : 0,
          chapter_log: (ext && ext.chapter_log) || []
        }
      });

      return Response.json({ campaign });
    }

    // Import a character from an uploaded character sheet PDF/image
    if (op === 'importCharacterSheet') {
      const { file_url, campaign_id, name } = body;
      if (!file_url || !campaign_id) return Response.json({ error: 'file_url and campaign_id required' }, { status: 400 });

      const campaign = await admin.entities.Campaign.get(campaign_id);
      if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });

      // One active character per user per campaign
      const existing = await admin.entities.Character.filter({ campaign_id, created_by_id: user.id, status: 'active' });
      if (existing.length) return Response.json({ error: 'You already have a character in this campaign' }, { status: 400 });

      const isSF = (campaign.game_system || 'add1e') === 'starfrontiers';
      const isGW = (campaign.game_system || 'add1e') === 'gammaworld';
      const isBH = (campaign.game_system || 'add1e') === 'boothill';
      const isIJ = (campaign.game_system || 'add1e') === 'indianajones';
      const isSJ = (campaign.game_system || 'add1e') === 'spelljammer';
      const isDS = (campaign.game_system || 'add1e') === 'darksun';
      const isTS = (campaign.game_system || 'add1e') === 'topsecret';
      const isHY = (campaign.game_system || 'add1e') === 'conan' || (campaign.game_system || 'add1e') === 'redsonja';
      const isGB = (campaign.game_system || 'add1e') === 'ghostbusters';
      const isGang = (campaign.game_system || 'add1e') === 'gangbusters';
      const isLOD = (campaign.game_system || 'add1e') === 'legionofdoom';
      const charSchema = isSF ? {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          ability_scores: { type: "object", properties: { str: { type: "number" }, int: { type: "number" }, log: { type: "number" }, dex: { type: "number" }, rs: { type: "number" }, per: { type: "number" }, ldr: { type: "number" }, sta: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          gold: { type: "number" },
          skills: { type: "array", items: { type: "object", properties: { name: { type: "string" }, level: { type: "number" } } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      } : isGW ? {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          ability_scores: { type: "object", properties: { ps: { type: "number" }, ms: { type: "number" }, dx: { type: "number" }, cn: { type: "number" }, in: { type: "number" }, ch: { type: "number" }, sn: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          ac: { type: "number" },
          gold: { type: "number" },
          mutations: { type: "array", items: { type: "object", properties: { name: { type: "string" }, type: { type: "string" }, defect: { type: "boolean" }, description: { type: "string" } } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      } : isBH ? {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          ability_scores: { type: "object", properties: { spd: { type: "number" }, gacc: { type: "number" }, tacc: { type: "number" }, str: { type: "number" }, brv: { type: "number" }, exp: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          gold: { type: "number" },
          skills: { type: "array", items: { type: "object", properties: { name: { type: "string" }, level: { type: "number" } } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      } : isIJ ? {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          ability_scores: { type: "object", properties: { str: { type: "number" }, mov: { type: "number" }, prw: { type: "number" }, bck: { type: "number" }, ins: { type: "number" }, app: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          gold: { type: "number" },
          skills: { type: "array", items: { type: "object", properties: { name: { type: "string" }, level: { type: "number" } } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      } : isTS ? {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          ability_scores: { type: "object", properties: { str: { type: "number" }, pbea: { type: "number" }, char: { type: "number" }, cour: { type: "number" }, know: { type: "number" }, judg: { type: "number" }, coor: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          gold: { type: "number" },
          skills: { type: "array", items: { type: "object", properties: { name: { type: "string" }, level: { type: "number" } } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      } : isHY ? {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          ability_scores: { type: "object", properties: { str: { type: "number" }, dex: { type: "number" }, agi: { type: "number" }, end: { type: "number" }, sta: { type: "number" }, int: { type: "number" }, men: { type: "number" }, lck: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          gold: { type: "number" },
          skills: { type: "array", items: { type: "object", properties: { name: { type: "string" }, level: { type: "number" } } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      } : isGB ? {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          ability_scores: { type: "object", properties: { brain: { type: "number" }, muscle: { type: "number" }, moves: { type: "number" }, cool: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          gold: { type: "number" },
          skills: { type: "array", items: { type: "object", properties: { name: { type: "string" }, level: { type: "number" } } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      } : isGang ? {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          ability_scores: { type: "object", properties: { mus: { type: "number" }, agi: { type: "number" }, aim: { type: "number" }, sav: { type: "number" }, ner: { type: "number" }, pan: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          gold: { type: "number" },
          skills: { type: "array", items: { type: "object", properties: { name: { type: "string" }, level: { type: "number" } } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      } : isLOD ? {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          ability_scores: { type: "object", properties: { mgt: { type: "number" }, cun: { type: "number" }, agi: { type: "number" }, tgh: { type: "number" }, wil: { type: "number" }, cha: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          ac: { type: "number" },
          gold: { type: "number" },
          skills: { type: "array", items: { type: "object", properties: { name: { type: "string" }, level: { type: "number" } } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      } : {
        type: "object",
        properties: {
          name: { type: "string" },
          race: { type: "string" },
          character_class: { type: "string" },
          level: { type: "number" },
          alignment: { type: "string" },
          ability_scores: { type: "object", properties: { str: { type: "number" }, int: { type: "number" }, wis: { type: "number" }, dex: { type: "number" }, con: { type: "number" }, cha: { type: "number" } } },
          hp_current: { type: "number" },
          hp_max: { type: "number" },
          ac: { type: "number" },
          thaco: { type: "number" },
          xp: { type: "number" },
          gold: { type: "number" },
          saving_throws: { type: "object", properties: { poison_death: { type: "number" }, wand: { type: "number" }, petrification: { type: "number" }, breath: { type: "number" }, spell: { type: "number" } } },
          equipment: { type: "array", items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" } } } },
          spells: { type: "array", items: { type: "string" } },
          appearance: { type: "string" },
          background: { type: "string" }
        },
        required: ["name", "race", "character_class"]
      };

      const charPrompt = isSF
        ? `You are reading a Star Frontiers character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the operative's name
- race: species (Human, Yazirian, Vrusk, or Dralasite)
- character_class: primary skill area (Military, Technological, or Biosocial)
- level: experience level
- ability_scores: percentile abilities 1-100 — str, int, log, dex, rs, per, ldr, sta
- hp_current and hp_max: current and max stamina
- gold: credits
- skills: array of {name, level}
- equipment: array of {name, qty}
- appearance: physical description if present
- background: backstory if present`
        : isGW
        ? `You are reading a Gamma World character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the mutant's name
- race: genotype (Pure Strain Human, Altered Human, Mutated Animal, or Sentient Plant)
- character_class: same as race/genotype
- level: experience level (default 1)
- ability_scores: the seven Gamma World abilities — ps (Physical Strength), ms (Mental Strength), dx (Dexterity), cn (Constitution), in (Intelligence), ch (Charisma), sn (Senses), 3-18
- hp_current and hp_max: current and max hit points (equals Constitution)
- ac: armor class (descending, 10 = unarmored)
- gold: domars (ancient currency)
- mutations: array of {name, type ("physical" or "mental"), defect (true/false), description}
- equipment: array of {name, qty}
- appearance: physical description if present
- background: backstory if present`
        : isBH
        ? `You are reading a Boot Hill Wild West character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the gunslinger's name
- race: their background or occupation (Gunfighter, Lawman, Cowboy, Gambler, Outlaw, Scout)
- character_class: same as race/background
- level: experience level (default 1)
- ability_scores: the six percentile attributes (1-100) — spd (Speed), gacc (Gun Accuracy), tacc (Throwing Accuracy), str (Strength), brv (Bravery), exp (Experience)
- hp_current and hp_max: current and max grit (equals Strength)
- gold: dollars
- skills: array of {name, level} — weapon skills (level = proficiency 1-6) and work skills (level = percentile score)
- equipment: array of {name, qty}
- appearance: physical description if present
- background: backstory if present`
        : isIJ
        ? `You are reading an Indiana Jones character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the adventurer's name
- race: their archetype (Archaeologist, Soldier, Mercenary, Aviator, Explorer, Scholar, Big Game Hunter, Federal Agent)
- character_class: same as archetype
- level: experience level (default 1)
- ability_scores: the six percentile attributes (1-100) — str (Strength), mov (Movement), prw (Prowess), bck (Backbone), ins (Instinct), app (Appeal)
- hp_current and hp_max: current and max vitality (equals Strength)
- gold: dollars
- skills: array of {name, level} — weapon skills (level = proficiency 1-6) and work skills (level = percentile score)
- equipment: array of {name, qty}
- appearance: physical description if present
- background: backstory if present`
        : isDS
        ? `You are reading a Dark Sun (AD&D 2nd Edition) character sheet for the world of Athas (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the character's name
- race: Athasian race (Human, Elf, Dwarf, Halfling, Half-Elf, Mul, Half-Giant, Thri-kreen)
- character_class: class (Fighter, Gladiator, Ranger, Cleric, Druid, Magic-User, Illusionist, Thief, Assassin, Bard, Monk, Templar, Defiler, Preserver, Psionicist)
- level: experience level
- alignment: alignment
- ability_scores: str, int, wis, dex, con, cha (3-18, may exceed 18 on Athas)
- hp_current and hp_max: current and max hit points
- ac: armor class
- thaco: THAC0
- xp: experience points
- gold: ceramic pieces (cp)
- saving_throws: poison_death, wand, petrification, breath, spell
- equipment: array of {name, qty} — note bone/stone/obsidian weapons vs metal
- spells: array of spell names
- appearance: physical description if present
- background: backstory if present`
        : isTS
        ? `You are reading a Top Secret espionage character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the agent's name or codename
- race: their archetype (Field Agent, Assassin, Commando, Demolitions Expert, Electronics Tech, Wheelman, Interrogator, Martial Artist, Sniper, Forgery Specialist)
- character_class: same as archetype
- level: experience level (default 1)
- ability_scores: the seven percentile attributes (1-100) — str (Physical Strength), pbea (Physical Beauty), char (Charm), cour (Courage), know (Knowledge), judg (Judgment), coor (Coordination)
- hp_current and hp_max: current and max vitality (equals Physical Strength)
- gold: dollars
- skills: array of {name, level} — weapon skills (level = proficiency 1-6) and tradecraft skills (level = percentile score)
- equipment: array of {name, qty}
- appearance: physical description if present
- background: backstory if present`
        : isHY
        ? `You are reading a Hyborian Age (Conan / Red Sonja) character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the warrior's name
- race: their archetype (Barbarian, Mercenary, Thief, Pirate, Hunter, Nomad, Soldier, Sorcerer, Noble, Scholar)
- character_class: same as archetype
- level: experience level (default 1)
- ability_scores: the eight percentile attributes (1-100) — str (Strength), dex (Dexterity), agi (Agility), end (Endurance), sta (Stature), int (Intelligence), men (Mentation), lck (Luck)
- hp_current and hp_max: current and max vitality (equals Endurance)
- gold: gold pieces
- skills: array of {name, level} — weapon skills (level = proficiency 1-6) and adventuring skills (level = percentile score)
- equipment: array of {name, qty}
- appearance: physical description if present
- background: backstory if present`
        : isGB
        ? `You are reading a Ghostbusters character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the buster's name
- race: their archetype (Scientist, Technician, Blue-Collar Buster, Civil Servant, Occultist, Journalist, Maverick)
- character_class: same as archetype
- level: experience level (default 1)
- ability_scores: the four attributes rated in dice (1-5) — brain (Brain), muscle (Muscle), moves (Moves), cool (Cool)
- hp_current and hp_max: current and max Brownie Points
- gold: Brownie Points bank
- skills: array of {name, level} — tag skills (level = bonus dice 1-3)
- equipment: array of {name, qty}
- appearance: physical description if present
- background: backstory if present`
        : isGang
        ? `You are reading a Gangbusters Prohibition-era crime character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the character's name
- race: their archetype (Gangster, Hit Man, Bootlegger, Safecracker, Police Officer, Federal Agent, Private Investigator, Racketeer, Wheelman, Con Artist)
- character_class: same as archetype
- level: experience level (default 1)
- ability_scores: the six percentile attributes (1-100) — mus (Muscle), agi (Agility), aim (Aim), sav (Savvy), ner (Nerve), pan (Panache)
- hp_current and hp_max: current and max Grit (equals Muscle)
- gold: dollars
- skills: array of {name, level} — weapon skills (level = proficiency 1-6) and underworld skills (level = percentile score)
- equipment: array of {name, qty}
- appearance: physical description if present
- background: backstory if present`
        : isLOD
        ? `You are reading a Legion of Doom supervillain character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the villain's name
- race: their archetype (The Mastermind, The Powerhouse, The Trickster, The Speedster, The Sorcerer, The Shapeshifter, The Gadgeteer, The Mentalist)
- character_class: same as archetype
- level: experience level (default 1)
- ability_scores: the six attributes 3-18 — mgt (Might), cun (Cunning), agi (Agility), tgh (Toughness), wil (Will), cha (Charisma)
- hp_current and hp_max: current and max Vitality (equals Toughness + level)
- ac: Defense (10 + Toughness modifier)
- gold: resources in dollars
- skills: array of {name, level} — super-powers (level = power rank 1-5)
- equipment: array of {name, qty}
- appearance: physical description if present
- background: origin story if present`
        : `You are reading an AD&D 1st Edition character sheet (PDF, image, or text). Extract every field accurately, using the EXACT numbers written on the sheet — do not recompute or estimate. If a field is not present, use null for numbers or an empty string.

Extract:
- name: the character's name
- race: race (Human, Elf, Dwarf, Halfling, Gnome, Half-Elf, Half-Orc)
- character_class: class (Fighter, Paladin, Ranger, Cleric, Druid, Magic-User, Illusionist, Thief, Assassin, Monk)
- level: experience level
- alignment: alignment (e.g. Lawful Good, Chaotic Neutral)
- ability_scores: str, int, wis, dex, con, cha (3-18)
- hp_current and hp_max: current and max hit points
- ac: armor class
- thaco: THAC0 (To Hit Armor Class 0)
- xp: experience points
- gold: gold pieces
- saving_throws: poison_death, wand, petrification, breath, spell
- equipment: array of {name, qty}
- spells: array of spell names
- appearance: physical description if present
- background: backstory if present`;

      const extraction = await base44.integrations.Core.InvokeLLM({
        prompt: charPrompt,
        file_urls: [file_url],
        response_json_schema: charSchema,
        model: "claude_sonnet_4_6"
      });

      let ext = extraction;
      if (typeof ext === 'string') { try { ext = JSON.parse(ext); } catch { ext = {}; } }
      if (ext && ext.response && typeof ext.response === 'object') ext = ext.response;
      if (ext && ext.name && typeof ext.name === 'object') ext = ext.name;

      const sheetName = (ext && ext.name) || '';
      const unreadable = /too large|could not read|cannot be read|unable to read/i.test(sheetName.slice(0, 200));
      if (unreadable || (!sheetName && !(name && name.trim()))) {
        return Response.json({ error: 'The DM could not read that character sheet. Ensure it is under 10 MB and the text is selectable (not a scanned image).' }, { status: 400 });
      }

      const charName = (name && name.trim()) || sheetName || 'Unknown Hero';
      const ability_scores = (ext && ext.ability_scores) || {};
      const staFallback = (ability_scores.sta && Number(ability_scores.sta)) || 50;
      const cnFallback = (ability_scores.cn && Number(ability_scores.cn)) || 10;
      const strFallback = (ability_scores.str && Number(ability_scores.str)) || 50;

      const character = await base44.entities.Character.create({
        name: charName.trim(),
        campaign_id,
        game_system: isSF ? 'starfrontiers' : isGW ? 'gammaworld' : isBH ? 'boothill' : isIJ ? 'indianajones' : isSJ ? 'spelljammer' : isDS ? 'darksun' : isTS ? 'topsecret' : (campaign.game_system || 'add1e'),
        race: (ext && ext.race) || (isGW ? 'Altered Human' : isBH ? 'Gunfighter' : isIJ ? 'Archaeologist' : isTS ? 'Field Agent' : isHY ? 'Barbarian' : isGB ? 'Scientist' : isGang ? 'Gangster' : isLOD ? 'The Mastermind' : 'Human'),
        character_class: (ext && ext.character_class) || (isSF ? 'Military' : isGW ? 'Altered Human' : isBH ? 'Gunfighter' : isIJ ? 'Archaeologist' : isTS ? 'Field Agent' : isHY ? 'Barbarian' : isGB ? 'Scientist' : isGang ? 'Gangster' : isLOD ? 'The Mastermind' : 'Fighter'),
        alignment: (ext && ext.alignment) || 'True Neutral',
        ability_scores,
        level: Math.max(1, Number(ext && ext.level) || 1),
        hp_current: Number(ext && ext.hp_current) || (isSF ? staFallback : isGW ? cnFallback : (isBH || isIJ || isTS) ? strFallback : isHY ? (ability_scores.end || 50) : isGB ? (Number(ext && ext.gold) || 20) : isGang ? (ability_scores.mus || 50) : isLOD ? ((ability_scores.tgh || 10) + 1) : 1),
        hp_max: Number(ext && ext.hp_max) || (isSF ? staFallback : isGW ? cnFallback : (isBH || isIJ || isTS) ? strFallback : isHY ? (ability_scores.end || 50) : isGB ? (Number(ext && ext.gold) || 20) : isGang ? (ability_scores.mus || 50) : isLOD ? ((ability_scores.tgh || 10) + 1) : 1),
        ac: Number(ext && ext.ac) || (isSF ? 0 : isGW ? 0 : isBH ? 0 : isIJ ? 0 : isTS ? 0 : isHY ? 0 : isGB ? 0 : isGang ? 0 : isLOD ? (10 + Math.floor(((ability_scores.tgh || 10) - 10) / 2)) : 10),
        thaco: Number(ext && ext.thaco) || (isSF ? 0 : isGW ? 0 : isBH ? 0 : isIJ ? 0 : isTS ? 0 : isHY ? 0 : isGB ? 0 : isGang ? 0 : isLOD ? 0 : 20),
        xp: Number(ext && ext.xp) || 0,
        saving_throws: (ext && ext.saving_throws) || {},
        gold: Number(ext && ext.gold) || 0,
        equipment: (ext && ext.equipment) || [],
        skills: (isSF || isBH || isIJ || isTS || isHY || isGB || isGang || isLOD) ? (ext && ext.skills) || [] : [],
        mutations: isGW ? (ext && ext.mutations) || [] : [],
        spells: (isSF || isGB || isGang || isLOD) ? [] : (ext && ext.spells) || [],
        spell_slots: {},
        appearance: (ext && ext.appearance) || '',
        background: (ext && ext.background) || '',
        status: 'active'
      });

      return Response.json({ character });
    }

    // Delete campaign and all related data (creator only)
    if (op === 'deleteCampaign') {
      const { campaign_id } = body;
      if (!campaign_id) return Response.json({ error: 'campaign_id required' }, { status: 400 });

      const campaign = await admin.entities.Campaign.get(campaign_id);
      if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });
      if (campaign.created_by_id !== user.id) {
        return Response.json({ error: 'Only the campaign creator can delete it' }, { status: 403 });
      }

      // Remove all related records in parallel
      const [characters, entries, loot, deaths, sessions] = await Promise.all([
        admin.entities.Character.filter({ campaign_id }),
        admin.entities.JournalEntry.filter({ campaign_id }),
        admin.entities.LootRecord.filter({ campaign_id }),
        admin.entities.DeathRecord.filter({ campaign_id }),
        admin.entities.Session.filter({ campaign_id })
      ]);

      await Promise.all([
        base44.entities.Campaign.delete(campaign_id),
        ...characters.map(c => base44.entities.Character.delete(c.id)),
        ...entries.map(e => base44.entities.JournalEntry.delete(e.id)),
        ...loot.map(l => base44.entities.LootRecord.delete(l.id)),
        ...deaths.map(d => base44.entities.DeathRecord.delete(d.id)),
        ...sessions.map(s => base44.entities.Session.delete(s.id))
      ]);

      return Response.json({ success: true });
    }

    // Update the campaign's DM Brief (group's custom DM instructions — creator only)
    if (op === 'updateDmBrief') {
      const { campaign_id, dm_brief } = body;
      if (!campaign_id) return Response.json({ error: 'campaign_id required' }, { status: 400 });
      const campaign = await admin.entities.Campaign.get(campaign_id);
      if (!campaign) return Response.json({ error: 'Campaign not found' }, { status: 404 });
      if (campaign.created_by_id !== user.id) {
        return Response.json({ error: 'Only the campaign creator can edit the DM Brief' }, { status: 403 });
      }
      await base44.entities.Campaign.update(campaign_id, { dm_brief: (dm_brief || '').trim() });
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown operation: ' + op }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});