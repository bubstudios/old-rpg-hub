import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getProvinceInfo } from '@/lib/pullRules';
import { GUILT_ENTRIES, isGuiltVisible } from '@/lib/pullSheetData';
import OverviewTab from '@/components/pull/sheet/OverviewTab';
import BodyTab from '@/components/pull/sheet/BodyTab';
import PullScarTab from '@/components/pull/sheet/PullScarTab';
import InventoryTab from '@/components/pull/sheet/InventoryTab';
import ShardPowersTab from '@/components/pull/sheet/ShardPowersTab';
import InstinctsTab from '@/components/pull/sheet/InstinctsTab';
import GuiltBondsTab from '@/components/pull/sheet/GuiltBondsTab';
import MemoriesTab from '@/components/pull/sheet/MemoriesTab';
import CodexLinksTab from '@/components/pull/sheet/CodexLinksTab';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ScrollText, Heart, Compass, Package, Sparkles, Swords, Brain, BookOpen, Link2, HandHeart, Users } from 'lucide-react';

const TABS = [
  { key: 'overview', label: 'Overview', icon: ScrollText },
  { key: 'body', label: 'Body', icon: Heart },
  { key: 'pull', label: 'Pull & Scar', icon: Compass },
  { key: 'inventory', label: 'Inventory', icon: Package },
  { key: 'shard', label: 'Shard Powers', icon: Sparkles },
  { key: 'instincts', label: 'Instincts', icon: Swords },
  { key: 'guilt', label: 'Guilt & Bonds', icon: Brain },
  { key: 'memories', label: 'Memories', icon: BookOpen },
  { key: 'codex', label: 'Codex Links', icon: Link2 }
];

export default function PullCharacterSheet({ character, campaignId, campaign: initialCampaign }) {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(initialCampaign);
  const [activeTab, setActiveTab] = useState('overview');
  const [rememberOpen, setRememberOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = base44.entities.Campaign.subscribe((event) => {
      if (event.data?.id === campaignId) {
        setCampaign(prev => prev ? { ...prev, ...event.data } : prev);
      }
    });
    return () => unsubscribe();
  }, [campaignId]);

  if (!campaign) {
    return <div className="text-center py-20 text-muted-foreground">Loading...</div>;
  }

  const flags = campaign.world_state?.quest_flags || {};
  const provinceInfo = getProvinceInfo(flags.current_province || 618);
  const isMichael = flags.phase === 'Final Revelation' || flags.phase === 'Cleanup' || flags.current_province === 1 || flags.current_province === -1;
  const canAcceptHelp = (campaign.current_chapter || 1) >= 8;
  const visibleGuilt = GUILT_ENTRIES.filter(e => isGuiltVisible(e, flags));

  function handleRememberName(name) {
    const actionText = `I focus on ${name}'s face. I hold onto the bond. I remember.`;
    localStorage.setItem('pull_pending_action', actionText);
    navigate(`/campaign/${campaignId}`);
  }

  function handleAcceptHelp() {
    localStorage.setItem('pull_pending_action', `I accept help. I don't have to survive this alone.`);
    navigate(`/campaign/${campaignId}`);
  }

  const tabProps = { character, flags, provinceInfo, isMichael, campaign };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24">
      <button
        onClick={() => navigate(`/campaign/${campaignId}`)}
        className="flex items-center gap-1.5 text-xs font-heading tracking-wide text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ChevronLeft className="w-3.5 h-3.5" /> Back to Campaign
      </button>

      {/* Header */}
      <div className="border border-border/50 rounded-lg bg-card/40 panel-glow p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-heading tracking-[0.2em] text-primary/60">{isMichael ? 'TRUE IDENTITY' : 'NAME'}</p>
            <h1 className="font-heading font-700 text-2xl text-foreground tracking-wide">{isMichael ? 'Michael' : (flags.bullet_named ? 'Bullet' : '???')}</h1>
            {isMichael && <p className="text-xs text-muted-foreground font-body mt-0.5">Also known as: Bullet</p>}
            {!isMichael && !flags.bullet_named && <p className="text-xs text-muted-foreground font-body mt-0.5">No name yet — the camp hasn't named you.</p>}
            <p className="text-xs text-muted-foreground font-body mt-1">
              {isMichael ? 'Brother of the fallen Leader · Sent by Father' : (flags.bullet_named ? 'Amnesiac survivor · Pull-bound anomaly' : 'Nameless stranger · Pull-bound anomaly')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-heading tracking-wide text-muted-foreground">PROVINCE</p>
            <p className="font-heading text-sm text-primary/90">{provinceInfo.name}</p>
            <p className="text-xs text-muted-foreground font-body">Chapter {campaign.current_chapter || 1} · {flags.phase || 'Lost Survivor'}</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-2 mb-4">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-heading tracking-wide whitespace-nowrap transition-colors border ${
              activeTab === tab.key
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'text-muted-foreground hover:text-foreground border-transparent'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-ink">
        {activeTab === 'overview' && <OverviewTab {...tabProps} />}
        {activeTab === 'body' && <BodyTab {...tabProps} />}
        {activeTab === 'pull' && <PullScarTab {...tabProps} />}
        {activeTab === 'inventory' && <InventoryTab {...tabProps} />}
        {activeTab === 'shard' && <ShardPowersTab {...tabProps} />}
        {activeTab === 'instincts' && <InstinctsTab {...tabProps} />}
        {activeTab === 'guilt' && <GuiltBondsTab {...tabProps} />}
        {activeTab === 'memories' && <MemoriesTab {...tabProps} />}
        {activeTab === 'codex' && <CodexLinksTab {...tabProps} />}
      </div>

      {/* Special actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-background/95 backdrop-blur-sm px-4 py-3 flex items-center gap-2 justify-center">
        <button
          onClick={() => visibleGuilt.length > 0 && setRememberOpen(true)}
          disabled={visibleGuilt.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-primary/40 bg-primary/10 text-primary text-xs font-heading tracking-wide hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Brain className="w-3.5 h-3.5" strokeWidth={1.5} /> {visibleGuilt.length > 0 ? 'Remember a Name' : 'No lasting names yet'}
        </button>
        {canAcceptHelp && (
          <button
            onClick={handleAcceptHelp}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs font-heading tracking-wide hover:bg-emerald-500/20 transition-colors"
          >
            <HandHeart className="w-3.5 h-3.5" strokeWidth={1.5} /> Accept Help
          </button>
        )}
      </div>

      {/* Remember a Name dialog */}
      <Dialog open={rememberOpen} onOpenChange={setRememberOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading tracking-wide">Remember a Name</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
            Bullet focuses on someone who helped him, died near him, or was left behind. This can reduce despair, strengthen connection, or trigger a memory flash.
          </p>
          <div className="space-y-1.5 max-h-[50vh] overflow-y-auto scrollbar-thin">
            {visibleGuilt.length === 0 ? (
              <p className="text-xs text-muted-foreground font-body text-center py-4 leading-relaxed">
                You do not remember anyone yet. Names become anchors after you meet people, lose people, help people, or leave them behind.
              </p>
            ) : (
              visibleGuilt.map(entry => (
                <button
                  key={entry.name}
                  onClick={() => { handleRememberName(entry.name); setRememberOpen(false); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-heading text-foreground">{entry.name}</p>
                    <p className="text-xs text-muted-foreground font-body">{entry.bond}</p>
                  </div>
                  <Brain className="w-3.5 h-3.5 text-primary/40" strokeWidth={1.5} />
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}