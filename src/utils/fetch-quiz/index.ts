"use server";
import { DATA_SOURCES } from "@/src/constants/data-sources";
import { loadGoogleSheet } from "../google-api";
import { cleanResponse } from "../string-utils";

function generateRandomId() {
  return Math.random().toString(36).substring(2, 15);
}

function parseQuizQuestion(data: any[]) {
  const [
    questionText,
    answer1Text,
    outcome1Text,
    answer2Text,
    outcome2Text,
    answer3Text,
    outcome3Text,
  ] = data;

  if (
    !questionText ||
    !answer1Text ||
    !answer2Text ||
    !answer3Text ||
    !outcome1Text ||
    !outcome2Text ||
    !outcome3Text
  ) {
    return null;
  }

  return {
    id: generateRandomId(),
    text: cleanResponse(questionText.trim()),
    answers: [
      {
        id: generateRandomId(),
        text: cleanResponse(answer1Text.trim()),
        outcome: cleanResponse(outcome1Text.trim()),
      },
      {
        id: generateRandomId(),
        text: cleanResponse(answer2Text.trim()),
        outcome: cleanResponse(outcome2Text.trim()),
      },
      {
        id: generateRandomId(),
        text: cleanResponse(answer3Text.trim()),
        outcome: cleanResponse(outcome3Text.trim()),
      },
    ],
  };
}

export const fetchQuizQuestions = async () => {
  try {
    const response = await loadGoogleSheet({
      spreadsheetId: DATA_SOURCES.GAMES.QUIZ.QUIZ_SPREADSHEET_ID,
      range: DATA_SOURCES.GAMES.QUIZ.QUIZ_SHEET_NAME,
    });

    const rawQuestions = response.slice(1); // Skip header row

    const questions = rawQuestions
      .map((question) => parseQuizQuestion(question))
      .filter(
        (question): question is NonNullable<typeof question> =>
          question !== null
      );

    return questions;
  } catch (error) {
    console.error("Error fetching quiz questions", error);
    throw error;
  }
};
