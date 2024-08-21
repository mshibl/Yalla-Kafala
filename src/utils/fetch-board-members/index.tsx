"use server";
import { DATA_SOURCES } from "@/src/constants/data-sources";
import { loadGoogleSheet } from "../google-api";
import {
  cleanResponse,
  convertGoogleDriveImageUrlToImageSrc,
} from "../string-utils";

function parseBoardMembers(data: any) {
  const [
    english_name,
    arabic_name,
    location,
    publish,
    status,
    english_bio,
    arabic_bio,
    photoLink,
  ] = data;
  if (!english_bio && !arabic_bio) {
    return;
  }
  if (!english_name && !arabic_name) {
    return;
  }

  const cleanEnglishBio = cleanResponse(english_bio?.trim() || "");
  const cleanArabicBio = cleanResponse(arabic_bio?.trim() || "");
  const arabicBio = cleanArabicBio || cleanEnglishBio;
  const englishBio = cleanEnglishBio || cleanArabicBio;

  return {
    publish: (publish === "TRUE") as boolean,
    arabic_bio: arabicBio as string,
    english_bio: englishBio as string,
    english_name: english_name as string,
    arabic_name: arabic_name as string,
    location: location as string,
    status: status as string,
    photoLink: convertGoogleDriveImageUrlToImageSrc(photoLink) as string,
  };
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
    const publishedBoardMembers = boardMembers.filter((boardMember) => {
      if (boardMember) return boardMember.publish;
      return false;
    });

    return publishedBoardMembers;
  } catch (error) {
    console.error("Error fetching boardMembers", error);

    // Rethrow the error so it can be caught by the ErrorBoundary
    throw error;
  }
};
