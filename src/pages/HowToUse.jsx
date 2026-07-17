import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Compass, ScrollText, Swords, Dices, Users, BookOpen, Library,
  ChevronDown, ChevronUp, KeyRound, Play, MessageCircle, Sparkles,
  Volume2, Settings, Flag, MapPin, Skull
} from 'lucide-react';

const SECTIONS = [
  { id: 'getting-started', n: 1, title: 'Getting Started', icon: KeyRound },
  { id: 'dashboard', n: 2, title: 'The Command Center', icon: Compass },
  { id: 'game-selection', n: 3, title: 'Choosing Your Realm', icon: ScrollText },
  { id: 'campaign-setup', n: 4, title: 'Creating a Campaign', icon: MapPin },
  { id: 'character-creation', n: 5, title: 'Creating a Character', icon: Swords },
  { id: 'playing', n: 6, title: 'Playing the Game', icon: Play },
  { id: 'dm-brief', n: 7, title: 'The DM Brief', icon: ScrollText },
  { id: 'party-play', n: 8, title: 'Playing With Friends', icon: Users },
  { id: 'journal-sheets', n: 9, title: 'Journal & Character Sheets', icon: BookOpen },
  { id: 'library', n: 10, title: 'The Adventure Library', icon: Library },
];

export default function HowToUse() {
  const [openSection, setOpenSection] = useState('getting-started');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full wax-seal mb-5 animate-flicker">
          <BookOpen className="w-7 h-7 text-primary-foreground" strokeWidth={1.2} />
        </div>
        <h1 className="font-heading font-700 text-3xl sm:text-4xl tracking-[0.08em] text-foreground mb-3">
          HOW TO USE THIS SITE
        </h1>
        <p className="font-tome text-sm sm:text-base text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
          A visual walkthrough for adventurers new and old. Each section below shows you
          exactly what to expect, with illustrations of the screens you'll encounter.
          Tap any section to expand it.
        </p>
        <div className="divider-rune max-w-xs mx-auto mt-6">
          <span className="text-xs tracking-[0.3em]">✦</span>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="mb-10 rounded-xl border border-border/50 bg-card/30 panel-glow p-4">
        <p className="font-heading text-[10px] tracking-[0.2em] text-muted-foreground mb-3">JUMP TO A SECTION</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setOpenSection(s.id);
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex items-center gap-2 p-2 rounded-lg border border-border/40 bg-card/30 hover:border-primary/40 hover:bg-secondary/20 transition-all text-left"
            >
              <div className="w-6 h-6 rounded-full wax-seal flex items-center justify-center shrink-0 text-[10px] font-heading font-700 text-primary-foreground">
                {s.n}
              </div>
              <span className="text-[10px] font-heading tracking-wide text-muted-foreground leading-tight">
                {s.title.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <Section id="getting-started" n={1} title="Getting Started" icon={KeyRound}
          open={openSection === 'getting-started'} onToggle={() => setOpenSection(openSection === 'getting-started' ? '' : 'getting-started')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            Before you can adventure, you need an account. This keeps your campaigns, characters,
            and progress saved across devices.
          </p>
          <Callout type="info" title="What You'll See">
            <ul className="space-y-1.5 text-xs text-muted-foreground font-body">
              <li>• <strong className="text-foreground">Register</strong> with your email and a password, or sign up with Google.</li>
              <li>• You'll receive a verification code by email — enter it to confirm your account.</li>
              <li>• Once verified, you'll land on the <strong className="text-foreground">Command Center</strong> (your dashboard).</li>
              <li>• Already have an account? Just log in with your email and password.</li>
            </ul>
          </Callout>
          <div className="mt-4 p-3 rounded-lg bg-secondary/20 border border-border/40">
            <p className="text-[11px] text-muted-foreground font-body">
              <Sparkles className="w-3 h-3 inline mr-1 text-primary" />
              <strong className="text-foreground">Tip:</strong> Use the same account on all your devices. Your campaigns sync automatically — start a turn on your phone, continue on your laptop.
            </p>
          </div>
        </Section>

        <Section id="dashboard" n={2} title="The Command Center" icon={Compass}
          open={openSection === 'dashboard'} onToggle={() => setOpenSection(openSection === 'dashboard' ? '' : 'dashboard')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            The Command Center is your home base. Every time you log in, this is where you'll land.
            It shows your active campaigns, your characters, pending invites, and quick actions to
            start or join a game.
          </p>
          <GuideImage
            src="https://media.base44.com/images/public/6a4af4087166276674b33cf8/f2f2a996c_generated_image.png"
            alt="The Command Center dashboard"
            caption="The Command Center — your campaign hub. Resume your last game, join a party by code, or start something new."
          />
          <div className="space-y-3 mt-5">
            <FeatureRow icon={Play} title="Resume Last Campaign" desc="The big card at the top lets you jump right back into your most recent game with one click." />
            <FeatureRow icon={KeyRound} title="Join by Code" desc="Enter a 6-character invite code from a friend to join their campaign instantly." />
            <FeatureRow icon={Swords} title="Create New Campaign" desc="Takes you to the realm selection screen to pick your game system and forge a new adventure." />
            <FeatureRow icon={Library} title="Browse Adventures" desc="Opens the shared module library where you can find pre-made adventures to play." />
            <FeatureRow icon={ScrollText} title="My Characters" desc="Lists every character you've created across all campaigns, with quick links to their sheets." />
            <FeatureRow icon={Sparkles} title="Recent Invites" desc="Shows campaigns you've been invited to but haven't created a character for yet." />
          </div>
        </Section>

        <Section id="game-selection" n={3} title="Choosing Your Realm" icon={ScrollText}
          open={openSection === 'game-selection'} onToggle={() => setOpenSection(openSection === 'game-selection' ? '' : 'game-selection')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            Old RPG Hub supports over 20 classic tabletop RPG systems. Each one has its own rules,
            character creation flow, and Game Master personality. Pick the world you want to play in.
          </p>
          <GuideImage
            src="https://media.base44.com/images/public/6a4af4087166276674b33cf8/e60b1c036_generated_image.png"
            alt="Game selection screen"
            caption="Choose Your Realm — browse game cards organized by category: Fantasy, Sci-Fi, Pulp, and more."
          />
          <div className="mt-5 space-y-2">
            <p className="text-xs font-heading tracking-wide text-muted-foreground">AVAILABLE GAME SYSTEMS INCLUDE:</p>
            <div className="flex flex-wrap gap-1.5">
              {['AD&D 1st Ed', 'Star Frontiers', 'Gamma World', 'Boot Hill', 'Indiana Jones', 'Top Secret', 'Conan / Red Sonja', 'Buck Rogers', 'Ghostbusters', 'Gangbusters', 'Legion of Doom', 'Spelljammer', 'Dark Sun', 'Greyhawk', 'Forgotten Realms', 'Hollow World', 'D&D 5e', 'Star Wars', 'Shadowrun', 'Cyberpunk', 'Traveller', 'Ravenloft'].map(g => (
                <span key={g} className="text-[10px] px-2 py-0.5 rounded-full border border-border/50 bg-card/30 text-muted-foreground font-body">{g}</span>
              ))}
            </div>
          </div>
          <Callout type="tip" title="Not Sure Which to Pick?">
            <p className="text-xs text-muted-foreground font-body">
              <strong className="text-foreground">AD&D 1st Edition</strong> is the classic fantasy experience — dungeons, dragons, and treasure. <strong className="text-foreground">Star Frontiers</strong> is great for sci-fi fans. Each card has a description to help you decide.
            </p>
          </Callout>
        </Section>

        <Section id="campaign-setup" n={4} title="Creating a Campaign" icon={MapPin}
          open={openSection === 'campaign-setup'} onToggle={() => setOpenSection(openSection === 'campaign-setup' ? '' : 'campaign-setup')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            After choosing a game system, you'll set up your campaign. This is where you name your
            adventure, choose a play style, describe your world vision, and optionally link a
            pre-made adventure module.
          </p>
          <div className="space-y-3">
            <FeatureRow icon={ScrollText} title="Campaign Name" desc="Give your saga a title — or leave it blank and one will be generated from your world setting." />
            <FeatureRow icon={Swords} title="Campaign Style" desc="Choose your tone: Balanced, Combat-Heavy, Dungeon Crawler, Sandbox, or Character-Driven. This shapes how the AI Game Master runs the game." />
            <FeatureRow icon={MapPin} title="World Setting" desc="Pick a preset world or type your own. For fantasy, you can name a custom realm. For sci-fi, pick a planet." />
            <FeatureRow icon={Sparkles} title="Your Vision (Optional)" desc="Describe the tone, themes, and starting situation you want. The DM reads this and weaves it into the world." />
            <FeatureRow icon={Library} title="Adventure Module (Optional)" desc="Link a published module from the library and the DM will study it to run the adventure faithfully." />
          </div>
          <Callout type="info" title="Play Mode">
            <p className="text-xs text-muted-foreground font-body">
              All campaigns use <strong className="text-foreground">Async (play-by-post)</strong> mode. This means you and your friends take turns declaring actions whenever you're available — no need to be online at the same time. The DM waits for everyone to act before responding.
            </p>
          </Callout>
        </Section>

        <Section id="character-creation" n={5} title="Creating a Character" icon={Swords}
          open={openSection === 'character-creation'} onToggle={() => setOpenSection(openSection === 'character-creation' ? '' : 'character-creation')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            Every campaign needs a hero. The character creation flow walks you through the rules
            step by step — the system enforces racial ability adjustments, class requirements, and
            alignment restrictions automatically.
          </p>
          <GuideImage
            src="https://media.base44.com/images/public/6a4af4087166276674b33cf8/1d2f57057_generated_image.png"
            alt="Character creation screen"
            caption="Character creation uses a 6-step wizard: Race → Class → Ability Scores → Alignment → Identity → Review."
          />
          <div className="space-y-3 mt-5">
            <StepRow n="1" title="Choose Your Race" desc="Pick from the available races for your game system. Each race has ability score adjustments and class restrictions." />
            <StepRow n="2" title="Choose Your Class" desc="Classes available to your race are highlighted. Some have minimum ability score requirements (shown in red if not met)." />
            <StepRow n="3" title="Roll Ability Scores" desc="Click to roll 3d6 in order for each ability (STR, INT, WIS, DEX, CON, CHA). Racial adjustments apply automatically. You can reroll as many times as you like." />
            <StepRow n="4" title="Choose Your Alignment" desc="Pick from the nine classic alignments. Some classes restrict which alignments are available — restricted ones are greyed out." />
            <StepRow n="5" title="Identity & Experience" desc="Set your starting level (1 for a classic crawl, or higher for seasoned heroes), name your character, and optionally describe their appearance and background." />
            <StepRow n="6" title="Review & Confirm" desc="See a summary of your character — HP, AC, THAC0, equipment, and all scores — before entering the realm." />
          </div>
          <Callout type="tip" title="Importing an Existing Character">
            <p className="text-xs text-muted-foreground font-body">
              Already have a character sheet from another game? Use the <strong className="text-foreground">"Import a sheet instead"</strong> link at the top of the character creation page to upload a PDF or image of your existing character.
            </p>
          </Callout>
        </Section>

        <Section id="playing" n={6} title="Playing the Game" icon={Play}
          open={openSection === 'playing'} onToggle={() => setOpenSection(openSection === 'playing' ? '' : 'playing')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            This is the heart of Old RPG Hub. You type what your character does in plain English,
            and the AI Game Master narrates the outcome, enforces the rules, rolls dice, tracks HP
            and XP, manages loot, and keeps the story moving.
          </p>
          <GuideImage
            src="https://media.base44.com/images/public/6a4af4087166276674b33cf8/8cc12971b_generated_image.png"
            alt="Campaign play screen"
            caption="The campaign screen. DM narration appears on parchment panels. Type your action at the bottom. The party sidebar shows your companions."
          />
          <div className="space-y-3 mt-5">
            <FeatureRow icon={Swords} title="Declare Your Action" desc="Type what your character does in the text box at the bottom. 'I search the room for traps.' 'I swing my sword at the goblin.' 'I try to persuade the guard.' Then hit send." />
            <FeatureRow icon={Dices} title="Roll Dice" desc="Open the dice panel to roll attacks, saves, ability checks, and damage. The DM interprets your roll and narrates the result. Dice results are also routed through the turn system." />
            <FeatureRow icon={MessageCircle} title="Discuss Mode" desc="Toggle to 'Discuss' to talk out-of-character with your party without triggering a DM response. Messages appear in sky-blue bubbles." />
            <FeatureRow icon={Play} title="I Agree — Stand Ready" desc="If you don't have a specific action this turn but want to move the round forward, click 'I Agree' to signal you're ready. When everyone agrees, the round advances." />
            <FeatureRow icon={ScrollText} title="Narration Feed" desc="The scrolling feed above the input shows the full history — DM narration, your actions, dice rolls, and party discussion. Scroll up to re-read past events." />
            <FeatureRow icon={Volume2} title="Voice Narration (AD&D)" desc="In AD&D 1st Edition campaigns, click the 'Voice' button on any DM narration to hear it spoken aloud. The audio is shared with your entire party — once one person generates it, everyone can play it." />
          </div>
          <Callout type="how" title="How Turns Work (Async Round System)">
            <div className="space-y-1.5 text-xs text-muted-foreground font-body">
              <p>1. <strong className="text-foreground">You submit your action</strong> (or click "I Agree").</p>
              <p>2. The DM <strong className="text-foreground">waits for every active party member</strong> to also act.</p>
              <p>3. Once everyone has submitted, the DM <strong className="text-foreground">combines all actions</strong> and responds with narration.</p>
              <p>4. You'll see a "waiting" indicator showing who has and hasn't acted yet.</p>
              <p>5. The round resets and you can act again.</p>
            </div>
          </Callout>
        </Section>

        <Section id="dm-brief" n={7} title="The DM Brief" icon={ScrollText}
          open={openSection === 'dm-brief'} onToggle={() => setOpenSection(openSection === 'dm-brief' ? '' : 'dm-brief')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            The DM Brief is your custom instruction manual for the AI Game Master. As the campaign
            owner, you can tell the DM exactly how you want the table run — tone, pacing, narration
            length, dice philosophy, NPC behavior, and table discipline. The DM reads it every turn
            and follows it over its defaults.
          </p>
          <GuideImage
            src="https://media.base44.com/images/public/6a4af4087166276674b33cf8/5c722b668_generated_image.png"
            alt="DM Brief editor"
            caption="The DM Brief editor — only visible to the campaign owner. Write your house rules and the DM will follow them."
          />
          <Callout type="info" title="How to Access It">
            <p className="text-xs text-muted-foreground font-body">
              On the campaign screen, look for the <strong className="text-foreground">"DM Brief"</strong> button in the top-right toolbar (next to Invite and Journal). This button only appears for the campaign owner.
            </p>
          </Callout>
          <Callout type="tip" title="What to Put in Your Brief">
            <ul className="space-y-1 text-xs text-muted-foreground font-body">
              <li>• <strong className="text-foreground">Tone:</strong> "Keep it gritty and dangerous. Don't pull punches."</li>
              <li>• <strong className="text-foreground">Pacing:</strong> "Move the story forward each turn. No filler or repetition."</li>
              <li>• <strong className="text-foreground">Narration length:</strong> "Keep narration to 2-3 short paragraphs."</li>
              <li>• <strong className="text-foreground">NPC behavior:</strong> "NPCs should have distinct voices and act on their own motivations."</li>
              <li>• <strong className="text-foreground">Focus:</strong> "Keep the story oriented toward current objectives and chapter progress."</li>
            </ul>
          </Callout>
          <Callout type="how" title="How It Works Behind the Scenes">
            <p className="text-xs text-muted-foreground font-body">
              Your DM Brief is injected into the AI's system prompt on every single turn, across every game system. It's treated as authoritative — when it conflicts with the DM's default behavior, the brief wins. Changes take effect on the next turn after you save.
            </p>
          </Callout>
        </Section>

        <Section id="party-play" n={8} title="Playing With Friends" icon={Users}
          open={openSection === 'party-play'} onToggle={() => setOpenSection(openSection === 'party-play' ? '' : 'party-play')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            Old RPG Hub is built for multiplayer. Invite your friends to your campaign, and everyone
            plays their own character. The DM waits for each party member to act before responding,
            so the whole group advances together — even if you're online at different times.
          </p>
          <div className="space-y-3">
            <FeatureRow icon={KeyRound} title="Invite by Code" desc="Click the 'Invite' button on the campaign screen. Share the 6-character invite code with your friends. They enter it on the dashboard's 'Join by Code' field to join instantly." />
            <FeatureRow icon={Users} title="The Party Sidebar" desc="The right sidebar shows every active party member with their name, class, level, and HP bar. Green checkmarks show who has submitted their action this round." />
            <FeatureRow icon={Play} title="Round System" desc="Each round, every player types their action (or clicks 'I Agree'). When all active members have acted, the DM responds with combined narration addressing everyone's actions." />
            <FeatureRow icon={MessageCircle} title="Party Discussion" desc="Use 'Discuss' mode to talk out-of-character with your party. Plan strategy, joke around, or coordinate your next move — without triggering a DM response." />
            <FeatureRow icon={Volume2} title="Shared Audio" desc="In AD&D campaigns, when any party member generates voice narration, the audio URL is saved to that journal entry. Everyone else in the party can play the same audio — no duplicate generation needed." />
          </div>
          <Callout type="tip" title="Up to 3 Free Friends">
            <p className="text-xs text-muted-foreground font-body">
              As the campaign owner, you can grant free DM access to up to 3 friends by email. Use the <strong className="text-foreground">"Free Friends"</strong> button on the campaign screen to manage this.
            </p>
          </Callout>
        </Section>

        <Section id="journal-sheets" n={9} title="Journal & Character Sheets" icon={BookOpen}
          open={openSection === 'journal-sheets'} onToggle={() => setOpenSection(openSection === 'journal-sheets' ? '' : 'journal-sheets')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            Everything that happens in your campaign is recorded. The Journal keeps a running log
            of every narration, action, and dice roll. Your Character Sheet tracks HP, XP, equipment,
            spells, gold, and more — all updated automatically by the DM as you play.
          </p>
          <div className="space-y-3">
            <FeatureRow icon={BookOpen} title="The Campaign Journal" desc="Click 'Journal' on the campaign screen to see the full history of your adventure — every DM narration, player action, dice roll, and discussion, organized by chapter." />
            <FeatureRow icon={ScrollText} title="Character Sheet" desc="Click 'My Character Sheet' in the campaign sidebar to view your full sheet: ability scores, HP, AC, THAC0, saves, spells, equipment, gold, appearance, and background." />
            <FeatureRow icon={Swords} title="Clickable Equipment & Spells" desc="In AD&D campaigns, click any item or spell on your character sheet to see its rules and stats in a popup. This is local to your view — it doesn't broadcast to the party." />
            <FeatureRow icon={MapPin} title="NPC & Location Dossiers" desc="The campaign sidebar also shows World State — a living dossier of every NPC you've met and every location you've explored, with running notes that accumulate over time." />
          </div>
        </Section>

        <Section id="library" n={10} title="The Adventure Library" icon={Library}
          open={openSection === 'library'} onToggle={() => setOpenSection(openSection === 'library' ? '' : 'library')}>
          <p className="font-body text-sm text-foreground/90 leading-relaxed mb-4">
            The Adventure Library is a shared collection of pre-made adventure modules. You can
            upload your own modules (as PDFs or documents), browse modules shared by other players,
            and link them to your campaigns so the DM runs them faithfully.
          </p>
          <div className="space-y-3">
            <FeatureRow icon={Library} title="Browse Modules" desc="Visit the Library from the dashboard or the game selection screen to see all shared adventures, filtered by game system." />
            <FeatureRow icon={ScrollText} title="Upload Your Own" desc="Upload a PDF or text file of an adventure module. The system extracts the content and the DM studies it to run the adventure as written." />
            <FeatureRow icon={Play} title="Link to a Campaign" desc="When creating a campaign, select a module from the library. The DM reads the module brief every turn and keeps locations, NPCs, traps, and treasures consistent." />
            <FeatureRow icon={Sparkles} title="Imported Campaigns" desc="Already playing a game elsewhere? Use the 'Import Campaign' option to upload your campaign history as a chronicle. The DM picks up exactly where you left off." />
          </div>
          <Callout type="info" title="File Limits">
            <p className="text-xs text-muted-foreground font-body">
              Module and character sheet uploads must be under <strong className="text-foreground">10 MB</strong>. PDFs with text layers work best. Scanned/image-only PDFs may not extract properly.
            </p>
          </Callout>
        </Section>
      </div>

      {/* Footer CTA */}
      <div className="mt-12 text-center rounded-xl border border-primary/40 bg-gradient-to-br from-primary/10 via-card/60 to-background panel-glow p-8">
        <h2 className="font-heading font-700 text-xl text-foreground mb-2">Ready to Begin?</h2>
        <p className="font-tome italic text-sm text-muted-foreground mb-5 max-w-md mx-auto">
          Your adventure is one click away. Choose a realm, forge a character, and let the Game Master guide your party into legend.
        </p>
        <div className="flex gap-2 justify-center flex-wrap">
          <Link to="/games">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Compass className="w-4 h-4 mr-1.5" /> Choose a Realm
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/10">
              <Play className="w-4 h-4 mr-1.5" /> Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ id, n, title, icon: Icon, open, onToggle, children }) {
  return (
    <div id={id} className="rounded-xl border border-border/50 bg-card/30 panel-glow overflow-hidden scroll-mt-20">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 hover:bg-secondary/20 transition-colors text-left"
      >
        <div className="w-8 h-8 rounded-full wax-seal flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-heading tracking-[0.2em] text-primary/70">STEP {n}</span>
          <h3 className="font-heading font-700 text-base text-foreground">{title}</h3>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-5 animate-ink">
          {children}
        </div>
      )}
    </div>
  );
}

function GuideImage({ src, alt, caption }) {
  return (
    <figure className="my-4">
      <div className="rounded-lg overflow-hidden border border-border/50 bg-background/40">
        <img src={src} alt={alt} className="w-full h-auto" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-[11px] font-tome italic text-muted-foreground text-center leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function FeatureRow({ icon: Icon, title, desc }) {
  return (
    <div className="flex gap-3 p-2.5 rounded-lg bg-card/20 border border-border/30">
      <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="font-heading font-600 text-xs text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground font-body leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function StepRow({ n, title, desc }) {
  return (
    <div className="flex gap-3">
      <div className="w-6 h-6 rounded-full wax-seal flex items-center justify-center shrink-0 text-[11px] font-heading font-700 text-primary-foreground">{n}</div>
      <div>
        <p className="font-heading font-600 text-xs text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground font-body leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function Callout({ type = 'info', title, children }) {
  const styles = {
    info: 'border-sky-800/40 bg-sky-950/10',
    tip: 'border-emerald-800/40 bg-emerald-950/10',
    how: 'border-primary/40 bg-primary/5',
    warning: 'border-amber-800/40 bg-amber-950/10',
  };
  const icons = {
    info: MessageCircle,
    tip: Sparkles,
    how: Settings,
    warning: Skull,
  };
  const Icon = icons[type] || MessageCircle;
  return (
    <div className={`mt-4 p-3.5 rounded-lg border ${styles[type]}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-primary" strokeWidth={1.5} />
        <p className="font-heading text-[11px] tracking-wide text-foreground">{title}</p>
      </div>
      {children}
    </div>
  );
}