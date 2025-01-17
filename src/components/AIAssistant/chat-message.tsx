import React, { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Box, Typography, ListItem, ListItemText } from "@mui/material";

export const ChatMessage = ({
  message,
  locale,
}: {
  locale: string;
  message: {
    id: string;
    content: string | ReactNode;
    role: "function" | "user" | "assistant" | "data" | "system" | "tool";
  };
}) => {
  return (
    <ListItem
      key={message.id}
      sx={{
        py: 0,
        textAlign: locale === "ar" ? "right" : "left",
      }}
    >
      <ListItemText
        primaryTypographyProps={{
          fontWeight: "bold",
          fontSize: "20px",
          color: message.role === "user" ? "primary" : "secondary",
        }}
        secondaryTypographyProps={{
          fontSize: "20px",
        }}
        primary={
          message.role === "user"
            ? locale === "ar"
              ? "انت"
              : "You"
            : locale === "ar"
            ? "👩🏻‍🏫 يلا كفالة AI"
            : "👩🏻‍🏫 Yalla Kafala AI"
        }
        secondary={
          typeof message.content !== "string" ? (
            message.content
          ) : (
            <ReactMarkdown
              components={{
                p: ({ node, children, ...props }) => (
                  <Typography variant="body1" sx={{ mb: 1, fontSize: "20px" }}>
                    {children}
                  </Typography>
                ),
                ul: ({ node, children, ...props }) => (
                  <Typography
                    variant="body1"
                    component="ul"
                    sx={{ pl: 2, fontSize: "20px" }}
                  >
                    {children}
                  </Typography>
                ),
                ol: ({ node, children, ...props }) => (
                  <Typography
                    variant="body1"
                    component="ol"
                    sx={{ pl: 2, fontSize: "20px" }}
                  >
                    {children}
                  </Typography>
                ),
                li: ({ node, children, ...props }) => (
                  <Typography
                    variant="body1"
                    component="li"
                    sx={{ mb: 1, fontSize: "20px" }}
                  >
                    {children}
                  </Typography>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )
        }
      />
    </ListItem>
  );
};
