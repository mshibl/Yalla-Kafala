import Quiz from "@/src/components/Games/Quiz";
import { fetchQuizQuestions } from "@/src/utils/fetch-quiz";
import { Box, Typography, Button } from "@mui/material";

export default async function PersonalityQuizPage() {
  try {
    const questions = await fetchQuizQuestions();
    return <Quiz questions={questions} />;
  } catch (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to bottom left, #f3e8ff, #dbeafe)",
          gap: 2,
          p: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" component="h1">
          Oops! Something went wrong while loading the quiz.
        </Typography>
      </Box>
    );
  }
}
