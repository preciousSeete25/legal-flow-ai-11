import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  system: z.string(),
  prompt: z.string(),
});

export const generateAiText = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured. Please try again later.");

    const gateway = createLovableAiGatewayProvider(key);

    try {
      const result = streamText({
        model: gateway("google/gemini-3.7-flash"),
        system: data.system,
        prompt: data.prompt,
      });
      const text = await result.text;
      return { text };
    } catch (error: unknown) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      if (status === 429) {
        throw new Error("Too many requests right now. Please wait a moment and try again.");
      }
      if (status === 402) {
        throw new Error("AI credits have run out. Please add credits to continue using LegalFlow AI.");
      }
      if (status === 403) {
        throw new Error("AI access is currently blocked for this workspace.");
      }
      throw new Error(
        error instanceof Error ? error.message : "Something went wrong while generating your result.",
      );
    }
  });
