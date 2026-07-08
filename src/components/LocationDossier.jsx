import { useState, useEffect, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Compass, BookOpen } from 'lucide-react';

// Parse a legacy explored-location string into a clean name + summary.
// "Haven / Keveth region (First Shard recovered, Aldric rescued)" ->
//   { name: "Haven / Keveth region", summary: "First Shard recovered, Aldric rescued" }
function parseLegacy(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  let name = s, summary = '';
  const paren = s.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (paren) {
    name = paren[1].trim();
    summary = paren[2].trim();
  } else {
    const dash = s.split(' — ');
    if (dash.length > 1) {
      name = dash[0].trim();
      summary = dash.slice(1).join(' — ').trim();
    }
  }
  return { name, summary };
}

function locKey(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ' '); }

export default function LocationDossier({ campaignId, legacyLocations }) {
  const [locations, setLocations] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
    const unsubscribe = base44.entities.Location.subscribe((event) => {
      if (event.data?.campaign_id === campaignId) loadLocations();
    });
    return () => unsubscribe();
  }, [campaignId]);

  async function loadLocations() {
    try {
      const list = await base44.entities.Location.filter({ campaign_id: campaignId }, '-updated_date', 200);
      setLocations(list || []);
    } catch (e) { /* ignore */ }
    finally { setLoading(false); }
  }

  // Merge real Location records with parsed legacy strings (deduped by name).
  const merged = useMemo(() => {
    const byKey = new Map();
    for (const l of locations) {
      byKey.set(locKey(l.name), {
        name: l.name, summary: l.summary || '',
        first: l.first_visited_chapter, last: l.last_visited_chapter
      });
    }
    for (const raw of (legacyLocations || [])) {
      const parsed = parseLegacy(raw);
      if (!parsed || !parsed.name) continue;
      const k = locKey(parsed.name);
      if (byKey.has(k)) {
        const existing = byKey.get(k);
        if (parsed.summary && !existing.summary) existing.summary = parsed.summary;
      } else {
        byKey.set(k, { name: parsed.name, summary: parsed.summary, first: null, last: null });
      }
    }
    return [...byKey.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, [locations, legacyLocations]);

  const selected = merged.find(l => locKey(l.name) === selectedKey) || null;
  const facts = selected?.summary
    ? String(selected.summary).split('\n').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <>
      <div>
        <p className="text-muted-foreground/60 text-[10px] font-heading tracking-wide">EXPLORED</p>
        {loading ? (
          <p className="text-muted-foreground/50 italic text-[11px] mt-0.5">Surveying the realm...</p>
        ) : merged.length ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {merged.map(l => (
              <button
                key={l.name}
                onClick={() => setSelectedKey(locKey(l.name))}
                className="px-1.5 py-0.5 rounded text-[11px] font-body border border-border/50 bg-secondary/40 hover:border-primary/50 hover:text-foreground text-muted-foreground transition-colors"
                title={l.summary ? String(l.summary).replace(/\n/g, ' ') : ''}
              >
                {l.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nothing yet</p>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedKey(null)}>
        <DialogContent className="max-w-lg max-h-[85dvh] overflow-y-auto overscroll-contain p-4 sm:p-6">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading tracking-wide flex items-center gap-2">
                  <Compass className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  {selected.name}
                </DialogTitle>
                {selected.first && (
                  <DialogDescription className="text-xs italic">
                    First explored in Chapter {selected.first}{selected.last && Number(selected.last) !== Number(selected.first) ? ` · last visited Chapter ${selected.last}` : ''}.
                  </DialogDescription>
                )}
              </DialogHeader>

              <div className="space-y-3 mt-2 text-sm font-body">
                {facts.length > 0 ? (
                  <DossierSection icon={BookOpen} label="What Happened Here">
                    <ul className="space-y-1 list-disc list-inside marker:text-primary/50">
                      {facts.map((f, i) => (
                        <li key={i} className="text-foreground/80 leading-relaxed">{f}</li>
                      ))}
                    </ul>
                  </DossierSection>
                ) : (
                  <p className="text-muted-foreground italic text-center py-4">No details recorded yet — explore here to learn more.</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function DossierSection({ icon: Icon, label, children }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1">
        <Icon className="w-3 h-3" strokeWidth={1.5} /> {label.toUpperCase()}
      </p>
      {children}
    </div>
  );
}