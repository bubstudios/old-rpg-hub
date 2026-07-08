import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Download, Loader2, UserMinus } from 'lucide-react';
import { exportCharacterSheet } from '@/lib/exportCharacterSheet';
import { toast } from 'sonner';

/**
 * Exports the character sheet as a PDF and, after confirmation,
 * permanently removes the character from the party (campaign).
 * The exported copy can be re-imported into another campaign.
 */
export default function ExportCharacterButton({ character, campaign, campaignId }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [removing, setRemoving] = useState(false);

  function handleClick() {
    setOpen(true);
  }

  async function handleConfirm() {
    setRemoving(true);
    try {
      exportCharacterSheet(character, campaign);
    } catch (e) {
      toast.error('Could not export sheet');
      setRemoving(false);
      return;
    }
    try {
      await base44.entities.Character.delete(character.id);
      toast.success(`${character.name} exported and removed from the party.`);
      navigate(`/campaign/${campaignId}`);
    } catch (e) {
      toast.error('Could not remove character from the party');
      setRemoving(false);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex items-center gap-1.5 text-[10px] font-heading tracking-wide text-muted-foreground hover:text-primary transition-colors"
      >
        <Download className="w-3 h-3" /> Export PDF
      </button>

      <Dialog open={open} onOpenChange={(o) => !removing && setOpen(o)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading tracking-wide">Export &amp; Remove {character.name}?</DialogTitle>
            <DialogDescription className="font-body leading-relaxed">
              A PDF copy of the character sheet will download, and {character.name} will be permanently removed from this party. You can re-import the exported sheet into another campaign.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={removing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={removing}>
              {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
              Export &amp; Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}