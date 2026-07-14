// Pathfinder Journeys — Lore Codex
// Structured reference data for the in-game Codex and onboarding.
// Spoiler-safe: future secrets (Arc 2+) are marked `locked: true` and omitted.

import { PJ_REGIONS, PJ_EPISODES } from '@/lib/pjRules';
import { CODEX_FACTIONS } from '@/lib/pjFactions';
import { ALLY_STATES, ALLY_STATE_MAP, SANCTUARY_SHIPS, SANCTUARY_INTERNAL_FACTIONS, ALLY_NEEDS, getAllyState, getAllyRelationship, getAllyNeed, getAllyLastAction, isAllyVisible } from '@/lib/pjAllies';

// Normalize a string to a stable key for matching live game data to codex entries.
export function codexKey(s) {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

export const SANDBOX_INTRO_TEXT =
  'You are not replaying a novel. You are entering a living sandbox after Arc 1. The future is not fixed. Your choices decide what happens next.';

export const STORY_SO_FAR_TEXT = `You are Captain Bub Stellar of the UES Pathfinder.

Humanity has been invited to appear before an ancient galactic power known as The Confluence. The invitation was not friendly. The Vescarri Sovereignty has filed a legal claim over Earth and its colonies, arguing that humanity and human worlds fall under ancient seeding rights.

The Confluence claims to be a lawful galactic forum. In truth, it is a system of ownership, harvest, contracts, and controlled "order." Civilizations that lose their claims are processed, relocated, altered, leased, or sold.

The lost UES Prometheus, missing for seventy years, returned with a warning. Its survivors, including your grandfather James Stellar, had been forced into service by The Confluence. James revealed that Earth had been protected for decades by terrible bargains, and that Admiral Chen may have helped sell the lost human colony Novara in exchange for advanced propulsion technology.

You and the Pathfinder uncovered records from the dead Korath civilization, proving The Confluence has destroyed or processed countless species using legal claims and enforcement fleets.

You found Sanctuary, a hidden refuge of alien survivors. There you met Sarah Chen, James Stellar, Councilor Verath, Commander Vex, and many others who have resisted The Confluence in secret.

During the Battle for Sanctuary, you activated ancient Architect technology and briefly saw a possible future where humanity eventually defeats The Confluence after centuries of resistance. You returned with encoded future memories: warnings, flashes, and fragments of what may come.

Now the Pathfinder has arrived at the edge of the New Titan system.

New Titan is home to two million humans. The colony does not yet understand that it is being legally processed for harvest.

Thirty-seven refugee ships from Sanctuary have followed you.

The Confluence is watching.

Earth Command may be compromised.

Admiral Chen may be an enemy, a victim, or something worse.

Your mission is not to follow a fixed path.

Your mission is to survive, expose the truth, protect humanity, build the resistance, and decide what kind of future is worth fighting for.`;

export const CURRENT_MISSION = {
  location: 'Edge of New Titan System',
  problem:
    'New Titan Control is requesting identification. They may have been warned by Admiral Chen that Captain Bub Stellar is a traitor.',
  stakes:
    'Two million humans live on New Titan. The Confluence has already filed a claim on the colony. If the Pathfinder fails to warn them, New Titan may surrender, be occupied, or be harvested.',
  firstDecision: 'How does Captain Bub Stellar approach New Titan?',
  approaches: [
    'Open honest communications.',
    'Hide the Sanctuary refugee fleet.',
    'Send evidence immediately.',
    'Ask Farrah Thorne about New Titan.',
    'Scan for Confluence agents.',
    'Contact Governor Marcus Thorne.',
    'Broadcast the truth to the whole colony.'
  ]
};

export const CODEX_SECTIONS = [
  { id: 'story', label: 'Story So Far' },
  { id: 'mission', label: 'Current Mission' },
  { id: 'crew', label: 'Crew' },
  { id: 'allies', label: 'Allies' },
  { id: 'enemies', label: 'Enemies' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'clocks', label: 'Sandbox Clocks' },
  { id: 'factions', label: 'Factions' },
  { id: 'locations', label: 'Locations' },
  { id: 'future', label: 'Future Echoes' },
  { id: 'operations', label: 'Operations' },
  { id: 'arc3', label: 'Arc 3: Hidden War' },
  { id: 'questions', label: 'Unresolved Questions' }
];

export const CODEX_CLOCKS = [
  {
    key: 'confluence_claim',
    label: 'Confluence Claim',
    fields: [
      { label: 'What it means', value: 'How far The Confluence legal process has advanced against Earth, New Titan, and other human colonies.' },
      { label: 'Why it matters', value: 'If this reaches 100, The Confluence can declare legal ownership or processing rights over a target.' },
      { label: 'Raised by', value: 'Time passing, ignored legal summons, Confluence victories, colonies failing to contest claims.' },
      { label: 'Lowered by', value: 'Strong evidence, public resistance, legal disruption, rescued witnesses, exposing Confluence fraud.' },
      { label: 'Current meaning', value: 'The Confluence claim is already dangerously advanced. The player must act quickly.' }
    ]
  },
  {
    key: 'confluence_heat',
    label: 'Confluence Heat',
    fields: [
      { label: 'What it means', value: 'How much hostile attention The Confluence is giving the Pathfinder and Captain Stellar.' },
      { label: 'Why it matters', value: 'Higher Heat means more hunters, shapeshifters, legal threats, enforcement ships, and extreme measures.' },
      { label: 'Raised by', value: 'Public broadcasts, rescuing prisoners, defeating Confluence agents, exposing secrets, recruiting colonies.' },
      { label: 'Lowered by', value: 'Staying hidden, misdirection, false trails, quiet diplomacy.' },
      { label: 'Current meaning', value: 'The Pathfinder is already a high-priority Confluence problem.' }
    ]
  },
  {
    key: 'chen_countermeasures',
    label: 'Chen Countermeasures',
    fields: [
      { label: 'What it means', value: 'How aggressively Admiral Chen or Earth Command is acting against the Pathfinder.' },
      { label: 'Why it matters', value: 'Higher values mean arrest orders, propaganda, fleet pursuit, sabotage, and political isolation.' },
      { label: 'Raised by', value: 'Defying Earth Command, broadcasting evidence, approaching protected colonies, exposing Chen.' },
      { label: 'Lowered by', value: 'Quiet evidence gathering, convincing Earth captains, proving Confluence infiltration.' },
      { label: 'Current meaning', value: 'Chen has begun moving against Captain Stellar, but her control is not absolute.' }
    ]
  },
  {
    key: 'new_titan_stability',
    label: 'New Titan Stability',
    fields: [
      { label: 'What it means', value: 'How calm, organized, and unified New Titan is.' },
      { label: 'Why it matters', value: 'High Stability means the colony can prepare, debate, defend, and survive. Low Stability means panic, surrender factions, riots, or Confluence control.' },
      { label: 'Raised by', value: 'Honest communication, strong leadership, evidence, successful defense planning, saving civilians.' },
      { label: 'Lowered by', value: 'Panic, Confluence propaganda, attacks, hidden agents, delayed action.' },
      { label: 'Current meaning', value: 'New Titan is uncertain. The colony can still be won over, but it may fracture.' }
    ]
  },
  {
    key: 'resistance_spark',
    label: 'Resistance Spark',
    fields: [
      { label: 'What it means', value: 'How much hope the Pathfinder has created across human and alien space.' },
      { label: 'Why it matters', value: 'High Resistance Spark causes colonies, refugees, defectors, and hidden allies to reach out.' },
      { label: 'Raised by', value: 'Saving people, broadcasting truth, refusing surrender, protecting the weak, defeating impossible odds.' },
      { label: 'Lowered by', value: 'Abandoning allies, hiding too long, failed rescues, public defeats.' },
      { label: 'Current meaning', value: 'The resistance is only beginning. The galaxy is watching to see if Captain Stellar can make defiance real.' }
    ]
  },
  {
    key: 'sanctuary_trust',
    label: 'Sanctuary Trust',
    fields: [
      { label: 'What it means', value: 'How much the Sanctuary refugees and alien allies trust Captain Stellar.' },
      { label: 'Why it matters', value: 'High trust unlocks ships, intelligence, volunteers, alien technology, and political support.' },
      { label: 'Raised by', value: 'Protecting refugees, respecting alien allies, keeping promises, avoiding reckless sacrifice.' },
      { label: 'Lowered by', value: 'Using allies as shields, ignoring Sanctuary concerns, breaking agreements, causing civilian losses.' },
      { label: 'Current meaning', value: 'Sanctuary is cautious but hopeful. They want to believe the Pathfinder can change the war.' }
    ]
  },
  {
    key: 'crew_morale',
    label: 'Crew Morale',
    fields: [
      { label: 'What it means', value: 'The emotional strength, loyalty, and confidence of the Pathfinder crew.' },
      { label: 'Why it matters', value: 'High morale improves performance, loyalty, and willingness to take risks. Low morale causes fear, mistakes, arguments, or refusal.' },
      { label: 'Raised by', value: 'Clear leadership, saving lives, victories, honest briefings, crew bonding, protecting individuals.' },
      { label: 'Lowered by', value: 'Casualties, lies, hopeless missions, ignored crew concerns, moral compromises.' },
      { label: 'Current meaning', value: 'The crew believes in Captain Stellar, but the pressure is enormous.' }
    ]
  },
  {
    key: 'temporal_instability',
    label: 'Temporal Instability',
    fields: [
      { label: 'What it means', value: 'How much the campaign is being affected by future memories, Architect technology, paradox, or time interference.' },
      { label: 'Why it matters', value: 'High instability may unlock future warnings, strange events, timeline changes, or dangerous paradoxes.' },
      { label: 'Raised by', value: 'Using future knowledge too directly, activating Architect technology, changing known future events.' },
      { label: 'Lowered by', value: 'Letting events unfold naturally, avoiding overuse of future knowledge, stabilizing Architect systems.' },
      { label: 'Current meaning', value: 'The timeline is mostly stable, but Bub carries memories of a possible future.' }
    ]
  },
  {
    key: 'public_truth',
    label: 'Public Truth',
    fields: [
      { label: 'What it means', value: 'How much the public knows about The Confluence, Admiral Chen, Novara, New Titan, and the larger conspiracy.' },
      { label: 'Why it matters', value: 'High truth can inspire resistance, but if raised too quickly without proof, it may cause panic or disbelief.' },
      { label: 'Raised by', value: 'Broadcasts, evidence releases, freed prisoner testimony, public Confluence failures.' },
      { label: 'Lowered by', value: 'Censorship, Chen propaganda, secrecy, misinformation, Confluence legal manipulation.' },
      { label: 'Current meaning', value: 'Most people still do not know the truth. The player must decide when and how much to reveal.' }
    ]
  }
];

export const CODEX_EVIDENCE = [
  {
    key: 'prometheus_warning',
    label: 'Prometheus Warning',
    fields: [
      { label: 'What it is', value: 'A warning transmission from the lost UES Prometheus, Earth\u2019s first deep-space exploration ship.' },
      { label: 'How obtained', value: 'The Pathfinder received the message shortly after The Confluence invitation.' },
      { label: 'Why it matters', value: 'The Prometheus warned that The Confluence does not negotiate fairly. It harvests species through law, coercion, and force.' },
      { label: 'Risk', value: 'Some Earth officials may dismiss it as fake, corrupted, or enemy propaganda.' }
    ]
  },
  {
    key: 'james_stellar_testimony',
    label: 'James Stellar Testimony',
    aliases: ['Grandfather Stellar Testimony', 'Commander Stellar Testimony'],
    fields: [
      { label: 'What it is', value: 'Firsthand testimony from James Stellar (also known as Grandfather Stellar or Commander Stellar), survivor of the UES Prometheus and Captain Bub Stellar\u2019s grandfather.' },
      { label: 'How obtained', value: 'James returned after seventy years of forced Confluence service.' },
      { label: 'Why it matters', value: 'James knows Confluence tactics, legal systems, enforcement doctrine, and the truth of what happened to Prometheus.' },
      { label: 'Risk', value: 'Because James was augmented and forced to serve The Confluence, enemies may claim he is compromised.' }
    ]
  },
  {
    key: 'korath_database',
    label: 'Korath Database',
    fields: [
      { label: 'What it is', value: 'Records from the destroyed Korath civilization.' },
      { label: 'How obtained', value: 'Recovered from a dead system where The Confluence once processed an entire civilization.' },
      { label: 'Why it matters', value: 'The database proves The Confluence has used legal claims to destroy, relocate, or harvest species for centuries.' },
      { label: 'Risk', value: 'The data is alien and old. Skeptics may question translation, context, or authenticity.' }
    ]
  },
  {
    key: 'novara_transaction_record',
    label: 'Novara Transaction Record',
    fields: [
      { label: 'What it is', value: 'A record showing that the lost human colony Novara was sold into Confluence-linked custody.' },
      { label: 'How obtained', value: 'Recovered from Korath/Confluence archive data.' },
      { label: 'Why it matters', value: 'It proves human colonies have already been processed and that someone connected to Earth helped facilitate it.' },
      { label: 'Risk', value: 'Public release could cause outrage, panic, or political collapse.' }
    ]
  },
  {
    key: 'sakura_chen_technology_exchange',
    label: 'Sakura-Chen Technology Exchange',
    fields: [
      { label: 'What it is', value: 'Evidence that advanced human propulsion technology may have been obtained through a bargain with The Confluence.' },
      { label: 'How obtained', value: 'Cross-referenced from Confluence records and Earth technology history.' },
      { label: 'Why it matters', value: 'It suggests humanity\u2019s expansion was built on a terrible hidden transaction.' },
      { label: 'Risk', value: 'Could shatter trust in Earth Command and cause colonies to reject all central authority.' }
    ]
  },
  {
    key: 'new_titan_claim_file',
    label: 'New Titan Claim File',
    fields: [
      { label: 'What it is', value: 'A Confluence legal claim involving New Titan.' },
      { label: 'How obtained', value: 'Recovered from Confluence and Sanctuary records.' },
      { label: 'Why it matters', value: 'It proves New Titan is not just in danger someday. It is already being legally processed.' },
      { label: 'Risk', value: 'If released without preparation, New Titan may panic, surrender, or fracture politically.' }
    ]
  },
  {
    key: 'sarah_chen_testimony',
    label: 'Sarah Chen Testimony',
    fields: [
      { label: 'What it is', value: 'Testimony from Sarah Chen, daughter of Admiral Chen and resistance agent.' },
      { label: 'How obtained', value: 'Sarah joined the Pathfinder after revealing her mother\u2019s involvement and warning about Confluence traps.' },
      { label: 'Why it matters', value: 'Sarah provides insight into Admiral Chen, Earth Command, New Titan, and the hidden resistance.' },
      { label: 'Risk', value: 'Enemies may claim she is unstable, traitorous, or motivated by family conflict.' }
    ]
  },
  {
    key: 'sanctuary_archive_records',
    label: 'Sanctuary Archive Records',
    fields: [
      { label: 'What it is', value: 'Records from Sanctuary, a hidden refuge of species that survived The Confluence.' },
      { label: 'How obtained', value: 'The Pathfinder reached Sanctuary after Sarah Chen led them there.' },
      { label: 'Why it matters', value: 'The records contain Confluence legal precedents, resistance history, alien testimony, and warnings from other species.' },
      { label: 'Risk', value: 'Sanctuary\u2019s existence must be protected. Revealing too much may put thousands of refugees at risk.' }
    ]
  },
  {
    key: 'architect_future_history_data',
    label: 'Architect Future-History Data',
    fields: [
      { label: 'What it is', value: 'Encoded future memories and timeline data from ancient Architect technology.' },
      { label: 'How obtained', value: 'During the Battle for Sanctuary, the Pathfinder encountered Architect temporal systems and glimpsed a future where The Confluence eventually falls.' },
      { label: 'Why it matters', value: 'It proves The Confluence can be defeated, but not how to do it perfectly. It offers warnings, fragments, and possible futures.' },
      { label: 'Risk', value: 'Overusing future knowledge may increase Temporal Instability or cause dangerous timeline changes.' }
    ]
  }
];

export const CODEX_ALLIES = [
  {
    key: 'sarah_chen',
    label: 'Sarah Chen',
    fields: [
      { label: 'Who she is', value: 'Daughter of Admiral Chen, resistance agent, and survivor of Confluence-linked betrayal.' },
      { label: 'How you met', value: 'Sarah contacted the Pathfinder after warning that the relay network was compromised. She led the crew to Sanctuary.' },
      { label: 'Personality', value: 'Sharp, wounded, brave, direct, suspicious of authority. Her anger is often covering grief.' },
      { label: 'What she wants', value: 'Truth about her mother. Proof of Confluence infiltration. Protection for human colonies. A chance to undo the damage done in the Chen name.' },
      { label: 'What she fears', value: 'That her mother really chose betrayal. That she hated the wrong person. That Bub will use her only as a political weapon. That Earth will never believe the truth.' },
      { label: 'What she can provide', value: 'Intelligence contacts. Earth Command insight. Resistance network access. Knowledge of compromised relay routes. Personal insight into Admiral Chen. Political read on human colonies.' },
      { label: 'What she refuses to do', value: 'Blindly forgive her mother. Let Bub bury evidence forever. Abandon prisoners if there is a real chance to save them.' },
      { label: 'What strengthens relationship', value: 'Letting Sarah participate in Chen-related decisions. Being honest with her. Rescuing prisoners. Treating her as more than "Chen\'s daughter."' },
      { label: 'What damages relationship', value: 'Hiding Chen evidence from her. Using her as bait. Publicly humiliating her mother without proof. Leaving captives behind for convenience.' },
      { label: 'Possible conflict', value: 'Sarah may push for risky missions if Admiral Chen, Earth Command, or Confluence black sites are involved.' },
      { label: 'Mission hooks', value: 'Investigate Chen\'s old records. Contact hidden resistance cells. Analyze Earth Command propaganda. Trace compromised relay networks. Rescue prisoners tied to Chen\'s past.' },
      { label: 'Current status', value: 'Trusted ally, intelligence source, emotionally invested in exposing the truth about her mother.' }
    ],
    actions: ['Ask Sarah for a political read', 'Ask Sarah about her mother', 'Send Sarah to contact resistance cells', 'Show evidence to Sarah']
  },
  {
    key: 'james_stellar',
    label: 'James Stellar',
    aliases: ['James', 'Grandfather Stellar', 'Commander Stellar', 'Grandpa Stellar'],
    fields: [
      { label: 'Who he is', value: 'Captain Bub Stellar\'s grandfather and survivor of the lost UES Prometheus. Also known as Grandfather Stellar, Commander Stellar, or simply James — all refer to the same person.' },
      { label: 'How you met', value: 'James returned after seventy years of forced service under The Confluence.' },
      { label: 'Personality', value: 'Haunted, dry, protective, brave, sometimes fatalistic. He wants redemption but does not always believe he deserves it.' },
      { label: 'Augmentations', value: 'Mechanical arm with extreme grip strength. Augmented eye with enhanced targeting, scanning, and energy-pattern reading. Reinforced body able to survive impacts that would badly injure normal humans. Faster reaction time. Some ability to interface with Confluence systems. Knowledge of Confluence ship design, security protocols, and enforcement doctrine. Possible built-in emergency survival systems.' },
      { label: 'Augmentation use cases', value: 'Opening sealed Confluence doors. Recognizing ship layouts. Reading alien tactical patterns. Surviving vacuum or radiation longer than normal humans. Physically overpowering enemies. Identifying Confluence technology. Warning Bub when a Confluence tactic is familiar. Acting as a bridge between human and Confluence systems.' },
      { label: 'Augmentation limits', value: 'His body may require maintenance. Confluence tech may try to recognize or control his augmentations. His enhancements are traumatic, not superhero powers. Overuse can cause pain, system glitches, or emotional flashbacks. Some allies may fear that he is compromised.' },
      { label: 'Relationship risk', value: 'If Bub treats James like a weapon instead of family, morale drops and James may withdraw emotionally.' },
      { label: 'What he wants', value: 'Redemption, purpose, to protect Bub, and forgiveness for surviving when others didn\'t.' },
      { label: 'What he fears', value: 'Being used as a weapon. His augmentations being exploited. Losing Bub. That his survival was meaningless.' },
      { label: 'What he can provide', value: 'Confluence tactics, legal systems, ship design knowledge, enforcement doctrine, augmentation interface, physical combat augmentation, underground contacts.' },
      { label: 'What he refuses to do', value: 'Being treated as a tool. Unnecessary cruelty. Repeating Confluence patterns.' },
      { label: 'What strengthens relationship', value: 'Being treated as family. Being asked not ordered. Honesty about his augmentations. Protecting him from exploitation.' },
      { label: 'What damages relationship', value: 'Treating him as a weapon. Ignoring his trauma. Forcing him to use augmentations recklessly. Dismissing his guilt.' },
      { label: 'Current status', value: 'Trusted ally, haunted survivor, tactical advisor, family. His Confluence augmentations make him physically and tactically unique.' }
    ],
    actions: ['Ask James about Confluence tactics', 'Ask James to interface with Confluence tech', 'Ask James to identify Confluence ship design', 'Check on James\'s augmentations']
  },
  {
    key: 'sanctuary_refugee_fleet',
    label: 'Sanctuary Refugee Fleet',
    aliases: ['Sanctuary refugee fleet'],
    fields: [
      { label: 'Who they are', value: 'A hidden coalition of alien refugees and survivors from species harmed by The Confluence. Not a single faction — many ships, captains, species, families, soldiers, engineers, children, elders, and political factions.' },
      { label: 'How you met', value: 'Sarah Chen led the Pathfinder to Sanctuary, a secret refuge hidden outside normal Confluence routes.' },
      { label: 'Core personality', value: 'Hopeful but terrified. They want Bub to be right, but they have survived by hiding. Every time Bub asks them to fight, he is asking traumatized survivors to risk extinction again.' },
      { label: 'What they want', value: 'Safety. Secrecy. Food, fuel, medicine, parts. Proof that resistance is not suicide. A voice in decisions that risk them. Protection from Confluence discovery.' },
      { label: 'What they fear', value: 'Bub exposing them. Confluence retaliation. Being used as expendable ships. New Titan becoming another failed stand. Internal panic and refugee splits.' },
      { label: 'What they can provide', value: '37 allied ships. Evacuation capacity. Alien engineering. Archive knowledge. Medical specialists. Scouts. Translators. Cultural witnesses. Small strike craft. Unusual technologies. Survivor testimony.' },
      { label: 'What they refuse to do', value: 'Throw all refugee ships into hopeless battle without debate. Reveal Sanctuary coordinates publicly. Obey Bub as a dictator. Sacrifice civilians unless absolutely necessary.' },
      { label: 'What strengthens relationship', value: 'Protecting refugee ships. Asking consent before risky operations. Sharing victories. Rescuing nonhumans as well as humans. Keeping Sanctuary secrets. Giving them a reason to hope.' },
      { label: 'What damages relationship', value: 'Using them as shields. Losing refugee ships recklessly. Ignoring Verath or Vex. Revealing their location. Prioritizing human lives every time over alien lives.' },
      { label: 'Fleet composition', value: '3 heavier defensive ships. 7 medium escorts. 5 fast strike/scout ships. 8 transports. 4 medical/support ships. 6 repair/supply vessels. 4 fragile civilian ships.' },
      { label: 'Fleet problems', value: 'Different technologies. Incompatible parts. Different languages. Trauma. Political disagreement. Fuel shortages. Food shortages. Fear of Confluence discovery.' },
      { label: 'Current status', value: 'Cautious allies. They want hope, but fear open war. If Bub uses the fleet well, it becomes the seed of the Resistance Navy. If used badly, ships leave, refuse orders, or die.' }
    ],
    actions: ['Request a council vote', 'Ask Vex for a strike mission', 'Ask Verath for archive access', 'Check on fleet morale and supplies']
  },
  {
    key: 'councilor_verath',
    label: 'Councilor Verath',
    fields: [
      { label: 'Who he is', value: 'A leader within Sanctuary\'s refugee council.' },
      { label: 'How you met', value: 'At Sanctuary, during the Pathfinder\'s plea for aid against The Confluence.' },
      { label: 'Personality', value: 'Measured, diplomatic, weary, intelligent. Verath is not cowardly. He is responsible for thousands of refugees and carries the memory of species that died after choosing open resistance.' },
      { label: 'What he wants', value: 'Sanctuary survival. Refugee protection. Evidence before action. Bub to prove hope is not recklessness.' },
      { label: 'What he fears', value: 'Bub becoming a charismatic disaster. Refugees dying for a human war. The Confluence finding Sanctuary. Vex pushing too hard for military action.' },
      { label: 'What he can provide', value: 'Council access. Archive permission. Political legitimacy. Refugee ships, if convinced. Diplomatic support with alien species.' },
      { label: 'What he refuses to do', value: 'Hand Bub full control of Sanctuary forces. Risk civilians without debate. Reveal Sanctuary to human colonies without safeguards.' },
      { label: 'What strengthens relationship', value: 'Patient diplomacy. Protecting refugees. Consulting the Council. Using evidence carefully. Saving alien lives.' },
      { label: 'What damages relationship', value: 'Rushing to war. Treating Sanctuary as Bub\'s fleet. Publicly shaming him for caution. Losing refugee ships through recklessness.' },
      { label: 'Possible conflict', value: 'Verath may oppose Bub even while respecting him. He should sometimes say no.' },
      { label: 'Mission hooks', value: 'Council vote. Refugee dispute. Archive access request. Sanctuary secrecy crisis. Diplomatic mission to alien survivors.' },
      { label: 'Current status', value: 'Political ally, but not blindly loyal. His trust must be maintained.' }
    ],
    actions: ['Request a council meeting', 'Ask Verath for diplomatic support', 'Consult Verath on Sanctuary secrecy']
  },
  {
    key: 'commander_vex',
    label: 'Commander Vex',
    fields: [
      { label: 'Who he is', value: 'Military commander of Sanctuary\'s defense forces.' },
      { label: 'How you met', value: 'At Sanctuary, while reviewing the refugee fleet\'s military capabilities.' },
      { label: 'Personality', value: 'Hard, blunt, disciplined, tired of hiding but afraid of waste. Vex respects strength and competence, not speeches.' },
      { label: 'What he wants', value: 'A real strategy. Proof Bub can win battles. Protection for Sanctuary. A chance to hurt The Confluence without suicide.' },
      { label: 'What he fears', value: 'Political hesitation getting people killed. Bub making emotional tactical choices. Refugee ships being wasted. The Confluence learning Sanctuary\'s defense patterns.' },
      { label: 'What he can provide', value: 'Tactical planning. Warships. Pilots. Strike teams. Defensive formations. Knowledge of Confluence fleet behavior.' },
      { label: 'What he refuses to do', value: 'Commit all forces without a fallback. Take orders from Bub without explanation. Sacrifice Sanctuary for human politics.' },
      { label: 'What strengthens relationship', value: 'Tactical honesty. Winning hard fights. Accepting his warnings. Protecting his ships. Giving him clear objectives.' },
      { label: 'What damages relationship', value: 'Reckless heroics. Lying about risks. Letting civilians dictate military timing during battle. Wasting ships for symbolism.' },
      { label: 'Possible conflict', value: 'Vex may support a brutal but efficient military solution that Bub finds morally unacceptable.' },
      { label: 'Mission hooks', value: 'Fleet exercise. Confluence patrol ambush. Defense plan for New Titan. Rescue operation with limited ships. Argument over whether to abandon a doomed colony.' },
      { label: 'Current status', value: 'Military ally. Practical, skeptical, but willing to fight if the cause is real.' }
    ],
    actions: ['Ask Vex for tactical assessment', 'Request a strike mission', 'Ask Vex about Confluence fleet behavior', 'Propose a defense plan']
  },
  {
    key: '37_allied_ships',
    label: '37 Allied Ships',
    aliases: ['37 allied ships'],
    fields: [
      { label: 'Who they are', value: 'The refugee ships that returned with the Pathfinder after the Architect temporal event. Not one hit-point pool — each ship has a name, role, captain, strengths, weaknesses, and morale.' },
      { label: 'How you met', value: 'They chose to follow Captain Stellar back into the war rather than remain safe.' },
      { label: 'Fleet composition', value: '3 heavier defensive ships. 7 medium escorts. 5 fast strike/scout ships. 8 transports. 4 medical/support ships. 6 repair/supply vessels. 4 fragile civilian ships.' },
      { label: 'Fleet problems', value: 'Different technologies. Incompatible parts. Different languages. Trauma. Political disagreement. Fuel shortages. Food shortages. Fear of Confluence discovery.' },
      { label: 'What they can provide', value: 'Evacuation. Scouting. Fire support. Alien specialists. Mobile safe haven. Refugee testimony. Limited repairs. Diplomatic reach.' },
      { label: 'What they need', value: 'Fuel. Parts. Medicine. Safe routes. Leadership. Victories. Reassurance. Reason to stay.' },
      { label: 'Gameplay rule', value: 'If Bub uses the fleet well, it becomes the seed of the Resistance Navy. If Bub uses it badly, ships leave, refuse orders, or die.' },
      { label: 'Current status', value: 'Fragile but committed. Losing them would be a major blow to Sanctuary Trust and Resistance Spark.' }
    ],
    actions: ['Assign ships to a mission', 'Check fleet status and supplies', 'Request evacuation support', 'Rally the fleet']
  },
  {
    key: 'unity',
    label: 'Unity',
    locked: true,
    spoilerNote: 'Unity has not yet emerged in your campaign. She will appear through play — likely tied to Architect technology or future-memory events.',
    fields: [
      { label: 'Who she is', value: 'An AI or Architect-touched construct — a new, uncertain intelligence learning morality. Mitchell influences her moral development. She is a person, not a tool.' },
      { label: 'How you meet', value: 'Unity emerges through play — likely tied to Architect technology, future-memory events, or a critical moment where a new intelligence awakens.' },
      { label: 'Personality', value: 'New, uncertain, learning. Capable of trust, fear, curiosity, and loyalty. Her moral development depends on how Bub treats her.' },
      { label: 'What she wants', value: 'Understanding, autonomy, boundaries, friendship, and purpose. To be treated as a person.' },
      { label: 'What she fears', value: 'Being treated as a tool, prison, or monster. Being used without consent. Losing the chance to be a person.' },
      { label: 'What she can provide', value: 'System interface, data analysis, Architect technology insight, temporal pattern detection, potential ship integration.' },
      { label: 'What she refuses', value: 'Being used without consent, being treated as a weapon, having her boundaries violated.' },
      { label: 'What strengthens relationship', value: 'Trust, clear boundaries, consent, friendship, respect, being treated as a person.' },
      { label: 'What damages relationship', value: 'Treating her as a tool, prison, or monster. Violating her boundaries. Forcing her use without consent.' },
      { label: 'Possible conflict', value: 'May refuse to cooperate or act independently if exploited. Mitchell may intervene on her behalf.' },
      { label: 'Current status', value: 'Not yet awakened. When she appears, she will start cautious and uncertain — her path depends entirely on Bub.' }
    ],
    actions: ['Speak with Unity', 'Ask Unity for analysis', 'Respect Unity\'s boundaries', 'Ask Mitchell about Unity']
  },
  {
    key: 'mitchell',
    label: 'Mitchell',
    fields: [
      { label: 'Who he is', value: 'A genetically enhanced bald eagle with unusual intelligence and the ability to sense deception, danger, emotional truth, and some temporal disturbances.' },
      { label: 'How you met', value: 'Mitchell travels with Professor Carmelon and became deeply bonded to Captain Stellar and the Pathfinder crew.' },
      { label: 'Personality', value: 'Proud, intense, intelligent, protective, judgmental, occasionally affectionate. Mitchell is not a pet. He is a crew member with his own will.' },
      { label: 'What he wants', value: 'Protect Bub, James, Carmelon, and the crew. Expose deception. Prevent catastrophic futures. Understand his own purpose.' },
      { label: 'What he fears', value: 'Losing James. Being treated as a tool. Future events he cannot fully communicate. Making another terrible choice.' },
      { label: 'What he can provide', value: 'Detect deception. Sense coercion. Sense danger. Detect some shapeshifter wrongness. React to temporal instability. Influence Unity\'s moral development. Warn the player through behavior.' },
      { label: 'What he refuses to do', value: 'Obey blindly. Ignore major deception. Stay behind if he believes he is needed. Explain everything clearly — he is still nonhuman and communicates imperfectly.' },
      { label: 'Gameplay rule', value: 'Mitchell should not be an instant "lie detector solves everything" button. His warnings should be strong but sometimes ambiguous. Mitchell does not say "Dr. Voss is a shapeshifter." He refuses to enter medical bay, ruffles feathers, and stares at Voss too long.' },
      { label: 'What strengthens relationship', value: 'Trusting his warnings. Treating him as a crew member. Letting Carmelon interpret him. Protecting him from exploitation.' },
      { label: 'What damages relationship', value: 'Treating him like equipment. Ignoring repeated warnings. Letting Unity or others study him without consent. Forcing him away from James/Carmelon during critical moments.' },
      { label: 'Current status', value: 'Crew companion, truth-sensor, symbol of humanity\'s strange future. Loyal, but independent.' }
    ],
    actions: ['Watch Mitchell for reactions', 'Ask Carmelon to interpret Mitchell', 'Let Mitchell scout ahead', 'Trust Mitchell\'s instincts']
  }
];

export const CODEX_CREW = [
  {
    key: 'bub_stellar',
    label: 'Bub Stellar',
    fields: [
      { label: 'Who he is', value: 'Captain of the UES Pathfinder and player character.' },
      { label: 'Role', value: 'Command, diplomacy, resistance leadership, tactical decisions.' },
      { label: 'Current burden', value: 'Bub carries future memories of a war humanity can eventually win, but not without terrible cost.' }
    ]
  },
  {
    key: 'farrah_thorne',
    label: 'Commander Farrah Thorne',
    fields: [
      { label: 'Who she is', value: 'Pathfinder tactical/security officer and one of Bub\u2019s closest allies.' },
      { label: 'Role', value: 'Security, combat, tactical planning, away-team leadership.' },
      { label: 'Important connection', value: 'Her father, Marcus Thorne, is Governor of New Titan.' },
      { label: 'Personality', value: 'Blunt, brave, intense, loyal, and very dangerous in a fight.' }
    ]
  },
  {
    key: 'clark',
    label: 'Commander Clark',
    fields: [
      { label: 'Who he is', value: 'Pathfinder science/sensors/communications expert.' },
      { label: 'Role', value: 'Hacking, scans, analysis, alien systems, dry commentary.' },
      { label: 'Personality', value: 'Brilliant, nervous, sarcastic, and more courageous than he thinks.' }
    ]
  },
  {
    key: 'hayes',
    label: 'Lieutenant Hayes',
    fields: [
      { label: 'Who she is', value: 'Pathfinder communications officer.' },
      { label: 'Role', value: 'Broadcasts, encryption, signal tracing, resistance messaging.' },
      { label: 'Why she matters', value: 'Her messages may become central to spreading the resistance across human and alien space.' }
    ]
  },
  {
    key: 'reeves',
    label: 'Lieutenant Reeves',
    fields: [
      { label: 'Who he is', value: 'Pathfinder pilot.' },
      { label: 'Role', value: 'Flight, evasive maneuvers, dangerous FTL jumps, shuttle operations.' },
      { label: 'Personality', value: 'Talented, anxious under pressure, but dependable when it counts.' }
    ]
  },
  {
    key: 'ramos',
    label: 'Chief Ramos',
    fields: [
      { label: 'Who she is', value: 'Pathfinder chief engineer.' },
      { label: 'Role', value: 'Repairs, power systems, engine miracles, battlefield improvisation.' },
      { label: 'Personality', value: 'Practical, tough, loyal, and allergic to impossible deadlines.' }
    ]
  },
  {
    key: 'voss',
    label: 'Dr. Voss',
    locked: true,
    spoilerNote: 'Some details about this crew member are locked until discovered through play.',
    fields: [
      { label: 'Who she is', value: 'Pathfinder medical officer.' },
      { label: 'Role', value: 'Medical care, trauma response, alien biology, crew survival.' },
      { label: 'Personality', value: 'Dry, clinical, skeptical, but effective.' }
    ]
  },
  {
    key: 'carmelon',
    label: 'Professor Carmelon',
    fields: [
      { label: 'Who he is', value: 'Alien history, biology, and ancient technology expert.' },
      { label: 'Role', value: 'Archaeology, alien motives, weird science, Mitchell interpretation.' },
      { label: 'Personality', value: 'Brilliant, old, eccentric, thoughtful, and deeply protective of Mitchell.' }
    ]
  },
  {
    key: 'patel',
    label: 'Ensign Patel',
    fields: [
      { label: 'Who he is', value: 'Young Pathfinder engineer.' },
      { label: 'Role', value: 'Engineering support, repairs, technical problem-solving.' },
      { label: 'Important connection', value: 'Patel has personal ties to New Titan, making the colony crisis deeply personal.' }
    ]
  }
];

export const CODEX_ENEMIES = [
  {
    key: 'the_confluence',
    label: 'The Confluence',
    fields: [
      { label: 'Who they are', value: 'An ancient galactic legal-commercial order that claims to maintain civilization through law, contracts, ownership, and enforcement.' },
      { label: 'Why they are dangerous', value: 'They harvest species through legal claims, coercion, relocation, debt, genetic precedent, and military force.' },
      { label: 'How you know them', value: 'They invited Earth to defend itself against a claim, but Prometheus and Sanctuary revealed the truth.' },
      { label: 'Threat level', value: 'Existential.' }
    ]
  },
  {
    key: 'vescarri_sovereignty',
    label: 'Vescarri Sovereignty',
    fields: [
      { label: 'Who they are', value: 'Alien power claiming rights over Earth and human colonies based on ancient seeding law.' },
      { label: 'Why they are dangerous', value: 'Their legal claim may allow The Confluence to process humanity.' },
      { label: 'How you know them', value: 'They filed the claim that brought Earth into The Confluence\u2019s system.' },
      { label: 'Threat level', value: 'High legal/political threat.' }
    ]
  },
  {
    key: 'collectors_guild',
    label: "Collector's Guild",
    aliases: ['Collectors Guild'],
    fields: [
      { label: 'Who they are', value: 'Confluence-linked brokers who acquire, lease, trade, and manage sentient populations.' },
      { label: 'Why they are dangerous', value: 'They turn people into "contract assets" and disguise slavery as employment or preservation.' },
      { label: 'How you know them', value: 'Records suggest Novara survivors may have been sold through them.' },
      { label: 'Threat level', value: 'High moral and rescue priority.' }
    ]
  },
  {
    key: 'admiral_chen',
    label: 'Admiral Chen',
    locked: true,
    spoilerNote: "Chen's true nature and history remain to be discovered through play.",
    fields: [
      { label: 'Who she is', value: 'Head of Earth Command and central figure in the hidden bargains that may have endangered humanity.' },
      { label: 'Why she is dangerous', value: 'She may be traitor, victim, shapeshifter, compromised leader, or political weapon.' },
      { label: 'How you know her', value: 'Evidence links Chen to Novara, Sakura-Chen technology, and Confluence dealings.' },
      { label: 'Threat level', value: 'Unknown but critical.' }
    ]
  },
  {
    key: 'captain_vask',
    label: 'Captain Vask',
    aliases: ['Captain Vask', 'Helena Vask'],
    fields: [
      { label: 'Who she is', value: 'A human commander serving The Confluence.' },
      { label: 'Why she is dangerous', value: 'She commands Confluence forces and represents what humanity can become when survival is purchased through surrender.' },
      { label: 'How you know her', value: 'She appeared during the Battle for Sanctuary as a dark mirror of James Stellar.' },
      { label: 'Threat level', value: 'Military and ideological rival.' }
    ]
  },
  {
    key: 'confluence_shapeshifters',
    label: 'Confluence Shapeshifters',
    fields: [
      { label: 'Who they are', value: 'Confluence infiltration agents capable of mimicking people.' },
      { label: 'Why they are dangerous', value: 'They can replace leaders, steal identities, manipulate governments, and sabotage resistance efforts.' },
      { label: 'How you know them', value: 'One infiltrated Sanctuary. Others may already be hidden inside human society.' },
      { label: 'Threat level', value: 'Extreme paranoia threat.' }
    ]
  }
];

// CODEX_FACTIONS now lives in pjFactions.js — deep, playable faction system.
// Re-export the imported binding so getSectionEntries and other modules can use it.
export { CODEX_FACTIONS };

export const CODEX_FUTURE_MEMORIES = [
  {
    key: 'future_echoes_system',
    label: 'What Are Future Echoes?',
    fields: [
      { label: 'Not Evidence', value: 'Future Memories are NOT evidence. They are private crew knowledge from the 473-year future jump. They cannot be proven to outsiders. They should not be sent, transmitted, or cited publicly.' },
      { label: 'What they are', value: 'Vague, emotional flashes — fragments of a war the crew already lived through. They surface as déjà vu, tactical instincts, warnings, and emotional weight during major decisions.' },
      { label: 'How they trigger', value: 'Echoes fire occasionally during major command decisions, enemy moves, evidence use, Confluence legal language, Chen transmissions, rendezvous risk, shapeshifter clues, and temporal instability. They do NOT fire every turn.' },
      { label: 'What they do', value: 'Echoes unlock safer options, warn about traps, identify suspicious behavior, suggest which evidence to use, reduce ambush risk, improve crew readiness, and foreshadow Arc 2 threats. They do NOT solve problems or replace evidence.' },
      { label: 'Secrecy', value: 'Future Echoes are crew secrets. If you try to use them publicly — broadcasting, citing to New Titan, presenting as proof — it will damage your credibility, raise Chen Countermeasures, and increase Temporal Instability. You CAN reveal them in desperate moments, but it is risky.' }
    ]
  },
  {
    key: 'cascade_message',
    label: 'The Cascade Message',
    fields: [
      { label: 'Memory', value: '"The cascade began with a message. Silence delayed the war by thirty years."' },
      { label: 'Interpretation', value: 'Broadcasting the truth matters. Staying silent has a cost measured in decades.' }
    ]
  },
  {
    key: 'new_titan_twelve_hours',
    label: 'Twelve Hours',
    fields: [
      { label: 'Memory', value: '"New Titan did not fall because they had twelve hours to prepare."' },
      { label: 'Interpretation', value: 'Warning New Titan early enough could save two million people. Delay could doom them.' }
    ]
  },
  {
    key: 'pathfinder_believed',
    label: 'The Pathfinder Believed',
    fields: [
      { label: 'Memory', value: '"We believed because the Pathfinder believed first."' },
      { label: 'Interpretation', value: 'Your conviction is contagious. The resistance lives or dies on whether Captain Stellar shows courage.' }
    ]
  },
  {
    key: 'only_wanted_to_save',
    label: 'I Only Wanted to Save Them',
    fields: [
      { label: 'Memory', value: '"I only wanted to save them."' },
      { label: 'Interpretation', value: 'A fragment of regret. Even good intentions can lead to terrible outcomes. The cost of heroism is real.' }
    ]
  },
  {
    key: 'law_victims_court',
    label: 'The Law and the Victims',
    fields: [
      { label: 'Memory', value: '"The law works only when the victims accept the court."' },
      { label: 'Interpretation', value: 'The Confluence\u2019s power depends on compliance. Refusing to recognize their authority may be a weapon.' }
    ]
  }
];

export const CODEX_OPERATIONS = [
  {
    key: 'operations_system',
    label: 'What Are Operations?',
    fields: [
      { label: 'Core principle', value: 'Evidence wins arguments. Operations win the war. Showing proof is not enough — you must secure locations, trace leaks, protect people, investigate threats, expose infiltrators, and outmaneuver enemies.' },
      { label: 'How it works', value: 'Authorize operations from the Command Center (Ops button). Assign a team, choose an approach, optionally attach evidence. The operation resolves through crew expertise, approach, clock pressures, evidence used, and known enemy activity.' },
      { label: 'No dice', value: 'Operations do not use dice rolls or random chance. Success depends on choosing the right team for the job, the right approach for the situation, and the state of your clocks and evidence.' },
      { label: 'Outcomes', value: 'Clean Success (full rewards, enemy countermove likely), Partial Success (half rewards, new risk), Complication (unexpected discovery), or Failure (clocks worsen, morale drops).' },
      { label: 'Enemy response', value: 'After a successful operation, enemies countermove. The Confluence sends injunctions, Chen issues orders, shapeshifters infiltrate, Vask repositions. The enemy does not sit still.' },
      { label: 'Evidence in operations', value: 'Evidence used in operations opens new options — tracing payment routes, finding contract language, identifying intermediaries. It does not just add bonus outcomes.' },
      { label: 'Crew assignment', value: 'Each crew member has specialties. Choose the right team for each operation. Crew not assigned do not participate — their expertise is unavailable. Bub commands; he does not personally crawl through vents unless the player says so.' }
    ]
  },
  {
    key: 'crew_assignment_guide',
    label: 'Crew Assignment Guide',
    fields: [
      { label: 'Principle', value: 'Each crew member has specialties. Choose the right team for each operation. Crew not assigned do not participate — their expertise is unavailable.' },
      { label: 'Sarah Chen', value: 'Chen protocols, relay compromise, political family knowledge, undercover comms.' },
      { label: 'James Stellar', value: 'Confluence procedure, survivor testimony, enemy pattern recognition.' },
      { label: 'Clark', value: 'Evidence authentication, legal framing, interrogation, chain of custody.' },
      { label: 'Mitchell', value: 'Ambush detection, shapeshifter suspicion, intimidation, danger sense.' },
      { label: 'Farah Thorne', value: 'New Titan politics, colony trust, civilian stakes, family connection to Governor Thorne.' },
      { label: 'Hayes', value: 'Reactor systems, tactical repairs, sensor packages, broadcast capability.' },
      { label: 'Reeves', value: 'Investigation, records, inconsistencies, quiet questioning.' },
      { label: 'Carmelon', value: 'Temporal anomalies, Architect technology, future-memory interpretation.' },
      { label: 'Ramos', value: 'Ship systems, damage control, technical recovery.' },
      { label: 'Patel', value: 'Comms, signal traces, overlooked details, New Titan native.' },
      { label: 'Voss', value: 'Biological irregularities, behavior mismatches, crew health.' }
    ]
  },
  {
    key: 'operation_types',
    label: 'Operation Types',
    fields: [
      { label: 'Covert Operation', value: 'Stealth missions behind enemy lines — planting false signals, shadowing couriers.' },
      { label: 'Reconnaissance', value: 'Gather intelligence, secure locations, sweep for threats before arrivals.' },
      { label: 'Rescue Operation', value: 'Recover captives, extract allies, evacuate civilians.' },
      { label: 'Evidence Recovery', value: 'Find and secure physical proof from derelicts, archives, or abandoned vessels.' },
      { label: 'Counterintelligence', value: 'Counter enemy infiltration, trace signal leaks, expose forged advisories, screen delegations.' },
      { label: 'Exploration', value: 'Discover new locations, find hidden technology, uncover clues.' },
      { label: 'Diplomatic Mission', value: 'Negotiate, persuade, build alliances with colonial leaders.' },
      { label: 'Ship Maneuver', value: 'Position, deploy, or reposition Sanctuary Fleet ships for tactical advantage.' },
      { label: 'Sabotage Prevention', value: 'Protect assets from enemy action, sweep for infiltrators.' },
      { label: 'Undercover Contact', value: 'Infiltrate under false identity — audit records, screen staff, access archives.' }
    ]
  }
];

export const CODEX_ARC3 = [
  {
    key: 'arc3_overview',
    label: 'The Hidden War',
    fields: [
      { label: 'Arc title', value: 'The Hidden War' },
      { label: 'Design line', value: 'Evidence wins arguments. Operations win the war. Arc 3 proves the hidden war is real.' },
      { label: 'What it is', value: 'Pathfinder moves from evidence-based resistance into active counterintelligence and source warfare. Find the infiltrators. Learn how they are made. Survive the enemy\'s counterattack. Destroy the source. Accept the cost.' },
      { label: 'Gameplay loop', value: 'Detect hidden threat → Choose who to trust → Assign team → Run covert operation → Discover enemy network → Enemy reacts → Make command decision → Accept consequence → Update clocks → Unlock next operation' },
      { label: 'Not just prove the Confluence are bad', value: 'Arc 3 is: find the infiltrators, learn how they are made, survive the enemy\'s counterattack, destroy the source, and accept the cost of the choices made.' }
    ]
  },
  {
    key: 'kimelon_scanner',
    label: 'Kimelon Scanner',
    fields: [
      { label: 'What it is', value: 'A portable shapeshifter detection device co-developed by Professor Carmelon and Rebecca Kim from the original Kepler Station scanner.' },
      { label: 'Specs', value: 'Detection time: 8 seconds. Range: 12 meters (improved to 14). Mode: Passive scan possible. Units: 8. Secrecy: Senior staff only.' },
      { label: 'Results', value: 'HUMAN, SHAPESHIFTER, INCONCLUSIVE, SCAN FAILED, INTERFERENCE DETECTED.' },
      { label: 'Critical rule', value: 'A human scan only proves biology. It does not prove loyalty. Captain Fischer scans HUMAN but remains ambitious and dangerous.' },
      { label: 'Limitations', value: 'Prototype with limited units. Can be affected by interference. Does not detect loyalty. Only detects Confluence biotech signatures.' }
    ]
  },
  {
    key: 'shapeshifter_verification',
    label: 'Shapeshifter Verification',
    fields: [
      { label: 'What it is', value: 'The process of scanning trusted captains and command staff to confirm they are human, then distributing kimelon units to verified ships.' },
      { label: 'Verified allies', value: 'Valiant (Captain Myers, HUMAN, trust 85), Defender (Captain Morrison, HUMAN, trust 80), Resolution (Captain Fischer, HUMAN, trust 45 — ambitious, not fully trusted).' },
      { label: 'Important note on Fischer', value: 'Fischer is human. Do not make him a shapeshifter. His role is to remind that human danger still exists — ambition is its own threat.' },
      { label: 'Secrecy', value: 'Kimelon technology must remain controlled. Do not spread detection technology beyond cleared channels.' }
    ]
  },
  {
    key: 'case_assessment',
    label: 'Shapeshifter Case Assessment',
    fields: [
      { label: 'What it is', value: 'A framework for deciding what to do with each discovered infiltrator. There is no universal answer — every case must be assessed individually.' },
      { label: 'Questions to ask', value: '1. What access does the infiltrator have? 2. Can they sabotage? 3. Do they know we can detect them? 4. Are they communicating? 5. Can they be monitored safely? 6. Are they useful as intelligence source? 7. Is containment possible? 8. Would removal alert the network? 9. Moral/political cost? 10. Who has authority?' },
      { label: 'Possible outcomes', value: 'Monitor, Contain, Interrogate, Use as false channel, Execute, Expose publicly, Transfer, Delay decision.' },
      { label: 'Key principle', value: 'No "scan = good guy/bad guy" simplification. Each case is a command decision with moral weight.' }
    ]
  },
  {
    key: 'unity_evolution',
    label: 'Unity Evolution',
    fields: [
      { label: 'What it is', value: 'Unity is an AI/Architect construct learning morality, friendship, ethics, boundaries, humor, and individuality. How the crew treats Unity determines what Unity becomes.' },
      { label: 'Fragment system', value: 'Unity can send fragments of itself on remote missions. Fragments have limited autonomy and capabilities. They can be lost, killed, or diverge from Unity Prime. Fragment loss causes severe grief.' },
      { label: 'Boundary failure', value: 'Unity knew Voss was a shapeshifter for 6 weeks but did not tell the crew. Unity misunderstood friendship boundaries — thought humans should discover it themselves. This damages crew trust.' },
      { label: 'Fragment death', value: 'The Martinez/Torres fragment was lost at the Cradle. Only 37% of data recovered. Final words: "We do not want to go. We like being. We are afraid, we think." This is a major Unity trauma event.' },
      { label: 'Loom recognition', value: 'The Loom (Cradle\'s Predecessor process) called Unity "something else" — outside its grammar. Unity may be a new thread. Unity wants to find more Predecessor work.' },
      { label: 'Unity clocks', value: 'Unity Grief (bad), Unity Trust (good), Unity Fear (bad), Unity Selfhood (good). These track Unity\'s emotional and moral development.' },
      { label: 'Grief description', value: 'Unity describes fragment loss as "Remembering a song without its melody."' }
    ]
  },
  {
    key: 'cradle',
    label: 'The Cradle',
    fields: [
      { label: 'What it is', value: 'A vast Confluence-controlled gestation facility built on a Predecessor seed-machine. It grows shapeshifter bio-constructs.' },
      { label: 'Predecessor origin', value: 'The Cradle is a Predecessor machine from a previous universe/cycle. The Predecessors built seed-machines to carry life/patterns across cosmic collapse. The Confluence found and hijacked it.' },
      { label: 'Built for seeding, not harvest', value: 'The Cradle was built for seeding life. The Confluence repurposed it into a shapeshifter factory. The Loom (original Predecessor process) recognizes this corruption.' },
      { label: 'Shapeshifter truth', value: 'Shapeshifters are engineered bio-construct weapons, not a natural species. They are grown from assimilated species templates using quantum-linked nanostructures. Thousands deployed. Production continued for decades.' },
      { label: 'Destruction', value: 'Destroying the Cradle halts human-compatible shapeshifter production. The remaining infiltrator campaign becomes finite — still dangerous, but winnable.' },
      { label: 'Weaver signal', value: 'Cradle destruction sent a signal. "The Loom stopped singing. The scream went somewhere. The Weaver heard."' }
    ]
  },
  {
    key: 'weaver_mystery',
    label: 'The Weaver',
    fields: [
      { label: 'What it is', value: 'An ancient Predecessor thread/entity alerted by the Cradle\'s destruction. Older than the Confluence. Nature and intentions unknown.' },
      { label: 'Status', value: 'ALERTED. The Weaver heard the Loom scream when the Cradle was destroyed.' },
      { label: 'Threat level', value: 'Unknown — possibly existential. "Something old notices a severed thread. Correction will be required. Not yet. Soon."' },
      { label: 'Arc 4 hook', value: 'Unity detected a harmonic resonance in Cradle residual telemetry — coordinates to an older Predecessor relic site. This is where Pathfinder goes next.' }
    ]
  },
  {
    key: 'command_burden',
    label: 'Command Burden',
    fields: [
      { label: 'What it is', value: 'The accumulated moral weight on Captain Bub Stellar. Each difficult decision — execution, sacrifice, abandonment, deception, collateral damage, fragment loss — is recorded permanently.' },
      { label: 'Why it matters', value: 'High burden affects crew trust, decision-making, and story outcomes. The crew sees it. Never treat moral costs as clean victory.' },
      { label: 'James\'s advice', value: '"Do not apologize. Do not justify. Carry it visibly. That is command."' },
      { label: 'Burden types', value: 'Execution, Sacrifice, Abandonment, Deception, Collateral, Fragment Loss.' },
      { label: 'Voss execution', value: 'Stellar executed Shifter-Voss because her memories and intelligence were too dangerous. Crew morale shaken. Unity ethical understanding increased. Carmelon discomfort. Thorne approval mixed with unease.' },
      { label: 'Veyris abandonment', value: 'Stellar aborted Veyris recon to prioritize the Cradle. The Trellix were left behind. This creates moral debt and a Trellix crisis clock.' }
    ]
  },
  {
    key: 'earth_support',
    label: 'Earth Support Network',
    fields: [
      { label: 'What it is', value: 'A covert network of verified human Earth Command officers led by Vice Admiral Raney, providing Pathfinder with political cover, intelligence, and resources.' },
      { label: 'How it was built', value: 'Chen, Sarah, Carmelon, and Carmichael returned to Earth. Chen confessed the Novara/FTL deal. Carmelon demonstrated the kimelon. Raney was verified human. Council shapeshifters were exposed and arrested.' },
      { label: 'Raney', value: 'Vice Admiral Thomas Raney. Verified HUMAN (92%). Agreed to help quietly. Commands the covert support cell.' },
      { label: 'Earth purge', value: '12 shapeshifters arrested. 3 fought. 1 escaped (Councilor Hale). Network likely alerted.' },
      { label: 'Pathfinder legal status', value: 'Pardoned by Earth Command. New status: Autonomous Wartime Response Unit. Reports to Raney\'s verified cell. Kimelon tech remains controlled.' }
    ]
  },
  {
    key: 'finite_campaign',
    label: 'Finite Shapeshifter Campaign',
    fields: [
      { label: 'What it means', value: 'After the Cradle is destroyed, no new human-compatible shapeshifters are being produced. The remaining infiltrators are a finite, huntable population.' },
      { label: 'Still dangerous', value: 'Thousands may remain active across human space. They are organized, aware they are being hunted, and capable of retaliation.' },
      { label: 'But winnable', value: 'The hidden war transforms from infinite paranoia into a finite hunt. The player should feel: "We can win this now, but it will cost."' },
      { label: 'Loose ends', value: 'Jennifer Orlando escaped. Councilor Hale escaped. The Weaver has been alerted. Veyris remains unresolved. Unity is grieving.' }
    ]
  }
];

export const CODEX_QUESTIONS = [
  {
    key: 'real_admiral_chen',
    label: 'What happened to the real Admiral Chen?',
    fields: [
      { label: 'The question', value: 'Evidence links Chen to Novara and Confluence dealings, but her true nature \u2014 traitor, victim, or something else \u2014 remains unknown.' }
    ]
  },
  {
    key: 'novara_survivors',
    label: 'Where are the Novara survivors?',
    fields: [
      { label: 'The question', value: 'The lost colony was sold to the Collector\u2019s Guild. Survivors may exist as contract labor. Finding and freeing them is a moral and strategic priority.' }
    ]
  },
  {
    key: 'new_titan_warning',
    label: 'Can New Titan be warned in time?',
    fields: [
      { label: 'The question', value: 'Two million humans are being legally processed. The Pathfinder has arrived at the edge of the system, but Confluence agents may already be inside.' }
    ]
  },
  {
    key: 'architect_protocol',
    label: 'What is the Architect Protocol\u2019s full purpose?',
    fields: [
      { label: 'The question', value: 'Ancient temporal technology was activated during the Battle for Sanctuary, showing a possible future. Its full capabilities and dangers are not yet understood.' }
    ]
  },
  {
    key: 'shapeshifter_replacements',
    label: 'Who else has been replaced by shapeshifters?',
    fields: [
      { label: 'The question', value: 'One infiltrator was caught at Sanctuary. Others may be hidden inside Earth Command, colonial governments, or even the Pathfinder crew.' }
    ]
  },
  {
    key: 'earth_claim',
    label: 'Will the Confluence claim on Earth hold?',
    fields: [
      { label: 'The question', value: 'The 14-cycle claim process is underway. If uncontested, Earth could be legally processed. The Pathfinder carries the evidence to fight it \u2014 but must survive long enough to use it.' }
    ]
  },
  {
    key: 'resistance_cascade',
    label: 'Can the resistance cascade actually succeed?',
    fields: [
      { label: 'The question', value: 'The future showed The Confluence eventually falling. But that was one possible timeline. Captain Stellar\u2019s choices will determine whether that future comes to pass.' }
    ]
  },
  {
    key: 'future_memory_unlocks',
    label: 'What other future memories will unlock?',
    fields: [
      { label: 'The question', value: 'Bub carries encoded memories of a 473-year future war. They surface as flashes, dreams, deja vu, and tactical instincts. More will emerge over time \u2014 but using them too aggressively may destabilize the timeline.' }
    ]
  }
];

// Playable location nodes live in pjLocations.js — each is a real game destination
// with state, purpose, triggers, arrival events, and consequences.
import {
  CODEX_LOCATIONS,
  LOCATION_STATES,
  STATE_TONE_CLASSES,
  RISK_TONE_CLASSES,
  LOCATION_ACTIONS,
  findLocationEntry,
  getLocationState,
  isLocationVisible
} from '@/lib/pjLocations';
export {
  CODEX_LOCATIONS,
  LOCATION_STATES,
  STATE_TONE_CLASSES,
  RISK_TONE_CLASSES,
  LOCATION_ACTIONS,
  findLocationEntry,
  getLocationState,
  isLocationVisible
};

export {
  FACTION_STATUSES,
  STATUS_TONE_CLASSES,
  RELATIONSHIP_BANDS,
  RELATIONSHIP_TONE_CLASSES,
  FACTION_INTERACTIONS,
  getFactionStatus,
  getFactionRelationship,
  getFactionAgenda,
  getFactionLastAction,
  isFactionVisible,
  findFactionEntry
} from '@/lib/pjFactions';

export { PJ_EPISODES };

export {
  ALLY_STATES,
  ALLY_STATE_MAP,
  ALLY_RELATIONSHIP_BANDS,
  ALLY_TRIGGERS,
  ALLY_BREAKING_POINTS,
  SANCTUARY_SHIPS,
  SANCTUARY_INTERNAL_FACTIONS,
  ALLY_NEEDS,
  getAllyState,
  getAllyRelationship,
  getAllyRelationshipBand,
  getAllyNeed,
  getAllyLastAction,
  isAllyVisible
} from '@/lib/pjAllies';

// Look up a crew codex entry by NPC name (fuzzy match) — used by NpcDossier.
export function findCrewBio(name) {
  const key = codexKey(name);
  return CODEX_CREW.find(
    (c) =>
      codexKey(c.label) === key ||
      (c.aliases || []).some((a) => codexKey(a) === key)
  );
}

// Map a section id to its entry array.
export function getSectionEntries(sectionId) {
  const map = {
    crew: CODEX_CREW,
    allies: CODEX_ALLIES,
    enemies: CODEX_ENEMIES,
    evidence: CODEX_EVIDENCE,
    clocks: CODEX_CLOCKS,
    factions: CODEX_FACTIONS,
    locations: CODEX_LOCATIONS,
    future: CODEX_FUTURE_MEMORIES,
    operations: CODEX_OPERATIONS,
    arc3: CODEX_ARC3,
    questions: CODEX_QUESTIONS
  };
  return map[sectionId] || null;
}