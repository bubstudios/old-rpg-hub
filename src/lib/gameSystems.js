// Registry of playable game systems. Add a new entry here to surface it on the
// game-selection page; the dashboard and campaign tagging pick it up automatically.
export const GAME_SYSTEMS = [
  {
    id: 'add1e',
    name: "AD&D 1st Edition",
    short: "1st Ed AD&D",
    tagline: "Old-school dungeon mastery",
    description:
      "The classic 1st Edition Advanced Dungeons & Dragons experience — THAC0, saving throws, and deadly dungeons, ruled by an AI Dungeon Master. Gather your party, roll your stats, and venture into the darkness.",
    dashboardTitle: "THE IRON REALM",
    dashboardSubtitle:
      "An old-school AD&D 1st Edition campaign, ruled by an AI Dungeon Master. Gather your party, roll your stats, and venture into the darkness — where every choice is written in ink that cannot be unwritten.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/d2a072ae5_generated_image.png",
    icon: "scroll",
    enterLabel: "Enter the Realm"
  },
  {
    id: "starfrontiers",
    name: "Star Frontiers",
    short: "Star Frontiers",
    tagline: "Pulp sci-fi adventure",
    description:
      "Explore the frontier of known space as a Voyager Services operative. Laser pistols, alien species, and uncharted worlds await in this classic 1980s sci-fi role-playing game, ruled by an AI Game Master.",
    dashboardTitle: "STAR FRONTIERS",
    dashboardSubtitle:
      "A classic Star Frontiers sci-fi campaign, ruled by an AI Game Master. Sign on with Voyager Services, gear up, and venture into the unknown reaches of the frontier — where first contact is written in light that cannot be outrun.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/01d170085_generated_image.png",
    icon: "rocket",
    enterLabel: "Board Your Ship"
  },
  {
    id: "gammaworld",
    name: "Gamma World",
    short: "Gamma World",
    tagline: "Post-apocalyptic mutant mayhem",
    description:
      "Scavenge the irradiated ruins of a fallen civilization as a mutated survivor of the biogenetic apocalypse. Ancient artifacts, deadly mutations, and gonzo science-fantasy danger await in this classic 1978 TSR role-playing game, ruled by an AI Game Master.",
    dashboardTitle: "GAMMA TERRA",
    dashboardSubtitle:
      "A classic Gamma World post-apocalyptic campaign, ruled by an AI Game Master. Emerge from the wastes as a mutant survivor, scavenge the ruins of the Ancients, and brave a world remade by fire and mutation — where survival is written in radioactive ink that cannot be unwritten.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/edaad6b2b_generated_image.png",
    icon: "atom",
    enterLabel: "Emerge into the Wastes"
  },
  {
    id: "boothill",
    name: "Boot Hill",
    short: "Boot Hill",
    tagline: "Wild West gunfighting",
    description:
      "Step into the dust and danger of the Old West — quick-draw showdowns, frontier justice, and saloon intrigue in this classic 1979 TSR western role-playing game, ruled by an AI Game Master. Roll your percentile stats, check your six-shooter, and see if you're quick enough to cheat Boot Hill.",
    dashboardTitle: "BOOT HILL",
    dashboardSubtitle:
      "A classic Boot Hill Wild West campaign, ruled by an AI Game Master. Ride into a frontier town, check your iron, and carve out a legend — where every draw is written in smoke that cannot be unhaled.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/ed1ccd9e4_generated_image.png",
    icon: "crosshair",
    enterLabel: "Ride into Town"
  },
  {
    id: "indianajones",
    name: "Indiana Jones",
    short: "Indiana Jones",
    tagline: "1930s pulp adventure",
    description:
      "Step into the 1930s as a two-fisted archaeologist adventurer — lost temples, ancient artifacts, rival treasure hunters, and Nazis to punch, in this classic 1984 TSR pulp action-adventure role-playing game, ruled by an AI Game Master. Roll your percentile stats, check your revolver, and see if you can outrun the boulder.",
    dashboardTitle: "THE PULP ADVENTURES",
    dashboardSubtitle:
      "A classic Indiana Jones pulp adventure campaign, ruled by an AI Game Master. Globe-trot for lost artifacts in the 1930s, outwit Nazis and rival archaeologists, and brave ancient traps — where every escape is written in dust that cannot be unbreathed.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/4608283ff_generated_image.png",
    icon: "compass",
    enterLabel: "Begin the Expedition"
  },
  {
    id: "spelljammer",
    name: "Spelljammer",
    short: "Spelljammer",
    tagline: "AD&D Adventures in Space",
    description:
      "Sail the void between worlds in a spelljamming ship — crystal spheres, the rainbow rivers of the phlogiston, spacefaring races, and ship-to-ship combat across wildspace, in this classic 1989 TSR AD&D 2nd Edition setting, ruled by an AI Dungeon Master. Take the helm, brave the void, and chart a course between the spheres.",
    dashboardTitle: "SPELLJAMMER",
    dashboardSubtitle:
      "A Spelljammer science-fantasy campaign, ruled by an AI Dungeon Master. Take the helm of a spelljamming ship, sail the void of wildspace between crystal spheres, and brave the phlogiston — where every voyage is written in starlight that cannot be unwritten.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/e9e07d862_generated_image.png",
    icon: "orbit",
    enterLabel: "Take the Helm"
  },
  {
    id: "darksun",
    name: "Dark Sun",
    short: "Dark Sun",
    tagline: "Survive the dying world of Athas",
    description:
      "Beneath a swollen crimson sun, the dying desert world of Athas awaits — defiler magic that blights the land, psionics in every mind, gladiatorial arenas, sorcerer-kings who rule as living gods, and metal scarce as hope. A brutal AD&D 2nd Edition survival campaign, ruled by an AI Dungeon Master. Hoard your water, mind your blade, and see if you can outlive the wasteland.",
    dashboardTitle: "DARK SUN",
    dashboardSubtitle:
      "A Dark Sun survival campaign on the dying world of Athas, ruled by an AI Dungeon Master. Brave the crimson sun, the blight of defiling magic, the arena bloodsport, and the sorcerer-kings — where every dawn is written in heat that cannot be unendured.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/418eb6d15_generated_image.png",
    icon: "sun",
    enterLabel: "Brave the Wastes"
  },
  {
    id: "topsecret",
    name: "Top Secret",
    short: "Top Secret",
    tagline: "Espionage in the Cold War shadows",
    description:
      "Step into the shadow world of Cold War espionage — CIA, KGB, MI6, and the quiet war fought in the spaces between nations. A classic 1980 TSR spy thriller RPG with percentile attributes, wound tables, tradecraft skills, cover identities, dead drops, and lethal gunfights, all ruled by an AI Administrator. Trust no one. Watch your back. Survive the mission.",
    dashboardTitle: "TOP SECRET",
    dashboardSubtitle:
      "A Cold War espionage campaign of spies, tradecraft, and betrayal, ruled by an AI Administrator. Run assets, crack safes, survive firefights, and navigate the shadow war between rival intelligence services — where one bullet ends a career and loyalty is the rarest currency.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/57d086f5d_generated_image.png",
    icon: "briefcase",
    enterLabel: "Accept the Mission"
  }
];

export const DEFAULT_GAME = "add1e";

export function getGameSystem(id) {
  return (
    GAME_SYSTEMS.find((g) => g.id === id) ||
    GAME_SYSTEMS.find((g) => g.id === DEFAULT_GAME)
  );
}