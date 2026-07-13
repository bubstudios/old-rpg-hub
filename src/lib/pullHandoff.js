// THE PULL — Chapter Handoff System
// Generates structured handoff state at chapter end and loads it into the next chapter.
// The handoff is the ONLY data from a completed chapter that the next chapter receives.

import { getChapterByNumber, getNextChapter } from './pullChapters';

// Generate a handoff from the current game state (client-side, for display)
export function generateHandoff(flags, equipment, chapterNum) {
  const chapter = getChapterByNumber(chapterNum);
  if (!chapter) return null;

  const nextChapter = getNextChapter(chapterNum);
  const chapterId = `chapter_${String(chapterNum).padStart(3, '0')}`;

  // Extract inventory — only carry-forward items
  const carryPatterns = chapter.carryForwardItems.map(item =>
    new RegExp(item.replace(/_/g, '.*'), 'i')
  );
  const inventory = (equipment || [])
    .filter(e => carryPatterns.some(p => p.test(e.name)))
    .map(e => e.name);

  // Extract known NPCs from this chapter
  const npcRels = flags.npc_relationships || {};
  const knownPeople = Object.entries(npcRels)
    .filter(([, npc]) => npc.first_met)
    .map(([key, npc]) => ({
      key,
      name: npc.name || key,
      role: npc.role || '',
      status: npc.status || 'Alive'
    }));

  // Variable outcomes — chapter-specific
  const variableOutcomes = {};
  if (chapterNum === 1) {
    variableOutcomes.cowboyStatus = (npcRels.cowboy?.status || 'Unknown').toLowerCase();
    variableOutcomes.rivetStatus = (npcRels.rivet?.status || 'Unknown').toLowerCase();
    const localClocks = flags.local_clocks || {};
    variableOutcomes.campTrust = localClocks.camp_trust ?? 30;
    variableOutcomes.campDamage = localClocks.raider_threat ?? 20;
  }

  // Bullet state
  const conditions = flags.conditions || [];
  const bullet = {
    name: flags.bullet_named ? 'Bullet' : 'The Stranger',
    trueIdentityKnown: false,
    condition: conditions.length > 2 ? 'injured but mobile' : 'worn but standing',
    scarStatus: flags.scar_state || 'burning',
    pullStatus: (flags.pull_intensity || 1) >= 4 ? 'intensifying' : 'present'
  };

  return {
    completedChapter: chapterId,
    nextChapter: nextChapter?.id || null,
    nextChapterTitle: nextChapter?.title || 'Unknown',
    bullet,
    inventory,
    knownPeople,
    requiredAlive: chapter.requiredAlive,
    variableOutcomes,
    canonicalEvents: chapter.canonicalEvents,
    bulletKnowledge: chapter.bulletKnowledge,
    playerOnlyKnowledge: chapter.playerOnlyKnowledge,
    debts: chapter.debts
  };
}

// Check if a chapter has saved a handoff (for gating: can't start next chapter without it)
export function hasHandoff(flags, chapterNum) {
  const handoffs = flags.chapter_handoffs || {};
  const chapterId = `chapter_${String(chapterNum).padStart(3, '0')}`;
  return !!handoffs[chapterId];
}

// Get saved handoff for display
export function getSavedHandoff(flags, chapterNum) {
  const handoffs = flags.chapter_handoffs || {};
  const chapterId = `chapter_${String(chapterNum).padStart(3, '0')}`;
  return handoffs[chapterId] || null;
}