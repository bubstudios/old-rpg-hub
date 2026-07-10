import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, FileText, Target, Rocket } from 'lucide-react';
import { STORY_SO_FAR_TEXT, SANDBOX_INTRO_TEXT } from '@/lib/pjCodex';

export default function StorySoFarModal({ open, onBegin, onNavigate }) {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onBegin(); }}>
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto overscroll-contain">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-[0.1em] flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-primary" strokeWidth={1.5} />
            THE STORY SO FAR
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm font-body italic text-primary/90 border-l-2 border-primary/40 pl-3 leading-relaxed">
            {SANDBOX_INTRO_TEXT}
          </p>

          <div className="text-sm font-body text-foreground/80 leading-relaxed whitespace-pre-line">
            {STORY_SO_FAR_TEXT}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/40">
            <Button
              onClick={onBegin}
              className="col-span-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10"
            >
              <Rocket className="w-4 h-4 mr-1.5" strokeWidth={1.5} /> Begin the Adventure
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('crew')}
              className="text-xs h-9"
            >
              <Users className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} /> Review Crew
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('evidence')}
              className="text-xs h-9"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} /> Review Evidence
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('mission')}
              className="col-span-2 text-xs h-9"
            >
              <Target className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.5} /> Review Current Mission
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}