"use client";
import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import { LoadingSpinner } from "./LoadingSpinner";
import { QuestionCard } from "./QuestionCard";
import { QuizQuestion } from "@/src/types";

type QuizProps = {
  questions: QuizQuestion[];
};

const Quiz = ({ questions }: QuizProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null
  );

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  }, []);

  const handleAnswer = (id: string) => {
    setSelectedAnswer(id);
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setCurrentQuestion(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[randomIndex]);
    }, 500);
  };

  if (!currentQuestion) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom left, #f3e8ff, #dbeafe)",
        p: 2,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswer}
          onReset={resetQuiz}
        />
      </Container>
    </Box>
  );
};

export default Quiz;
