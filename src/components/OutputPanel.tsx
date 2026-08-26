import { Copy, Download, Eraser, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function OutputPanel({
  value,
  onChange,
  loading,
  error,
  filename,
  placeholder,
  emptyHint,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  error: string | null;
  filename: string;
  placeholder?: string;
  emptyHint?: string;
}) {
  function copy() {
    navigator.clipboard.writeText(value).then(
      () => toast.success("Copied to clipboard"),
      () => toast.error("Copying failed — please select and copy manually."),
    );
  }

  function download() {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Output</h2>
          <p className="text-xs text-muted-foreground">Fully editable before you use it.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={copy} disabled={!value}>
            <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={download} disabled={!value}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Download
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onChange("")} disabled={!value}>
            <Eraser className="mr-1.5 h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      </div>

      {error && (
        <p className="mb-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-secondary/40 text-sm text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
          Drafting with LegalFlow AI…
        </div>
      ) : value ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-72 resize-y font-sans text-sm leading-relaxed"
          placeholder={placeholder}
        />
      ) : (
        <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-border bg-secondary/40 px-6 text-center text-sm text-muted-foreground">
          {emptyHint ?? "Your generated result will appear here."}
        </div>
      )}
    </section>
  );
}
