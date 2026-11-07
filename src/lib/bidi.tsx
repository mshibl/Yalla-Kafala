import React from "react";

// A run of Latin letters or digits, with the punctuation that belongs to it
// ("I-SCORE", "MMPI", "501(c)(3)", "3000"); brackets around a run stay
// with the Arabic text.
const TOKEN = String.raw`[A-Za-z0-9]+(?:[-./][A-Za-z0-9]+|\([A-Za-z0-9]+\))*`;
const LATIN_RUN = new RegExp(`(${TOKEN}(?:\\s${TOKEN})*)`, "g");
/([A-Za-z0-9][A-Za-z0-9()\-./]*(?:\s[A-Za-z0-9][A-Za-z0-9()\-./]*)*)/g;

/**
 * Arabic text with every Latin or numeric run set apart as left to right, so
 * the bidi algorithm can't reorder its brackets and hyphens.
 */
export const isolateLatin = (text: string): React.ReactNode =>
  text.split(LATIN_RUN).map((part, index) =>
    index % 2 === 1 ? (
      <bdi key={index} dir="ltr" className="whitespace-nowrap">
        {part}
      </bdi>
    ) : (
      part
    ),
  );
