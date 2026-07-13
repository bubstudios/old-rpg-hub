// THE PULL — Chapter Module Definitions
// Each chapter is a self-contained module with its own state, NPCs, clocks, and knowledge.
// Chapters connect via structured handoffs saved at chapter end.
// Internally: 21 mini-games. Player-facing: one continuous journey.

import { PULL_OPENING_SCENE, PROVINCE_SEQUENCE } from './pullRules';

// Chapters 1-21 based on PROVINCE_SEQUENCE. Gaps at 5, 7, 11 are intentional
// (those chapter numbers are reserved for interlude/deep provinces).
const CHAPTER_DATA = {
  1: {
    title: 'Red Sand',
    openingNarration: PULL_OPENING_SCENE,
    carryForwardItems: ['etched_shard', 'pipe', 'spark_shard', 'breathing_apparatus'],
    requiredAlive: ['shard', 'spark'],
    canonicalEvents: [
      'Bullet woke in red sand with no memory.',
      'Bullet found the etched shard in his pocket.',
      'A mechanical bird scanned Bullet and reported to something distant.',
      'Bullet reached Red Sand Camp.',
      'Shard named him Bullet after seeing his circular scar.',
      "Bullet completed Shard's task (retrieving the purifier core).",
      'Bullet fought raiders with the pipe.',
      'Spark loaned Bullet her unetched shard.',
      'Shard gave Bullet breathing apparatus.',
      'The Pull forced Bullet onward.',
      'Bullet reached the wall of water.'
    ],
    bulletKnowledge: [
      'He has no memory of who he was.',
      'The Pull leads him forward through the Provinces.',
      'The camp survivors also lack true memories — everyone woke here.',
      'The next Province is water-like and dangerous.',
      'The breathing apparatus is needed to survive there.'
    ],
    playerOnlyKnowledge: [
      'A distant Leader knows an anomaly appeared in Province 618.',
      'Bullet has no Nexus record.',
      'An investigation has been ordered.'
    ],
    debts: [
      'Spark expects Bullet to return someday.',
      'Shard trusted Bullet enough to help him move on.'
    ]
  },
  2: {
    title: 'The Water Block',
    openingNarration: `The red sand ends.

Ahead, a wall of water rises into the sky.

It stretches left and right until the horizon swallows it.

The Pull points directly into it.`,
    carryForwardItems: ['etched_shard', 'pipe', 'spark_shard', 'breathing_apparatus'],
    requiredAlive: [],
    canonicalEvents: [],
    bulletKnowledge: [],
    playerOnlyKnowledge: [],
    debts: []
  }
};

// Build the full chapter list from PROVINCE_SEQUENCE + CHAPTER_DATA
export const PULL_CHAPTERS = PROVINCE_SEQUENCE.map(p => {
  const data = CHAPTER_DATA[p.chapter] || {};
  return {
    id: `chapter_${String(p.chapter).padStart(3, '0')}`,
    number: p.chapter,
    title: data.title || p.name,
    subtitle: `Province ${p.province}`,
    province: p.province,
    phase: p.phase,
    nextChapter: p.chapter < 21 ? `chapter_${String(p.chapter + 1).padStart(3, '0')}` : null,
    openingNarration: data.openingNarration || '',
    carryForwardItems: data.carryForwardItems || ['etched_shard', 'pipe'],
    requiredAlive: data.requiredAlive || [],
    canonicalEvents: data.canonicalEvents || [],
    bulletKnowledge: data.bulletKnowledge || [],
    playerOnlyKnowledge: data.playerOnlyKnowledge || [],
    debts: data.debts || []
  };
});

export function getChapterByNumber(num) {
  return PULL_CHAPTERS.find(c => c.number === num);
}

export function getChapterByProvince(province) {
  return PULL_CHAPTERS.find(c => c.province === province);
}

export function getChapterById(id) {
  return PULL_CHAPTERS.find(c => c.id === id);
}

export function getNextChapter(currentChapterNum) {
  return PULL_CHAPTERS.find(c => c.number === currentChapterNum + 1);
}

export function getChapterStatus(flags, chapterNum) {
  const statuses = flags.chapter_status || {};
  const chapterId = `chapter_${String(chapterNum).padStart(3, '0')}`;
  return statuses[chapterId] || (chapterNum === 1 ? 'available' : 'locked');
}

export function getCurrentChapterNumber(flags) {
  return flags.current_chapter || 1;
}