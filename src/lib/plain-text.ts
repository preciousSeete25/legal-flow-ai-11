/**
 * Converts Markdown-ish AI output into clean plain text:
 * headings become plain uppercase-free lines, bullets become "• ",
 * and emphasis/backtick characters are removed.
 */
export function toPlainText(input: string): string {
  return input
    .split("\n")
    .map((line) => {
      let l = line.replace(/\s+$/g, "");

      // Headings: "## Key Issues" -> "Key Issues"
      l = l.replace(/^\s{0,3}#{1,6}\s*/, "");

      // Bullets: "- item" / "* item" / "+ item" -> "• item"
      l = l.replace(/^(\s*)[-*+]\s+/, "$1• ");

      // Numbered lists keep their numbers, just normalise spacing
      l = l.replace(/^(\s*\d+)[.)]\s+/, "$1. ");

      // Emphasis and inline code markers
      l = l.replace(/\*\*\*(.+?)\*\*\*/g, "$1");
      l = l.replace(/\*\*(.+?)\*\*/g, "$1");
      l = l.replace(/(^|[^*])\*(?!\s)([^*]+?)\*(?!\*)/g, "$1$2");
      l = l.replace(/__(.+?)__/g, "$1");
      l = l.replace(/`{1,3}([^`]*)`{1,3}/g, "$1");

      // Table pipes / horizontal rules
      if (/^\s*([-*_]\s*){3,}$/.test(l)) return "";

      return l.replace(/\s+$/g, "");
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
