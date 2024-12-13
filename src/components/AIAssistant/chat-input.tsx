"use client";
import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

const ChatInput = ({
  locale,
  handleSubmit,
  input,
  handleInputChange,
  handleInputClick,
}: {
  locale: "ar" | "en";
  handleSubmit?: () => void;
  input?: string;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputClick?: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      bgcolor="primary.main"
      display={{ xs: "flex", md: "none" }}
      width="100%"
      p="24px"
      sx={{
        position: "sticky",
        bottom: 0,
        zIndex: 45,
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          mr: locale === "en" ? "12px" : "0",
          ml: locale === "en" ? "0" : "12px",
        }}
      >
        {!isFocused && !input && (
          <span
            style={{
              fontSize: "30px",
              position: "absolute",
              [locale === "ar" ? "right" : "left"]: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          >
            👩🏻‍🏫
          </span>
        )}
        <TextField
          fullWidth
          multiline
          maxRows={3}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={input}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={
            locale === "ar" ? "اسألني عن الكفالة..." : "Ask me about Kafala..."
          }
          sx={{
            "& .MuiInputBase-root": {
              borderRadius: "24px",
              bgcolor: "white",
              py: "12px",
              [locale === "ar" ? "paddingRight" : "paddingLeft"]:
                !isFocused && !input ? "48px" : "16px",
            },
            "& .MuiOutlinedInput-input": {
              color: "#6B7280",
              fontSize: "16px",
              height: "28px",
              fontWeight: 400,
              "&::placeholder": {
                color: "#6B7280",
                opacity: 1,
              },
            },
          }}
        />
      </Box>
      <Button
        type="submit"
        sx={{
          minWidth: "48px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          bgcolor: "secondary.main",
          color: "white",
          "&:hover": {
            bgcolor: "secondary.main",
          },
        }}
      >
        <Box
          component="img"
          src="/images/ai-send-icon.svg"
          alt={locale === "ar" ? "إرسال" : "Send"}
          sx={{ width: 24, height: 24 }}
        />
      </Button>
    </Box>
  );
};

export default ChatInput;
