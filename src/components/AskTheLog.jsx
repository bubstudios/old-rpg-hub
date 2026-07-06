import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, ArrowDown } from 'lucide-react';

function formatEntriesForLLM(entries) {
  return entries
    .map((e, i) => {
      const parts = [`[${i}]`];
      if (e.entry_type) parts.push(`(${e.entry_type})`);
      if (e.acting_character_name) parts.push(e.acting_character_name + ':');
      if (e.narration) parts.push(e.narration.slice(0, 600));
      if (e.player_action) parts.push(`"${e.player_action.slice(0, 300)}"`);
      if (e.dice_rolls && e.dice_rolls.length) {
        parts.push('[' + e.dice_rolls.map(r => `${r.description || r.die}=${r.total}`).join(', ') + ']');
      }
      return parts.join(' ');
    })
    .join('\n');
}

export default function AskTheLog({ entries, onJumpToEntry }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim() || loading || entries.length === 0) return;
    setLoading(true);
    setAnswer(null);
    try {
      const context = formatEntriesForLLM(entries);
      const prompt = `You are a scribe's assistant for an AD&D 1st Edition campaign journal. A player asks a question about past events in the campaign. Answer based ONLY on the journal content below. Be concise and specific, quoting names and places when possible. If the answer is found, reference the entry number in square brackets like [3]. If the journal does not contain the answer, say "I could not find that in the journal."

JOURNAL:
${context}

QUESTION: ${question.trim()}

Return a concise answer and the 0-based index of the most relevant entry (or -1 if none is relevant).`;
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            entry_index: { type: 'number' }
          }
        }
      });
      const result = res?.data ?? res;
      setAnswer(result);
    } catch (e) {
      setAnswer({ answer: 'The scribe falters — the tome could not be consulted at this time.', entry_index: -1 });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  const canJump = answer && typeof answer.entry_index === 'number' &&
    answer.entry_index >= 0 && answer.entry_index < entries.length;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading || entries.length === 0}
          placeholder="Ask the journal... e.g. What was the name of the inn?"
          className="flex-1 bg-card/60 border border-input rounded-lg px-3.5 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <Button
          onClick={handleAsk}
          disabled={!question.trim() || loading || entries.length === 0}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        </Button>
      </div>

      {answer && (
        <div className="tome-surface rounded-lg p-4 animate-ink">
          <div className="flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-700/60 shrink-0 mt-0.5" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <p className="tome-text text-sm leading-relaxed whitespace-pre-wrap">{answer.answer}</p>
              {canJump && (
                <button
                  onClick={() => onJumpToEntry(answer.entry_index)}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-heading tracking-wide text-amber-900/70 hover:text-amber-900 transition-colors border-b border-amber-900/20"
                >
                  <ArrowDown className="w-3 h-3" strokeWidth={1.5} /> Jump to this passage
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}