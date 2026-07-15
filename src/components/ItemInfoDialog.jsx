import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Package, ScrollText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ItemInfoDialog({ item, type, gameSystem, characterClass, open, onOpenChange }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !item) return;
    let cancelled = false;
    setLoading(true);
    setInfo(null);

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
      ? `You are an expert RPG rules reference. In the ${systemLabel} tabletop RPG system, a ${characterClass || 'spellcaster'} has the spell "${item}". Explain what this spell does, how it works in play, and its key stats (level, range, duration, area of effect, components if applicable). Use plain language a player can quickly understand. If this exact spell does not exist in ${systemLabel}, use the closest match. Format your response with these fields: "description" (2-3 sentences explaining what the spell does and how it plays at the table), "properties" (key stats: level, range, duration, area of effect, components), "value" (leave empty), "extra" (any special notes or limitations).`
      : `You are an expert RPG rules reference. In the ${systemLabel} tabletop RPG system, a character carries "${item}" in their equipment. Explain what this item is, what it does, and any notable properties or magical effects. Use plain language a player can quickly understand. Format your response with these fields: "description" (2-3 sentences explaining what the item is and what it does), "properties" (key properties: type, magical effects, bonuses, weight/encumbrance if relevant), "value" (approximate value in the system's currency), "extra" (any special notes or limitations).`;

    base44.integrations.Core.InvokeLLM({
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
    }).then((res) => {
      if (!cancelled) setInfo(res);
    }).catch(() => {
      if (!cancelled) setInfo({
        title: item,
        description: 'Unable to retrieve information at this time.',
        properties: '', value: '', extra: ''
      });
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [open, item]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1">
                  {type === 'spell' ? 'WHAT IT DOES' : 'DESCRIPTION'}
                </p>
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