import { openai } from "@ai-sdk/openai";

// Create and export the OpenAI model instance directly
export const model = openai("gpt-4o-mini");
