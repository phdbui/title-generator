import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { openai } from ".";
import {
  storyTellingPrompt,
  theoPrompt,
  dataPrompt,
  questionPrompt,
  howToPrompt,
  listiclePrompt,
} from "./prompts";
import { zodResponseFormat } from "openai/helpers/zod";
import { agentSchema } from "./zod.schemas";

const createTitleAgent = (prompt: string) =>
  internalAction({
    args: {
      summary: v.string(),
    },
    handler: async (ctx, args) => {
      const response = await openai.beta.chat.completions.parse({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: args.summary,
          },
        ],
        response_format: zodResponseFormat(agentSchema, "agent"),
      });

      const story = response.choices[0].message.parsed;
      if (!story) {
        throw new Error("No story available.");
      }
      return story.titles;
    },
  });

export const storyTellingAgent = createTitleAgent(storyTellingPrompt);
export const theoAgent = createTitleAgent(theoPrompt);
export const dataAgent = createTitleAgent(dataPrompt);
export const questionAgent = createTitleAgent(questionPrompt);
export const howToAgent = createTitleAgent(howToPrompt);
export const listicleAgent = createTitleAgent(listiclePrompt);
