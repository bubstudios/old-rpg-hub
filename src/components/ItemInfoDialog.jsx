import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Package, ScrollText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ItemInfoDialog({ item, type, gameSystem, characterClass, open, onOpenChange }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchInfo() {
    if (!item || info) return;
    setLoading(true);
    try {
      const isSpell = type === 'spell';
      const systemLabel = gameSystem === 'starfrontiers' ? 'Star Frontiers'
        : gameSystem === 'gammaworld' ? 'Gamma World'
        : gameSystem === 'boothill' ? 'Boot Hill'
        : gameSystem === 'indianajones' ? 'Indiana Jones RPG'
        : gameSystem === 'topsecret' ? 'Top Secret'
        : gameSystem === 'ghostbusters' ? 'Ghostbusters RPG'
        : gameSystem === 'gangbusters' ? 'Gangbusters'
        : gameSystem === 'legionofdoom' ? 'Legion of Doom'
        : gameSystem === 'conan' || gameSystem === 'redsonja' ? 'Hyborian RPG'
        : 'AD&D 1st Edition';

      const prompt = isSpell
        ? `You are an expert RPG rules reference. In the ${systemLabel} tabletop RPG system, a ${characterClass || 'spellcaster'} has the spell "${item}" on their character sheet. Provide a concise, accurate description of this spell as it works in ${systemLabel}. Include: spell level, range, duration, area of effect, components (if applicable), and a brief plain-language description of what the spell does. If the spell name is ambiguous or does not exist in ${systemLabel}, provide the closest match. Keep it to 3-5 short paragraphs.`
        : `You are an expert RPG rules reference. In the ${systemLabel} tabletop RPG system, a character carries "${item}" in their equipment. Provide a concise, accurate description of this item as it works in ${systemLabel}. Include: what the item is, what it does, any notable properties or magical effects, approximate value in the system's currency, and weight/encumbrance if relevant. If the item name is ambiguous or does not exist in ${systemLabel}, provide the closest match or a reasonable interpretation. Keep it to 3-5 short paragraphs.`;

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            properties: { type: "string" },
            value: { type: "string" },
            extra: { type: "string" }
          }
        }
      });

      setInfo(res);
    } catch (e) {
      setInfo({
        title: item,
        description: 'Unable to retrieve information at this time.',
        properties: '', value: '', extra: ''
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOpenChange(open) {
    if (open && !info && !loading) {
      fetchInfo();
    }
    if (!open) {
      setTimeout(() => { setInfo(null); }, 200);
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-wide flex items-center gap-2">
            {type === 'spell'
              ? <ScrollText className="w-4 h-4 text-primary" strokeWidth={1.5} />
              : <Package className="w-4 h-4 text-primary" strokeWidth={1.5} />}
            {info?.title || item}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-5 h-5 text-primary/50 animate-spin" />
            <p className="font-tome italic text-sm text-muted-foreground">Consulting the archives...</p>
          </div>
        ) : info ? (
          <div className="space-y-4">
            {info.description && (
              <div>
                <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1">DESCRIPTION</p>
                <p className="text-sm text-foreground font-body leading-relaxed whitespace-pre-wrap">{info.description}</p>
              </div>
            )}
            {info.properties && (
              <div>
                <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1">PROPERTIES</p>
                <p className="text-sm text-foreground font-body leading-relaxed whitespace-pre-wrap">{info.properties}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {info.value && (
                <div className="p-2 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-[9px] font-heading tracking-wide text-muted-foreground">VALUE</p>
                  <p className="text-xs text-foreground font-body">{info.value}</p>
                </div>
              )}
              {info.extra && (
                <div className="p-2 rounded-lg bg-secondary/30 border border-border/30">
                  <p className="text-[9px] font-heading tracking-wide text-muted-foreground">NOTES</p>
                  <p className="text-xs text-foreground font-body">{info.extra}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}