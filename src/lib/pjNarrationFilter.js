// Plain-language narration filter for Pathfinder Journeys.
// Applied before display to ensure readability for high-school-level readers.
// Replaces dense technical/legal/military jargon with plain English equivalents.

const JARGON_REPLACEMENTS = [
  [/\badjudications\b/gi, 'judgments'],
  [/\badjudication\b/gi, 'judgment'],
  [/\binterdictions\b/gi, 'ship blockades'],
  [/\binterdiction\b/gi, 'ship blockade'],
  [/\bsector-signature\b/gi, 'official ID code'],
  [/\bsector signature\b/gi, 'official ID code'],
  [/\bclaim string\b/gi, 'legal claim marker'],
  [/\bauthorization lattice\b/gi, 'permission network'],
  [/\bprocedural compression\b/gi, 'signal compression'],
  [/\buplink queue\b/gi, 'transmission queue'],
  [/\bsecure bind\b/gi, 'secure connection'],
  [/\bauthorization packet\b/gi, 'permission code'],
  [/\brouting header\b/gi, 'signal source'],
  [/\buplink\b/gi, 'transmission'],
];

export function enforceReadableNarration(text) {
  if (!text || typeof text !== 'string') return text;
  let result = text;
  for (const [pattern, replacement] of JARGON_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export const NARRATION_STYLES = [
  { value: 'cinematic_simple', label: 'Cinematic Simple', short: 'Cinematic' },
  { value: 'technical_sci_fi', label: 'Technical Sci-Fi', short: 'Technical' },
  { value: 'brief_command', label: 'Brief Command Report', short: 'Brief' },
  { value: 'novel_mode', label: 'Novel Mode', short: 'Novel' },
];