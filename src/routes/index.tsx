import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, BookOpen, CalendarCheck, FileText, ArrowRight, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { getActivity, timeAgo, type Activity } from "@/lib/activity";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LegalFlow AI — AI Assistant for Law Students & Junior Lawyers" },
      {
        name: "description",
        content:
          "LegalFlow AI helps law students and junior legal professionals draft emails, research legal topics, plan tasks and summarise meeting notes.",
      },
      { property: "og:title", content: "LegalFlow AI — AI Assistant for Legal Work" },
      {
        property: "og:description",
        content: "Draft emails, research topics, plan study time and summarise consultation notes.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Professional Email Generator",
    body: "Draft polished correspondence to supervisors, clients and counsel in the right tone.",
  },
  {
    to: "/research",
    icon: BookOpen,
    title: "Legal Research Assistant",
    body: "Break a topic, question or article into key issues, concepts and further reading.",
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    title: "AI Task Planner",
    body: "Turn assignments, deadlines and study hours into a prioritised schedule.",
  },
  {
    to: "/notes",
    icon: FileText,
    title: "Meeting & Consultation Notes",
    body: "Condense long notes into decisions, action items, owners and deadlines.",
  },
] as const;

function Dashboard() {
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    const sync = () => setActivity(getActivity());
    sync();
    window.addEventListener("legalflow-activity", sync);
    return () => window.removeEventListener("legalflow-activity", sync);
  }, []);

  return (
    <AppShell title="Dashboard" description="Your legal productivity workspace — no account needed.">
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section
            className="rounded-lg p-6 text-primary-foreground sm:p-8"
            style={{ background: "var(--gradient-navy)" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold">
              <Sparkles className="h-3.5 w-3.5" /> Powered by Lovable AI
            </span>
            <h2 className="mt-4 max-w-xl text-2xl leading-snug sm:text-3xl">
              Spend less time drafting, and more time understanding the law.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-primary-foreground/75">
              Four focused tools for coursework, clerkship tasks and consultation follow-ups.
            </p>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map(({ to, icon: Icon, title, body }) => (
              <Link
                key={to}
                to={to}
                className="group rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-colors hover:border-accent"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open tool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
          <h2 className="text-base font-semibold">Recent activity</h2>
          <p className="text-xs text-muted-foreground">Stored on this device only.</p>
          <ul className="mt-4 space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="border-l-2 border-accent/60 pl-3">
                <p className="text-sm leading-snug">{a.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.tool} · {timeAgo(a.at)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
