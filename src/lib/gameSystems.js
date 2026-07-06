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
  }
];

export const DEFAULT_GAME = "add1e";

export function getGameSystem(id) {
  return (
    GAME_SYSTEMS.find((g) => g.id === id) ||
    GAME_SYSTEMS.find((g) => g.id === DEFAULT_GAME)
  );
}