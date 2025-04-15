import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { Innertube } from "youtubei.js/web";
import { openai } from ".";

export const getYoutubeTranscript = internalAction({
  args: {
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const videoId = args.url.split("v=")[1];
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });

    const info = await youtube.getInfo(videoId);
    const transcript = await info.getTranscript();
    const transcriptText = transcript.transcript.content?.body?.initial_segments
      .map((segment) => segment.snippet.text ?? "")
      .join(" ");

    if (!transcriptText) {
      throw new Error("No transcript available for this video.");
    }
    return transcriptText;
  },
});

export const generateSummary = internalAction({
  args: {
    transcript: v.string(),
  },
  handler: async (ctx, args) => {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that summarizes transcripts from YouTube videos. 
      Please provide a concise summary in a few paragraphs that clearly explains the video's main points. 
      Also, include a list of highly relevant keywords that can help improve SEO. 
      Return the output in **markdown format**.`,
        },
        {
          role: "user",
          content: `Summarize the following transcript from a YouTube video:\n\n${args.transcript}`,
        },
      ],
    });

    const summary = response.choices[0].message.content;
    if (!summary) {
      throw new Error("No summary available.");
    }
    return summary;
  },
});
