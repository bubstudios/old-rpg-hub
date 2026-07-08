import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, QrCode, Mail, Share2, Link2, Loader2, Send, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function InviteDialog({ open, onOpenChange, campaign }) {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!campaign) return null;

  const code = campaign.invite_code || '';
  const inviteLink = `${window.location.origin}/join?code=${code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(inviteLink)}`;

  async function copy(text, field) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (e) {
      toast.error('Failed to copy');
    }
  }

  async function sendEmail() {
    if (!email.trim()) return;
    setSending(true);
    try {
      await base44.integrations.Core.SendEmail({
        to: email.trim(),
        subject: `${campaign.name} — You're Invited`,
        body: `The party gathers in "${campaign.name}"!\n\nYou've been invited to join a tabletop RPG adventure on Old RPG Hub — an AI-run role-playing game.\n\nCampaign: ${campaign.name}\nInvite Code: ${code}\n\nJoin here: ${inviteLink}\n\nOpen the link or enter the code to create your character and begin the adventure.`
      });
      toast.success(`Invite sent to ${email.trim()}`);
      setEmail('');
    } catch (e) {
      toast.error('Failed to send invite email');
    } finally {
      setSending(false);
    }
  }

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: campaign.name,
          text: `Join my RPG campaign "${campaign.name}" on Old RPG Hub!`,
          url: inviteLink
        });
      } catch (e) { /* user cancelled */ }
    } else {
      await copy(inviteLink, 'Link');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[100dvh] sm:max-h-[85vh] p-4 sm:p-6 overflow-y-auto overscroll-contain">
        <DialogHeader>
          <DialogTitle className="font-heading tracking-wide flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Invite Adventurers
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground font-body leading-relaxed">
          Gather your party for <span className="text-foreground font-heading">{campaign.name}</span>. Share any of these to bring new players to the table.
        </p>

        {/* Join code */}
        <div>
          <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5">JOIN CODE</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-background/60 border border-border/50 rounded px-3 py-2 font-heading text-lg tracking-[0.3em] text-primary text-center">{code}</code>
            <Button onClick={() => copy(code, 'Code')} variant="outline" className="border-border/50 px-3">
              {copiedField === 'Code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Invite link */}
        <div>
          <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5 flex items-center gap-1"><Link2 className="w-3 h-3" /> INVITE LINK</p>
          <div className="flex items-center gap-2">
            <Input readOnly value={inviteLink} className="bg-background/60 text-xs font-body" />
            <Button onClick={() => copy(inviteLink, 'Link')} variant="outline" className="border-border/50 px-3 shrink-0">
              {copiedField === 'Link' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* QR code */}
        <div className="flex flex-col items-center gap-1.5 py-1">
          <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground self-start flex items-center gap-1"><QrCode className="w-3 h-3" /> QR CODE</p>
          <div className="bg-white p-1.5 sm:p-2 rounded-lg">
            <img src={qrUrl} alt="QR code for invite link" className="w-32 h-32 sm:w-40 sm:h-40" />
          </div>
          <p className="text-[10px] text-muted-foreground/70 font-body text-center">Scan to join on mobile</p>
        </div>

        {/* Email invite */}
        <div>
          <p className="text-[10px] font-heading tracking-[0.15em] text-muted-foreground mb-1.5 flex items-center gap-1"><Mail className="w-3 h-3" /> EMAIL INVITE</p>
          <div className="flex gap-2">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="friend@email.com" className="bg-background/60" />
            <Button onClick={sendEmail} disabled={sending || !email.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Share button */}
        <Button onClick={share} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <Share2 className="w-4 h-4 mr-1.5" /> Share Invite
        </Button>
        <p className="text-[10px] text-muted-foreground/60 font-body text-center">
          Opens your device's share sheet — send via text, Discord, or any app.
        </p>
      </DialogContent>
    </Dialog>
  );
}