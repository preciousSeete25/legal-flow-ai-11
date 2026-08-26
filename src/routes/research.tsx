import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2, Loader2, AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAiGenerate } from "@/hooks/useAiGenerate";
import { logActivity } from "@/lib/activity";
import { DISCLAIMER } from "@/lib/disclaimer";
import { toPlainText } from "@/lib/plain-text";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Legal Research Assistant — LegalFlow AI" },
      {
        name: "description",
        content:
          "Summarise a legal topic, question or article into key issues, important concepts and suggested areas for further research.",
      },
      { property: "og:title", content: "Legal Research Assistant — LegalFlow AI" },
      {
        property: "og:description",
        content: "Turn a legal topic or article into structured study notes you can edit.",
      },
    ],
  }),
  component: ResearchPage,
});

const SAMPLE =
  "Is a penalty clause in a fixed-term commercial lease enforceable where the tenant vacates six months early? The lease requires payment of the full remaining rental as 'agreed damages'. Consider the Conventional Penalties Act and the landlord's duty to mitigate.";

function ResearchPage() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const { generate, loading, error, setError } = useAiGenerate();

  async function onGenerate() {
    if (input.trim().length < 15) {
      setError("Please paste a legal topic, question or article of at least a sentence or two.");
      return;
    }
    const text = await generate(
      "You are a legal research assistant for law students. Produce structured study notes with these headings: SUMMARY, KEY ISSUES, IMPORTANT CONCEPTS & TERMINOLOGY, SUGGESTED AREAS FOR FURTHER RESEARCH. Be jurisdiction-aware and say when jurisdiction matters. Do not fabricate case names, statutes or citations; if unsure, say what to verify. End with a short 'VERIFY THIS' note reminding the reader to confirm all sources.",
      input,
    );
    if (text) {
      setOutput(text);
      logActivity("Research Assistant", input.slice(0, 80));
    }
  }

  return (
    <AppShell
      title="Legal Research Assistant"
      description="Structure a topic, question or article into study-ready notes."
    >
      <div className="mb-6 flex items-start gap-3 rounded-lg border border-accent/50 bg-accent/10 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
        <p className="text-sm leading-relaxed text-accent-foreground">{DISCLAIMER}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold">Topic, question or article</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="topic">Paste your text</Label>
              <Textarea
                id="topic"
                rows={16}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste a legal question, topic or extract from an article…"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onGenerate} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-1.5 h-4 w-4" />
                )}
                Generate research notes
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
          filename="legalflow-research-notes.txt"
          emptyHint="Your key issues, concepts and further-research suggestions will appear here."
        />
      </div>
    </AppShell>
  );
}
