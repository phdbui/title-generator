import { z } from "zod";

export const agentSchema = z.object({
  titles: z.array(z.string()),
});

export const reviewSchema = z.object({
  originalTitle: z.string(),
  originalSummary: z.string(),
  rating: z.number(),
  feedback: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvementSuggestions: z.array(z.string()),
});

export const rewriteSchema = z.object({
  title: z.string(),
});

export type AgentType = z.infer<typeof agentSchema>;
export type ReviewType = z.infer<typeof reviewSchema>;
export type RewriteType = z.infer<typeof rewriteSchema>;
