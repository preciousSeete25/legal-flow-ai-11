import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAiGenerate } from "@/hooks/useAiGenerate";
import { logActivity } from "@/lib/activity";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — LegalFlow AI" },
      {
        name: "description",
        content:
          "Turn assignments, work tasks, deadlines and available study hours into a prioritised daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner — LegalFlow AI" },
      {
        property: "og:description",
        content: "A prioritised study and work schedule with priority labels and checkboxes.",
      },
    ],
  }),
  component: PlannerPage,
});

type Row = { priority: string; day: string; slot: string; task: string };

function parseSchedule(text: string): Row[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.includes("|"))
    .map((l) => l.split("|").map((p) => p.trim()))
    .filter((p) => p.length >= 4 && !/^priority$/i.test(p[0]))
    .map((p) => ({ priority: p[0], day: p[1], slot: p[2], task: p.slice(3).join(" — ") }));
}

function priorityClass(p: string) {
  const v = p.toLowerCase();
  if (v.startsWith("high")) return "bg-destructive/10 text-destructive border-destructive/30";
  if (v.startsWith("med")) return "bg-accent/20 text-accent-foreground border-accent/40";
  return "bg-secondary text-secondary-foreground border-border";
}

function PlannerPage() {
  const [tasks, setTasks] = useState(
    "Constitutional Law essay (2500 words) — due Friday 09:00\nMoot court bundle prep — due Thursday\nFirm: summarise 3 client files for supervisor — due Wednesday 16:00\nRead Chapter 7: Law of Delict — before Thursday seminar",
  );
  const [hours, setHours] = useState("4");
  const [range, setRange] = useState("weekly");
  const [output, setOutput] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const { generate, loading, error, setError } = useAiGenerate();

  const rows = useMemo(() => parseSchedule(output), [output]);

  async function onGenerate() {
    if (!tasks.trim()) {
      setError("Please list at least one assignment, task or deadline.");
      return;
    }
    const text = await generate(
      "You are a study and workload planner for law students. Return ONLY a pipe-delimited schedule, one line per block, in the exact format: Priority | Day | Time slot | Task and focus. Priority must be exactly High, Medium or Low. Respect the stated available hours per day, front-load work with the earliest deadlines, and include short breaks and one review block. No preamble, no markdown.",
      `Plan type: ${range}\nAvailable study/work hours per day: ${hours}\nTasks and deadlines:\n${tasks}`,
    );
    if (text) {
      setOutput(text);
      setDone({});
      logActivity("Task Planner", `${range === "daily" ? "Daily" : "Weekly"} plan — ${hours}h/day`);
    }
  }

  return (
    <AppShell
      title="AI Task Planner"
      description="Prioritise assignments, deadlines and firm work around your available hours."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold">Your workload</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="tasks">Assignments, work tasks and deadlines</Label>
              <Textarea id="tasks" rows={10} value={tasks} onChange={(e) => setTasks(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="hours">Available hours per day</Label>
                <Input
                  id="hours"
                  type="number"
                  min="1"
                  max="16"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="range">Schedule type</Label>
                <Select value={range} onValueChange={setRange}>
                  <SelectTrigger id="range">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onGenerate} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-1.5 h-4 w-4" />
                )}
                Build schedule
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setTasks("");
                  setOutput("");
                  setDone({});
                  setError(null);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {rows.length > 0 && !loading && (
            <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="text-base font-semibold">Your schedule</h2>
              <ul className="mt-4 space-y-3">
                {rows.map((r, i) => {
                  const id = `task-${i}`;
                  return (
                    <li key={id} className="flex items-start gap-3 border-b border-border/70 pb-3 last:border-0">
                      <Checkbox
                        id={id}
                        checked={!!done[id]}
                        onCheckedChange={(v) => setDone((d) => ({ ...d, [id]: !!v }))}
                        className="mt-1"
                      />
                      <div className="min-w-0 flex-1">
                        <label
                          htmlFor={id}
                          className={`block text-sm leading-snug ${done[id] ? "text-muted-foreground line-through" : ""}`}
                        >
                          {r.task}
                        </label>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className={`rounded-full border px-2 py-0.5 font-medium ${priorityClass(r.priority)}`}>
                            {r.priority}
                          </span>
                          <span>
                            {r.day} · {r.slot}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <OutputPanel
            value={output}
            onChange={setOutput}
            loading={loading}
            error={error}
            filename="legalflow-schedule.txt"
            emptyHint="Your prioritised schedule will appear here, with checkboxes for completed tasks."
          />
        </div>
      </div>
    </AppShell>
  );
}
