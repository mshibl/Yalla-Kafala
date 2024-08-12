import Link from "next/link";
import sanitizeHtml from "sanitize-html";

// Truncate a string to a certain length and add "..." at the end
export function truncateString(str: string, num: number) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

export function cleanResponse(dirty: string) {
  return sanitizeHtml(dirty, {
    allowedTags: [],
    allowedAttributes: {
      a: [],
    },
    allowedIframeHostnames: [],
  });
}

export function convertGoogleDriveImageUrlToImageSrc(
  url: string
): string | null {
  if (!url) return null;
  // Extract the file ID from the provided URL
  const match = url.match(/[-\w]{25,}/);

  if (!match) {
    console.error("Invalid Google Drive URL");
    return null;
  }

  const fileId = match[0];
  // Construct the direct access URL
  const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;

  return directLink;
}

/**
 * Formats the text to display it in a readable way, and replaces URLs with links
 */
export function formatText(text: string) {
  // regex to match list item starters like "1- " or "1-" or "1." and arabic equivalents like "١- " or "١-" or "١."
  const listItemRegex = /([0-9\u0660-\u0669]+[-.]\s?)/gi;
  const parts = text.split(listItemRegex);

  const formattedParts = parts.map((part: string, index: number) => {
    if (part.match(listItemRegex)) {
      return (
        <>
          <br />
          <span style={{ marginLeft: "0.5rem", fontWeight: 600 }}>{part}</span>
        </>
      );
    } else {
      return part;
    }
  });

  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  const result = formattedParts
    .map((part, index) => {
      if (typeof part === "string") {
        const parts = part.split(urlRegex).filter((part) => part !== "https");
        return parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <Link
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "blue",
                  textDecoration: "underline",
                }}
              >
                {part}
              </Link>
            );
          } else {
            return part;
          }
        });
      } else {
        return part;
      }
    })
    .flat();

  return result;
}
