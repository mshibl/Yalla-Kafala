import { DATA_SOURCES } from "@/src/constants/data-sources";
import { loadGoogleSheet } from "../google-api";
import { cleanResponse } from "../string-utils";

function parseBoardMembers(data: any) {
  // const [publish, question_en, question_ar, answer_en, answer_ar, slug] = data;
  // if (!question_en && !question_ar) {
  //   throw new Error("FAQ question is missing");
  // }
  // if (!answer_ar && !answer_en) {
  //   throw new Error("FAQ answer is missing");
  // }
  // const cleanEnglishQuestion = cleanResponse(question_en?.trim() || "");
  // const cleanArabicQuestion = cleanResponse(question_ar?.trim() || "");
  // const cleanArabicAnswer = cleanResponse(answer_ar?.trim() || "");
  // const cleanEnglishAnswer = cleanResponse(answer_en?.trim() || "");
  // const arabicAnswer = cleanArabicAnswer || cleanEnglishAnswer;
  // const englishAnswer = cleanEnglishAnswer || cleanArabicAnswer;
  // const arabicQuestion = cleanArabicQuestion || cleanEnglishQuestion;
  // const englishQuestion = cleanEnglishQuestion || cleanArabicQuestion;
  // return {
  //   publish: publish === "TRUE",
  //   arabic_question: arabicQuestion,
  //   english_question: englishQuestion,
  //   arabic_answer: arabicAnswer,
  //   english_answer: englishAnswer,
  // };
}

export const fetchBoardMembers = async () => {
  try {
    const response = await loadGoogleSheet({
      spreadsheetId: DATA_SOURCES.BOARD_MEMBERS.BOARD_MEMBERS_SPREADSHEET_ID,
      range: DATA_SOURCES.BOARD_MEMBERS.BOARD_MEMBERS_SHEET_NAME,
    });

    const rawBoardMembers = response.slice(1);

    const boardMembers = rawBoardMembers.map((boardMember) => {
      return parseBoardMembers(boardMember);
    });
    // const publishedBoardMembers = boardMembers.filter(
    //   (boardMember) => boardMember.publish
    // );

    // return publishedBoardMembers;
  } catch (error) {
    console.error("Error fetching boardMembers", error);

    // Rethrow the error so it can be caught by the ErrorBoundary
    throw error;
  }
};
