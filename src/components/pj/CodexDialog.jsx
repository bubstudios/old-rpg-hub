import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  BookOpen, Target, Users, Heart, AlertTriangle, FileText, Activity,
  Flag, MapPin, Clock, HelpCircle, Lock, ChevronDown, ChevronUp, Compass
} from 'lucide-react';
import {
  CODEX_SECTIONS, STORY_SO_FAR_TEXT, SANDBOX_INTRO_TEXT, CURRENT_MISSION,
  getSectionEntries, PJ_EPISODES, CODEX_LOCATIONS, isLocationVisible
} from '@/lib/pjCodex';
import LocationCard from '@/components/pj/LocationCard';
import FactionCard from '@/components/pj/FactionCard';
import ClockCard from '@/components/pj/ClockCard';
import { CODEX_FACTIONS, isFactionVisible } from '@/lib/pjFactions';
import { getAllClocks, getClockValue, isCrisisClockVisible } from '@/lib/pjClocks';

const SECTION_ICONS = {
  story: BookOpen, mission: Target, crew: Users, allies: Heart,
  enemies: AlertTriangle, evidence: FileText, clocks: Activity,
  factions: Flag, locations: MapPin, future: Clock, questions: HelpCircle
};

export default function CodexDialog({ open, onOpenChange, initialSection, initialEntryKey, campaign, onSuggestAction }) {
  const [section, setSection] = useState('story');
  const [expanded, setExpanded] = useState(new Set());
  const [showEpisodes, setShowEpisodes] = useState(false);

  useEffect(() => {
    if (open) {
      setSection(initialSection || 'story');
      const ex = new Set();
      if (initialEntryKey) ex.add(initialEntryKey);
      setExpanded(ex);
      setShowEpisodes(false);
    }
  }, [open, initialSection, initialEntryKey]);

  function toggle(key) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const entries = getSectionEntries(section);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40">
          <DialogTitle className="font-heading tracking-[0.15em] text-base flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" strokeWidth={1.5} />
            CODEX
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row h-[68vh]">
          {/* Section sidebar */}
          <div className="sm:w-48 sm:shrink-0 border-b sm:border-b-0 sm:border-r border-border/40 overflow-y-auto">
            <div className="flex sm:flex-col gap-1 p-2 overflow-x-auto sm:overflow-x-visible">
              {CODEX_SECTIONS.map((s) => {
                const Icon = SECTION_ICONS[s.id] || BookOpen;
                const active = section === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSection(s.id)}
                    className={`shrink-0 sm:w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-heading tracking-wide transition-colors ${
                      active
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {section === 'story' && (
              <div className="space-y-4">
                <p className="text-sm font-body italic text-primary/90 border-l-2 border-primary/40 pl-3 leading-relaxed">
                  {SANDBOX_INTRO_TEXT}
                </p>
                <div className="text-sm font-body text-foreground/80 leading-relaxed whitespace-pre-line">
                  {STORY_SO_FAR_TEXT}
                </div>
                <div className="pt-3 border-t border-border/40">
                  <button
                    onClick={() => setShowEpisodes((v) => !v)}
                    className="flex items-center gap-2 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showEpisodes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    ARC 1 EPISODES ({PJ_EPISODES.length})
                  </button>
                  {showEpisodes && (
                    <div className="mt-2 space-y-1.5">
                      {PJ_EPISODES.map((ep) => (
                        <div key={ep.num} className="text-xs font-body">
                          <span className="font-heading text-primary/70 tabular-nums">{ep.num}.</span>{' '}
                          <span className="font-heading text-foreground/90">{ep.title}</span>
                          <span className="text-muted-foreground"> — {ep.summary}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {section === 'mission' && (
              <div className="space-y-4">
                <MissionField label="Location" value={CURRENT_MISSION.location} icon={Compass} />
                <MissionField label="Immediate Problem" value={CURRENT_MISSION.problem} icon={AlertTriangle} />
                <MissionField label="Stakes" value={CURRENT_MISSION.stakes} icon={Target} />
                <MissionField label="First Decision" value={CURRENT_MISSION.firstDecision} icon={HelpCircle} />
                <div>
                  <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-2">
                    <Target className="w-3 h-3" strokeWidth={1.5} /> POSSIBLE APPROACHES
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside marker:text-primary/50">
                    {CURRENT_MISSION.approaches.map((a, i) => (
                      <li key={i} className="text-sm font-body text-foreground/80 leading-relaxed">{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {section === 'factions' ? (
              <div className="space-y-2">
                {CODEX_FACTIONS.filter((f) => isFactionVisible(campaign, f)).map((fac) => (
                  <FactionCard
                    key={fac.key}
                    faction={fac}
                    campaign={campaign}
                    expanded={expanded.has(fac.key)}
                    onToggle={() => toggle(fac.key)}
                    onSuggestAction={onSuggestAction}
                  />
                ))}
                <p className="text-[10px] text-muted-foreground/60 italic pt-1.5 leading-relaxed">
                  Factions are living groups with their own goals. They do not wait passively — if ignored, they advance their agendas. Use Faction Interactions to monitor, negotiate, threaten, or recruit.
                </p>
              </div>
            ) : section === 'locations' ? (
              <div className="space-y-2">
                {CODEX_LOCATIONS.filter((loc) => isLocationVisible(campaign, loc)).map((loc) => (
                  <LocationCard
                    key={loc.key}
                    location={loc}
                    campaign={campaign}
                    expanded={expanded.has(loc.key)}
                    onToggle={() => toggle(loc.key)}
                    onSuggestAction={onSuggestAction}
                  />
                ))}
                <p className="text-[10px] text-muted-foreground/60 italic pt-1.5 leading-relaxed">
                  Every location listed here is a playable destination. If it is unlocked or active, use the Player Actions to set course, send a probe, or plan a mission. Ignored crises can fall.
                </p>
              </div>
            ) : section === 'clocks' ? (
              <div className="space-y-2">
                {getAllClocks().filter((c) => isCrisisClockVisible(campaign, c)).map((clock) => (
                  <ClockCard
                    key={clock.key}
                    clock={clock}
                    value={getClockValue(campaign, clock.key)}
                    changes={(campaign?.world_state?.quest_flags?.clock_changes || []).filter((cc) => cc.clock === clock.key)}
                    expanded={expanded.has(clock.key)}
                    onToggle={() => toggle(clock.key)}
                    onSuggestAction={onSuggestAction}
                  />
                ))}
                <p className="text-[10px] text-muted-foreground/60 italic pt-1.5 leading-relaxed">
                  Sandbox Clocks are story pressure meters. The AI GM manages them — you only need to understand what's getting better, what's getting worse, why it changed, and what you can do about it. Crisis clocks appear only when triggered by events in your campaign.
                </p>
              </div>
            ) : entries && (
              <div className="space-y-2">
                {entries.map((entry) => (
                  <EntryCard
                    key={entry.key}
                    entry={entry}
                    expanded={expanded.has(entry.key)}
                    onToggle={() => toggle(entry.key)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MissionField({ label, value, icon: Icon }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1">
        <Icon className="w-3 h-3" strokeWidth={1.5} /> {label.toUpperCase()}
      </p>
      <p className="text-sm font-body text-foreground/80 leading-relaxed">{value}</p>
    </div>
  );
}

function EntryCard({ entry, expanded, onToggle }) {
  return (
    <div className="border border-border/40 rounded-lg overflow-hidden bg-card/30">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors"
      >
        <span className="font-heading text-sm text-foreground pr-2">{entry.label}</span>
        <div className="flex items-center gap-2 shrink-0">
          {entry.locked && <Lock className="w-3 h-3 text-muted-foreground/50" strokeWidth={1.5} />}
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />}
        </div>
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2.5">
          {(entry.fields || []).map((f, i) => (
            <div key={i}>
              <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-0.5">{f.label.toUpperCase()}</p>
              <p className="text-sm font-body text-foreground/80 leading-relaxed">{f.value}</p>
            </div>
          ))}
          {entry.locked && entry.spoilerNote && (
            <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 italic pt-1.5 border-t border-border/30">
              <Lock className="w-3 h-3 shrink-0" strokeWidth={1.5} /> {entry.spoilerNote}
            </p>
          )}
        </div>
      )}
    </div>
  );
}