import { jsPDF } from 'jspdf';

/**
 * Generates a downloadable character-sheet PDF. The output is a clean,
 * human-readable sheet whose text is selectable — so it can be printed,
 * shared, or re-imported into another campaign via the sheet importer.
 */
export function exportCharacterSheet(character, campaign) {
  const gameSystem = character.game_system || (campaign && campaign.game_system) || 'add1e';
  const isSF = gameSystem === 'starfrontiers';
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });

  const pageW = 612, pageH = 792;
  const margin = 44;
  const contentW = pageW - margin * 2;
  const col2 = margin + 250;
  let y = margin;

  const ink = [28, 22, 16];
  const accent = [122, 72, 28];
  const muted = [120, 108, 92];
  const line = [188, 172, 142];

  const ensureSpace = (needed) => {
    if (y + needed > pageH - margin - 24) { doc.addPage(); y = margin; }
  };

  const sectionHeader = (title) => {
    ensureSpace(40);
    y += 10;
    doc.setDrawColor(...line);
    doc.setLineWidth(0.6);
    doc.line(margin, y, pageW - margin, y);
    y += 14;
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text(title.toUpperCase(), margin, y);
    y += 16;
  };

  const rowPair = (l1, v1, l2, v2) => {
    ensureSpace(20);
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...muted);
    doc.text(l1, margin, y);
    doc.setFont('times', 'normal');
    doc.setTextColor(...ink);
    doc.text(String(v1 ?? '—'), margin + 140, y);
    if (l2) {
      doc.setFont('times', 'bold');
      doc.setTextColor(...muted);
      doc.text(l2, col2, y);
      doc.setFont('times', 'normal');
      doc.setTextColor(...ink);
      doc.text(String(v2 ?? '—'), col2 + 140, y);
    }
    y += 15;
  };

  const paragraph = (text) => {
    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...ink);
    const lines = doc.splitTextToSize(String(text), contentW);
    lines.forEach((l) => {
      ensureSpace(14);
      doc.text(l, margin, y);
      y += 13;
    });
  };

  const listRow = (label, value) => {
    ensureSpace(16);
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...ink);
    doc.text(label, margin, y);
    doc.setFont('times', 'bold');
    doc.setTextColor(...muted);
    doc.text(String(value), pageW - margin, y, { align: 'right' });
    y += 14;
  };

  // ===== HEADER BANNER =====
  doc.setFillColor(244, 236, 216);
  doc.rect(0, 0, pageW, 96, 'F');
  doc.setDrawColor(...line);
  doc.setLineWidth(1);
  doc.line(0, 96, pageW, 96);

  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...ink);
  doc.text(character.name || 'Unnamed Hero', margin, 52);

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(...accent);
  const subtitle = isSF
    ? `${character.race || ''} · ${character.character_class || ''} Operative · Level ${character.level || 1}`
    : `${character.race || ''} ${character.character_class || ''} · Level ${character.level || 1} · ${character.alignment || ''}`;
  doc.text(subtitle, margin, 74);

  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(isSF ? 'STAR FRONTIERS' : 'AD&D 1ST EDITION', pageW - margin, 44, { align: 'right' });
  if (campaign && campaign.name) {
    doc.text(`From the campaign: ${campaign.name}`, pageW - margin, 62, { align: 'right' });
  }
  doc.text(`Status: ${(character.status || 'active').toUpperCase()}`, pageW - margin, 78, { align: 'right' });

  y = 120;

  // ===== VITAL / COMBAT STATS =====
  sectionHeader(isSF ? 'Vital Statistics' : 'Combat Statistics');
  if (isSF) {
    rowPair('Stamina (HP)', `${character.hp_current ?? 0} / ${character.hp_max ?? 0}`, 'Credits', `${character.gold ?? 0} Cr`);
    rowPair('Level', character.level ?? 1);
  } else {
    rowPair('Hit Points', `${character.hp_current ?? 0} / ${character.hp_max ?? 0}`, 'Armor Class', character.ac ?? 10);
    rowPair('THAC0', character.thaco ?? 20, 'Experience', `${character.xp ?? 0} XP`);
    rowPair('Gold', `${character.gold ?? 0} gp`, 'Level', character.level ?? 1);
  }

  // ===== ABILITY SCORES =====
  sectionHeader(isSF ? 'Ability Scores (1-100)' : 'Ability Scores (3-18)');
  const scores = character.ability_scores || {};
  const abilities = isSF
    ? [['STR', 'str'], ['INT', 'int'], ['LOG', 'log'], ['DEX', 'dex'], ['RS', 'rs'], ['PER', 'per'], ['LDR', 'ldr'], ['STA', 'sta']]
    : [['STR', 'str'], ['INT', 'int'], ['WIS', 'wis'], ['DEX', 'dex'], ['CON', 'con'], ['CHA', 'cha']];
  const perRow = 4;
  const rows = Math.ceil(abilities.length / perRow);
  const cellW = contentW / perRow;
  ensureSpace(rows * 26 + 4);
  abilities.forEach(([label, key], i) => {
    const col = i % perRow;
    const rowI = Math.floor(i / perRow);
    const x = margin + col * cellW;
    const ry = y + rowI * 26;
    doc.setFont('times', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(label, x, ry);
    doc.setFont('times', 'normal');
    doc.setFontSize(15);
    doc.setTextColor(...ink);
    doc.text(String(scores[key] ?? '—'), x + 38, ry);
  });
  y += rows * 26 + 4;

  // ===== SAVING THROWS (AD&D) =====
  if (!isSF) {
    const saves = character.saving_throws || {};
    sectionHeader('Saving Throws');
    rowPair('Poison / Death', saves.poison_death, 'Rod / Staff / Wand', saves.wand);
    rowPair('Petrification / Poly', saves.petrification, 'Breath Weapon', saves.breath);
    rowPair('Spell', saves.spell);
  }

  // ===== SKILLS (SF) =====
  if (isSF) {
    const skills = character.skills || [];
    sectionHeader('Skills');
    if (skills.length) {
      skills.forEach((s) => listRow(s.name, `Level ${s.level}`));
    } else {
      paragraph('No skills recorded.');
    }
    y += 2;
  }

  // ===== EQUIPMENT =====
  const equipment = character.equipment || [];
  sectionHeader('Equipment & Inventory');
  if (equipment.length) {
    equipment.forEach((e) => listRow(e.name + (e.notes ? ` — ${e.notes}` : ''), e.qty > 1 ? `×${e.qty}` : '1'));
  } else {
    paragraph('No equipment carried.');
  }

  // ===== SPELLS (AD&D) =====
  if (!isSF) {
    const spells = character.spells || [];
    sectionHeader('Spells Known');
    if (spells.length) {
      paragraph(spells.join(' · '));
    } else {
      paragraph('No spells known.');
    }
  }

  // ===== APPEARANCE & BACKGROUND =====
  if (character.appearance) {
    sectionHeader('Appearance');
    paragraph(character.appearance);
  }
  if (character.background) {
    sectionHeader('Background');
    paragraph(character.background);
  }

  // ===== FOOTER on every page =====
  const pageCount = (doc.getNumberOfPages ? doc.getNumberOfPages() : doc.internal.getNumberOfPages()) || 1;
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(`${character.name} — Character Sheet`, margin, pageH - 22);
    doc.text(`Page ${p} of ${pageCount}`, pageW - margin, pageH - 22, { align: 'right' });
  }

  const filename = `${(character.name || 'character').replace(/[^a-z0-9]+/gi, '_')}_sheet.pdf`;
  doc.save(filename);
}