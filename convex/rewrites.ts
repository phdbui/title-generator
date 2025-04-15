import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { openai } from ".";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { rewriteSchema } from "./zod.schemas";

export const rewriteAgent = internalAction({
  args: v.object({
    originalTitle: v.string(),
    originalSummary: v.string(),
    rating: v.number(),
    feedback: v.string(),
    strengths: v.array(v.string()),
    weaknesses: v.array(v.string()),
    improvementSuggestions: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a professional title rewriting agent. Your task is to improve titles based on provided feedback and metrics.

Given:
- Original title
- Current rating (out of 10)
- General feedback
- List of strengths
- List of weaknesses
- Specific improvement suggestions

Your goal is to rewrite the title to achieve a perfect 10/10 rating by:
- Maintaining identified strengths
- Addressing noted weaknesses
- Incorporating improvement suggestions
- Ensuring the new title remains clear, engaging, and effective
- keep the title under 8 words
- No not generate Noun Phrases or Headline type of titles

Output a single "title" field with your improved version. The new title should be concise, impactful, and incorporate all feedback while maintaining the core message. Please make sure the title is related to the original summary`,
        },
        {
          role: "user",
          content: `Original Title: ${args.originalTitle}
Original Summary: ${args.originalSummary}
Current Rating: ${args.rating}
General Feedback: ${args.feedback}
Strengths: ${args.strengths.join(", ")}
Weaknesses: ${args.weaknesses.join(", ")}
Improvement Suggestions: ${args.improvementSuggestions.join(", ")}`,
        },
      ],
      response_format: zodResponseFormat(rewriteSchema, "agent"),
    });

    const parsed = response.choices[0].message.parsed;
    if (!parsed) {
      throw new Error("No title available.");
    }
    return parsed.title;
  },
});
