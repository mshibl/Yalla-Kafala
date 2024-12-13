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
import { generateId } from "ai";

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

const LOCAL_STORAGE_USER_KEY = "yalla_kafala_user";

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

interface UserInfo {
  name: string;
  mobile: string;
}

export default function Chat({ locale }: ChatProps) {
  const isMobile = !useResponsiveBreakpoint("md");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showNameForm, setShowNameForm] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const suggestedActions =
    locale === "ar" ? suggestedActionsArabic : suggestedActionsEnglish;

  const [chatId, setChatId] = useState(generateId(10));

  const { messages, input, setInput, handleInputChange, handleSubmit, append } =
    useChat({
      body: {
        id: chatId,
        authorName: userInfo?.name,
        authorMobile: userInfo?.mobile,
      },
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (!userInfo) {
      setShowNameForm(true);
    }
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
    if (!userInfo) {
      setShowNameForm(true);
    }
    setOpen(true);
  };

  const id = open ? "chatbot-popover" : undefined;

  useEffect(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    } else {
      setShowNameForm(true);
    }
  }, []);

  const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const mobile = formData.get("mobile") as string;

    if (name.trim() && mobile.trim()) {
      const userInfo = {
        name: name.trim(),
        mobile: mobile.trim(),
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userInfo));
      setUserInfo(userInfo);
      setShowNameForm(false);
      setOpen(true);
    }
  };

  const userForm = (
    <Box
      component="form"
      onSubmit={handleNameSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6">
        {locale === "ar"
          ? "مرحباً! من فضلك أدخل بياناتك"
          : "Hello! Please enter your details"}
      </Typography>
      <TextField
        required
        name="name"
        fullWidth
        placeholder={locale === "ar" ? "أدخل اسمك" : "Enter your name"}
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "8px",
          },
          "& .MuiInputBase-input": {
            fontSize: "20px",
          },
        }}
      />
      <TextField
        required
        name="mobile"
        fullWidth
        type="tel"
        placeholder={locale === "ar" ? "رقم الهاتف المحمول" : "Mobile number"}
        helperText={
          locale === "ar"
            ? "يرجى إدخال رقم هاتف محمول صالح (11 أرقام)"
            : "Please enter a valid mobile number (11 digits)"
        }
        sx={{
          "& .MuiInputBase-root": {
            borderRadius: "8px",
          },
          "& .MuiInputBase-input": {
            fontSize: "20px",
            textAlign: locale === "ar" ? "right" : "left",
          },
          "& .MuiFormHelperText-root": {
            fontSize: "14px",
            textAlign: locale === "ar" ? "right" : "left",
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ borderRadius: "8px", fontSize: "20px", textTransform: "none" }}
      >
        {locale === "ar" ? "بدء المحادثة" : "Start Chatting"}
      </Button>
    </Box>
  );

  if (isMobile) {
    return (
      <>
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
                  zIndex: 39,
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
                  maxHeight: "80vh",
                  height: showNameForm
                    ? "420px"
                    : isFocused
                    ? "400px"
                    : "700px",
                  transition: "height 0.3s ease-in-out",
                  overflow: "auto",
                  paddingBottom: "100px",
                }}
              >
                {showNameForm ? (
                  <Box sx={{ p: 3 }}>{userForm}</Box>
                ) : (
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
                              primaryTypographyProps={{
                                fontWeight: "bold",
                                fontSize: "20px",
                                color:
                                  m.role === "user" ? "primary" : "secondary",
                              }}
                              secondaryTypographyProps={{
                                fontSize: "20px",
                              }}
                              primary={
                                m.role === "user"
                                  ? locale === "ar"
                                    ? "انت"
                                    : "You"
                                  : locale === "ar"
                                  ? "👩🏻‍🏫 يلا كفالة AI"
                                  : "👩🏻‍🏫 Yalla Kafala AI"
                              }
                              secondary={
                                <ReactMarkdown
                                  components={{
                                    p: ({ node, children, ...props }) => (
                                      <Typography
                                        variant="body1"
                                        sx={{ mb: 1, fontSize: "20px" }}
                                      >
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
                                  {m.content}
                                </ReactMarkdown>
                              }
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
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <ChatInput
          locale={locale}
          handleSubmit={handleSubmit}
          input={input}
          handleInputChange={handleInputChange}
          handleInputClick={handleOpen}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </>
    );
  }

  return (
    <>
      <Fab
        aria-label="Open chat"
        aria-describedby={id}
        onClick={handleClick}
        sx={{
          backgroundColor: "#2194BC",
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
        {showNameForm ? (
          <Box sx={{ width: 400, p: 3 }}>{userForm}</Box>
        ) : (
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
              sx={{ p: 8, borderBottom: 1, borderColor: "divider" }}
            >
              {locale === "ar" ? "✨ يلا كفالة AI" : "✨ Yalla Kafala AI"}
            </Typography>
            <List sx={{ flexGrow: 1, overflow: "auto", p: 8 }}>
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
                            <Typography
                              variant="body1"
                              sx={{ mb: 1, fontSize: "16px" }}
                            >
                              {children}
                            </Typography>
                          ),
                          ul: ({ node, children, ...props }) => (
                            <Typography
                              variant="body1"
                              component="ul"
                              sx={{ pl: 2, fontSize: "16px" }}
                            >
                              {children}
                            </Typography>
                          ),
                          ol: ({ node, children, ...props }) => (
                            <Typography
                              variant="body1"
                              component="ol"
                              sx={{ pl: 2, fontSize: "16px" }}
                            >
                              {children}
                            </Typography>
                          ),
                          li: ({ node, children, ...props }) => (
                            <Typography
                              variant="body1"
                              component="li"
                              sx={{ mb: 1, fontSize: "16px" }}
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
                  p: 8,
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
                p: 8,
                borderTop: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                  marginRight: locale === "ar" ? 0 : 2,
                  marginLeft: locale === "ar" ? 2 : 0,
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
                  alt={locale === "ar" ? "إرسا��" : "Send"}
                  sx={{ width: 24, height: 24 }}
                />
              </Button>
            </Box>
          </Box>
        )}
      </Popover>
    </>
  );
}

export const useChatState = () => {
  const [chatId] = useState<string>(uuidv4());
  return useChat({ id: chatId });
};