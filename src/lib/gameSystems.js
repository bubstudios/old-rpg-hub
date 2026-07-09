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
  },
  {
    id: "greyhawk",
    name: "Greyhawk",
    short: "Greyhawk",
    tagline: "The classic World of Oerth",
    description:
      "The original Advanced Dungeons & Dragons campaign setting — the World of Greyhawk, created by Gary Gygax himself. Adventure across the Flanaess: the Free City of Greyhawk, the warring Great Kingdom, the shadow of Iuz, the scheming Circle of Eight, and the deadliest dungeons ever devised. Classic AD&D 1st Edition rules, ruled by an AI Dungeon Master. The dungeon awaits — and it does not forgive.",
    dashboardTitle: "GREYHAWK",
    dashboardSubtitle:
      "A classic World of Greyhawk campaign, ruled by an AI Dungeon Master. Venture into the Flanaess — the Free City, the ruins of Castle Greyhawk, the wars of the Great Kingdom — where every delve is written in ink that cannot be unwritten.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/77a086e09_generated_image.png",
    icon: "landmark",
    enterLabel: "Enter the Flanaess"
  },
  {
    id: "forgottenrealms",
    name: "Forgotten Realms",
    short: "Forgotten Realms",
    tagline: "The Realms of high magic",
    description:
      "The most beloved Dungeons & Dragons setting — the Forgotten Realms, the world of Toril. Adventure across Faerûn: Waterdeep the City of Splendors, the Dalelands, the Sword Coast, Cormyr, Baldur's Gate, and the lightless Underdark beneath. Active gods walk among mortals, factions like the Harpers and Zhentarim scheme for power, and ancient magic saturates the land. AD&D rules, ruled by an AI Dungeon Master. The Realms await.",
    dashboardTitle: "FORGOTTEN REALMS",
    dashboardSubtitle:
      "A Forgotten Realms campaign on the world of Toril, ruled by an AI Dungeon Master. Walk the streets of Waterdeep, brave the Underdark, and cross paths with gods and factions — where every legend is written in ink that cannot be unwritten.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/c02ba8eb4_generated_image.png",
    icon: "crown",
    enterLabel: "Enter the Realms"
  },
  {
    id: "hollowworld",
    name: "Hollow World",
    short: "Hollow World",
    tagline: "A world within the world",
    description:
      "Deep within the planet Mystara lies the Hollow World — a vast inner realm with its own sun, where the Immortals preserved ancient civilizations from the surface world's cataclysms. Explore the marble colonnades of the Milenian Empire, the jade pyramids of the Azcans, the pharaohs of Nithia, and dinosaurs roaming eternal jungles under an unmoving sun. D&D BECMI rules, ruled by an AI Dungeon Master. Descend through the polar opening — and discover a world that time forgot.",
    dashboardTitle: "THE HOLLOW WORLD",
    dashboardSubtitle:
      "A Hollow World campaign inside the planet Mystara, ruled by an AI Dungeon Master. Descend through the polar opening into a vast inner world of preserved civilizations, immortal guardians, and ancient wonders — where every discovery is written in ink that cannot be unwritten.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/8dd161c03_generated_image.png",
    icon: "globe",
    enterLabel: "Descend Within"
  },
  {
    id: "conan",
    name: "Conan",
    short: "Conan",
    tagline: "Sword-and-sorcery of the Hyborian Age",
    description:
      "Stride into the Hyborian Age — a savage world of ancient kingdoms, dark sorcery, and steel, created by Robert E. Howard. From the hills of Cimmeria to the thrones of Aquilonia, adventure as a barbarian, mercenary, thief, or pirate in a land where civilization is thin and the sword is law. A percentile attribute system with wound tables and gritty combat, ruled by an AI Dungeon Master. By Crom, the age awaits.",
    dashboardTitle: "CONAN",
    dashboardSubtitle:
      "A Hyborian Age sword-and-sorcery campaign, ruled by an AI Dungeon Master. Venture across the savage kingdoms of a world before history — where every blow is written in blood that cannot be unshed.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/1b9dc1177_generated_image.png",
    icon: "flame",
    enterLabel: "Stride Forth"
  },
  {
    id: "redsonja",
    name: "Red Sonja",
    short: "Red Sonja",
    tagline: "The She-Devil with a Sword",
    description:
      "Take up the blade as Red Sonja — the Hyrkanian warrior woman, mercenary, and scourge of evil sorcerers across the Hyborian kingdoms. A sword-and-sorcery percentile RPG set in the world of Robert E. Howard's Hyboria, with wound tables, dark sorcery, and two-fisted survival. Adventure as a Nomad, Mercenary, Thief, or Sorcerer across the steppes and cities of a savage age, ruled by an AI Game Master. The She-Devil rides.",
    dashboardTitle: "RED SONJA",
    dashboardSubtitle:
      "A Hyborian sword-and-sorcery campaign of the She-Devil with a Sword, ruled by an AI Game Master. Ride the Hyrkanian steppes, cross blades with tyrants and sorcerers, and carve a legend — where every strike is written in steel that cannot be sheathed.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/3d20fb40f_generated_image.png",
    icon: "swords",
    enterLabel: "Take Up the Blade"
  },
  {
    id: "buckrogers",
    name: "Buck Rogers",
    short: "Buck Rogers",
    tagline: "25th century high adventure",
    description:
      "Rocket into the 25th century — the XXVc, where the Inner Planets are dominated by the genetic-supermen of RAM, the Asteroid Belt hungers for freedom, and Earth is a poisoned relic. Fly a rocketjockey, pilot, warrior, or medic across a solar system at war. A classic TSR sci-fi RPG using AD&D 2nd Edition rules adapted for blasters, spaceship combat, and corporate intrigue, ruled by an AI Dungeon Master. The future is now.",
    dashboardTitle: "BUCK ROGERS XXVc",
    dashboardSubtitle:
      "A 25th-century sci-fi campaign of rocket packs, ray guns, and rebellion, ruled by an AI Dungeon Master. Soar between the Inner Planets and the Asteroid Belt, defy the geniocracy of RAM, and fight for the future of the solar system — where every dogfight is written in rocket-fire that cannot be recalled.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/06a3ef690_generated_image.png",
    icon: "satellite",
    enterLabel: "Blast Off"
  },
  {
    id: "ghostbusters",
    name: "Ghostbusters",
    short: "Ghostbusters",
    tagline: "Who ya gonna call?",
    description:
      "Suit up and wrangle the supernatural — a Ghostbusters franchise in a haunted modern city, using the classic 1986 West End Games D6 System. Four attributes (Brain, Muscle, Moves, Cool), tag skills, the Ghost Die, and Brownie Points as your hero currency and damage track. Trap Class 5 free-floating repeaters, face Gozer, and don't cross the streams. Ruled by an AI Game Master. We came, we saw, we kicked its ass.",
    dashboardTitle: "GHOSTBUSTERS",
    dashboardSubtitle:
      "A supernatural comedy-horror campaign of ghost-trapping and slimy heroics, ruled by an AI Game Master. Patrol the haunted city, wrangle the paranormal, and save the world from things that go bump in the night — where every proton stream is written in slime that cannot be unslimed.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/958d3add0_generated_image.png",
    icon: "ghost",
    enterLabel: "Suit Up"
  },
  {
    id: "legionofdoom",
    name: "Legion of Doom",
    short: "Legion of Doom",
    tagline: "Be the villain. Conquer the world.",
    description:
      "Join the Legion of Doom — a cabal of supervillains united for mutual gain. Play the bad guys: masterminds, powerhouses, tricksters, speedsters, sorcerers, shapeshifters, gadgeteers, and mentalists. Pull heists, battle heroes, scheme against each other, and pursue world domination. An original d20 roll-under system with super-powers, Ego, and villainous flair, ruled by an AI Game Master. The Hall of Doom awaits — and the world is yours for the taking.",
    dashboardTitle: "THE LEGION OF DOOM",
    dashboardSubtitle:
      "A supervillain caper campaign, ruled by an AI Game Master. Join the Legion of Doom, pull heists, battle heroes, and scheme for world domination — where every monologue is written in villainy that cannot be undone.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/6fd4dd456_generated_image.png",
    icon: "zap",
    enterLabel: "Enter the Hall of Doom"
  },
  {
    id: "gangbusters",
    name: "Gangbusters",
    short: "Gangbusters",
    tagline: "1920s Prohibition organized crime",
    description:
      "Step into the Roaring Twenties — Prohibition-era organized crime, Tommy guns, speakeasies, and the war between the mob and the law. Play a gangster, hit man, bootlegger, safecracker, cop, G-man, or private eye in this classic 1982 TSR crime role-playing game. A percentile (d100) system with wound tables and lethal gunfights, ruled by an AI Game Master. The city is yours for the taking — if you can hold it.",
    dashboardTitle: "GANGBUSTERS",
    dashboardSubtitle:
      "A Prohibition-era organized crime campaign of mobsters, G-men, and gunfights, ruled by an AI Game Master. Run rackets, bust safes, dodge the Feds, and carve out an empire in the city's underworld — where every bullet is written in smoke that cannot be uninhaled.",
    cardImage:
      "https://media.base44.com/images/public/6a4af4087166276674b33cf8/1b490ab3d_generated_image.png",
    icon: "skull",
    enterLabel: "Hit the Streets"
  },
  {
    id: "starwars",
    name: "Star Wars",
    short: "Star Wars",
    tagline: "A galaxy far, far away",
    description: "Travel to a galaxy far, far away in the classic West End Games Star Wars RPG. Play a Rebel operative, a smuggler, a Jedi, or a bounty hunter. Blasters, starships, the Force, and the eternal struggle between light and dark. D6 System mechanics with wound levels, Force Points, and the seductive pull of the Dark Side. Ruled by an AI Game Master. May the Force be with you.",
    dashboardTitle: "STAR WARS",
    dashboardSubtitle: "A Star Wars D6 System campaign, ruled by an AI Game Master. Fly the stars, wield the Force, and fight the Empire — where every blaster bolt is written in light that cannot be outrun.",
    cardImage: null,
    icon: "star",
    enterLabel: "Jump to Lightspeed"
  },
  {
    id: "marvel",
    name: "Marvel Super Heroes",
    short: "Marvel SH",
    tagline: "FASERIP superhero action",
    description: "Become a superhero in the classic TSR Marvel Super Heroes RPG (FASERIP system). Fighting, Agility, Strength, Endurance, Reason, Intuition, Psyche — each rated by rank (Feeble to Unearthly). Roll on the Universal Table, spend Karma, and battle supervillains. Ruled by an AI Game Master. Excelsior!",
    dashboardTitle: "MARVEL SUPER HEROES",
    dashboardSubtitle: "A Marvel Super Heroes campaign, ruled by an AI Game Master. Suit up, roll on the Universal Table, and save the world — where every heroic deed is written in Karma that cannot be unspent.",
    cardImage: null,
    icon: "zap",
    enterLabel: "Assemble"
  },
  {
    id: "dcheroes",
    name: "DC Heroes",
    short: "DC Heroes",
    tagline: "Mayfair exponential heroics",
    description: "Join the Justice League in the classic Mayfair DC Heroes RPG. Attributes rated in AP (Attribute Points) on an exponential scale — lift cars, leap buildings, outrun lasers. Spend Hero Points, roll on the Action Table, and face Lex Luthor, the Joker, and Darkseid. Ruled by an AI Game Master. To the Batcave!",
    dashboardTitle: "DC HEROES",
    dashboardSubtitle: "A DC Heroes campaign, ruled by an AI Game Master. Don the cape, roll the Action Table, and save Metropolis — where every hero point is written in heroism that cannot be undone.",
    cardImage: null,
    icon: "shield",
    enterLabel: "Answer the Call"
  },
  {
    id: "jamesbond",
    name: "James Bond 007",
    short: "James Bond 007",
    tagline: "Espionage, gadgets, and danger",
    description: "Step into the tailored world of James Bond 007 — the classic Victory Games espionage RPG. Play a 00 agent with percentile attributes, Ease Factor skill checks, Hero Points, and lethal gunfights. Casino royales, villain lairs, gadgetry, seduction, and the Cold War. Ruled by an AI Game Master. Shaken, not stirred.",
    dashboardTitle: "JAMES BOND 007",
    dashboardSubtitle: "A James Bond 007 espionage campaign, ruled by an AI Game Master. Travel the world, seduce the assets, survive the lair — where every martini is written in danger that cannot be unstirred.",
    cardImage: null,
    icon: "crosshair",
    enterLabel: "Accept the Assignment"
  },
  {
    id: "shadowrun",
    name: "Shadowrun",
    short: "Shadowrun",
    tagline: "Cyberpunk meets fantasy",
    description: "Enter the shadows of 2050s Seattle — where magic returned to a cyberpunk world. Play a street samurai, decker, mage, shaman, or rigger. Trolls with cyberarms, elves in corporate boardrooms, dragons running megacorps. The classic FASA d6 dice-pool system with Target Numbers, physical and stun damage tracks, the Matrix, and Nuyen. Ruled by an AI Game Master. Watch your back. Shoot straight. Conserve ammo. And never, ever, cut a deal with a dragon.",
    dashboardTitle: "SHADOWRUN",
    dashboardSubtitle: "A Shadowrun cyberpunk-fantasy campaign, ruled by an AI Game Master. Run the shadows, hack the Matrix, dodge the megacorps — where every run is written in Nuyen that cannot be unspent.",
    cardImage: null,
    icon: "cpu",
    enterLabel: "Enter the Shadows"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    short: "Cyberpunk",
    tagline: "The Street finds its own uses",
    description: "Welcome to Night City, 2020 or 2077 — the classic R. Talsorian Cyberpunk RPG. Play a Solo, Netrunner, Techie, Medtech, Media, Cop, Corporate, Fixer, Nomad, or Rockerboy. The Interlock system: d10 + stat + skill vs Difficulty. Cyberware costs Humanity, chrome is addictive, and the Street is lethal. Eurodollars, heavy weapons, and the eternal question: style over substance? Ruled by an AI Game Master. Wake up, choomba. The future is now.",
    dashboardTitle: "CYBERPUNK",
    dashboardSubtitle: "A Cyberpunk campaign, ruled by an AI Game Master. Walk the Street, install the chrome, dodge the lead — where every deal is written in Eurodollars that cannot be unspent.",
    cardImage: null,
    icon: "cpu",
    enterLabel: "Hit the Street"
  },
  {
    id: "traveller",
    name: "Traveller",
    short: "Traveller",
    tagline: "Explore the Imperium",
    description: "Explore the vast Third Imperium in the classic GDW Traveller RPG. No classes, no levels — your character has a prior career (Navy, Army, Marines, Scouts, Merchants, and more). Attributes are 2d6 (Strength, Dexterity, Endurance, Intelligence, Education, Social Standing). Resolution is 2d6 + skill vs Target. Starships, trade, exploration, and the alien races of the Imperium. Ruled by an AI Game Master. To the stars!",
    dashboardTitle: "TRAVELLER",
    dashboardSubtitle: "A Traveller science-fiction campaign, ruled by an AI Game Master. Crew a starship, jump between worlds, and explore the Imperium — where every parsec is written in starlight that cannot be unjumped.",
    cardImage: null,
    icon: "satellite",
    enterLabel: "Jump Out"
  },
  {
    id: "ravenloft",
    name: "Ravenloft",
    short: "Ravenloft",
    tagline: "Gothic horror in the Demiplane of Dread",
    description: "Enter the Mists of Ravenloft — the Demiplane of Dread, where Darklords rule their eternal prisons and horror stalks every shadow. Gothic castles, werewolves, vampires, and the cursed Domains that feed on fear. AD&D 2nd Edition rules with Fear, Horror, and Madness checks, and a Powers Check for those who tread the path of darkness. Ruled by an AI Dungeon Master. The Mists are calling...",
    dashboardTitle: "RAVENLOFT",
    dashboardSubtitle: "A Ravenloft gothic horror campaign, ruled by an AI Dungeon Master. Brave the Mists, face the Darklords, and resist the darkness within — where every fear is written in shadow that cannot be unlit.",
    cardImage: null,
    icon: "moon",
    enterLabel: "Enter the Mists"
  },
  {
    id: "oddnd",
    name: "Original D&D (1974)",
    short: "OD&D",
    tagline: "The original three booklets",
    description: "Return to where it all began — Original Dungeons & Dragons (1974), the three little booklets that started it all. Fighting-Men, Magic-Users, and Clerics; Elves, Dwarves, and Halflings as their own classes. Descending Armor Class, attack matrices, and the original spell lists. Lean, lethal, and endlessly creative. Ruled by an AI Dungeon Master. The dungeon awaits — as it did in 1974.",
    dashboardTitle: "ORIGINAL D&D",
    dashboardSubtitle: "An Original D&D (1974) campaign, ruled by an AI Dungeon Master. Enter the first dungeon ever — where every delve is written in the original ink that cannot be unwritten.",
    cardImage: null,
    icon: "scroll",
    enterLabel: "Enter the Dungeon"
  },
  {
    id: "bxdnd",
    name: "B/X D&D",
    short: "B/X D&D",
    tagline: "Basic & Expert, Moldvay/Cook",
    description: "The beloved B/X edition — Tom Moldvay's Basic and Dave Cook's Expert sets (1981). Race-as-class for Elves, Dwarves, and Halflings; Fighters, Clerics, Magic-Users, and Thieves for humans. Clean, simple, and endlessly playable. d20 attack rolls vs descending AC, saving throws, and exploration turns. Levels 1-14. Ruled by an AI Dungeon Master. Keep on the Borderlands.",
    dashboardTitle: "B/X DUNGEONS & DRAGONS",
    dashboardSubtitle: "A B/X D&D campaign, ruled by an AI Dungeon Master. Explore the known world, delve the dungeon, and level up — where every turn is written in the simple ink that cannot be unwritten.",
    cardImage: null,
    icon: "bookopen",
    enterLabel: "Keep on the Borderlands"
  },
  {
    id: "add2e",
    name: "AD&D 2nd Edition",
    short: "AD&D 2e",
    tagline: "The refined edition",
    description: "The refined AD&D — 2nd Edition (1989). THAC0, weapon and non-weapon proficiencies, class kits, mage specialization by school, priest spheres, and the complete class lineup (Barbarian, Bard, Cavalier, and more). The Player's Handbook, the Dungeon Master's Guide, and the Monstrous Compendium. Ruled by an AI Dungeon Master. The adventure continues.",
    dashboardTitle: "AD&D 2ND EDITION",
    dashboardSubtitle: "An AD&D 2nd Edition campaign, ruled by an AI Dungeon Master. Choose your kit, master your proficiencies, and venture forth — where every roll is written in refined ink that cannot be unwritten.",
    cardImage: null,
    icon: "scroll",
    enterLabel: "Venture Forth"
  },
  {
    id: "dnd35",
    name: "D&D 3.5 Edition",
    short: "D&D 3.5",
    tagline: "The d20 System",
    description: "The d20 System at its peak — D&D 3.5 Edition. d20 + modifiers vs DC. Ascending Armor Class. Base Attack Bonus that improves with level. Skills (rank-based, class vs cross-class), Feats (every 3 levels), and free multiclassing. Fortitude, Reflex, and Will saves. The SRD that powered a generation of gaming. Ruled by an AI Dungeon Master. Roll for initiative.",
    dashboardTitle: "D&D 3.5 EDITION",
    dashboardSubtitle: "A D&D 3.5 Edition campaign, ruled by an AI Dungeon Master. Build your character, stack your feats, and take on the CR-appropriate challenge — where every d20 is written in modifiers that cannot be unrolled.",
    cardImage: null,
    icon: "bookopen",
    enterLabel: "Roll for Initiative"
  },
  {
    id: "dnd4e",
    name: "D&D 4th Edition",
    short: "D&D 4e",
    tagline: "Tactical combat redefined",
    description: "The tactical edition — D&D 4th Edition (2008). At-Will, Encounter, and Daily powers for every class. Roles: Defender, Striker, Controller, Leader. Defenses: AC, Fortitude, Reflex, Will. Healing Surges and Action Points. Grid-based combat with marked targets, shifts, and opportunity attacks. High HP, big numbers, epic encounters. Ruled by an AI Dungeon Master. Mark your target and strike.",
    dashboardTitle: "D&D 4TH EDITION",
    dashboardSubtitle: "A D&D 4th Edition campaign, ruled by an AI Dungeon Master. Choose your powers, hold the line, and surge forward — where every encounter is written in tactical ink that cannot be unrolled.",
    cardImage: null,
    icon: "swords",
    enterLabel: "Mark Your Target"
  },
  {
    id: "dnd5e",
    name: "D&D 5th Edition",
    short: "D&D 5e",
    tagline: "The world's greatest RPG",
    description: "The current edition — D&D 5th Edition (2014). Advantage and Disadvantage, bounded accuracy, and streamlined rules. Ability modifiers: (score - 10) / 2. Proficiency bonus (+2 to +6). Skills you're proficient in or not. Cantrips at-will, spell slots by level (not per-spell), Hit Dice for short-rest healing. Backgrounds, subclasses at level 1-3, and optional Feats. Ascending AC. Ruled by an AI Dungeon Master. Gather your party and venture forth.",
    dashboardTitle: "D&D 5TH EDITION",
    dashboardSubtitle: "A D&D 5th Edition campaign, ruled by an AI Dungeon Master. Roll with advantage, spend your Hit Dice, and become a hero — where every natural 20 is written in advantage that cannot be unrolled.",
    cardImage: null,
    icon: "scroll",
    enterLabel: "Gather Your Party"
  },
];

export const CATEGORY_MAP = {
  // TSR Classics — the original TSR-published games the app launched with
  add1e: "TSR Classics", starfrontiers: "TSR Classics", gammaworld: "TSR Classics",
  boothill: "TSR Classics", indianajones: "TSR Classics", spelljammer: "TSR Classics",
  darksun: "TSR Classics", topsecret: "TSR Classics", greyhawk: "TSR Classics",
  forgottenrealms: "TSR Classics", hollowworld: "TSR Classics", buckrogers: "TSR Classics",
  gangbusters: "TSR Classics",
  // Dungeons & Dragons — newer editions and settings
  oddnd: "Dungeons & Dragons", bxdnd: "Dungeons & Dragons", add2e: "Dungeons & Dragons",
  dnd35: "Dungeons & Dragons", dnd4e: "Dungeons & Dragons", dnd5e: "Dungeons & Dragons",
  ravenloft: "Dungeons & Dragons",
  // Science Fiction
  starwars: "Science Fiction", traveller: "Science Fiction",
  shadowrun: "Science Fiction", cyberpunk: "Science Fiction",
  // Superhero
  legionofdoom: "Superhero", marvel: "Superhero", dcheroes: "Superhero",
  // Classic Adventure
  ghostbusters: "Classic Adventure", jamesbond: "Classic Adventure",
  // Sword & Sorcery
  conan: "Sword & Sorcery", redsonja: "Sword & Sorcery"
};

export const CATEGORIES = ["TSR Classics", "Dungeons & Dragons", "Science Fiction", "Superhero", "Classic Adventure", "Sword & Sorcery"];

export const DEFAULT_GAME = "add1e";

export function getGameSystem(id) {
  return (
    GAME_SYSTEMS.find((g) => g.id === id) ||
    GAME_SYSTEMS.find((g) => g.id === DEFAULT_GAME)
  );
}