import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Compass, Sparkles, Sword, BookOpen, MapPin, Users } from 'lucide-react';

function normName(s) {
  return String(s || '').trim().toLowerCase()
    .replace(/^province\s+\d+(?:\s+(?:upper|inner|deep))?:\s*/, '')
    .replace(/\s+/g, ' ');
}

function dispositionColor(d) {
  const s = String(d || '').toLowerCase();
  if (s.includes('hostile') || s.includes('enemy')) return 'bg-red-900/40 text-red-300 border-red-800/50';
  if (s.includes('friend') || s.includes('ally') || s.includes('respect')) return 'bg-emerald-900/40 text-emerald-300 border-emerald-800/50';
  return 'bg-secondary text-muted-foreground border-border/50';
}

export default function PullWorldStateDossier({ campaignId, selection, onClose }) {
  const [npcs, setNpcs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId) return;
    let active = true;
    (async () => {
      try {
        const [n, l] = await Promise.all([
          base44.entities.NPC.filter({ campaign_id: campaignId }, '-updated_date', 200),
          base44.entities.Location.filter({ campaign_id: campaignId }, '-updated_date', 200)
        ]);
        if (!active) return;
        setNpcs(n || []);
        setLocations(l || []);
      } catch (e) { /* ignore */ }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [campaignId]);

  const open = !!selection;
  const type = selection?.type;
  const name = selection?.name;

  let entity = null;
  if (type === 'npc') {
    entity = npcs.find(n => normName(n.name) === normName(name) || (n.aliases || []).some(a => normName(a) === normName(name)));
  } else if (type === 'location') {
    entity = locations.find(l => normName(l.name) === normName(name));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85dvh] overflow-y-auto overscroll-contain p-4 sm:p-6">
        {selection && (type === 'npc'
          ? <NpcBody entity={entity} fallback={selection.fallback || {}} loading={loading} />
          : <LocationBody entity={entity} name={name} loading={loading} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function NpcBody({ entity, fallback, loading }) {
  if (loading && !entity) return <p className="text-muted-foreground italic text-center py-8">Compiling the dossier...</p>;
  const name = entity?.name || fallback.name || 'Unknown';
  const disposition = entity?.disposition || fallback.disposition;
  const knownFacts = entity?.what_we_know
    ? String(entity.what_we_know).split('\n').map(s => s.trim()).filter(Boolean)
    : [];
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading tracking-wide flex items-center gap-2 flex-wrap">
          <Users className="w-4 h-4 text-primary" strokeWidth={1.5} />
          {name}
          {disposition && (
            <span className={`px-1.5 py-0.5 rounded text-[9px] border ${dispositionColor(disposition)}`}>
              {disposition}
            </span>
          )}
        </DialogTitle>
        {entity?.aliases?.length ? (
          <DialogDescription className="text-xs italic">Also known as: {entity.aliases.join(', ')}</DialogDescription>
        ) : null}
      </DialogHeader>
      <div className="space-y-3 mt-2 text-sm font-body">
        {entity?.description && (
          <Section icon={MapPin} label="Description">
            <p className="text-foreground/80 leading-relaxed">{entity.description}</p>
          </Section>
        )}
        {entity?.characteristics && (
          <Section icon={Sparkles} label="Characteristics">
            <p className="text-foreground/80 leading-relaxed">{entity.characteristics}</p>
          </Section>
        )}
        {entity?.attributes && (
          <Section icon={Sword} label="Attributes & Status">
            <p className="text-foreground/80 leading-relaxed">{entity.attributes}</p>
          </Section>
        )}
        {knownFacts.length > 0 && (
          <Section icon={BookOpen} label="What We Know">
            <ul className="space-y-1 list-disc list-inside marker:text-primary/50">
              {knownFacts.map((f, i) => <li key={i} className="text-foreground/80 leading-relaxed">{f}</li>)}
            </ul>
          </Section>
        )}
        {fallback.notes && (
          <Section icon={BookOpen} label="Notes">
            <p className="text-foreground/80 leading-relaxed">{fallback.notes}</p>
          </Section>
        )}
        {entity?.first_met_chapter && (
          <p className="text-[10px] text-muted-foreground/50 italic pt-1 border-t border-border/30">
            First encountered in Chapter {entity.first_met_chapter}.
          </p>
        )}
        {!entity && !fallback.notes && (
          <p className="text-muted-foreground italic text-center py-4">No details recorded yet.</p>
        )}
      </div>
    </>
  );
}

function LocationBody({ entity, name, loading }) {
  if (loading && !entity) return <p className="text-muted-foreground italic text-center py-8">Surveying the realm...</p>;
  const facts = entity?.summary
    ? String(entity.summary).split('\n').map(s => s.trim()).filter(Boolean)
    : [];
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-heading tracking-wide flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary" strokeWidth={1.5} />
          {entity?.name || name}
        </DialogTitle>
        {entity?.first_visited_chapter && (
          <DialogDescription className="text-xs italic">
            First explored in Chapter {entity.first_visited_chapter}{entity.last_visited_chapter && Number(entity.last_visited_chapter) !== Number(entity.first_visited_chapter) ? ` · last visited Chapter ${entity.last_visited_chapter}` : ''}.
          </DialogDescription>
        )}
      </DialogHeader>
      <div className="space-y-3 mt-2 text-sm font-body">
        {facts.length > 0 ? (
          <Section icon={BookOpen} label="What Happened Here">
            <ul className="space-y-1 list-disc list-inside marker:text-primary/50">
              {facts.map((f, i) => <li key={i} className="text-foreground/80 leading-relaxed">{f}</li>)}
            </ul>
          </Section>
        ) : (
          <p className="text-muted-foreground italic text-center py-4">No details recorded yet — explore here to learn more.</p>
        )}
      </div>
    </>
  );
}

function Section({ icon: Icon, label, children }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1">
        <Icon className="w-3 h-3" strokeWidth={1.5} /> {label.toUpperCase()}
      </p>
      {children}
    </div>
  );
}