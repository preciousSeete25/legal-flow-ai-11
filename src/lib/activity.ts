export type Activity = {
  id: string;
  tool: string;
  title: string;
  at: number;
};

const KEY = "legalflow.activity";

const SAMPLE: Activity[] = [
  {
    id: "s1",
    tool: "Email Generator",
    title: "Follow-up to Adv. M. Naidoo re: discovery bundle",
    at: Date.now() - 1000 * 60 * 42,
  },
  {
    id: "s2",
    tool: "Research Assistant",
    title: "Unconscionability in standard-form consumer contracts",
    at: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "s3",
    tool: "Task Planner",
    title: "Week plan — Constitutional Law essay + firm filings",
    at: Date.now() - 1000 * 60 * 60 * 26,
  },
  {
    id: "s4",
    tool: "Notes Summarizer",
    title: "Client consultation — Mbeki v. Harbour Logistics",
    at: Date.now() - 1000 * 60 * 60 * 50,
  },
];

export function getActivity(): Activity[] {
  if (typeof window === "undefined") return SAMPLE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return SAMPLE;
    const parsed = JSON.parse(raw) as Activity[];
    return Array.isArray(parsed) && parsed.length ? parsed : SAMPLE;
  } catch {
    return SAMPLE;
  }
}

export function logActivity(tool: string, title: string) {
  if (typeof window === "undefined") return;
  const entry: Activity = {
    id: Math.random().toString(36).slice(2),
    tool,
    title: title.slice(0, 90) || "Untitled",
    at: Date.now(),
  };
  const next = [entry, ...getActivity()].slice(0, 12);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("legalflow-activity"));
}

export function timeAgo(ts: number) {
  const mins = Math.round((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}
