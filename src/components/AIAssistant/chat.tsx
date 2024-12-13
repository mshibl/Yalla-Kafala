"use client";

import React, { useState, useEffect, useRef } from "react";
import { useChat, useCompletion } from "ai/react";
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
  Dialog,
  Slide,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import { v4 as uuidv4 } from "uuid";
import { TransitionProps } from "@mui/material/transitions";
import { motion, AnimatePresence } from "framer-motion";
import ChatInput from "./chat-input";
import useResponsiveBreakpoint from "@/src/utils/mui-utils";

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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ChatProps {
  locale: "ar" | "en";
}

export default function Chat({ locale }: ChatProps) {
  const isMobile = !useResponsiveBreakpoint("md");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const suggestedActions =
    locale === "ar" ? suggestedActionsArabic : suggestedActionsEnglish;

  const [chatId, setChatId] = useState<string>("");
  const { messages, input, setInput, handleInputChange, handleSubmit, append } =
    useChat({
      id: chatId,
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChatId(uuidv4());
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const [isFocused, setIsFocused] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };

  const handleSuggestedAction = (action: string) => {
    append({
      role: "user",
      content: action,
    });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const id = open ? "chatbot-popover" : undefined;

  if (isMobile) {
    return (
      <>
        <ChatInput
          locale={locale}
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          handleInputClick={handleOpen}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "black",
                  zIndex: 39, // Just below the chat panel
                }}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 500 }}
                style={{
                  position: "sticky",
                  bottom: 0,
                  backgroundColor: "white",
                  boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
                  zIndex: 40,
                  maxHeight: isFocused ? "40vh" : "80vh",
                  height: isFocused ? "400px" : "700px",
                  transition: "height 0.3s ease-in-out",
                  overflow: "auto",
                  paddingBottom: "100px",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      px: "16px",
                      py: "8px",
                      borderBottom: 1,
                      borderColor: "divider",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">
                      {locale === "ar"
                        ? "✨ يلا كفالة AI"
                        : "✨ Yalla Kafala AI"}
                    </Typography>
                    <IconButton onClick={handleClose}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Box
                    ref={chatContainerRef}
                    sx={{ flexGrow: 1, overflow: "auto", p: "16px" }}
                  >
                    <List sx={{ flexGrow: 1, overflow: "auto" }}>
                      {messages.map((m) => (
                        <ListItem
                          key={m.id}
                          sx={{
                            py: 0,
                            textAlign: locale === "ar" ? "right" : "left",
                          }}
                        >
                          <ListItemText
                            primary={
                              m.role === "user"
                                ? locale === "ar"
                                  ? "أنا"
                                  : "You"
                                : locale === "ar"
                                ? "👩🏻‍🏫 يلا كفالة AI"
                                : "👩🏻‍🏫 Yalla Kafala AI"
                            }
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
                              color:
                                m.role === "user" ? "primary" : "secondary",
                            }}
                          />
                        </ListItem>
                      ))}
                      <div ref={messagesEndRef} />
                    </List>
                    {messages.length === 0 && (
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
                    )}
                  </Box>
                </Box>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <Fab
        color="secondary"
        aria-label="Open chat"
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
      >
        <Box fontSize="30px">👩🏻‍🏫</Box>
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
            width: 500,
            height: 700,
            maxHeight: "80vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h6"
            sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
          >
            {locale === "ar" ? "✨ يلا كفالة AI" : "✨ Yalla Kafala AI"}
          </Typography>
          <List sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
            {messages.map((m) => (
              <ListItem
                key={m.id}
                sx={{ py: 0, textAlign: locale === "ar" ? "right" : "left" }}
              >
                <ListItemText
                  primary={
                    m.role === "user"
                      ? locale === "ar"
                        ? "أنا"
                        : "You"
                      : locale === "ar"
                      ? "👩🏻‍🏫 يلا كفالة AI"
                      : "👩🏻‍🏫 Yalla Kafala AI"
                  }
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
            <Box
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
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
              py: "16px",
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={3}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              value={input}
              onChange={handleInputChange}
              placeholder={
                locale === "ar"
                  ? "اسألني عن الكفالة..."
                  : "Ask me about Kafala..."
              }
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "24px",
                  bgcolor: "white",
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
        </Box>
      </Popover>
    </>
  );
}

export const useChatState = () => {
  const [chatId] = useState<string>(uuidv4());
  return useChat({ id: chatId });
};
