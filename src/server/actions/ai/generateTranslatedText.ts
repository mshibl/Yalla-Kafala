"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const generateTranslatedText = async ({
  text,
  system,
}: {
  text: string;
  system: string;
}) => {
  try {
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: z.object({
        text: z.object({
          arabic: z.string(),
          english: z.string(),
        }),
      }),
      system,
      prompt: `The following is the text you work with: ${text}`,
    });

    return object.text;
  } catch (error) {
    console.error(error);
    return null;
  }
};
