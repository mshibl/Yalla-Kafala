"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Chip,
  Fab,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import { v4 as uuidv4 } from "uuid";

const suggestedActions = [
  "What services do you offer?",
  "How can I contact support?",
  "Tell me about pricing",
];

export default function Chat() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [chatId, setChatId] = useState<string>("");
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: chatId,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatId(uuidv4());
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSuggestedAction = (action: string) => {
    handleSubmit({
      preventDefault: () => {},
      currentTarget: { message: { value: action } },
    } as unknown as React.FormEvent<HTMLFormElement>);
  };

  const open = Boolean(anchorEl);
  const id = open ? "chatbot-popover" : undefined;

  return (
    <>
      <Fab
        color="primary"
        aria-label="Open chat"
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <ChatIcon />
      </Fab>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            width: 300,
            height: 400,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
          >
            Kafala AI Assistant
          </Typography>
          <List sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
            {messages.map((m) => (
              <ListItem key={m.id} sx={{ py: 0 }}>
                <ListItemText
                  primary={m.role === "user" ? "You" : "Kafala AI"}
                  secondary={
                    <ReactMarkdown
                      components={{
                        p: ({ node, children, ...props }) => (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {children}
                          </Typography>
                        ),
                        ul: ({ node, children, ...props }) => (
                          <Typography
                            variant="body2"
                            component="ul"
                            sx={{ pl: 2 }}
                          >
                            {children}
                          </Typography>
                        ),
                        ol: ({ node, children, ...props }) => (
                          <Typography
                            variant="body2"
                            component="ol"
                            sx={{ pl: 2 }}
                          >
                            {children}
                          </Typography>
                        ),
                        li: ({ node, children, ...props }) => (
                          <Typography
                            variant="body2"
                            component="li"
                            sx={{ mb: 1 }}
                          >
                            {children}
                          </Typography>
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  }
                  primaryTypographyProps={{
                    fontWeight: "bold",
                    color: m.role === "user" ? "primary" : "secondary",
                  }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
          {messages.length === 0 && (
            <Box sx={{ p: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {suggestedActions.map((action, index) => (
                <Chip
                  key={index}
                  label={action}
                  onClick={() => handleSuggestedAction(action)}
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              variant="outlined"
            />
            <IconButton type="submit" color="primary" sx={{ ml: 1 }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
