import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Scale, LayoutDashboard, Mail, BookOpen, CalendarCheck, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DISCLAIMER } from "@/lib/disclaimer";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/notes", label: "Notes Summarizer", icon: FileText },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-accent-foreground font-semibold border-l-2 border-sidebar-primary",
          }}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-3 py-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <Scale className="h-5 w-5" />
      </span>
      <span className="font-display text-lg font-semibold text-sidebar-foreground">
        LegalFlow <span className="text-sidebar-primary">AI</span>
      </span>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-sidebar px-3 pb-6 lg:fixed lg:inset-y-0 lg:flex">
        <div>
          <Brand />
          <NavLinks />
        </div>
        <p className="px-3 text-xs leading-relaxed text-sidebar-foreground/50">
          Built for law students and junior legal professionals.
        </p>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-navy-deep/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-sidebar px-3 pb-6">
            <div className="flex items-center justify-between">
              <Brand />
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-sidebar-foreground" />
              </Button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold sm:text-2xl">{title}</h1>
              <p className="truncate text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>

        <footer className="border-t border-border bg-secondary/60 px-4 py-6 sm:px-8">
          <p className="max-w-4xl text-xs leading-relaxed text-muted-foreground">{DISCLAIMER}</p>
          <p className="mt-3 text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} LegalFlow AI
          </p>
        </footer>
      </div>
    </div>
  );
}
