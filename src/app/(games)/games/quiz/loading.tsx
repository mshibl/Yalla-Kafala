import { Box, CircularProgress } from "@mui/material";

export default function QuizLoading() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom left, #f3e8ff, #dbeafe)",
      }}
    >
      <CircularProgress size={60} thickness={4} />
    </Box>
  );
}
