import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAiGenerate } from "@/hooks/useAiGenerate";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Professional Email Generator — LegalFlow AI" },
      {
        name: "description",
        content:
          "Generate professional legal emails with formal, friendly or persuasive tone, then edit, copy and download them.",
      },
      { property: "og:title", content: "Professional Email Generator — LegalFlow AI" },
      {
        property: "og:description",
        content: "Draft polished legal correspondence in seconds and edit before sending.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("Adv. M. Naidoo, Instructing Attorney");
  const [purpose, setPurpose] = useState("Request a one-week extension on the discovery bundle");
  const [details, setDetails] = useState(
    "The client only provided the bank statements yesterday. Draft bundle is 70% complete. Proposed new deadline: 12 September. Happy to send partial bundle in the interim.",
  );
  const [tone, setTone] = useState("formal");
  const [output, setOutput] = useState("");
  const { generate, loading, error, setError } = useAiGenerate();

  async function onGenerate() {
    if (!recipient.trim() || !purpose.trim()) {
      setError("Please add both a recipient and an email purpose.");
      return;
    }
    const text = await generate(
      "You are a legal communications assistant for law students and junior legal professionals. Write clear, correct, respectful emails. Output only the email: subject line, greeting, body, and sign-off. Never invent facts that were not supplied.",
      `Tone: ${tone}\nRecipient: ${recipient}\nPurpose: ${purpose}\nImportant details: ${details}`,
    );
    if (text) {
      setOutput(text);
      logActivity("Email Generator", `${purpose} — to ${recipient}`);
    }
  }

  return (
    <AppShell
      title="Professional Email Generator"
      description="Draft correspondence for supervisors, clients and opposing counsel."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold">Email details</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="purpose">Purpose of the email</Label>
              <Input id="purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="details">Important details</Label>
              <Textarea
                id="details"
                rows={7}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="concise and neutral">Concise & neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button onClick={onGenerate} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-1.5 h-4 w-4" />
                )}
                Generate email
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setRecipient("");
                  setPurpose("");
                  setDetails("");
                  setOutput("");
                  setError(null);
                }}
              >
                Clear form
              </Button>
            </div>
          </div>
        </section>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          filename="legalflow-email.txt"
          emptyHint="Fill in the details and generate a professional email you can edit before sending."
        />
      </div>
    </AppShell>
  );
}
