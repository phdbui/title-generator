import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const saveTitles = internalMutation({
  args: v.object({
    workflowId: v.string(),
    titles: v.array(
      v.object({
        title: v.string(),
        rating: v.number(),
      })
    ),
  }),
  handler: async (ctx, args) => {
    const { workflowId, titles } = args;
    await Promise.all(
      titles.map((title) =>
        ctx.db.insert("titles", {
          workflowId,
          title: title.title,
          rating: title.rating,
        })
      )
    );
  },
});

export const getTitles = query({
  args: v.object({
    workflowId: v.string(),
  }),
  handler: async (ctx, args) => {
    const titles = await ctx.db
      .query("titles")
      .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
      .collect();

    return titles.sort((a, b) => b.rating - a.rating);
  },
});
