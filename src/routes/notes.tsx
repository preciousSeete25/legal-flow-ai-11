import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiGenerate } from "@/hooks/useAiGenerate";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting & Consultation Notes Summarizer — LegalFlow AI" },
      {
        name: "description",
        content:
          "Turn long meeting or consultation notes into discussion points, decisions, action items, responsible persons and deadlines.",
      },
      { property: "og:title", content: "Notes Summarizer — LegalFlow AI" },
      {
        property: "og:description",
        content: "Condense consultation notes into decisions, owners and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

const SAMPLE = `Consultation — Mbeki v. Harbour Logistics (Tues, 14:00, boardroom)
Present: S. Mbeki (client), Adv. T. Kruger, N. Patel (candidate attorney), me.
Client explained the delivery contract was signed in March 2024 and terminated verbally in June. No written termination notice was ever received. Client says invoices 4412 and 4418 remain unpaid (R186,000 total).
Adv. Kruger noted the contract requires written notice with 30 days; verbal termination likely a repudiation. He wants the full contract, all invoices, and the WhatsApp thread with the operations manager.
Discussion about whether to send a letter of demand first or proceed straight to summons. Agreed: letter of demand first, 10 business days to pay.
N. Patel to collect documents from the client by Thursday. I must draft the letter of demand by next Monday for Adv. Kruger's review. Client to confirm whether any partial payment was received — he'll check with his bookkeeper by Friday.
Fees discussed briefly; client to be sent a revised mandate.`;

function NotesPage() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const { generate, loading, error, setError } = useAiGenerate();

  async function onGenerate() {
    if (input.trim().length < 40) {
      setError("Please paste your meeting or consultation notes (at least a short paragraph).");
      return;
    }
    const text = await generate(
      "You summarise legal meeting and consultation notes. Use these headings: MAIN DISCUSSION POINTS, DECISIONS TAKEN, ACTION ITEMS (each as: task — responsible person — deadline), OPEN QUESTIONS. Use only information present in the notes; write 'not stated' where something is missing. Be concise and professional.",
      input,
    );
    if (text) {
      setOutput(text);
      logActivity("Notes Summarizer", input.split("\n")[0]);
    }
  }

  return (
    <AppShell
      title="Meeting & Consultation Notes Summarizer"
      description="Turn raw notes into decisions, action items, owners and deadlines."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold">Your notes</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="notes">Paste meeting or consultation notes</Label>
              <Textarea
                id="notes"
                rows={16}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your raw notes here…"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onGenerate} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-1.5 h-4 w-4" />
                )}
                Summarise notes
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setInput("");
                  setOutput("");
                  setError(null);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </section>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          filename="legalflow-meeting-summary.txt"
          emptyHint="Your structured summary with action items and deadlines will appear here."
        />
      </div>
    </AppShell>
  );
}
