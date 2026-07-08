import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { MapPin, Sparkles, Sword, BookOpen } from 'lucide-react';

function dispositionColor(d) {
  const s = String(d || '').toLowerCase();
  if (s.includes('hostile') || s.includes('enemy')) return 'bg-red-900/40 text-red-300 border-red-800/50';
  if (s.includes('friend') || s.includes('ally')) return 'bg-emerald-900/40 text-emerald-300 border-emerald-800/50';
  return 'bg-secondary text-muted-foreground border-border/50';
}

export default function NpcDossier({ campaignId }) {
  const [npcs, setNpcs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNpcs();
    const unsubscribe = base44.entities.NPC.subscribe((event) => {
      if (event.data?.campaign_id === campaignId) loadNpcs();
    });
    return () => unsubscribe();
  }, [campaignId]);

  async function loadNpcs() {
    try {
      const list = await base44.entities.NPC.filter({ campaign_id: campaignId }, '-created_date', 200);
      setNpcs(list || []);
    } catch (e) { /* ignore */ }
    finally { setLoading(false); }
  }

  const selected = npcs.find(n => n.id === selectedId) || null;
  const knownFacts = selected?.what_we_know
    ? String(selected.what_we_know).split('\n').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <>
      <div>
        <p className="text-muted-foreground/60 text-[10px] font-heading tracking-wide">NPCS MET</p>
        {loading ? (
          <p className="text-muted-foreground/50 italic text-[11px] mt-0.5">Compiling the dossier...</p>
        ) : npcs.length ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {npcs.map(n => (
              <button
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className="px-1.5 py-0.5 rounded text-[11px] font-body border border-border/50 bg-secondary/40 hover:border-primary/50 hover:text-foreground text-muted-foreground transition-colors"
                title={n.attributes || n.description || ''}
              >
                {n.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No one yet</p>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading tracking-wide flex items-center gap-2 flex-wrap">
                  {selected.name}
                  {selected.disposition && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] border ${dispositionColor(selected.disposition)}`}>
                      {selected.disposition}
                    </span>
                  )}
                </DialogTitle>
                {selected.aliases?.length ? (
                  <DialogDescription className="text-xs italic">
                    Also known as: {selected.aliases.join(', ')}
                  </DialogDescription>
                ) : null}
              </DialogHeader>

              <div className="space-y-3 mt-2 text-sm font-body">
                {selected.description && (
                  <DossierSection icon={MapPin} label="Description">
                    <p className="text-foreground/80 leading-relaxed">{selected.description}</p>
                  </DossierSection>
                )}
                {selected.characteristics && (
                  <DossierSection icon={Sparkles} label="Characteristics">
                    <p className="text-foreground/80 leading-relaxed">{selected.characteristics}</p>
                  </DossierSection>
                )}
                {selected.attributes && (
                  <DossierSection icon={Sword} label="Attributes & Status">
                    <p className="text-foreground/80 leading-relaxed">{selected.attributes}</p>
                  </DossierSection>
                )}
                {knownFacts.length > 0 && (
                  <DossierSection icon={BookOpen} label="What We Know">
                    <ul className="space-y-1 list-disc list-inside marker:text-primary/50">
                      {knownFacts.map((f, i) => (
                        <li key={i} className="text-foreground/80 leading-relaxed">{f}</li>
                      ))}
                    </ul>
                  </DossierSection>
                )}
                {selected.first_met_chapter && (
                  <p className="text-[10px] text-muted-foreground/50 italic pt-1 border-t border-border/30">
                    First encountered in Chapter {selected.first_met_chapter}.
                  </p>
                )}
                {!selected.description && !selected.characteristics && !selected.attributes && knownFacts.length === 0 && (
                  <p className="text-muted-foreground italic text-center py-4">No details recorded yet.</p>
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