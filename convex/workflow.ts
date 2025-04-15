import { v } from "convex/values";
import { MAX_REWRITES, MIN_RATING, workflow } from ".";
import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { ReviewType } from "./zod.schemas";

export const kickoffGenerateTitleWorkflow = mutation({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const titleGeneratorWorkflowId = Math.random()
      .toString(36)
      .substring(2, 15);
    await workflow.start(ctx, internal.workflow.generateTitleWorkflow, {
      url: args.url,
      workflowId: titleGeneratorWorkflowId,
    });

    return titleGeneratorWorkflowId;
  },
});

export const generateTitleWorkflow = workflow.define({
  args: { url: v.string(), workflowId: v.string() },
  handler: async (step, args) => {
    const transcript = await step.runAction(
      internal.transcripts.getYoutubeTranscript,
      { url: args.url },
      {
        retry: {
          maxAttempts: 2,
          initialBackoffMs: 100,
          base: 2,
        },
      }
    );

    const summary = await step.runAction(internal.transcripts.generateSummary, {
      transcript: transcript,
    });

    const allTitles = await Promise.all([
      step.runAction(internal.agents.storyTellingAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.theoAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.dataAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.questionAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.howToAgent, {
        summary: summary,
      }),
      step.runAction(internal.agents.listicleAgent, {
        summary: summary,
      }),
    ]).then((result) => result.flat());

    const reviews: ReviewType[] = await Promise.all(
      allTitles.map((title) =>
        step.runAction(internal.reviews.engagementReviewer, {
          title: title,
          summary: summary,
          workflowId: args.workflowId,
        })
      )
    ).then((result) => result.filter((result) => result !== null));

    let rewrites = 0;
    let currentReviews: typeof reviews = [...reviews];

    while (rewrites++ < MAX_REWRITES) {
      const badTitles = currentReviews.filter(
        (review) => review.rating < MIN_RATING
      );

      if (badTitles.length === 0) {
        break;
      }

      const rewrittenTitles = await Promise.all(
        badTitles.map((review) =>
          step.runAction(internal.rewrites.rewriteAgent, review)
        )
      );

      currentReviews = await Promise.all(
        rewrittenTitles.map((title) =>
          step.runAction(internal.reviews.engagementReviewer, {
            title: title,
            summary: summary,
            workflowId: args.workflowId,
          })
        )
      ).then(
        (result) => result.filter((result) => result !== null) as ReviewType[]
      );

      return currentReviews;
    }
  },
});
