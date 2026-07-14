import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Crosshair, ChevronDown, ChevronUp, Users, AlertTriangle, Check,
  Send, Eye, Search, Shield, Compass, Rocket, Lock, FileText, Heart, EyeOff
} from 'lucide-react';
import {
  AVAILABLE_OPERATIONS, OPERATION_TYPES, CREW_CAPABILITIES, CREW_KEYS,
  getOperationType, getAvailableEvidence, formatOperationCommand
} from '@/lib/pjOperations';

const TYPE_ICONS = {
  covert: Eye, recon: Search, rescue: Heart, evidence_recovery: FileText,
  counterintel: Shield, exploration: Compass, diplomatic: Users,
  ship_maneuver: Rocket, sabotage_prevention: Lock, undercover: EyeOff
};

export default function OperationsPanel({ open, onOpenChange, campaign, onSuggestAction }) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState({});
  const [selectedApproach, setSelectedApproach] = useState({});
  const [selectedEvidence, setSelectedEvidence] = useState({});

  const operations = filter === 'all'
    ? AVAILABLE_OPERATIONS
    : AVAILABLE_OPERATIONS.filter(op => op.type === filter);

  function toggleTeam(opId, crewKey) {
    setSelectedTeam(prev => {
      const cur = prev[opId] || [];
      return { ...prev, [opId]: cur.includes(crewKey) ? cur.filter(k => k !== crewKey) : [...cur, crewKey] };
    });
  }

  function toggleEvidence(opId, evLabel) {
    setSelectedEvidence(prev => {
      const cur = prev[opId] || [];
      return { ...prev, [opId]: cur.includes(evLabel) ? cur.filter(e => e !== evLabel) : [...cur, evLabel] };
    });
  }

  function handleAuthorize(op) {
    const team = selectedTeam[op.id] || [];
    const approach = selectedApproach[op.id] || '';
    const evidence = selectedEvidence[op.id] || [];
    const command = formatOperationCommand(op, team, approach, evidence);
    onSuggestAction?.(command);
    onOpenChange(false);
    setExpandedId(null);
  }

  function handleExpand(opId) {
    setExpandedId(prev => prev === opId ? null : opId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/40">
          <DialogTitle className="font-heading tracking-[0.15em] text-base flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-primary" strokeWidth={1.5} />
            COMMAND CENTER
          </DialogTitle>
          <p className="text-xs text-muted-foreground font-body leading-relaxed mt-1">
            Evidence wins arguments. Operations win the war. Assign a team, choose an approach, and authorize the mission.
          </p>
        </DialogHeader>

        {/* Filter row */}
        <div className="flex flex-wrap gap-1.5 px-5 py-2.5 border-b border-border/30">
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          {OPERATION_TYPES.map(t => (
            <FilterChip key={t.key} label={t.label} active={filter === t.key} onClick={() => setFilter(t.key)} />
          ))}
        </div>

        {/* Operations list */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-2.5 max-h-[68vh] scrollbar-thin">
          {operations.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-8">No operations available.</p>
          )}
          {operations.map(op => (
            <OperationCard
              key={op.id}
              op={op}
              expanded={expandedId === op.id}
              onExpand={() => handleExpand(op.id)}
              selectedTeam={selectedTeam[op.id] || []}
              onToggleTeam={(crewKey) => toggleTeam(op.id, crewKey)}
              selectedApproach={selectedApproach[op.id] || ''}
              onSelectApproach={(a) => setSelectedApproach(prev => ({ ...prev, [op.id]: a }))}
              selectedEvidence={selectedEvidence[op.id] || []}
              onToggleEvidence={(label) => toggleEvidence(op.id, label)}
              onAuthorize={() => handleAuthorize(op)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-[10px] font-heading tracking-wide px-2.5 py-1 rounded-full border transition-colors ${
        active
          ? 'border-primary/50 text-primary bg-primary/10'
          : 'border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30'
      }`}
    >
      {label}
    </button>
  );
}

function OperationCard({ op, expanded, onExpand, selectedTeam, onToggleTeam, selectedApproach, onSelectApproach, selectedEvidence, onToggleEvidence, onAuthorize }) {
  const typeInfo = getOperationType(op.type);
  const TypeIcon = TYPE_ICONS[op.type] || Crosshair;
  const evidenceList = getAvailableEvidence();

  return (
    <div className={`border rounded-lg overflow-hidden bg-card/30 ${expanded ? 'border-primary/30' : 'border-border/40'}`}>
      {/* Card header */}
      <button
        onClick={onExpand}
        className="flex items-center justify-between w-full p-3 hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <TypeIcon className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} />
          <div className="min-w-0">
            <p className="font-heading text-sm text-foreground truncate">{op.title}</p>
            <p className="text-[10px] font-body text-muted-foreground/70 truncate">{typeInfo.label} · {op.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-heading tracking-wide text-primary/50">{op.recommendedCrew.length} RECOMMENDED</span>
          {expanded
            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />
            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={1.5} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-border/30">
          {/* Objective */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-0.5">OBJECTIVE</p>
            <p className="text-sm font-body text-foreground/80 leading-relaxed">{op.objective}</p>
          </div>

          {/* Risks & Rewards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="border border-red-500/20 rounded p-2 bg-red-950/20">
              <p className="flex items-center gap-1 text-[10px] font-heading tracking-[0.12em] text-red-400/70 mb-1">
                <AlertTriangle className="w-3 h-3" strokeWidth={1.5} /> RISKS
              </p>
              <p className="text-[11px] font-body text-foreground/70 leading-relaxed">{op.risks.join(' · ')}</p>
            </div>
            <div className="border border-emerald-500/20 rounded p-2 bg-emerald-950/20">
              <p className="flex items-center gap-1 text-[10px] font-heading tracking-[0.12em] text-emerald-400/70 mb-1">
                <Check className="w-3 h-3" strokeWidth={1.5} /> REWARDS
              </p>
              <p className="text-[11px] font-body text-foreground/70 leading-relaxed">{op.rewards.join(' · ')}</p>
            </div>
          </div>

          {/* Approach selection */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1.5">APPROACH</p>
            <div className="space-y-1">
              {op.approaches.map((approach, i) => (
                <button
                  key={i}
                  onClick={() => onSelectApproach(approach)}
                  className={`flex items-center gap-2 w-full text-left px-2.5 py-2 rounded border text-xs font-body transition-colors ${
                    selectedApproach === approach
                      ? 'border-primary/50 bg-primary/10 text-foreground'
                      : 'border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center ${
                    selectedApproach === approach ? 'border-primary bg-primary' : 'border-border/50'
                  }`}>
                    {selectedApproach === approach && <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={2} />}
                  </span>
                  {approach}
                </button>
              ))}
            </div>
          </div>

          {/* Team selection */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Users className="w-3 h-3 text-primary/60" strokeWidth={1.5} />
              <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60">AWAY TEAM</p>
              <span className="text-[9px] text-muted-foreground/50 ml-auto">
                Recommended: {op.recommendedCrew.map(k => CREW_CAPABILITIES[k]?.name || k).join(', ')}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {CREW_KEYS.map(key => {
                const crew = CREW_CAPABILITIES[key];
                const isSelected = selectedTeam.includes(key);
                const isRecommended = op.recommendedCrew.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => onToggleTeam(key)}
                    className={`flex items-start gap-2 px-2.5 py-2 rounded border text-left transition-colors ${
                      isSelected
                        ? 'border-primary/50 bg-primary/10'
                        : isRecommended
                        ? 'border-primary/20 bg-primary/5 hover:border-primary/40'
                        : 'border-border/30 hover:border-primary/30'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded border shrink-0 mt-0.5 flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-border/50'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={2} />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-heading text-foreground truncate">{crew.name}</p>
                      <p className="text-[9px] font-body text-muted-foreground/60 truncate">{crew.specialties.join(' · ')}</p>
                    </div>
                    {isRecommended && !isSelected && (
                      <span className="text-[8px] font-heading tracking-wide text-primary/50 shrink-0 mt-0.5">REC</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Evidence attachment (optional) */}
          <div>
            <p className="text-[10px] font-heading tracking-[0.12em] text-primary/60 mb-1.5">EVIDENCE (OPTIONAL)</p>
            <div className="flex flex-wrap gap-1">
              {evidenceList.map(ev => (
                <button
                  key={ev.key}
                  onClick={() => onToggleEvidence(ev.label)}
                  className={`text-[10px] font-body px-2 py-1 rounded border transition-colors ${
                    selectedEvidence.includes(ev.label)
                      ? 'border-primary/50 bg-primary/10 text-foreground'
                      : 'border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30'
                  }`}
                >
                  {ev.label}
                </button>
              ))}
            </div>
          </div>

          {/* Authorize button */}
          <Button
            onClick={onAuthorize}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            size="sm"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" /> AUTHORIZE OPERATION
          </Button>
        </div>
      )}
    </div>
  );
}