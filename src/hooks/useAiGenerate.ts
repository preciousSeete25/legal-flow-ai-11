import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateAiText } from "@/lib/ai.functions";

export function useAiGenerate() {
  const run = useServerFn(generateAiText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(system: string, prompt: string): Promise<string | null> {
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { system, prompt } });
      return res.text;
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : "We couldn't generate your result. Please check your connection and try again.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { generate, loading, error, setError };
}
