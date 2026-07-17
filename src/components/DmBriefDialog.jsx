import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const TONE_OPTIONS = ['Balanced', 'Gritty & Dangerous', 'Heroic & Epic', 'Dark Fantasy', 'Lighthearted', 'Sandbox Freedom'];
const PACING_OPTIONS = ['Steady Adventure', 'Slow-burn Exploration', 'Fast-paced Action', 'Story-driven', 'Dungeon Crawl'];
const NARRATION_OPTIONS = ['Moderate (2-3 paragraphs)', 'Brief (1-2 paragraphs)', 'Detailed (3-5 paragraphs)', 'Novel-style (longer)'];

function parseBrief(text) {
  const fields = { tone: '', pacing: '', narration: '', npcBehavior: '', storyFocus: '', customNotes: '' };
  if (!text || !text.trim()) return fields;

  const toneMatch = text.match(/(?:^|\n)TONE:\s*(.+)/i);
  const pacingMatch = text.match(/(?:^|\n)PACING:\s*(.+)/i);
  const narrationMatch = text.match(/(?:^|\n)NARRATION(?:\s+LENGTH)?:\s*(.+)/i);

  if (toneMatch || pacingMatch || narrationMatch) {
    if (toneMatch) fields.tone = toneMatch[1].trim();
    if (pacingMatch) fields.pacing = pacingMatch[1].trim();
    if (narrationMatch) fields.narration = narrationMatch[1].trim();

    const npcMatch = text.match(/NPC\s+BEHAVIOR:\s*([\s\S]*?)(?=\n(?:STORY\s+FOCUS|CUSTOM)|$)/i);
    if (npcMatch) fields.npcBehavior = npcMatch[1].trim();

    const focusMatch = text.match(/STORY\s+FOCUS:\s*([\s\S]*?)(?=\n(?:CUSTOM)|$)/i);
    if (focusMatch) fields.storyFocus = focusMatch[1].trim();

    const customMatch = text.match(/CUSTOM(?:\s+(?:INSTRUCTIONS|NOTES))?:\s*([\s\S]*?)$/i);
    if (customMatch) fields.customNotes = customMatch[1].trim();
  } else {
    fields.customNotes = text.trim();
  }

  return fields;
}

function composeBrief(fields) {
  const parts = [];
  if (fields.tone) parts.push(`TONE: ${fields.tone}`);
  if (fields.pacing) parts.push(`PACING: ${fields.pacing}`);
  if (fields.narration) parts.push(`NARRATION LENGTH: ${fields.narration}`);
  if (fields.npcBehavior?.trim()) parts.push(`NPC BEHAVIOR: ${fields.npcBehavior.trim()}`);
  if (fields.storyFocus?.trim()) parts.push(`STORY FOCUS: ${fields.storyFocus.trim()}`);
  if (fields.customNotes?.trim()) parts.push(`CUSTOM INSTRUCTIONS: ${fields.customNotes.trim()}`);
  return parts.join('\n\n');
}

export default function DmBriefDialog({ open, onOpenChange, campaignId, initialBrief }) {
  const [fields, setFields] = useState({ tone: '', pacing: '', narration: '', npcBehavior: '', storyFocus: '', customNotes: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && initialBrief !== undefined) {
      setFields(parseBrief(initialBrief));
    }
  }, [open, initialBrief]);

  function update(field, value) {
    setFields(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const composed = composeBrief(fields);
      await base44.entities.Campaign.update(campaignId, { dm_brief: composed });
      toast.success('DM Brief saved — the DM will follow it from the next turn.');
      onOpenChange(false);
    } catch (e) {
      toast.error('Failed to save DM Brief');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto ornate-frame bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full wax-seal flex items-center justify-center shrink-0">
              <ScrollText className="w-4 h-4 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <DialogTitle className="font-heading tracking-wide text-lg text-foreground">Dungeon Master Brief</DialogTitle>
          </div>
        </DialogHeader>
        <p className="text-xs text-muted-foreground font-body leading-relaxed">
          Customize how your AI Game Master runs this campaign. Set the tone, pacing, narration style, and story focus. The DM reads this every turn and follows it over its defaults.
        </p>

        <div className="space-y-4 mt-2">
          <Field label="Tone" hint="The overall feel of the campaign">
            <PillSelect options={TONE_OPTIONS} value={fields.tone} onChange={v => update('tone', v)} />
          </Field>

          <Field label="Pacing" hint="How quickly the story moves">
            <PillSelect options={PACING_OPTIONS} value={fields.pacing} onChange={v => update('pacing', v)} />
          </Field>

          <Field label="Narration Length" hint="How long each DM response should be">
            <PillSelect options={NARRATION_OPTIONS} value={fields.narration} onChange={v => update('narration', v)} />
          </Field>

          <Field label="NPC Behavior" hint="How NPCs should act and speak">
            <Textarea
              value={fields.npcBehavior}
              onChange={e => update('npcBehavior', e.target.value)}
              placeholder="e.g. NPCs should have distinct voices and act on their own motivations. Don't make all NPCs friendly."
              className="min-h-[70px] font-body text-sm bg-background/60 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
            />
          </Field>

          <Field label="Story Focus" hint="What to keep the story oriented toward">
            <Textarea
              value={fields.storyFocus}
              onChange={e => update('storyFocus', e.target.value)}
              placeholder="e.g. Keep the story focused on the main quest and current objectives. Each turn should advance the plot."
              className="min-h-[70px] font-body text-sm bg-background/60 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
            />
          </Field>

          <Field label="Custom Instructions" hint="Any other house rules or notes for the DM">
            <Textarea
              value={fields.customNotes}
              onChange={e => update('customNotes', e.target.value)}
              placeholder="e.g. Don't pull punches. If a character would die, let them die. Reward creative thinking."
              className="min-h-[100px] font-body text-sm bg-background/60 border-border text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/30"
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-amber-600 to-amber-500 text-amber-50 hover:from-amber-500 hover:to-amber-400 font-heading tracking-wide"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Brief'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <Label className="text-[11px] font-heading tracking-wide text-muted-foreground">{label}</Label>
      {hint && <p className="text-[10px] text-muted-foreground/60 font-body mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

function PillSelect({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-2.5 py-1 rounded text-[11px] font-heading border transition-colors ${
            value === opt
              ? 'border-primary/50 text-primary bg-primary/10'
              : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}