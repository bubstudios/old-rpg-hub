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
      campaigns.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
      return Response.json({ campaigns });
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
        module_title
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
      const { name, mode, tone, world_setting, setting_notes, module_id } = body;
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
      const { campaign_id, name, race, character_class, alignment, ability_scores, equipment, appearance, background, level } = body;
      if (!campaign_id || !name || !race || !character_class) {
        return Response.json({ error: 'Missing required fields' }, { status: 400 });
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

    return Response.json({ error: 'Unknown operation: ' + op }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});