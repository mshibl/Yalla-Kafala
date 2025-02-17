import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

type Answer = {
  id: string;
  text: string;
  outcome: string;
};

type Question = {
  id: string;
  text: string;
  answers: Answer[];
};

type QuestionCardProps = {
  question: Question;
  selectedAnswer: string | null;
  onAnswerSelect: (id: string) => void;
  onReset: () => void;
};

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  onReset,
}: QuestionCardProps) {
  return (
    <>
      <Card sx={{ width: "100%", maxWidth: 800, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography
              variant="h4"
              component="h2"
              align="center"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(to right, #9333ea, #3b82f6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {question.text}
            </Typography>
          }
          subheader={
            <Typography
              variant="h6"
              align="center"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              اختار الاجابة المناسبة ليك
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            {question.answers.map((answer) => (
              <Grid item xs={12} sm={4} key={answer.id}>
                <motion.div
                  whileHover={
                    !selectedAnswer || selectedAnswer === answer.id
                      ? { scale: 1.05 }
                      : undefined
                  }
                  whileTap={
                    !selectedAnswer || selectedAnswer === answer.id
                      ? { scale: 0.95 }
                      : undefined
                  }
                >
                  <Button
                    variant={
                      selectedAnswer === answer.id ? "contained" : "outlined"
                    }
                    fullWidth
                    sx={{
                      height: "150px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 2,
                      background:
                        selectedAnswer === answer.id
                          ? "linear-gradient(to bottom left, #9333ea, #3b82f6)"
                          : "inherit",
                      "&:disabled": {
                        opacity: 0.5,
                      },
                    }}
                    onClick={() => onAnswerSelect(answer.id)}
                    disabled={Boolean(
                      selectedAnswer && selectedAnswer !== answer.id
                    )}
                  >
                    <Typography
                      align="center"
                      sx={{
                        maxHeight: "100%",
                        width: "100%",
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {answer.text}
                    </Typography>
                  </Button>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedAnswer)}
        onClose={onReset}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 600,
              background: "linear-gradient(to right, #9333ea, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 3,
            }}
          >
            {question.answers.find((a) => a.id === selectedAnswer)?.outcome}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={onReset}
            variant="outlined"
            sx={{
              width: { xs: "90%", sm: "auto" },
              minWidth: { sm: "200px" },
            }}
          >
            سؤال آخر
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
