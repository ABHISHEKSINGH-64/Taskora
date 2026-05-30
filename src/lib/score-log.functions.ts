import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  taskTitle: z.string().min(1).max(300),
  taskDescription: z.string().max(2000).optional().default(""),
  logText: z.string().min(1).max(4000),
});

const Schema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.enum(["genuine", "thin", "vague", "no_detail"]),
  rationale: z.string().max(280),
  flags: z.array(z.string()).max(6),
});

export const scoreWorkLog = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const system = `You are an accountability auditor. Score work logs from 0-100 based on specificity, evidence (tools, files, outcomes, numbers), and plausibility relative to the task. Be strict: vague logs ("worked on it", "made progress") score under 30. Detailed logs citing files, metrics, and concrete outcomes score 70+.`;

    const prompt = `Task: ${data.taskTitle}\nContext: ${data.taskDescription}\n\nLog entry:\n"""${data.logText}"""\n\nReturn JSON.`;

    try {
      const { output } = await generateText({
        model,
        system,
        prompt,
        output: Output.object({ schema: Schema }),
      });
      return output;
    } catch (e) {
      console.error("scoreWorkLog failed", e);
      const len = data.logText.trim().length;
      const fallback = Math.max(10, Math.min(85, Math.round(len / 8)));
      return {
        score: fallback,
        verdict: (len < 60 ? "vague" : "genuine") as "vague" | "genuine",
        rationale: "AI gateway unavailable — heuristic score based on log length.",
        flags: len < 60 ? ["heuristic", "short"] : ["heuristic"],
      };
    }
  });
