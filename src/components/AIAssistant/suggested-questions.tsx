import { Box, Chip } from "@mui/material";

const suggestedActionsEnglish = [
  "What is Kafala?",
  "How can I contact Yalla Kafala?",
  "What is the mission of Yalla Kafala?",
];

const suggestedActionsArabic = [
  "ما هي الكفالة؟",
  "كيف يمكنني الاتصال بيلا كفالة؟",
  "ما هي مهمة يلا كفالة؟",
];

export const SuggestedQuestions = ({
  locale,
  handleSuggestedAction,
}: {
  locale: string;
  handleSuggestedAction: (action: string) => void;
}) => {
  const suggestedActions =
    locale === "ar" ? suggestedActionsArabic : suggestedActionsEnglish;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {suggestedActions.map((action, index) => (
        <Chip
          key={index}
          label={action}
          onClick={() => handleSuggestedAction(action)}
          color="secondary"
          sx={{ mb: 4, fontSize: "16px" }}
        />
      ))}
    </Box>
  );
};
